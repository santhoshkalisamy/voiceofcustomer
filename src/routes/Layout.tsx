import AuthContext from "../contexts/AuthContext.ts";
import Navbar from "../components/Navbar.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import Footer from "../components/Footer.tsx";
import {Sidebar} from "../components/Sidebar.tsx";
import {IdToken} from "@auth0/auth0-spa-js/src/global.ts";

const Layout = () => {
    const { getIdTokenClaims, isAuthenticated} = useAuth0();
    const [token, setToken] = useState<IdToken | undefined>(undefined);
    useEffect(() => {
        const getAccessToken = async () => {
            try {
                if(isAuthenticated) {
                    const token = await getIdTokenClaims();
                    setToken(token);
                    if(token && token.__raw) {
                        localStorage.setItem("token", token!.__raw!);
                    }
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {
                        headers:{
                            Authorization: `Bearer ${token?.__raw}`
                        }
                    }).then((response) => {
                        console.log(response);
                    }).catch((error) => {
                        console.error(error);
                    })
                }
            } catch (e) {
                console.error(e);
            }
        };
        getAccessToken();
    }, [getIdTokenClaims, isAuthenticated]);

    return (<AuthContext.Provider value={token}>
            <div className="w-screen">
                <Navbar/>
                <div className="hidden 2xl:block"><Sidebar/></div>
                <div className="mt-20 pb-20 flex flex-col h-full justify-center items-center">
                    <Outlet/>
                </div>
                <div><Footer/></div>
            </div>
        </AuthContext.Provider>);
};

export default Layout;
