import { TerminalCard } from "./TerminalCard";
import { MinimalCard } from "./MinimalCard";
import { ChronicleCard } from "./ChronicleCard";

const INACTIVE_OPACITY = 0.42;

type ThemeCardProps = {
    id: string;
    active: boolean;
    onClick: () => void;
    disabled: boolean;
};

export function ThemeCard({ id, active, onClick, disabled }: ThemeCardProps) {
    if (id === "terminal") return <TerminalCard active={active} onClick={onClick} disabled={disabled} />;
    if (id === "minimal") return <MinimalCard active={active} onClick={onClick} disabled={disabled} />;
    if (id === "chronicle") return <ChronicleCard active={active} onClick={onClick} disabled={disabled} />;
    // fallback for any future theme unknown to this client
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-pressed={active}
            className={`text-left p-4 border-2 transition-colors ${active ? "border-primary" : "border-text/30"}`}
            style={{ opacity: active ? 1 : INACTIVE_OPACITY }}
        >
            <span className="font-semibold capitalize">{id}</span>
            {active && <span className="ml-2 text-xs opacity-60">active</span>}
        </button>
    );
}
