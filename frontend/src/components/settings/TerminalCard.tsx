const ACTIVE_BORDER = "2px solid";
const INACTIVE_BORDER = "1.5px solid";
const INACTIVE_OPACITY = 0.42;

type CardProps = { active: boolean; onClick: () => void; disabled: boolean };

export function TerminalCard({ active, onClick, disabled }: CardProps) {
    const isClickable = !active && !disabled;
    return (
        <>
            <style>{`
                @keyframes settings-cursor-blink {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                }
                .settings-blink { animation: settings-cursor-blink 1s step-end infinite; }
            `}</style>
            <button
                onClick={onClick}
                disabled={!isClickable}
                aria-pressed={active}
                style={{
                    all: "unset",
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    cursor: active ? "default" : disabled ? "not-allowed" : "pointer",
                    opacity: !active && disabled ? 0.3 : active ? 1 : INACTIVE_OPACITY,
                    background: "#060606",
                    border: active
                        ? `${ACTIVE_BORDER} oklch(0.75 0.15 60)`
                        : `${INACTIVE_BORDER} #1c1c1c`,
                    boxShadow: active
                        ? "0 0 0 1px oklch(0.75 0.15 60 / 0.2), 0 0 32px oklch(0.75 0.15 60 / 0.12)"
                        : "none",
                    fontFamily: '"Geist Mono", "Courier New", monospace',
                    position: "relative",
                    overflow: "hidden",
                    transition: "opacity 0.2s, box-shadow 0.2s",
                }}
            >
                {/* CRT scanlines */}
                <div
                    aria-hidden
                    style={{
                        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
                        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.14) 3px, rgba(0,0,0,0.14) 4px)",
                    }}
                />
                {/* Window chrome */}
                <div style={{ background: "#0f0f0f", borderBottom: "1px solid #1e1e1e", padding: "5px 10px", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57", display: "inline-block", flexShrink: 0 }} />
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e", display: "inline-block", flexShrink: 0 }} />
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840", display: "inline-block", flexShrink: 0 }} />
                    <span style={{ color: "#333", fontSize: 10, marginLeft: 8, letterSpacing: "0.04em" }}>~/blog — zsh</span>
                </div>
                {/* Body */}
                <div style={{ padding: "11px 14px", position: "relative", zIndex: 2 }}>
                    <div style={{ fontSize: 10, color: "#2e4a2e", marginBottom: 6 }}>
                        $ cat articles/the-hidden-cost-of-complexity.md
                    </div>
                    <div style={{ marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: "oklch(0.6 0.1 120)" }}>&gt; </span>
                        <span style={{ fontSize: 12, color: "oklch(0.78 0.15 60)", fontWeight: 700 }}>
                            The Hidden Cost of Complexity
                        </span>
                    </div>
                    <div style={{ fontSize: 9.5, color: "oklch(0.5 0.07 120)", display: "flex", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                        <span>2026-02-22</span>
                        <span style={{ opacity: 0.4 }}>·</span>
                        <span>#systems</span>
                        <span>#engineering</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: "oklch(0.62 0.06 120)", lineHeight: 1.65 }}>
                        Systems that grow without discipline accumulate invisible
                        <br />
                        debt. Every abstraction has a cost paid in comprehension.
                    </div>
                    <div style={{ marginTop: 10, fontSize: 11, color: "oklch(0.75 0.15 60)", display: "flex", alignItems: "center", gap: 5 }}>
                        <span>$</span>
                        <span
                            className={active ? "settings-blink" : undefined}
                            style={{
                                display: "inline-block",
                                width: 7, height: 13,
                                background: active ? "oklch(0.75 0.15 60)" : "#1e1e1e",
                                verticalAlign: "text-bottom",
                            }}
                        />
                    </div>
                </div>
            </button>
        </>
    );
}
