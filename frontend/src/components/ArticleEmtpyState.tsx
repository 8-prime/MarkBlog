import { Plus } from "lucide-react";

type Props = { onCreate: () => void };

const ArticleEmptyState = ({ onCreate }: Props) => (
    <div className="flex items-center justify-center h-full text-text">
        <div className="text-center flex flex-col items-center">
            <h3 className="text-lg font-medium mb-2">No Article Selected</h3>
            <p className="mb-4">Select an article from the sidebar to edit, or create a new one.</p>
            <button
                onClick={onCreate}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-background hover:bg-primary/80 transition-colors"
            >
                <Plus className="w-4 h-4" />
                Create New Article
            </button>
        </div>
    </div>
);

export default ArticleEmptyState;
