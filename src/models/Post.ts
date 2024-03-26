export interface Post {
    id?:string,
    title: string,
    category: string,
    tags: string[] | undefined,
    content: string,
    author?: string,
    postedOn?: Date,
    likeCount?: number,
    comments?: number
}
