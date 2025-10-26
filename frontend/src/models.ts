export type ArticleInfo = {
    id: number;
    title: string;
    description: string;
    updated_at: string;
    published_at: string | null;
    scheduled_at: string | null;
    tags: string[];
}

export type CreateArticle = {
    title: string;
    description: string;
    body: string;
    tags: string[];
}

export type Article = {
    id: number;
    title: string;
    filename: string;
    description: string;
    body: string;
    created_at: string;
    updated_at: string;
    scheduled_at: string | null;
    published_at: string | null;
    tags: string[];
}

export type ArticleStats = {
    id: number;
    views: number;
    first_read: string | null;
    last_read: string | null;
    all_reads: ReadInfo[];
}

export type ReadInfo = {
    timestamp: string;
    reads: number;
}