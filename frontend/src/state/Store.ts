import { create } from "zustand";
import { ArticleModel, ArticleShell } from "../models/Articles";
import { adminArticle, articleShells, createArticle, deleteArticle, getUserInfo, updateArticle, updateUserInfo } from "../api/api";
import { UserInfoModel } from "../models/UserInfo";

interface BlogState {
    currentArticle: ArticleModel | undefined,
    articleList: ArticleShell[],
    userSettings: UserInfoModel | undefined,
    updateLocal: (value: ArticleModel) => void,
    createArticle: (value: ArticleModel) => Promise<void>,
    updateArticle: (value: ArticleModel) => Promise<void>,
    deleteArticle: (id: string) => Promise<void>,
    fetchArticleShells: () => Promise<void>,
    fetchArticle: (id: string) => Promise<void>,
    fetchUserInfo: () => Promise<void>,
    updateLocalUserInfo: (userInfo: UserInfoModel) => void,
    saveUserInfo: () => Promise<void>
}

export const useBlogStore = create<BlogState>((set, get) => ({
    currentArticle: undefined,
    articleList: [],
    userSettings: undefined,
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
        get().fetchArticleShells()
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
    },
    fetchUserInfo: async () => {
        const result = await getUserInfo()
        if (result) {
            set({ userSettings: result })
        }
    },
    updateLocalUserInfo: (userInfo: UserInfoModel) => {
        set({ userSettings: userInfo })
    },
    saveUserInfo: async () => {
        const userSettings = get().userSettings;
        if (!userSettings) {
            return
        }
        await updateUserInfo(userSettings)
    }
}))