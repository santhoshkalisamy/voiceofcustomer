import {Link} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {useState} from "react";


const Navbar = () => {
    const {logout, loginWithPopup, isAuthenticated, user} = useAuth0();
    const [openProfileMenu, setOpenProfileMenu] = useState(false);
    return (
        <nav className="fixed w-full h-16 bg-gray-100 flex flex-row flex-wrap items-center mx-auto justify-around">
            <div>
                <h1 className="font-extrabold">
                    <Link to="/">Voice of Consumer</Link>
                </h1>
            </div>
            <div>
                <input className="bg-transparent h-10 w-56 border rounded-md px-2" placeholder="Search" type="text"/>
            </div>

            <div className="flex flex-row space-x-10 justify-center items-center">
                <div>
                    <Link to="/post/new">Create Post</Link>
                </div>
                <div>
                    <button onClick={() => setOpenProfileMenu(!openProfileMenu)}><img alt="user-profile" src={user?.picture ? user?.picture : "/profile.png"}
                                 className="h-8 w-8 rounded-xl"/></button>
                    <div
                        className={`fixed ${openProfileMenu ? "fixed":"hidden"} z-50 my-4 text-base list-none bg-gray-100 divide-y divide-gray-100 rounded-lg shadow`}
                        id="user-dropdown">
                        <div className="px-4 py-3">
                            <span className="block text-sm text-black">{isAuthenticated ? user?.name : "Welcome"}</span>
                            <span
                                className="block text-sm  text-gray-500 truncate">{user?.email}</span>
                        </div>
                        <ul className="py-2" aria-labelledby="user-menu-button">
                            <li>
                                {isAuthenticated && <a href="#"
                                   className="block px-4 py-2 text-sm text-black hover:bg-gray-100">Profile</a>}
                            </li>
                            <li>
                                <a onClick={() => isAuthenticated ? logout() : loginWithPopup()} href="#"
                                   className="block px-4 py-2 text-sm text-black hover:bg-gray-100">{isAuthenticated ? "Logout" : "Login"}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
