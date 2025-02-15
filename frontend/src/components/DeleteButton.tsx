type DeleteButtonProps = {
    onDelete: () => void,
    setDeletingState: (state: boolean) => void
    isDeleting: boolean

}

export const DeleteButton = ({ onDelete, setDeletingState, isDeleting }: DeleteButtonProps) => {

    const triggerDelete = () => {
        onDelete();
        setDeletingState(false);
    }

    return (
        <>
            {isDeleting && (
                <div className="space-x-4">
                    <button className="text-red-600 hover:text-red-800" onClick={triggerDelete}>
                        Yes
                    </button>
                    <button className="text-neutral-500 hover:text-neutral-600" onClick={() => setDeletingState(false)}>
                        No
                    </button>
                </div>
            )}
            {!isDeleting && (
                <button className="text-red-600 hover:text-red-800" onClick={() => setDeletingState(true)}>Delete</button>
            )}
        </>
    )
}