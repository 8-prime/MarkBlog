import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getTheme, getThemes, setTheme } from "../api/endpoints";

type Theme = { id: string; name: string; description: string };

// Shared border width so active vs inactive are clearly distinct
const ACTIVE_BORDER = "2px solid";
const INACTIVE_BORDER = "1.5px solid";
const INACTIVE_OPACITY = 0.42;

// ─── Terminal card ────────────────────────────────────────────────────────────
function TerminalCard({ active, onClick, disabled }: { active: boolean; onClick: () => void; disabled: boolean }) {
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
    );
}

// ─── Minimal card ─────────────────────────────────────────────────────────────
function MinimalCard({ active, onClick, disabled }: { active: boolean; onClick: () => void; disabled: boolean }) {
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

// ─── Dusk card ────────────────────────────────────────────────────────────────
function DuskCard({ active, onClick, disabled }: { active: boolean; onClick: () => void; disabled: boolean }) {
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
                cursor: active ? "default" : disabled ? "not-allowed" : "pointer",
                opacity: !active && disabled ? 0.3 : active ? 1 : INACTIVE_OPACITY,
                background: "#0f1018",
                border: active
                    ? `${ACTIVE_BORDER} #a78bfa`
                    : `${INACTIVE_BORDER} #272a42`,
                boxShadow: active
                    ? "0 0 0 1px rgba(167,139,250,0.2), 0 0 28px rgba(167,139,250,0.14)"
                    : "none",
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                padding: "13px 14px",
                position: "relative",
                transition: "opacity 0.2s, box-shadow 0.2s",
            }}
        >
            <div style={{ fontSize: 9, color: "#6c7294", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Feb 22, 2026 · #systems</span>
                {active && <span style={{ color: "#a78bfa", fontSize: 10, letterSpacing: "0.1em" }}>◆</span>}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", lineHeight: 1.25, marginBottom: 6 }}>
                The Hidden Cost of Complexity
            </div>
            <div style={{ fontSize: 11, color: "#9ca0b8", lineHeight: 1.6, marginBottom: 9 }}>
                Systems that grow without discipline accumulate invisible debt.
                Every abstraction has a cost paid in comprehension.
            </div>
            <div style={{ display: "flex", gap: 5 }}>
                <span style={{ fontSize: 9.5, color: "#a78bfa", border: "1px solid #2a2d44", padding: "2px 7px", borderRadius: 3 }}>systems</span>
                <span style={{ fontSize: 9.5, color: "#6c7294", border: "1px solid #2a2d44", padding: "2px 7px", borderRadius: 3 }}>engineering</span>
            </div>
        </button>
    );
}

// ─── Card dispatch ────────────────────────────────────────────────────────────
function ThemeCard({ id, active, onClick, disabled }: { id: string; active: boolean; onClick: () => void; disabled: boolean }) {
    if (id === "terminal") return <TerminalCard active={active} onClick={onClick} disabled={disabled} />;
    if (id === "minimal") return <MinimalCard active={active} onClick={onClick} disabled={disabled} />;
    if (id === "dusk") return <DuskCard active={active} onClick={onClick} disabled={disabled} />;
    // fallback for any future theme unknown to this client
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-pressed={active}
            className={`text-left p-4 border-2 transition-colors ${active ? "border-primary" : "border-text/30"} disabled:opacity-40`}
            style={{ opacity: active ? 1 : INACTIVE_OPACITY }}
        >
            <span className="font-semibold capitalize">{id}</span>
            {active && <span className="ml-2 text-xs opacity-60">active</span>}
        </button>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const Settings = () => {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [activeTheme, setActiveTheme] = useState<string>("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([getThemes(), getTheme()])
            .then(([availableThemes, current]) => {
                setThemes(availableThemes);
                setActiveTheme(current.theme);
            })
            .catch((err) => console.error("Failed to load settings:", err));
    }, []);

    const handleSelect = async (theme: string) => {
        if (theme === activeTheme || saving) return;
        setSaving(true);
        setSaved(false);
        setError(null);
        try {
            await setTheme(theme);
            setActiveTheme(theme);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            setError("Failed to save theme.");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <style>{`
                @keyframes settings-cursor-blink {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                }
                .settings-blink { animation: settings-cursor-blink 1s step-end infinite; }
            `}</style>

            <div className="flex flex-col h-screen bg-background text-text" style={{ fontFamily: "Geist, sans-serif" }}>
                {/* Header */}
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "10px 20px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                    <Link to="/" className="text-text/50 hover:text-text transition-colors" style={{ fontSize: 13 }}>
                        ← Articles
                    </Link>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.15)" }}>/</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Blog Theme</span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflow: "auto", padding: "28px 24px" }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginBottom: 22, letterSpacing: "0.03em" }}>
                        Select a theme — changes take effect on next public page load.
                    </p>

                    {/* Cards: aligned to top so each is only as tall as its content */}
                    <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1.3fr", gap: 24, alignItems: "start" }}>
                        {themes.map((theme) => (
                            <ThemeCard
                                key={theme.id}
                                id={theme.id}
                                active={activeTheme === theme.id}
                                onClick={() => handleSelect(theme.id)}
                                disabled={saving}
                            />
                        ))}
                    </div>

                    {/* Labels */}
                    {themes.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1.3fr", gap: 24, marginTop: 10 }}>
                            {themes.map((theme) => (
                                <div
                                    key={theme.id}
                                    style={{
                                        fontSize: 10,
                                        letterSpacing: "0.07em",
                                        textTransform: "uppercase",
                                        color: activeTheme === theme.id ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 5,
                                        transition: "color 0.2s",
                                    }}
                                >
                                    {activeTheme === theme.id && (
                                        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>●</span>
                                    )}
                                    {theme.name}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Status */}
                    <div style={{ marginTop: 20, height: 18 }}>
                        {saved && (
                            <p style={{ fontSize: 11, color: "rgba(120,200,120,0.8)", letterSpacing: "0.04em" }}>
                                ✓ Theme saved
                            </p>
                        )}
                        {error && (
                            <p style={{ fontSize: 11, color: "rgba(220,100,100,0.85)" }}>{error}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;
