import { NavLink } from "react-router-dom";
import "./Menu.css";
import { authStore} from "../../Redux/AuthStore";

 

export function Menu(): JSX.Element {    
    return (
        <div className="Menu">
            {authStore.getState().role === "Customer" ? <NavLink className={"nuv_link"} to={"/coupons_list"}>Home</NavLink> : ""}
            {/* {clientType === "Customer" ? <NavLink className={"nuv_link"} to={"/coupons_list"}>Cart</NavLink> : ""} */}
            {authStore.getState().role === "Customer" ? <NavLink className={"nuv_link"} to={"/get_all_coupons"}>My coupons</NavLink> : ""}
            {authStore.getState().role === "Customer" || authStore.getState().role  === "Company" ? <NavLink className={"nuv_link"} to={"/user_profile"}>Profile</NavLink> : ""}
        </div>
    );
}
