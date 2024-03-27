import {useAuth0} from "@auth0/auth0-react";

const Profile = () => {
    const {user, isAuthenticated} = useAuth0();
    return (
        isAuthenticated &&
        <div>
            <p>{user?.email}</p>
            <p>{user?.name}</p>
        </div>
    );
};

export default Profile;
