
//current article
//logged in 

import { create } from "zustand";
import { ArticleModel, ArticleShell } from "../models/Articles";
import { adminArticle, articleShells, createArticle, deleteArticle, updateArticle } from "../api/api";


interface BlogState {
    currentArticle: ArticleModel | undefined,
    articleList: ArticleShell[],
    updateLocal: (value: ArticleModel) => void,
    createArticle: (value: ArticleModel) => Promise<void>,
    updateArticle: (value: ArticleModel) => Promise<void>,
    deleteArticle: (id: string) => Promise<void>,
    fetchArticleShells: () => Promise<void>,
    fetchArticle: (id: string) => Promise<void>,
}

export const useBlogStore = create<BlogState>((set) => ({
    currentArticle: undefined,
    articleList: [],
    updateLocal: (value: ArticleModel) => {
        set({ currentArticle: value })
    },
    createArticle: async (article: ArticleModel) => {
        // create article in backend and set for currentArticle once returned
        const response = await createArticle(article);
        if (response) {
            set({ currentArticle: response })
        }
    },
    updateArticle: async (article: ArticleModel) => {
        // update article in backend and update in currentArticle
        await updateArticle(article);
        set({ currentArticle: article });
    },
    deleteArticle: async (id: string) => {
        // remove article and update shell list
        await deleteArticle(id);
    },
    fetchArticleShells: async () => {
        // load articles and set shell list
        const result = await articleShells();
        set({ articleList: result })
    },
    fetchArticle: async (id: string) => {
        const result = await adminArticle(id);
        if (result) {
            set({ currentArticle: result })
        }
    }
}))