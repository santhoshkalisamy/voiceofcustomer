import React from "react";
import {IdToken} from "@auth0/auth0-spa-js/src/global.ts";

const AuthContext = React.createContext<undefined | IdToken>(undefined);

export default AuthContext;
