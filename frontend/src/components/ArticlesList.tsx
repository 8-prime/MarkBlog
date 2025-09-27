import { fetchAdminArticles } from "../api/endpoints";
import { useEffect, useState } from "react";
import type { ArticleInfo } from "../models";


export type ArticlesListProps = {
    onSelectArticle: (id: number) => void;
}

function ArticlesList({ onSelectArticle }: ArticlesListProps) {

    const [page, setPage] = useState(1);
    const [articles, setArticles] = useState<ArticleInfo[]>([]);

    useEffect(() => {
        fetchAdminArticles(page).then(data => {
            setArticles(data);
        })
            .catch(error => {
                console.error("Error fetching articles:", error);
            });
    }, []);

    return (
        <div>
            <ul>
                {articles?.map((article) => (
                    <li key={article.id} onClick={() => onSelectArticle(article.id)}>
                        {article.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ArticlesList;