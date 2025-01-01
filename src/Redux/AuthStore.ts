import { jwtDecode } from "jwt-decode";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface JwtToken{
    withIssuer: string;
    withIssuedAt: Date;
    username: string;
    email: string;
    role: string;
    withExpiresAt: number;
    token: string;
}

// const tokenFromCache = jwtDecode<JwtToken>(localStorage.my_token); // my code make problem because he did not found token in localStorage
const tokenFromCache = (() => { // GPT help:
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
    withIssuedAt:    tokenFromCache ? new Date(tokenFromCache.withIssuedAt) : new Date(),
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
            state.withIssuedAt = new Date();
            state.withExpiresAt = 0;
            state.token = "";
        }
    }
})

export const clientType = initState.role;
export const {login, logout} = authSlice.actions; 
export const AuthStore = configureStore({
    reducer: authSlice.reducer
})


