
//current article
//logged in 

import { ArticleModel, ArticleShell } from "../models/Articles";


interface BlogState {
    currentArticle: ArticleModel | undefined,
    articleList: ArticleShell[],
    createArticle: (value: ArticleModel) => Promise<void>,
    updateArticle: (value: ArticleModel) => Promise<void>,
    deleteArticle: (id: string) => Promise<void>

}