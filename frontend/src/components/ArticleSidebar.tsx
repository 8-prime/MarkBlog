import { Plus } from "lucide-react";
import ArticleListItem from "./ArticleListItem";
import type { ArticleInfo } from "../models";

type Props = {
    articles: ArticleInfo[];
    selectedArticleId?: number;
    onSelect: (article: ArticleInfo) => void;
    onCreate: () => void;
};

const ArticleSidebar = ({ articles, selectedArticleId, onSelect, onCreate }: Props) => {
    return (
        <div className="w-1/5 border-r border-text overflow-y-auto">
            <div className="p-4 border-b border-text">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-text">Articles</h2>
                    <button
                        onClick={onCreate}
                        className="flex items-center gap-2 px-3 py-2 bg-primary text-background hover:bg-primary/80 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Article
                    </button>
                </div>
            </div>
            <div className="p-4 space-y-3">
                {articles.map((article) => (
                    <ArticleListItem
                        key={article.id}
                        article={article}
                        selected={selectedArticleId === article.id}
                        onClick={() => onSelect(article)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ArticleSidebar;
