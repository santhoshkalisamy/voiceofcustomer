export interface Post {
    id?:string,
    title: string,
    category: string,
    tags: string[] | undefined,
    content: string,
    userId?:string,
    userName?: string,
    postedOn?: Date,
    likeCount?: number,
    commentCount?: number,
    createdAt?: string,
}
