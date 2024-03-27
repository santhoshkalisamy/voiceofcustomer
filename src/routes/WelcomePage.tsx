import {useAuth0} from "@auth0/auth0-react";

const WelcomePage = () => {
    const {isAuthenticated, user} = useAuth0();
    return (
        <div>
            <h1>Welcome to Voice of Consumer</h1>
            <p>Share your thoughts with the world!</p>
            {isAuthenticated && (
                <p>Welcome {user?.name}</p>
            )}
        </div>
    );
};

export default WelcomePage;
