import axios from "axios";
import { authStore, login } from "../Redux/AuthStore";

const BASE_URL = process.env.REACT_APP_API_URL + "/users"; //BASE_URL - gives flexibility to change the controller endpoint or the developing mode. when the value of "process.env.REACT_APP_API_URL" will be diffrent automaticlly when you running your project on localhost(value - "http://localhost:8080" + ...) or on server (value - "https://namir-coupons.shop" + ...) it will be take the values from file .env or from file .env.production
class AuthService {
    async login(email: string, password: string, role: string, rememberMe: boolean) {
        const token = (await axios.post<string>(`${BASE_URL}/login?email=${email}&password=${password}&role=${role}&rememberMe=${rememberMe}`)).data;
        authStore.dispatch(login(token));
        return token;
    }

    async logout(email: string, role: string) {
        return (await axios.get(`${BASE_URL}/logout?email=${email}&role=${role}`)).data;
    }
}

const authService = new AuthService(); 
export default authService;
