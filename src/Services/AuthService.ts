import axios from "axios";
import { ClientType } from "../Models/ClientType";

class AuthService{
    async login(email: string , password: string, role: string){
        return (await axios.post<string>(`http://localhost:8080/users/login?email=${email}&password=${password}&role=${role}`)).data;
    }

    async logout(email: string, role: ClientType){
        return (await axios.get(`http://localhost:8080/users/logout?email=${email}&role=${role}`))
    }
}

const authService = new AuthService();
export default authService;