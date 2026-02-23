const ACTIVE_BORDER = "2px solid";
const INACTIVE_BORDER = "1.5px solid";
const INACTIVE_OPACITY = 0.42;

type CardProps = { active: boolean; onClick: () => void; disabled: boolean };

export function MinimalCard({ active, onClick, disabled }: CardProps) {
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
                background: "#ffffff",
                border: active ? `${ACTIVE_BORDER} #1a1a2e` : `${INACTIVE_BORDER} #e4e4ec`,
                boxShadow: active ? "0 0 0 1px rgba(26,26,46,0.15)" : "none",
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                padding: "12px 14px",
                transition: "opacity 0.2s, box-shadow 0.2s",
            }}
        >
            <div style={{ fontSize: 9, color: "#bbb", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Feb 22, 2026</span>
                {active && <span style={{ color: "#1a1a2e", fontSize: 11, fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", lineHeight: 1.25, marginBottom: 5 }}>
                The Hidden Cost of Complexity
            </div>
            <div style={{ fontSize: 11, color: "#888", lineHeight: 1.55 }}>
                Systems that grow without discipline accumulate invisible debt.
            </div>
        </button>
    );
}
