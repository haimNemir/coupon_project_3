import { jwtDecode } from "jwt-decode";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface JwtToken{
    withIssuer: string;
    withIssuedAt: number;
    username: string;
    email: string;
    role: string;
    withExpiresAt: number;
    token: string;
}

const tokenFromCache = (() => { 
    try {
        const token = localStorage.my_token;
        if (!token || typeof token !== "string") {
            return null;
        }
        return jwtDecode<JwtToken>(token);
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
})();

const initState:JwtToken = {
    withIssuer:      tokenFromCache ? tokenFromCache.withIssuer : "" ,
    withIssuedAt:    tokenFromCache ? tokenFromCache.withIssuedAt : 0,
    username:        tokenFromCache ? tokenFromCache.username : "" ,
    email:           tokenFromCache ? tokenFromCache.email : "" ,
    role:            tokenFromCache ? tokenFromCache.role : "" ,
    withExpiresAt:   tokenFromCache ? tokenFromCache.withExpiresAt : 0 ,
    token:           tokenFromCache ? tokenFromCache.token : ""
}

export const authSlice = createSlice({
    name: "authSlice",
    initialState: initState,
    reducers: {
        login: (state: JwtToken, action: PayloadAction<string>) => {
            const decodToken = jwtDecode<JwtToken>(action.payload);
            state.token = action.payload;
            state.email = decodToken.email;
            state.role = decodToken.role;
            state.username = decodToken.username;
            state.withIssuer = decodToken.withIssuer;
            state.withIssuedAt = decodToken.withIssuedAt;
            state.withExpiresAt = decodToken.withExpiresAt;
        },
        logout: (state: JwtToken)=>{
            state.email = "";
            state.role = "";
            state.username = "";
            state.withIssuer = "";
            state.withIssuedAt = 0;
            state.withExpiresAt = 0;
            state.token = "";
        }
    }
})

export const {login, logout} = authSlice.actions;   //+ exporting the methods of the cache to enable saving data in the cache or deleting data from the cache ext. , we exporting in this way to enable to get the methods insantlly from "dispatch(login(...))" and we dont need to create - authStore.actions.login(...) .
export const authStore = configureStore({  //+ over here we exporting the hole object, its relevante when we have more then one Slice that we can export slice of "Auth" and slice of "Companies".  configureStore() - return two methods, 1: getState() , return what the value now in the cache, 2: dispetch() , give you the option to run the "actions" methods.
    reducer: authSlice.reducer
})
