import PostList from "../components/PostList.tsx";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";

const AllPosts = () => {
    const [searchParams] = useSearchParams()
    const [search, setSearch] = useState<string | null>();
    const [category, setCategory] = useState<string | null>();
    const [tags, setTags] = useState<string | null>();
    useEffect(() => {
        setSearch(searchParams.get("search"));
        setCategory(searchParams.get("categories"));
        setTags(searchParams.get("tags"));
    },[searchParams]);

    return (
        <PostList search={search} category={category} tags={tags}></PostList>
    );
};

export default AllPosts;
