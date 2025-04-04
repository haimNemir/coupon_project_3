import authService from "../../../Services/AuthService";
import "./Login.css";
import { authStore, logout } from "../../../Redux/AuthStore";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { OpenAiChat } from "../../OpenAiChat/OpenAiChat";

interface SubmitForm {
    email: string;
    password: string;
    role: string;
}

export function Login(): JSX.Element {
    const { register, handleSubmit } = useForm<SubmitForm>({ mode: "onSubmit" })
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState<boolean>(localStorage.getItem("remember_me") === "true")
    if (rememberMe) {
        localStorage.setItem("remember_me", "true");
    } else {
        localStorage.setItem("remember_me", "false");
    }

    function submitLogin(form: SubmitForm) {
        authService.login(form.email, form.password, form.role, rememberMe)
            .then(token => {
                localStorage.setItem("my_token", token)
                if (!rememberMe) {
                    setTimeout(() => clearConnection(), 1_800_000) //30 minutes 1_800_000
                } else {
                    setTimeout(() => clearConnection(), 28_800_000) //Eight hours 28_800_000
                }
                if (form.role === "Customer") {
                    navigate("/coupons_list")
                }
                else if (form.role === "Company") {
                    navigate("/get_all_coupons")
                }
                else { //Admin:
                    navigate("/clients")
                }
            })
            .catch(error => alert(error.response.data))
    }

    function clearConnection() {
        alert("You have been disconnected")
        authStore.dispatch(logout())
        navigate("/") // this function of setTimout help when we have a problem of sync commands like here the navigate cant happend if it will be without setTimeout because alert() play in the same time what can lead to miss the navigate so if we useing this function it will do the navigate after 0 miliseconds but is effitient because it will wait amtil any other commads was exequted. we enter the "lambda" here as a shortcut instad of function , lambda == short function
    }

    function copyText(elementId: string) {
        const textElement = document.getElementById(elementId) as HTMLParagraphElement
        navigator.clipboard.writeText(textElement.textContent || "")
    }

    const [showPassword, setShowPassword] = useState<boolean>(false)

    return (
        <div className="Login">
                <h1 className="login__login_title">Please login</h1><br/>

            <form className="loginArea" onSubmit={handleSubmit(submitLogin)}>
                <input className="login__input login__grid_A" type="email" placeholder="Email" required {...register("email")} />
                <label className="login__grid_B">
                    <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                    <span className="login__sapn">Remember me</span> 
                </label>
                <input className="login__input login__grid_C" type={showPassword ? "text" : "password"} placeholder="Password" required {...register("password")} />
                <label className="login__grid_D">
                    <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)}></input>
                    <span className="login__sapn">Show password</span>
                </label>
                <select className="login__select login__grid_E" defaultValue={""} required {...register("role")}>
                    <option value={""} disabled>Select user type</option>
                    <option value={"Administrator"}>Administrator</option>
                    <option value={"Company"}>Company</option>
                    <option value={"Customer"}>Customer</option>
                </select>
                <button className="customized_button login__buttons login__grid_F" >Login</button>
            </form>
            <h3 className="tips">Connection info:</h3>

            <div className="tipsTable">
                <div className="tipBody tipsTable__grid_A">
                    <p className="tip">Admin email:</p><br /> <span className="login__span" id="info1" title="Copy" onClick={() => copyText('info1')}>admin@admin.com</span><br />
                    <p className="tip">Admin password:</p><br /> <span className="login__span" id="info2" title="Copy" onClick={() => copyText('info2')}>admin</span>
                </div>
                <div className="tipBody tipsTable__grid_B">
                    <p className="tip">Demo company email:</p><br /> <span className="login__span" id="info3" title="Copy" onClick={() => copyText('info3')}>Apple@gmail.com</span><br />
                    <p className="tip">Demo company password:</p><br /> <span className="login__span" id="info4" title="Copy" onClick={() => copyText('info4')}>Appl3X!</span>
                </div>
                <div className="tipBody tipsTable__grid_C">
                    <p className="tip">Demo customer email:</p><br /> <span className="login__span" id="info5" title="Copy" onClick={() => copyText('info5')}>JohnDoe@gmail.com</span><br />
                    <p className="tip">Demo customer password:</p><br /> <span className="login__span" id="info6" title="Copy" onClick={() => copyText('info6')}>passw0rd123</span>
                </div>
            </div>
        </div>
    );
}

