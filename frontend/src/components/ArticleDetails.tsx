import { Save, X, LoaderCircle } from "lucide-react";
import type { Article } from "../models";
import { useState } from "react";
import ArticleEditForm from "./ArticleEditForm";
import { ArticleStats } from "./ArticleStats";


enum Mode {
    EDIT = 'edit',
    STATS = 'stats',
}

type ArticleDetailsProps = {
    formData: Article;
    setFormData: React.Dispatch<React.SetStateAction<Article | null>>;
    onCancel: () => void;
    onSave: () => Promise<void>;
};

function ArticleDetails({ formData, setFormData, onCancel, onSave }: ArticleDetailsProps) {
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState<Mode>(Mode.EDIT);


    function handleSave() {
        if (saving) return;
        setSaving(true);
        onSave().finally(() => setSaving(false));
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-text">
                <div className="flex gap-2 justify-center items-center">
                    <button onClick={() => setMode(Mode.EDIT)}>
                        <h1 className={`text-2xl font-bold text-text ${mode === Mode.EDIT ? 'text-text' : 'text-text/50'}`}>Edit Article</h1>
                    </button>
                    <p>/</p>
                    <button onClick={() => setMode(Mode.STATS)}>
                        <h1 className={`text-2xl font-bold text-text ${mode === Mode.STATS ? 'text-text' : 'text-text/50'}`}>Article Stats</h1>
                    </button>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex items-center gap-2 px-3 py-2 bg-background text-text border border-text hover:bg-primary/80 transition-colors"
                    >
                        <X className="w-4 h-4 mr-2 inline" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-3 py-2 bg-primary text-background hover:bg-primary/80 transition-colors"
                    >
                        {!saving && (
                            <Save className="w-4 h-4" />)
                        }
                        {saving && (
                            <LoaderCircle className="animate-spin w-4 h-4" />
                        )}
                        Save Changes
                    </button>
                </div>
            </div>
            {mode === Mode.EDIT && (<ArticleEditForm formData={formData} setFormData={setFormData} />)}
            {mode === Mode.STATS && (<ArticleStats articleId={formData.id} />)}
        </div>
    );
}

export default ArticleDetails;