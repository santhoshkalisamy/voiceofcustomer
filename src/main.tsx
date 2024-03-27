import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {Auth0Provider} from "@auth0/auth0-react";
import App from "./App.tsx";
import {ThemeProvider} from "@material-tailwind/react";

const DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const authParams = {
    redirect_uri: "http://localhost:5173/"
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Auth0Provider
            domain={DOMAIN!}
            clientId={CLIENT_ID!}
            authorizationParams={authParams}
        >
            <div className="h-full min-h-screen bg-green-50">
                <ThemeProvider>
                    <App/>
                </ThemeProvider>
            </div>
        </Auth0Provider>
    </React.StrictMode>,
)
