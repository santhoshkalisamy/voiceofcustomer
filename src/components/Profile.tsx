import {useContext} from "react";
import AuthContext from "../contexts/AuthContext.ts";
import {useAuth0} from "@auth0/auth0-react";

const Profile = () => {
    const jwt = useContext(AuthContext);
    const {user, isAuthenticated} = useAuth0();
    return (
        isAuthenticated &&
        <div>
            <p>{jwt}</p>
            <p>{user?.email}</p>
            <p>{user?.name}</p>
        </div>
    );
};

export default Profile;
