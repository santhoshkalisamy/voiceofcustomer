import {Link} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faPlus} from "@fortawesome/free-solid-svg-icons";


const Navbar = () => {
    const {logout, loginWithPopup, isAuthenticated, user} = useAuth0();
    const [openProfileMenu, setOpenProfileMenu] = useState(false);
    return (
        <header  className="z-50 fixed w-screen top-0 left-0 bg-gray-800 text-white py-5">
            <nav className="flex flex-row mx-auto max-w-screen-2xl items-center justify-between">
            <div>
                <h1 className="font-extrabold">
                    <Link to="/">Voice of Consumer</Link>
                </h1>
            </div>
            <div className="relative">
                <input className="border-gray-400 h-10 w-56 border rounded-lg px-2 pl-10" placeholder="Search"
                       type="text"/>
                <FontAwesomeIcon icon={faMagnifyingGlass}
                                 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"/>
            </div>

            <div className="flex flex-row space-x-10 justify-center items-center">
                <div>
                    <Link to="/post/new" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded mr-4">
                        <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                        Create Post
                    </Link>
                </div>
                <div>
                    <button onClick={() => setOpenProfileMenu(!openProfileMenu)}><img alt="user-profile"
                                                                                      src={user?.picture ? user?.picture : "/profile.png"}
                                                                                      className="h-8 w-8 rounded-xl"/>
                    </button>
                    <div
                        className={`fixed ${openProfileMenu ? "fixed" : "hidden"} z-50 my-4 text-base list-none bg-gray-100 divide-y divide-gray-100 rounded-lg shadow`}
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
        </header>
    );
};

export default Navbar;
