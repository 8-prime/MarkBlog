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

type Segment =
  | { type: "text"; content: string }
  | { type: "mark"; content: string; lint: Lint };

function buildSegments(text: string, lints: Lint[]): Segment[] {
  const sorted = [...lints].sort((a, b) => a.span().start - b.span().start);
  const segments: Segment[] = [];
  let cursor = 0;

  for (const lint of sorted) {
    const span = lint.span();
    if (span.start < cursor) continue;
    if (span.start > cursor) {
      segments.push({ type: "text", content: text.slice(cursor, span.start) });
    }
    segments.push({ type: "mark", content: text.slice(span.start, span.end), lint });
    cursor = span.end;
  }

  if (cursor < text.length) {
    segments.push({ type: "text", content: text.slice(cursor) });
  }

  return segments;
}

export default function ProofRead({ text, onTextChange }: Props) {
  const [lints, setLints] = useState<Lint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLint, setActiveLint] = useState<ActiveLint | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    linter.setup().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await linter.lint(text, { language: "markdown" });
      setLints(results);
      setActiveLint(null);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, loading]);

  useEffect(() => {
    if (!activeLint) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveLint(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeLint]);

  const handleMarkClick = (lint: Lint, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setActiveLint({ lint, rect });
  };

  const handleApply = async (suggestion: Suggestion) => {
    if (!activeLint) return;
    const newText = await linter.applySuggestion(text, activeLint.lint, suggestion);
    onTextChange(newText);
    setActiveLint(null);
  };

  const handleDismiss = async () => {
    if (!activeLint) return;
    await linter.ignoreLint(text, activeLint.lint);
    setLints((prev) => prev.filter((l) => l !== activeLint.lint));
    setActiveLint(null);
  };

  const segments = buildSegments(text, lints);

  return (
    <div className="h-full overflow-y-auto p-6 font-mono text-sm text-text whitespace-pre-wrap leading-relaxed">
      {loading && (
        <p className="text-secondary text-xs mb-4">Loading grammar checker…</p>
      )}
      {segments.map((seg, i) =>
        seg.type === "text" ? (
          <span key={i}>{seg.content}</span>
        ) : (
          <span
            key={i}
            style={{ textDecoration: `underline wavy ${lintColor(seg.lint.lint_kind())}` }}
            className="cursor-pointer"
            onClick={(e) => handleMarkClick(seg.lint, e)}
          >
            {seg.content}
          </span>
        )
      )}

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

  const spaceBelow = window.innerHeight - rect.bottom;
  const useBottom = spaceBelow < 220;

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
        <button
          onClick={onDismiss}
          className="text-xs text-secondary hover:text-text"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
