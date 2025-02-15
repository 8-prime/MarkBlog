export type BasicButtonProps = {
    onClick: () => void,
    children: React.ReactNode
}

export const BasicButton = ({ onClick, children }: BasicButtonProps) => {
    return (
        <button onClick={onClick} className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-700">
            {children}
        </button>
    );
}