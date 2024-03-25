import AuthContext from "../contexts/AuthContext.ts";
import Navbar from "../components/Navbar.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import Footer from "../components/Footer.tsx";

const Layout = () => {
    const {getAccessTokenSilently} = useAuth0();
    const [token, setToken] =
        useState<null | string>(null);
    useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                setToken(token);
            } catch (e) {
                console.error(e);
            }
        };
        getAccessToken();
    }, [getAccessTokenSilently]);

    return (
        <AuthContext.Provider value={token}>
            <div className="max-w-screen mx-auto">
                <Navbar/>
                <div className="flex flex-col h-screen justify-between items-center">
                    <div><Outlet/></div>
                    <div><Footer/></div>
                </div>
            </div>
        </AuthContext.Provider>
    );
};

export default Layout;
