import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL + "/api/ai"; //BASE_URL - gives flexibility to change the controller endpoint or the developing mode. when the value of "process.env.REACT_APP_API_URL" will be diffrent automaticlly when you running your project on localhost(value - "http://localhost:8080" + ...) or on server (value - "https://namir-coupons.shop" + ...) it will be take the values from file .env or from file .env.production

class OpenAiService {
    async sendMessage(prompt: string){
        const res = await axios.post(`${BASE_URL}/chat`, prompt, {
            headers: { 'Content-Type': 'text/plain' },
          });
          return res.data;
    }
}

const openAiService = new OpenAiService();
export default openAiService;