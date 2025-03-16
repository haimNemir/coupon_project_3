import { jwtDecode } from "jwt-decode";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface JwtToken { // You must create this interface with the values of: iss, iat, exp - as is with no changes. it is because this is not an ordinary interface, and because the server sends the data like this you must receive the data like this also.
    iss: string; // the Issuer
    iat: string; // creation time
    username: string;
    email: string;
    role: string;
    exp: string; // expiration time
    token: string;
}

const tokenFromCache = (() => {
    try {
        const token = localStorage.getItem("my_token")
        if (token === "" || token === null) {
            return "";
        }
        return jwtDecode<JwtToken>(token);
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
})();

const initState: JwtToken = {
    iss: tokenFromCache ? tokenFromCache.iss : "",
    iat: tokenFromCache ? tokenFromCache.iat : "",
    username: tokenFromCache ? tokenFromCache.username : "",
    email: tokenFromCache ? tokenFromCache.email : "",
    role: tokenFromCache ? tokenFromCache.role : "",
    exp: tokenFromCache ? tokenFromCache.exp : "",
    token: tokenFromCache ? tokenFromCache.token : ""
}

export const authSlice = createSlice({

    name: "authSlice",
    initialState: initState,
    reducers: {
        login: (state: JwtToken, action: PayloadAction<string>) => {
            const decodedToken = jwtDecode<JwtToken>(action.payload);
            state.token = action.payload;
            state.email = decodedToken.email;
            state.role = decodedToken.role;
            state.username = decodedToken.username;
            state.iss = decodedToken.iss;
            state.iat = "" + decodedToken.iat;
            state.exp = "" + decodedToken.exp;
            localStorage.setItem("expiration_time", "" + decodedToken.exp)
        },
        logout: (state: JwtToken) => {
            state.email = "";
            state.role = "";
            state.username = "";
            state.iss = "";
            state.iat = "";
            state.exp = "";
            state.token = "";
            localStorage.setItem("my_token", "")
            localStorage.setItem("expiration_time", "")
            localStorage.setItem("remember_me", "false");
        }
    }
})

export const { login, logout } = authSlice.actions;   //+ exporting the methods of the cache to enable saving data in the cache or deleting data from the cache ext. , we exporting in this way to enable to get the methods insantlly from "dispatch(login(...))" and we dont need to create - authStore.actions.login(...) .
export const authStore = configureStore({  //+ over here we exporting the hole object, its relevante when we have more then one Slice that we can export slice of "Auth" and slice of "Companies".  configureStore() - return two methods, 1: getState() , return what the value now in the cache, 2: dispetch() , give you the option to run the "actions" methods.
    reducer: authSlice.reducer
})


// TODO: copy line 4 to the notbook , the right way to create good JWT interface.