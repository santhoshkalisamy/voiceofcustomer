import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    IconButton,
    Popover, PopoverContent, PopoverHandler,
    Typography
} from "@material-tailwind/react";
import {Post} from "../models/Post.ts";
import {useEffect, useState} from "react";
import {GetAllPosts, GetAllReactions, ReactToPost} from "../services/PostService.ts";
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/16/solid";
import {Reaction} from "../models/Reaction.ts";

const reactions = [
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

const PostList = () => {
    const pageSize = 5;
    const [posts, setPosts] = useState<Post[]>([]);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [userReactions, setUserReactions] = useState<Reaction[]>([]);
    const [selectedReaction, setSelectedReaction] = useState({
        type: "LIKE",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  className="w-6 h-6">
            <path
                d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z"/>
        </svg>,
        color: "text-blue-800"
    });
    useEffect(() => {
        GetAllPosts(pageSize, activePage).then((response) => {
            console.log(response.data);
            setPosts(response.data.posts);
            setTotalPages(response.data.total);
        }).catch((err) => {
            console.error(err);
        })
        GetAllReactions().then((response) => {
            console.log(response.data);
            setUserReactions(response.data);
        }).catch((err) => {
            console.error(err);
        });
    }, [activePage]);

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
        for (let i = 1; i <= totalPages / pageSize; i++) {
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
            return <Button variant="outlined" className={`${selectedReaction.color}`} placeholder onPointerEnterCapture onPointerLeaveCapture>
                {selectedReaction.svg} ( {post.likeCount} )
            </Button>
        }
        const type = filteredReaction[0].reactionType;
        const postReaction = reactions.filter(reaction => reaction.type === type)[0];
        return  <Button variant="outlined" className={`${postReaction.color}`} placeholder onPointerEnterCapture onPointerLeaveCapture>
            {postReaction.svg} ( {post.likeCount} )
        </Button>;
    }

    function reactToPost(post: Post, reaction: { type: string, svg: any, color: string }) {
        ReactToPost({reactionType: reaction.type, postId: post.id!})
            .then((response) => {
                console.log(response.data);
                setSelectedReaction(reaction);
            }).catch((err) => {
                console.error(err);
            })
        }

    return (
        <div className="flex flex-col gap-y-5 justify-between items-center h-screen">
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
                                <Typography placeholder onPointerEnterCapture onPointerLeaveCapture variant="h6"
                                            color="blue-gray" className="mb-2">
                                    by {post.author}
                                </Typography>
                            </div>
                            <div>
                                <Typography placeholder onPointerEnterCapture onPointerLeaveCapture color="blue-gray"
                                            className="mb-2">
                                    posted on
                                </Typography>
                                <Typography placeholder onPointerEnterCapture onPointerLeaveCapture color="blue-gray"
                                            className="mb-2">
                                    22/11/1992
                                </Typography>
                            </div>
                        </div>

                        <Typography placeholder onPointerEnterCapture onPointerLeaveCapture>
                            {post.content}
                        </Typography>
                    </CardBody>
                    <CardFooter placeholder onPointerEnterCapture onPointerLeaveCapture className="pt-0">
                        <Button className="w-full" placeholder onPointerEnterCapture onPointerLeaveCapture>Read More</Button>
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
                            <Button variant="outlined" placeholder onPointerEnterCapture
                                    onPointerLeaveCapture>Comments</Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
            <div className="flex items-center gap-4 mb-40">
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
    </div>
    </div>
)
    ;
};

export default PostList;
