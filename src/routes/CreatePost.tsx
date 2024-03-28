import {withAuthenticationRequired} from '@auth0/auth0-react';
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SubmitPost} from "../services/PostService.ts";
import {Button, Dialog, DialogBody, DialogFooter, DialogHeader} from "@material-tailwind/react";
import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Post} from "../models/Post.ts";

const PostForm = z.object({
    title: z.string().min(5, "Title must contain at least 5 character(s)").max(100),
    category: z.string().min(1, "Please select a category"),
    tags: z.string().optional(),
    content: z.string().min(10, "Content must contain at least 10 character(s)")
        .max(2000, "Content must be less than 2000 characters")
})

type PostFormType = z.infer<typeof PostForm>

const CreatePost = () => {

    const [searchParams] = useSearchParams();

    let post:Post|undefined = undefined;
    if(searchParams.get("id") && localStorage.getItem("postToEdit")) {
        post = JSON.parse(localStorage.getItem("postToEdit")!);
    }

    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<PostFormType>({
        resolver: zodResolver(PostForm),
        defaultValues: {
            title: post ? post.title : "",
            category: post ? post.category : "",
            tags: post ? post.tags?.join(",") : "",
            content: post ? post.content : ""
        }
    })

    const [open, setOpen] = useState(false);
    const [newPostId, setNewPostId] = useState<string | undefined>(undefined);
    const handleOpen = () => setOpen(!open);

    const navigate = useNavigate();

    const submitHandler: SubmitHandler<PostFormType> = async (data: PostFormType) => {
        console.log(data);
        const response = await SubmitPost({
            title: data.title,
            category: data.category,
            content: data.content,
            tags: data.tags?.split(",").map(tag => tag.trim())
        })
        if (response) {
            setNewPostId(response.data.id);
            setOpen(true);
            localStorage.removeItem("postToEdit");
        } else {
            console.log("Failed to submit post");
        }
    }

    return (
            <div className="relative bg-gray-50 rounded-lg mt-20 w-screen max-w-screen-lg">
                <div
                    className="flex items-center justify-between p-4 md:p-5 border-b rounded-t w-full max-w-screen-lg">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {post ? "Edit post" : "Create new post"}
                    </h3>

                </div>
                <form onSubmit={handleSubmit(submitHandler)} className="p-4 md:p-5 w-full max-w-screen-lg">
                    <div className="grid gap-4 mb-4 grid-cols-2 w-full max-w-screen-lg">
                        <div className="col-span-2">
                            <label htmlFor="name"
                                   className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                            <input {...register("title")} type="text" name="title" id="title"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                   placeholder="Post title" required/>
                            {errors.title && <p className="text-orange-700">{errors.title.message}</p>}
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="category"
                                   className="block mb-2 text-sm font-medium text-gray-900">Category</label>
                            <select id="category" {...register("category")}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                                <option value="" defaultValue="">Select a category</option>
                                <option value="REVIEW">Review</option>
                                <option value="FEEDBACK">Feedback</option>
                                <option value="COMPLAINT">Complaint</option>
                                <option value="MISC">Misc</option>
                            </select>
                            {errors.category && <p className="text-orange-700">{errors.category.message}</p>}
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="tags"
                                   className="block mb-2 text-sm font-medium text-gray-900">Tags</label>
                            <input type="text" {...register("tags")} name="tags" id="tags"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                   placeholder="add relevant tags separated by comma"/>
                            {errors.tags && <p className="text-orange-700">{errors.tags.message}</p>}
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="description"
                                   className="block mb-2 text-sm font-medium text-gray-900 ">Content</label>
                            <textarea {...register("content")} id="description" rows={4}
                                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="What's on your mind?"></textarea>
                            {errors.content && <p className="text-orange-700">{errors.content.message}</p>}
                        </div>
                    </div>
                    <button type="submit"
                            className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        {isSubmitting ? "Please wait..." : post ? "Save" : "Post"}
                    </button>
                </form>
                <Dialog placeholder onPointerEnterCapture onPointerLeaveCapture
                    open={open}
                    handler={handleOpen}
                    animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0.9, y: -100 },
                    }}
                        size="xs"
                >
                    <DialogHeader placeholder onPointerEnterCapture onPointerLeaveCapture>Success</DialogHeader>
                    <DialogBody placeholder onPointerEnterCapture onPointerLeaveCapture>
                        Your post has been {post ? "saved" : "submitted."}
                    </DialogBody>
                    <DialogFooter placeholder onPointerEnterCapture onPointerLeaveCapture>
                        <Button placeholder onPointerEnterCapture onPointerLeaveCapture
                            variant="text"
                            color="red"
                            onClick={() => { setOpen(!open) ; navigate("/")}}
                            className="mr-1"
                        >
                            <span>Close</span>
                        </Button>
                        <Button placeholder onPointerEnterCapture onPointerLeaveCapture variant="gradient" color="green" onClick={() => { setOpen(!open) ; navigate(`/post/${newPostId}`)}}>
                            <span>Go to my post</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </div>
    );
};

export default withAuthenticationRequired(CreatePost, {returnTo: "/post/new"});
