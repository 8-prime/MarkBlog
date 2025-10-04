import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
    fetchAdminArticle,
    fetchAdminArticles,
    createArticle,
    updateArticle,
} from "../api/endpoints";
import type { Article, ArticleInfo, CreateArticle } from "../models";
import ArticleCreateForm from "../components/ArticleCreateForm";
import ArticleEditForm from "../components/ArticleEditForm";

const ArticleAdmin = () => {
    const [articles, setArticles] = useState<ArticleInfo[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [createFormData, setCreateFormData] = useState<CreateArticle>({
        title: "",
        description: "",
        body: "",
        tags: [],
    });

    // Fetch articles on mount
    useEffect(() => {
        fetchAdminArticles(1)
            .then(setArticles)
            .catch((err) => console.error("Error fetching articles:", err));
    }, []);

    // Select article from sidebar
    const handleArticleSelect = (articleInfo: ArticleInfo) => {
        setIsCreatingNew(false);
        fetchAdminArticle(articleInfo.id)
            .then(setSelectedArticle)
            .catch((err) => console.error("Error fetching article:", err));
    };

    const handleCreateNew = () => {
        setSelectedArticle(null);
        setIsCreatingNew(true);
        setCreateFormData({ title: "", description: "", body: "", tags: [] });
    };

    // Save logic for both create and update
    const handleSave = async () => {
        try {
            if (isCreatingNew) {
                // Create new article
                const newArticle = await createArticle(createFormData);
                setSelectedArticle(newArticle);
                setIsCreatingNew(false);

                // Add to sidebar
                const newArticleInfo: ArticleInfo = {
                    id: newArticle.id,
                    title: newArticle.title,
                    description: newArticle.description,
                    tags: newArticle.tags,
                    updated_at: newArticle.updated_at,
                    published_at: newArticle.published_at,
                    scheduled_at: newArticle.scheduled_at,
                };
                setArticles((prev) => [...prev, newArticleInfo]);
            } else if (selectedArticle) {
                // Update existing article
                await updateArticle(selectedArticle);
            }
        } catch (err) {
            console.error("Error saving article:", err);
        }
    };

    const handleCancel = () => {
        setIsCreatingNew(false);
        setSelectedArticle(null);
    };

    return (
        <div className="flex h-screen bg-background text-text font-family">
            {/* Sidebar */}
            <div className="w-1/5 border-r border-text overflow-y-auto">
                <div className="p-4 border-b border-text flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text">Articles</h2>
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 px-3 py-2 bg-primary text-background hover:bg-primary/80 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Article
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            onClick={() => handleArticleSelect(article)}
                            className={`p-4 bg-background border ${selectedArticle?.id === article.id ? "border-primary bg-background/90 shadow-sm shadow-primary" : "border-border-text"
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium truncate">{article.title}</h3>
                                {article.published_at ? (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs">Published</span>
                                ) : article.scheduled_at ? (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs">Scheduled</span>
                                ) : (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs">Draft</span>
                                )}
                            </div>
                            <p className="text-sm text-text mb-3 line-clamp-2">{article.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {article.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="px-2 py-1 text-xs border border-text">#{tag}</span>
                                ))}
                                {article.tags.length > 3 && <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                {isCreatingNew ? (
                    <ArticleCreateForm
                        formData={createFormData}
                        setFormData={setCreateFormData}
                        onCancel={handleCancel}
                        onSave={handleSave}
                    />
                ) : selectedArticle ? (
                    <ArticleEditForm
                        formData={selectedArticle}
                        setFormData={setSelectedArticle}
                        onCancel={handleCancel}
                        onSave={handleSave}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-text">
                        <div className="text-center flex flex-col items-center">
                            <h3 className="text-lg font-medium mb-2">No Article Selected</h3>
                            <p className="mb-4">Select an article from the sidebar to edit, or create a new one.</p>
                            <button
                                onClick={handleCreateNew}
                                className="flex items-center gap-2 px-3 py-2 bg-primary text-background hover:bg-primary/80 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Create New Article
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleAdmin;
