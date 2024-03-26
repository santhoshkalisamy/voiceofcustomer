import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import CreatePost from "./routes/CreatePost.tsx";
import Layout from "./routes/Layout.tsx";
import PostDetails from "./routes/PostDetails.tsx";
import PostList from "./components/PostList.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
        children: [
            {
                index: true,
                Component: PostList,
            },
            {
                path: "post",
                children: [
                    {
                        path: ":id",
                        Component: PostDetails,
                    },
                    {
                        path: "new",
                        Component: CreatePost,
                    },
                    {
                        path: "all",
                        Component: PostList,
                    }
                ],
            },
        ],
    },
]);


function App() {
    return (
        <RouterProvider router={router}></RouterProvider>
    )
}

export default App
