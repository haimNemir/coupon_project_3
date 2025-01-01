import authService from "../../../Services/AuthService";
import "./Login.css";
import { AuthStore, login } from "../../../Redux/AuthStore";
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

    function submitLogin(form: SubmitForm) {
        authService.login(form.email, form.password, form.role)
            .then(token => {
                localStorage.my_token = token;
                AuthStore.dispatch(login(token));
                if(form.role === "Customer"){
                    navigate("/coupons_list")
                }
            })
            .catch(error => console.log(error))
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

        </div>
    );
}
