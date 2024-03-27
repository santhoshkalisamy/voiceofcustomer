export interface Comment {
    id?: string;
    postId?: string;
    content?: string;
    userId?: string;
    profile?: {
        "name": string,
        "picture": string
    }
}
