import { Tag, X, Clock } from "lucide-react";
import type { Article } from "../models";
import { useState } from "react";
import Editor from "./Editor";

type ArticleEditFormProps = {
    formData: Article;
    setFormData: React.Dispatch<React.SetStateAction<Article | null>>;
};

const pad = (n: number) => n.toString().padStart(2, "0");

function formatForDateTimeLocal(iso?: string | null) {
    if (!iso) return "";
    const d = new Date(iso);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        d.getHours()
    )}:${pad(d.getMinutes())}`;
}

function ArticleEditForm({ formData, setFormData }: ArticleEditFormProps) {
    const [newTag, setNewTag] = useState("");

    const handleInputChange = (field: keyof Article, value: any) => {
        setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
    };

    const handleAddTag = () => {
        if (!newTag.trim()) return;
        handleInputChange("tags", [...formData.tags, newTag.trim()]);
        setNewTag("");
    };

    const handleRemoveTag = (tagToRemove: string) => {
        handleInputChange("tags", formData.tags.filter((t) => t !== tagToRemove));
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Left sidebar: metadata */}
            <div className="w-1/3 p-6 overflow-y-auto border-r border-text space-y-6">
                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="w-full px-3 py-2 border-2 border-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter article title..." />
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter article description..." />
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                        <Tag className="w-4 h-4 inline mr-1" />
                        Tags
                    </label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                            className="flex-1 px-3 py-2 border border-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add a tag..." />
                        <button
                            onClick={handleAddTag}
                            className="flex items-center gap-2 px-3 py-2 bg-primary text-background hover:bg-primary/80 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-3 py-1 border border-text text-text text-sm"
                            >
                                #{tag}
                                <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-primary">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Schedule Publication
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="datetime-local"
                            value={formatForDateTimeLocal(formData.scheduled_at)}
                            onChange={(e) => handleInputChange(
                                "scheduled_at",
                                e.target.value ? new Date(e.target.value).toISOString() : null
                            )}
                            className="w-full px-3 py-2 border border-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        <button
                            type="button"
                            onClick={() => handleInputChange("scheduled_at", new Date().toISOString())}
                            className="px-3 py-1 bg-primary text-background hover:bg-primary/80 transition-colors text-sm"
                        >
                            Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Editor */}
            <div className="flex-1 overflow-y-auto">
                <Editor
                    articleText={formData.body}
                    setArticleText={(text) => handleInputChange("body", text ?? "")} />
            </div>
        </div>
    );
}

export default ArticleEditForm;
