import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getTheme, getThemes, setTheme } from "../api/endpoints";
import { ThemeCard } from "../components/settings/ThemeCard";
import type { Theme } from "../models";

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
            <div className="flex-1 overflow-auto" style={{ padding: "28px 24px" }}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginBottom: 22, letterSpacing: "0.03em" }}>
                    Select a theme — changes take effect on next public page load.
                </p>

                {/* Responsive grid: 1 col mobile → 2 col tablet → 3 col desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {themes.map((theme) => (
                        <div key={theme.id} className="flex flex-col gap-2.5 min-w-0">
                            <ThemeCard
                                id={theme.id}
                                active={activeTheme === theme.id}
                                onClick={() => handleSelect(theme.id)}
                                disabled={saving}
                            />
                            <div
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
                        </div>
                    ))}
                </div>

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
    );
};

export default Settings;
