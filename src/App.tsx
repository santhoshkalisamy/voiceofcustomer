import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./routes/Home.tsx";
import CreatePost from "./routes/CreatePost.tsx";
import Layout from "./routes/Layout.tsx";
import PostDetails from "./routes/PostDetails.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
        children: [
            {
                index: true,
                Component: Home,
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
