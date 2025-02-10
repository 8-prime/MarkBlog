import { ArticleModel, ArticleShell } from "../models/Articles"
import { isLoginInfo, LoginInfo, LoginRequest, PasswordChangeRequest, PasswordResetInformation } from "../models/Authentication"

const login = async (login: LoginRequest): Promise<LoginInfo | PasswordResetInformation | undefined> => {
    const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
            username: '',
            password: ''
        })
    })

    if (!response.ok) {
        return undefined;
    }

    const body = await response.json();
    if (isLoginInfo(body)) {
        return body as LoginInfo
    }
    return body as PasswordResetInformation
}

const changePassword = async (changeRequest: PasswordChangeRequest): Promise<boolean> => {
    const response = await fetch('/api/change-password', {
        method: 'POST',
        body: JSON.stringify(changeRequest)
    })

    return response.ok;
}

const refresh = async (refreshToken: string): Promise<LoginInfo | undefined> => {
    const response = await fetch('/api/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
    })

    if (!response.ok) {
        return undefined;
    }
    return await response.json() as LoginInfo;
}

const uploadImage = async (image: File): Promise<string | undefined> => {
    const data = new FormData()
    data.append('file', image)

    const response = await fetch('/api/images', {
        method: 'POST',
        body: data
    })
    if (!response.ok) {
        return undefined;
    }
    return response.text()
}

const articleShells = async (): Promise<ArticleShell[]> => {
    const response = await fetch('/api/articles-admin/shells', {
        method: 'GET'
    })
    if (!response.ok) {
        return []
    }
    return response.json() as unknown as ArticleShell[]
}

const adminArticle = async (id: string): Promise<ArticleModel | undefined> => {
    const response = await fetch(`/api/articles-admin/${id}`, {
        method: 'GET'
    })
    if (!response.ok) {
        return undefined;
    }
    return await response.json() as ArticleModel;
}

const deleteArticle = (id: string) => {
    return fetch(`/api/articles-admin/${id}`, {
        method: 'DELETE'
    })
}

const updateArticle = async (article: ArticleModel): Promise<ArticleModel | undefined> => {
    const response = await fetch(`/api/articles-admin/${article.id}`, {
        method: 'PUT',
        body: JSON.stringify(article)
    })
    if (!response.ok) {
        return undefined;
    }
    return await response.json() as ArticleModel;
}

const createArticle = async (article: ArticleModel): Promise<ArticleModel | undefined> => {
    const response = await fetch(`/api/articles-admin/${article.id}`, {
        method: 'POST',
        body: JSON.stringify(article)
    })
    if (!response.ok) {
        return undefined;
    }
    return await response.json() as ArticleModel;
}