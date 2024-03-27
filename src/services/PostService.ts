import {Post} from "../models/Post.ts";
import axios from "axios";
import {GetAllPostsResponse} from "../models/GetAllPostsResponse.ts";
import {Reaction} from "../models/Reaction.ts";
import {PopularTag} from "../models/PopularTag.ts";
import {Comment} from "../models/Comment.ts";

function getAxiosClient() {
    return axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
    })
}

export const SubmitPost = (post: Post) => {
    return getAxiosClient().post<Post>("/post", post, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
}

export const ReactToPost = (reaction: {reactionType:string, postId:string}) => {
    return getAxiosClient().post<Reaction>("/post/reaction", reaction, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
}

export const AddCommentToPost = (comment:Comment) => {
    return getAxiosClient().post<Reaction>(`/post/${comment.postId}/comment`, comment, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
}

export const GetAllComments = (comment:Comment) => {
    return getAxiosClient().get<Comment[]>(`/post/${comment.postId}/comment`);
}

export const GetAllPosts = (pageSize:number, pageNumber:number) => {
    return getAxiosClient().get<GetAllPostsResponse>("/post",{params:{pageSize, pageNumber}});
}


export const GetAllPostsWithQuery = (pageSize:number, pageNumber:number, categories?:string | undefined | null, search?: string | undefined | null, tags?: string | undefined | null) => {
    return getAxiosClient().get<GetAllPostsResponse>("/post/all",{params:{pageSize, pageNumber, categories, search, tags}});
}

export const GetPost = (postId:string) => {
    return getAxiosClient().get<Post>(`/post/${postId}`);
}

export const DeletePost = (postId:string) => {
    return getAxiosClient().delete<string>(`/post/${postId}`,{
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
}

export const GetAllReactions = () => {
    return getAxiosClient().get<Reaction[]>("/reaction",{
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
}

export const SearchPosts = (query:string) => {
    return getAxiosClient().get<Post[]>("/post/search", {params:{query}});
}

export const PopularTags = () => {
    return getAxiosClient().get<PopularTag[]>("/tag/popular");
}


