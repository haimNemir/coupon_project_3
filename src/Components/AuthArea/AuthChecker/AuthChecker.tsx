import { useNavigate } from "react-router-dom";
import { authStore, logout } from "../../../Redux/AuthStore";
import "./AuthChecker.css";
import { useEffect } from "react";

export function AuthChecker(): JSX.Element {
    const navigate = useNavigate();
    useEffect(() => {
        const expiredTime = localStorage.getItem("expiration_time") || "";
        if (expiredTime !== "" && Number(expiredTime) < Math.floor(Date.now() / 1000)) { //Math.floor(Date.now() / 1000)- take the current time in milliseconds and convert them to seconds like the object expired time we gotted from the server, he always give value of seconds. 
            authStore.dispatch(logout())
        } else if (expiredTime !== "" && Number(expiredTime) > Math.floor(Date.now() / 1000)) {
            const role = authStore.getState().role
            if (role === "Customer") {
                navigate("/coupons_list") 
            }
            else if (role === "Company") {
                navigate("/get_all_coupons")
            }
            else if (role === "Administrator") {
                navigate("/clients")
            }
        }
    }, [])
    return (
        <div className="AuthChecker">

        </div>
    );
}
