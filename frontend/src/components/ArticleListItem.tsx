import { Calendar } from "lucide-react";
import type { ArticleInfo } from "../models";

type Props = {
    article: ArticleInfo;
    selected: boolean;
    onClick: () => void;
};

const ArticleListItem = ({ article, selected, onClick }: Props) => {
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const getStatusBadge = () => {
        if (article.published_at) {
            return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs ">Published</span>;
        } else if (article.scheduled_at) {
            return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs ">Scheduled</span>;
        } else {
            return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs ">Draft</span>;
        }
    };

    return (
        <div
            onClick={onClick}
            className={`p-4 bg-background border cursor-pointer ${selected ? "border-primary bg-background/90 shadow-sm shadow-primary" : "border-border-text"
                }`}
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium truncate">{article.title}</h3>
                {getStatusBadge()}
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary mb-2">
                <Calendar className="w-3 h-3" />
                Updated {formatDate(article.updated_at)}
            </div>
            <p className="text-sm text-text mb-3 line-clamp-2">{article.description}</p>
            <div className="flex flex-wrap gap-1">
                {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs border border-text">
                        #{tag}
                    </span>
                ))}
                {article.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
                )}
            </div>
        </div>
    );
};

export default ArticleListItem;
