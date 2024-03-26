import {Post} from "./Post.ts";

export interface GetAllPostsResponse {
    total: number,
    posts: Post[]
}
