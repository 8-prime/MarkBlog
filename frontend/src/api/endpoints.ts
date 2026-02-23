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

export async function updateArticle(article: Article): Promise<void> {
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

export async function getThemes(): Promise<{ id: string; name: string; description: string }[]> {
    const res = await fetch('/api/settings/themes');
    if (!res.ok) {
        throw new Error(`Failed to get themes: ${res.statusText}`);
    }
    return res.json();
}

export async function getTheme(): Promise<{ theme: string }> {
    const res = await fetch('/api/settings/theme');
    if (!res.ok) {
        throw new Error(`Failed to get theme: ${res.statusText}`);
    }
    return res.json();
}

export async function setTheme(theme: string): Promise<void> {
    const res = await fetch('/api/settings/theme', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
    });
    if (!res.ok) {
        throw new Error(`Failed to set theme: ${res.statusText}`);
    }
}