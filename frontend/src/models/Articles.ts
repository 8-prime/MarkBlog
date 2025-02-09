export type ArticleModel = {
    id: string | null;
    description: string | null;
    tags: string | null;
    image: string | null;
    createdDate: string;
    updatedDate: string;
    readDurationSeconds: number;
}

export type ArticleShell = {
    title: string,
    createdDate: Date,
    updatedDate: Date
}