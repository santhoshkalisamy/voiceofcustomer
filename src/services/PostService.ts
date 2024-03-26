import {Post} from "../models/Post.ts";
import axios from "axios";
import {GetAllPostsResponse} from "../models/GetAllPostsResponse.ts";
import {Reaction} from "../models/Reaction.ts";
const axiosClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Authorization": `santhosh`
    }
})

export const SubmitPost = (post: Post) => {
    return axiosClient.post<Post>("/post", post);
}

export const ReactToPost = (reaction: {reactionType:string, postId:string}) => {
    return axiosClient.post<Post>("/post/reaction", reaction);
}

export const GetAllPosts = (pageSize:number, pageNumber:number) => {
    return axiosClient.get<GetAllPostsResponse>("/post",{params:{pageSize, pageNumber}});
}

export const GetAllReactions = () => {
    return axiosClient.get<Reaction[]>("/reaction");
}
