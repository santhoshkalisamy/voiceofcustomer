import {Post} from "../models/Post.ts";
import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080"
})

export const SubmitPost = (post: Post) => {
    return axiosClient.post<Post>("/post", post);
}
