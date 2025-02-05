import authService from "../../../Services/AuthService";
import "./Login.css";
import { authStore, login, logout } from "../../../Redux/AuthStore";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

interface SubmitForm {
    email: string;
    password: string;
    role: string;
} 

export function Login(): JSX.Element {

    const { register, handleSubmit, formState, setValue } = useForm<SubmitForm>({ mode: "onSubmit" })
    const navigate = useNavigate();
    let intervalId: NodeJS.Timer;
    function submitLogin(form: SubmitForm) {
        authService.login(form.email, form.password, form.role)
            .then(token => {
                localStorage.my_token = token;
                authStore.dispatch(login(token));
                intervalId = setInterval(clearConnection, 1_800_000); // enter a timer, after 30 minutes(1_800_000) he will call "clearConnection"
                if(form.role === "Customer"){
                    navigate("/coupons_list") 
                }
                else if(form.role === "Company"){
                    navigate("/get_all_coupons") 
                }
                else { //Admin:
                    navigate("/clients")
                }
            })
            .catch(error => alert(error))
    }

    function clearConnection(){
        alert("You have been disconnected")
        localStorage.my_token= ""
        authStore.dispatch(logout());
        clearInterval(intervalId)
        setTimeout( () => navigate("/"), 0) // this function of setTimout help when we have a problem of sync commands like here the navigate cant happend if it will be wiout setTimeout because alert() play in the same time what can lead to miss the navigate so if we useing this function it will do the navigate after 0 miliseconds but is effitient because it will wait amtil any other commads was exequted. we enter the "lambda" here as a shortcut instad of function , lambda == short function
        
    }
 

    return (
        <div className="Login">
            <form onSubmit={handleSubmit(submitLogin)}>
                <h1>Please login</h1>
                <input type="text" placeholder="Email" required {...register("email")} /><br/>
                <input type="password" placeholder="Password" required {...register("password")} /><br/>
                <select required {...register("role")}>
                    <option defaultValue={"Customer"} disabled hidden>Select user type</option>
                    <option value={"Administrator"}>Administrator</option>
                    <option value={"Company"}>Company</option>
                    <option value={"Customer"}>Customer</option>
                </select>
                <button>Login</button>
            </form>
            <p className="tipBody">
                <p className="tip">Tip:</p> <br/>
                <p className="tip">admin email:</p> admin@admin.com<br/>
                <p className="tip">admin password:</p> admin<br/>
            </p>
        </div>
    );
}

