export interface ArticleModel {
    id: number,
    title: string,
    tags: string[],
    markdownText: string,
    createdAt: string,
    lastChanged: string,
    userName: string
}
