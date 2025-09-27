import type { Article, ArticleInfo, CreateArticle } from "../models";


export async function fetchAdminArticles(page: number): Promise<ArticleInfo[]> {
    const res = await fetch(`/api/articles?page=${page}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch articles: ${res.statusText}`);
    }
    return res.json();
}

export async function fetchAdminArticle(id: number): Promise<Article> {
    const res = await fetch(`/api/articles/${id}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch article: ${res.statusText}`);
    }
    return res.json();
}

export async function createArticle(article: CreateArticle): Promise<Article> {
    const res = await fetch(`/api/articles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
    });
    if (!res.ok) {
        throw new Error(`Failed to create article: ${res.statusText}`);
    }
    return res.json();
}

export async function updateArticle(article: Article): Promise<Article> {
    const res = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
    });
    if (!res.ok) {
        throw new Error(`Failed to update article: ${res.statusText}`);
    }
    return res.json();
}