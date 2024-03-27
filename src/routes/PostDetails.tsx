import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    AddCommentToPost,
    DeletePost,
    GetAllComments,
    GetAllReactions,
    GetPost,
    ReactToPost
} from "../services/PostService.ts";
import {Post} from "../models/Post.ts";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Popover,
    PopoverContent,
    PopoverHandler,
    Typography
} from "@material-tailwind/react";
import {useAuth0} from "@auth0/auth0-react";
import {Reaction} from "../models/Reaction.ts";
import {reactions} from "../components/PostList.tsx";
import {Comment} from "../models/Comment.ts";

const PostDetails = () => {
    const {id} = useParams<{ id: string }>();
    const {isAuthenticated, user} = useAuth0();
    const [userReactions, setUserReactions] = useState<Reaction[]>([]);
    const navigation = useNavigate();
    const navigate = useNavigate();
    const [showComments, setShowComments] = useState<boolean>(false);
    const [post, setPost] = useState<Post>();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    useEffect(() => {
        GetPost(id!).then((response) => {
            setPost(response.data);
        }).catch((error) => {
            console.log(error);
        })
        GetAllReactions().then((response) => {
            console.log("GetAllReactions")
            console.log(response.data);
            setUserReactions(response.data);
            console.log("user details");
            console.log(user);
        }).catch((err) => {
            console.error(err);
        });
    }, [id]);

    function getLikeButtonForPost(post: Post) {
        const filteredReaction = userReactions.filter(reaction => reaction.postId === post.id);
        if (filteredReaction.length === 0) {
            return <Button disabled={!isAuthenticated} variant="outlined" className="text-blue-800 p-0 px-0 border-0"
                           placeholder onPointerEnterCapture onPointerLeaveCapture>
                Like ( {post.likeCount} )
            </Button>
        }
        const type = filteredReaction[0].reactionType;
        const postReaction = reactions.filter(reaction => reaction.type === type)[0];
        return <Button disabled={!isAuthenticated} variant="outlined"
                       className={`${postReaction.color} p-0 px-0 border-0`} placeholder onPointerEnterCapture
                       onPointerLeaveCapture>
            {postReaction.svg} ( {post.likeCount} )
        </Button>;
    }

    function deletePost() {
        if (post) {
            DeletePost(post.id!).then((response) => {
                console.log(response.data);
                navigation("/");
            }).catch((err) => {
                console.error(err);
            });
        }
    }

    function reactToPost(post: Post, reaction: { type: string, svg: JSX.Element, color: string }) {
        ReactToPost({reactionType: reaction.type, postId: post.id!})
            .then((response) => {
                setUserReactions([...userReactions, response.data]);
                const updatedReactions = userReactions.filter(reaction => reaction.postId === post.id);
                if (updatedReactions.length > 0) {
                    updatedReactions[0].reactionType = reaction.type;
                    setUserReactions([...userReactions, updatedReactions[0]]);
                }
            }).catch((err) => {
            console.error(err);
        })
    }

    function handleEdit(post: Post) {
        localStorage.setItem("postToEdit", JSON.stringify(post));
        navigate(`/post/new?id=${post.id}`)
    }

    function handleNewComment(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setNewComment(event.target.value);
    }

    function handleShowComments() {
        if(!showComments) {
            GetAllComments({postId: post!.id!}).then((response) => {
                setComments(response.data);
            }).catch((err) => {
                console.error(err);
            });
        }
        setShowComments(!showComments);
    }

    function addComment() {
        console.log("adding comment");
        if (post && newComment && user?.sub) {
            AddCommentToPost({postId: post!.id!, content: newComment, userId: user?.sub}).then((response) => {
                console.log(response.data);
                GetAllComments({postId: post!.id!}).then((response) => {
                    setComments(response.data);
                }).catch((err) => {
                    console.error(err);
                });
                GetPost(id!).then((response) => {
                    setPost(response.data);
                }).catch((error) => {
                    console.log(error);
                })
                setNewComment("");
            }).catch((err) => {
                console.error(err);
            });
        }
    }

    return (
        <div>
            {post && (<>
                    <Card placeholder onPointerEnterCapture onPointerLeaveCapture
                          className="mt-20 w-screen max-w-screen-lg">
                        <CardHeader placeholder onPointerEnterCapture onPointerLeaveCapture
                                    className="flex items-center justify-center py-3">
                            <h1>{post.category}</h1>
                        </CardHeader>
                        <CardBody placeholder onPointerEnterCapture onPointerLeaveCapture>
                            <h2 className="font-extrabold">{post.title}</h2>
                            <div className="flex justify-between">
                                <Typography placeholder onPointerEnterCapture onPointerLeaveCapture>
                                    {post.userName}
                                </Typography>
                                <Typography placeholder onPointerEnterCapture onPointerLeaveCapture>
                                    {post.createdAt?.split("T")[0]}
                                </Typography>
                            </div>
                            <Typography className="mt-10" placeholder onPointerEnterCapture onPointerLeaveCapture>
                                {post.content}
                                <div className="flex flex-row gap-5 mt-5">
                                    {post.tags && post.tags.map((tag, index) => (
                                        <Chip key={index} variant="ghost" value={tag} className="rounded-xl"/>
                                    ))}
                                </div>
                            </Typography>
                        </CardBody>
                        <CardFooter className="flex flex-row justify-between" placeholder onPointerEnterCapture
                                    onPointerLeaveCapture>
                            <div className="flex flex-row gap-5 items-center justify-center">
                                <Popover dismiss={{
                                    enabled: true,
                                    escapeKey: true,
                                    outsidePress: true,
                                    outsidePressEvent: 'click',
                                    bubbles: {
                                        escapeKey: true,
                                        outsidePress: true
                                    }
                                }}
                                         animate={{
                                             mount: {scale: 1, y: 0},
                                             unmount: {scale: 0, y: 25},
                                         }}
                                >
                                    <PopoverHandler>
                                        {getLikeButtonForPost(post)}
                                    </PopoverHandler>
                                    <PopoverContent placeholder onPointerEnterCapture onPointerLeaveCapture>
                                        <div className="flex flex-row gap-1">
                                            {reactions.map((reaction) => (
                                                <Button onClick={() => reactToPost(post, reaction)} variant="outlined"
                                                        className={`p-2 ${reaction.color}`} placeholder
                                                        onPointerEnterCapture onPointerLeaveCapture>
                                                    {reaction.svg}
                                                </Button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <div className="flex items-center justify-center">
                                    <Button variant="outlined" className="p-0 px-0 border-0 text-blue-700" placeholder
                                            onPointerEnterCapture onPointerLeaveCapture>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                             className="w-6 h-6">
                                            <path fillRule="evenodd"
                                                  d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                            <Button className="p-0 px-0 border-0" variant="outlined"
                                    onClick={() => handleShowComments()}
                                    placeholder
                                    onPointerEnterCapture
                                    onPointerLeaveCapture>Comments ({post.commentCount})</Button>

                            <div>
                                {isAuthenticated && user?.sub === post.userId && (
                                    <div className="mt-5 flex flex-row gap-5 justify-end">
                                        <Button onClick={() => handleEdit(post)}
                                                className="text-orange-700 p-0 px-0 border-0" onPointerLeaveCapture
                                                disabled={!isAuthenticated} variant="outlined" placeholder
                                                onPointerEnterCapture>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                 fill="currentColor"
                                                 className="w-6 h-6">
                                                <path
                                                    d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"/>
                                                <path
                                                    d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"/>
                                            </svg>
                                        </Button>
                                        <Button onClick={() => deletePost()} className="text-red-700 p-0 px-0 border-0"
                                                onPointerLeaveCapture disabled={!isAuthenticated} variant="outlined"
                                                placeholder
                                                onPointerEnterCapture>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                 fill="currentColor"
                                                 className="w-6 h-6">
                                                <path
                                                    d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z"/>
                                                <path fillRule="evenodd"
                                                      d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.133 2.845a.75.75 0 0 1 1.06 0l1.72 1.72 1.72-1.72a.75.75 0 1 1 1.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 1 1-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 1 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                        </Button>
                                    </div>)}
                            </div>
                        </CardFooter>
                    </Card>
                    {showComments && (
                        <Card placeholder onPointerEnterCapture onPointerLeaveCapture
                              className="mt-5 w-screen max-w-screen-lg">
                            <CardBody placeholder onPointerEnterCapture onPointerLeaveCapture>
                                <div>
                                    <div className="px-5 flex flex-col gap-5 w-screen max-w-screen-xl items-start">
                                        {isAuthenticated && <div className="flex flex-row gap-5">
                                            <img src={user?.picture} alt="user" className="w-10 h-10 rounded-full"/>
                                            <div className="flex flex-col gap-5">
                                                <Typography placeholder onPointerEnterCapture onPointerLeaveCapture>
                                                    {user?.name}
                                                </Typography>
                                                <textarea value={newComment} onChange={handleNewComment}
                                                          className="w-screen max-w-screen-md p-2.5 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                          rows={4} placeholder="Add a comment"/>
                                                <Button onClick={addComment} className="text-white bg-green-700"
                                                        placeholder
                                                        onPointerEnterCapture
                                                        onPointerLeaveCapture>
                                                    Comment</Button>
                                            </div>
                                        </div>}
                                        {comments.map((comment, index) => (
                                            <div key={index} className="flex flex-col gap-5">
                                                <div className="flex flex-row gap-5">
                                                    <img src={comment.profile?.picture} alt="user"
                                                         className="w-10 h-10 rounded-full"/>
                                                    <div className="flex flex-col gap-5">
                                                        <Typography placeholder onPointerEnterCapture
                                                                    onPointerLeaveCapture>
                                                            {comment.profile?.name}
                                                        </Typography>
                                                        <Typography placeholder onPointerEnterCapture
                                                                    onPointerLeaveCapture>
                                                            {comment.content}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>)}
                </>
            )}
        </div>
    );
};

export default PostDetails;
