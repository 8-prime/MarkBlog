const ACTIVE_BORDER = "2px solid";
const INACTIVE_BORDER = "1.5px solid";
const INACTIVE_OPACITY = 0.42;

type CardProps = { active: boolean; onClick: () => void; disabled: boolean };

export function ChronicleCard({ active, onClick, disabled }: CardProps) {
    const isClickable = !active && !disabled;
    return (
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
                background: "#0d0b08",
                border: active
                    ? `${ACTIVE_BORDER} #c8892a`
                    : `${INACTIVE_BORDER} #1e1a10`,
                boxShadow: active
                    ? "0 0 0 1px rgba(200,137,42,0.15), 0 0 20px rgba(200,137,42,0.08)"
                    : "none",
                padding: "13px 14px",
                fontFamily: "Georgia, 'Times New Roman', serif",
                transition: "opacity 0.2s, box-shadow 0.2s",
            }}
        >
            {/* Logbook entry: amber left rule, date → title → description */}
            <div style={{ borderLeft: "2px solid #c8892a", paddingLeft: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 9, color: "#c8892a", fontFamily: "'SFMono-Regular', Consolas, monospace", letterSpacing: "0.04em" }}>
                    2026-02-22
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e8dcc8", lineHeight: 1.25 }}>
                    The Hidden Cost of Complexity
                </div>
                <div style={{ fontSize: 10.5, color: "#7a6a4f", lineHeight: 1.55 }}>
                    Systems that grow without discipline accumulate invisible debt.
                </div>
            </div>
            {/* Active indicator */}
            {active && (
                <div style={{ marginTop: 10, fontSize: 9, color: "#c8892a", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.7 }}>
                    ◆
                </div>
            )}
        </button>
    );
}
