import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useBlogStore } from "../state/Store";
import { ArticleShell } from "../models/Articles";
import { DeleteButton } from "../components/DeleteButton";

type ArticleDetailProps = {
    article: ArticleShell
}

function ArticleDetail({ article }: Readonly<ArticleDetailProps>) {

    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const deleteArticle = useBlogStore((store) => store.deleteArticle)

    const onDelete = () => {
        deleteArticle(article.id!)
    }


    return (
        <div className="flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors">
            <div className="h-10">
                {
                    !isDeleting &&
                    <div>
                        <h3 className="text-lg font-medium">{article.title}</h3>
                        <p className="text-neutral-500 text-sm">Published on {article.updatedDate}</p>
                    </div>
                }
                {
                    isDeleting &&
                    <div className="h-full flex justify-start items-center  gap-4">
                        <span>Are you sure you want to delete</span>
                        <span className="text-lg font-medium">{article.title}</span>
                    </div>
                }
            </div>
            <div className="space-x-4 flex flex-row">
                {
                    !isDeleting &&
                    <NavLink to={`edit/${article.id}`} className="text-neutral-600 hover:text-neutral-900">Edit</NavLink>
                }
                <DeleteButton isDeleting={isDeleting} onDelete={onDelete} setDeletingState={setIsDeleting} />
            </div>
        </div>
    );
}


export function ArticleOverview() {

    const fetchShells = useBlogStore((state) => state.fetchArticleShells)
    const articleShells = useBlogStore((state) => state.articleList);

    useEffect(() => {
        fetchShells();
    }, [])

    return (
        <div className="col-span-9">
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center p-6 border-b border-neutral-200">
                    <h2 className="text-2xl font-light">Published Articles</h2>
                    <NavLink to="new-article" className="px-5 py-2.5 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors">
                        New Article
                    </NavLink>
                </div>
                <div className="divide-y divide-neutral-200">
                    {articleShells.map(a =>
                        <ArticleDetail key={a.id} article={a} />
                    )}
                </div>
            </div>
        </div>
    );
}