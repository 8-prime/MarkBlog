export type ArticleModel = {
    id: string | undefined;
    title: string,
    articleText: string
    description: string | undefined;
    tags: string | undefined;
    image: string | undefined;
    createdDate: string | undefined;
    updatedDate: string | undefined;
    readDurationSeconds: number;
}

export type ArticleShell = {
    id: string | undefined,
    title: string,
    createdDate: string,
    updatedDate: string
}