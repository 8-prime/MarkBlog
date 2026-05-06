import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { WorkerLinter, type Lint, type Suggestion } from "harper.js";
import { binaryInlined } from "harper.js/binaryInlined";

const linter = new WorkerLinter({ binary: binaryInlined });

type ActiveLint = { lint: Lint; rect: DOMRect };

type Props = {
  text: string;
  onTextChange: (text: string) => void;
};

function lintColor(kind: string): string {
  if (kind === "Spelling") return "#dc2626";
  if (kind === "Grammar") return "#d97706";
  return "#7c3aed";
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildHtml(text: string, lints: Lint[]): string {
  const sorted = [...lints].sort((a, b) => a.span().start - b.span().start);
  let html = "";
  let cursor = 0;
  for (let i = 0; i < sorted.length; i++) {
    const lint = sorted[i];
    const { start, end } = lint.span();
    if (start < cursor) continue;
    if (start > cursor) html += escapeHtml(text.slice(cursor, start));
    const color = lintColor(lint.lint_kind());
    html += `<span data-lint-index="${i}" style="text-decoration:underline wavy ${color};cursor:pointer">${escapeHtml(text.slice(start, end))}</span>`;
    cursor = end;
  }
  if (cursor < text.length) html += escapeHtml(text.slice(cursor));
  return html;
}

function getCursorOffset(el: HTMLElement): number | null {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return null;
  const range = sel.getRangeAt(0);
  if (!el.contains(range.startContainer)) return null;
  const pre = document.createRange();
  pre.setStart(el, 0);
  pre.setEnd(range.startContainer, range.startOffset);
  return pre.toString().length;
}

function setCursorOffset(el: HTMLElement, offset: number) {
  const sel = window.getSelection();
  if (!sel) return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let count = 0;
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    const len = node.textContent?.length ?? 0;
    if (count + len >= offset) {
      const range = document.createRange();
      range.setStart(node, offset - count);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    count += len;
  }
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

export default function ProofRead({ text, onTextChange }: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const textRef = useRef(text);
  const lintsRef = useRef<Lint[]>([]);
  const isFocusedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lints, setLints] = useState<Lint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLint, setActiveLint] = useState<ActiveLint | null>(null);

  useEffect(() => {
    linter.setup().then(() => setLoading(false));
  }, []);

  // Set initial innerHTML on mount
  useEffect(() => {
    if (divRef.current) divRef.current.innerHTML = buildHtml(text, []);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Run initial lint once WASM is ready
  useEffect(() => {
    if (loading) return;
    linter.lint(text, { language: "markdown" }).then(setLints);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild innerHTML whenever lints change, preserving cursor if focused
  useEffect(() => {
    const div = divRef.current;
    if (!div) return;
    lintsRef.current = lints;
    const html = buildHtml(textRef.current, lints);
    if (isFocusedRef.current) {
      const offset = getCursorOffset(div);
      div.innerHTML = html;
      if (offset !== null) setCursorOffset(div, offset);
    } else {
      div.innerHTML = html;
    }
    setActiveLint(null);
  }, [lints]);

  useEffect(() => {
    if (!activeLint) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveLint(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeLint]);

  const scheduleLint = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await linter.lint(textRef.current, { language: "markdown" });
      setLints(results);
    }, 400);
  };

  const handleInput = () => {
    const div = divRef.current;
    if (!div) return;
    // innerText respects white-space:pre-wrap but adds a trailing \n in Chrome
    let newText = div.innerText ?? "";
    if (newText.endsWith("\n")) newText = newText.slice(0, -1);
    textRef.current = newText;
    onTextChange(newText);
    scheduleLint();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      // Intercept Enter so the browser inserts a plain \n text node rather than
      // a <div> or <br>, keeping innerText extraction consistent across browsers.
      e.preventDefault();
      document.execCommand("insertText", false, "\n");
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const idx = target.getAttribute("data-lint-index");
    if (idx === null) return;
    const lint = lintsRef.current[parseInt(idx, 10)];
    if (!lint) return;
    setActiveLint({ lint, rect: target.getBoundingClientRect() });
  };

  const handleApply = async (suggestion: Suggestion) => {
    if (!activeLint) return;
    const newText = await linter.applySuggestion(textRef.current, activeLint.lint, suggestion);
    textRef.current = newText;
    onTextChange(newText);
    setActiveLint(null);
    const results = await linter.lint(newText, { language: "markdown" });
    setLints(results);
  };

  const handleDismiss = async () => {
    if (!activeLint) return;
    await linter.ignoreLint(textRef.current, activeLint.lint);
    setLints(lintsRef.current.filter((l) => l !== activeLint.lint));
    setActiveLint(null);
  };

  return (
    <div className="h-full overflow-y-auto p-6 font-mono text-sm text-text leading-relaxed">
      {loading && (
        <p className="text-secondary text-xs mb-4">Loading grammar checker…</p>
      )}
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        className="outline-none whitespace-pre-wrap min-h-full"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onFocus={() => { isFocusedRef.current = true; }}
        onBlur={() => { isFocusedRef.current = false; }}
      />
      {activeLint &&
        createPortal(
          <>
            <div
              className="fixed inset-0"
              style={{ zIndex: 9998 }}
              onClick={() => setActiveLint(null)}
            />
            <SuggestionPopup
              activeLint={activeLint}
              onApply={handleApply}
              onDismiss={handleDismiss}
              onClose={() => setActiveLint(null)}
            />
          </>,
          document.body
        )}
    </div>
  );
}

type PopupProps = {
  activeLint: ActiveLint;
  onApply: (s: Suggestion) => void;
  onDismiss: () => void;
  onClose: () => void;
};

function SuggestionPopup({ activeLint, onApply, onDismiss, onClose }: PopupProps) {
  const { lint, rect } = activeLint;
  const suggestions = lint.suggestions();
  const useBottom = window.innerHeight - rect.bottom < 220;

  const style: React.CSSProperties = {
    position: "fixed",
    left: Math.min(rect.left, window.innerWidth - 420),
    zIndex: 9999,
    width: 380,
    ...(useBottom
      ? { bottom: window.innerHeight - rect.top + 6 }
      : { top: rect.bottom + 6 }),
  };

  return (
    <div
      style={style}
      className="bg-background border border-text shadow-lg p-3 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-secondary uppercase tracking-wide">
          {lint.lint_kind_pretty()}
        </span>
        <button
          onClick={onClose}
          className="text-secondary hover:text-text text-lg leading-none px-1"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div
        className="text-sm text-text"
        dangerouslySetInnerHTML={{ __html: lint.message_html() }}
      />
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onApply(s)}
              className="px-2 py-1 bg-primary text-background text-sm hover:bg-primary/80 transition-colors"
            >
              {s.get_replacement_text() || "Remove"}
            </button>
          ))}
        </div>
      )}
      <div className="flex justify-end border-t border-text pt-2 mt-1">
        <button onClick={onDismiss} className="text-xs text-secondary hover:text-text">
          Dismiss
        </button>
      </div>
    </div>
  );
}
