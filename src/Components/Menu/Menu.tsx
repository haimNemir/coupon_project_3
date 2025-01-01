import { NavLink } from "react-router-dom";
import "./Menu.css";
import { clientType } from "../../Redux/AuthStore";



export function Menu(): JSX.Element {
    return (
        <div className="Menu">
            {clientType === "Customer" ? <NavLink className={"nuv_link"} to={"/coupons_list"}>Home</NavLink> : ""}
            {/* {clientType === "Customer" ? <NavLink className={"nuv_link"} to={"/coupons_list"}>Cart</NavLink> : ""} */}
            {clientType === "Customer" ? <NavLink className={"nuv_link"} to={"/get_all_coupons"}>My coupons</NavLink> : ""}
			
        </div>
    );
}
