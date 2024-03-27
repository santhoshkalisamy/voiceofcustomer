import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader, Dialog, DialogBody, DialogFooter, DialogHeader,
    IconButton,
    Popover, PopoverContent, PopoverHandler,
    Typography
} from "@material-tailwind/react";
import {Post} from "../models/Post.ts";
import {useEffect, useState} from "react";
import {DeletePost, GetAllPosts, GetAllPostsWithQuery, GetAllReactions, ReactToPost} from "../services/PostService.ts";
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/16/solid";
import {Reaction} from "../models/Reaction.ts";
import {useAuth0} from "@auth0/auth0-react";
import {Link, useNavigate} from "react-router-dom";

export const reactions = [
    {
        type: "LIKE",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  className="w-6 h-6">
            <path
                d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z"/>
        </svg>,
        color: "text-blue-800"
    },
    {
        type: "DISLIKE",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="currentColor" className="w-6 h-6">
            <path
                d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z"/>
        </svg>,
        color: "text-gray-800"
    },
    {
        type: "LOVE",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="currentColor" className="w-6 h-6">
            <path
                d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"/>
        </svg>,
        color: "text-red-800"
    },
    {
        type: "HAPPY",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 0 1-.189-.866c0-.298.059-.605.189-.866Zm2.023 6.828a.75.75 0 1 0-1.06-1.06 3.75 3.75 0 0 1-5.304 0 .75.75 0 0 0-1.06 1.06 5.25 5.25 0 0 0 7.424 0Z"
                  clipRule="evenodd"/>
        </svg>,
        color: "text-green-800"
    },
    {
        type: "SAD",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 0 1-.189-.866c0-.298.059-.605.189-.866Zm-4.34 7.964a.75.75 0 0 1-1.061-1.06 5.236 5.236 0 0 1 3.73-1.538 5.236 5.236 0 0 1 3.695 1.538.75.75 0 1 1-1.061 1.06 3.736 3.736 0 0 0-2.639-1.098 3.736 3.736 0 0 0-2.664 1.098Z"
                  clipRule="evenodd"/>
        </svg>,
        color: "text-amber-800"
    }
]

type PostListProps = {
    category?: string | undefined | null,
    tags?: string | undefined | null,
    search?: string | undefined | null,
}

const PostList = ({category, search, tags}:PostListProps) => {
    const  {isAuthenticated, user} = useAuth0();
     const pageSize = 5;
     const  navigate = useNavigate();
     const [postToDelete, setPostToDelete] = useState<Post | null>(null);
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const handleOpen = (value:boolean) => setDeleteDialogOpen(value);
    const [posts, setPosts] = useState<Post[]>([]);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [userReactions, setUserReactions] = useState<Reaction[]>([]);
    useEffect(() => {
        if(category || search || tags) {
        GetAllPostsWithQuery(pageSize, activePage, category, search, tags).then((response) => {
            console.log(response.data);
            setPosts(response.data.posts);
            setTotalPages(response.data.total);
        }).catch((err) => {
            console.error(err);
        }) } else {
            GetAllPosts(pageSize, activePage).then((response) => {
                console.log(response.data);
                setPosts(response.data.posts);
                setTotalPages(response.data.total);
            }).catch((err) => {
                console.error(err);
            })
        }
        GetAllReactions().then((response) => {
            console.log(response.data);
            setUserReactions(response.data);
            console.log("user details");
            console.log(user);
        }).catch((err) => {
            console.error(err);
        });
    }, [activePage, category, tags, search, user, isAuthenticated]);

    const next = () => {
        if (activePage === 5) return;
        setActivePage(activePage + 1);
    };

    const prev = () => {
        if (activePage === 1) return;

        setActivePage(activePage - 1);
    };

    function createPagination() {
        const pages = [];
        const pagesToShow = Math.ceil(totalPages / pageSize);
        for (let i = 1; i <= pagesToShow; i++) {
            pages.push(
                <IconButton placeholder onPointerEnterCapture onPointerLeaveCapture
                            onClick={() => setActivePage(i)}
                            variant={`${activePage === i ? "filled" : "text"}`}>{i}</IconButton>
            );
        }
        return pages;
    }

    function getLikeButtonForPost(post: Post) {
        const filteredReaction = userReactions.filter(reaction => reaction.postId === post.id);
        if(filteredReaction.length === 0) {
            return <Button disabled={!isAuthenticated} variant="outlined" className="text-blue-800 p-0 px-0 border-0" placeholder onPointerEnterCapture onPointerLeaveCapture>
                Like ( {post.likeCount} )
            </Button>
        }
        const type = filteredReaction[0].reactionType;
        const postReaction = reactions.filter(reaction => reaction.type === type)[0];
        return  <Button disabled={!isAuthenticated} variant="outlined" className={`${postReaction.color} p-0 px-0 border-0`} placeholder onPointerEnterCapture onPointerLeaveCapture>
            {postReaction.svg} ( {post.likeCount} )
        </Button>;
    }

    function reactToPost(post: Post, reaction: { type: string, svg: JSX.Element, color: string }) {
        ReactToPost({reactionType: reaction.type, postId: post.id!})
            .then((response) => {
                    setUserReactions([...userReactions, response.data]);
                    const updatedReactions = userReactions.filter(reaction => reaction.postId === post.id);
                    if(updatedReactions.length > 0) {
                        updatedReactions[0].reactionType = reaction.type;
                        setUserReactions([...userReactions, updatedReactions[0]]);
                    } else {
                        const updatedPosts = posts.map((p) => { if(p.id === post.id) p.likeCount ? p.likeCount += 1 : p.likeCount = 1; return p; });
                        setPosts(updatedPosts);
                    }
            }).catch((err) => {
                console.error(err);
            })
        }

    function handleDelete(post: Post) {
        handleOpen(true);
        setPostToDelete(post);
    }

    function deletePost() {
        console.log("deleting post");
        console.log(postToDelete);
        handleOpen(false);
        if(postToDelete) {
            DeletePost(postToDelete.id!).then((response) => {
                console.log(response.data);
                const updatedPosts = posts.filter((post) => post.id !== postToDelete?.id);
                setPosts(updatedPosts);
            }).catch((err) => {
                console.error(err);

            });
        }
    }

    function handleEdit(post: Post) {
        localStorage.setItem("postToEdit", JSON.stringify(post));
        navigate(`/post/new?id=${post.id}`)
    }

    return (
        <div className="flex flex-col gap-y-5 justify-between items-center">
        <div className="mt-20 grid grid-cols-3 gap-5 space-y-8 flex-grow-0">
            {posts.map((post) => (
                <Card placeholder onPointerEnterCapture onPointerLeaveCapture className="w-96 border border-green-100">
                    <CardHeader placeholder onPointerEnterCapture onPointerLeaveCapture color="gray"
                                className="border bg-green-800 border-green-500 text-white text-xl relative h-12 flex items-center justify-center">
                        <h1>{post.category.toLowerCase()}</h1>
                    </CardHeader>
                    <CardBody placeholder onPointerEnterCapture onPointerLeaveCapture>
                        <div className="flex flex-row justify-between">
                            <div>
                                <Typography placeholder onPointerEnterCapture onPointerLeaveCapture variant="h5"
                                            color="blue-gray" className="mb-2">
                                    {post.title}
                                </Typography>
                                <Typography placeholder onPointerEnterCapture onPointerLeaveCapture
                                            color="blue-gray" className="mb-2 font-light text-xs">
                                    by {post.userName}
                                </Typography>
                            </div>
                            <div>
                                <Typography placeholder onPointerEnterCapture onPointerLeaveCapture color="blue-gray"
                                            className="mb-2">
                                    posted on
                                </Typography>
                                <Typography placeholder onPointerEnterCapture onPointerLeaveCapture color="blue-gray"
                                            className="mb-2 font-light text-xs">
                                    {post.createdAt?.split("T")[0]}
                                </Typography>
                            </div>
                        </div>

                        <Typography placeholder onPointerEnterCapture onPointerLeaveCapture>
                            {post.content.substring(0, 100)} {post.content.length > 100 ? "..." : ""}
                        </Typography>
                    </CardBody>
                    <CardFooter placeholder onPointerEnterCapture onPointerLeaveCapture className="pt-0">
                        <Button className="w-full" placeholder onPointerEnterCapture onPointerLeaveCapture>
                            <Link to={`/post/${post.id}`}>Read More</Link>
                        </Button>
                        <div className="flex flex-row justify-evenly mt-5">
                            <Popover dismiss = {{
                                enabled: true,
                                escapeKey: true,
                                outsidePress: true ,
                                outsidePressEvent: 'click',
                                bubbles: {
                                    escapeKey: true,
                                    outsidePress: true
                                }
                                }}
                                animate={{
                                    mount: { scale: 1, y: 0 },
                                    unmount: { scale: 0, y: 25 },
                                }}
                            >
                                <PopoverHandler>
                                    { getLikeButtonForPost(post) }
                                </PopoverHandler>
                                <PopoverContent placeholder onPointerEnterCapture onPointerLeaveCapture>
                                    <div className="flex flex-row gap-1">
                                        {reactions.map((reaction) => (
                                            <Button onClick={() => reactToPost(post, reaction)} variant="outlined" className={`p-2 ${reaction.color}`} placeholder onPointerEnterCapture onPointerLeaveCapture>
                                                {reaction.svg}
                                            </Button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Button className="p-0 px-0 border-0" disabled={!isAuthenticated} variant="outlined" placeholder onPointerEnterCapture
                                    onPointerLeaveCapture>Comments ({post.commentCount})</Button>
                            {isAuthenticated && post.userId === user?.sub &&
                            <div className="flex flex-row gap-5 items-center">
                                <Button onClick={() => handleEdit(post)} className="text-orange-700 p-0 px-0 border-0" onPointerLeaveCapture disabled={!isAuthenticated} variant="outlined" placeholder
                                        onPointerEnterCapture>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         className="w-6 h-6">
                                        <path
                                            d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"/>
                                        <path
                                            d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"/>
                                    </svg>
                                </Button>
                                <Button onClick={() => handleDelete(post)} className="text-red-700 p-0 px-0 border-0"  onPointerLeaveCapture disabled={!isAuthenticated} variant="outlined" placeholder
                                        onPointerEnterCapture>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         className="w-6 h-6">
                                        <path
                                            d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z"/>
                                        <path fillRule="evenodd"
                                              d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.133 2.845a.75.75 0 0 1 1.06 0l1.72 1.72 1.72-1.72a.75.75 0 1 1 1.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 1 1-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 1 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </Button>
                            </div> }
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
            {totalPages >= pageSize && (
                <div className="flex items-center gap-4 mb-10">
                    <Button placeholder onPointerEnterCapture onPointerLeaveCapture
                            variant="text"
                            className="flex items-center gap-2"
                            onClick={prev}
                            disabled={activePage === 1}
                    >
                        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4"/> Previous
                </Button>
                <div className="flex items-center gap-2">
                { createPagination() }
        </div>
        <Button placeholder onPointerEnterCapture onPointerLeaveCapture
                variant="text"
                className="flex items-center gap-2"
                onClick={next}
                disabled={activePage === Math.floor((totalPages / pageSize))}
        >
            Next
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4"/>
        </Button>
    </div>)}
            <Dialog placeholder onPointerEnterCapture onPointerLeaveCapture
                    handler={handleOpen}
                open={deleteDialogOpen}
                size={"xs"}
            >
                <DialogHeader placeholder onPointerEnterCapture onPointerLeaveCapture>Delete post?</DialogHeader>
                <DialogBody placeholder onPointerEnterCapture onPointerLeaveCapture>
                   Are you sure want to delete this post?
                </DialogBody>
                <DialogFooter placeholder onPointerEnterCapture onPointerLeaveCapture>
                    <Button placeholder onPointerEnterCapture onPointerLeaveCapture
                        variant="text"
                        color="red"
                        onClick={() => deletePost()}
                        className="mr-1"
                    >
                        <span>Yes</span>
                    </Button>
                    <Button placeholder onPointerEnterCapture onPointerLeaveCapture
                        variant="gradient"
                        color="green"
                        onClick={() => handleOpen(false)}
                    >
                        <span>No</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    )}

export default PostList;
