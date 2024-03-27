import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {DeletePost, GetAllReactions, GetPost, ReactToPost} from "../services/PostService.ts";
import {Post} from "../models/Post.ts";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip, Popover, PopoverContent,
    PopoverHandler,
    Typography
} from "@material-tailwind/react";
import {useAuth0} from "@auth0/auth0-react";
import {Reaction} from "../models/Reaction.ts";
import {reactions} from "../components/PostList.tsx";

const PostDetails = () => {
    const {id} = useParams<{ id: string }>();
    const  {isAuthenticated, user} = useAuth0();
    const [userReactions, setUserReactions] = useState<Reaction[]>([]);
    const navigation = useNavigate();
    const  navigate = useNavigate();
    const [post, setPost] = useState<Post>();
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
        console.log("userReactions");
        console.log(userReactions);
        console.log("filteredReaction");
        console.log(filteredReaction)
        console.log("post");
        console.log(post);
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

    function deletePost() {
        console.log("deleting post");
        console.log(post);
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
                if(updatedReactions.length > 0) {
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

    return (
        <div>
            {post && (
                <Card placeholder onPointerEnterCapture onPointerLeaveCapture
                      className="mt-20 w-screen max-w-screen-lg">
                    <CardHeader placeholder onPointerEnterCapture onPointerLeaveCapture
                                className="flex items-center justify-center py-3">
                        <h1>{post.category}</h1>
                    </CardHeader>
                    <CardBody placeholder onPointerEnterCapture onPointerLeaveCapture>
                        <h2 className="font-extrabold">{post.title}</h2>
                        <div className="flex flex justify-between">
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
                            <div className="flex items-center justify-center">
                                <Button variant="outlined" className="p-0 px-0 border-0 text-blue-700" placeholder onPointerEnterCapture onPointerLeaveCapture>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         className="w-6 h-6">
                                        <path fillRule="evenodd"
                                              d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </Button>
                            </div>
                        </div>
                        <div>
                            {isAuthenticated && user?.sub === post.userId && (
                                <div className="mt-5 flex flex-row gap-5 justify-end">
                                    <Button onClick={() => handleEdit(post)}  className="text-orange-700 p-0 px-0 border-0" onPointerLeaveCapture disabled={!isAuthenticated} variant="outlined" placeholder
                                        onPointerEnterCapture>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         className="w-6 h-6">
                                        <path
                                            d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"/>
                                        <path
                                            d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"/>
                                    </svg>
                                </Button>
                                <Button onClick={() => deletePost()} className="text-red-700 p-0 px-0 border-0"  onPointerLeaveCapture disabled={!isAuthenticated} variant="outlined" placeholder
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
                            </div>) }
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default PostDetails;
