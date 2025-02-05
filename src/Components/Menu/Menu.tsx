import { NavLink } from "react-router-dom";
import "./Menu.css";
import { authStore } from "../../Redux/AuthStore";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import adminService from "../../Services/AdminService";


export function Menu(): JSX.Element {
    const [clientType, setClientType] = useState(authStore.getState().role)
    const [isConnected, setIsConnected] = useState<boolean>(authStore.getState().role !== "")

    // this useEffect use for litsen for client role change and reder this component equaly. 
    useEffect(() => {
        //How its works: 1- first enering to Menu component will apply the litsener, 2- when the client will connect the commands inside the lambda will run. 3- because useState() is changing the hole component will rerender and show the updated "role" and make useEffect run again and the second litsener to work, but only after the first litsener was canceled by return. 
        const unsubscribe = authStore.subscribe(() => { // ".subscribe"  - return always method, this method can cancel the litsener of "subscribe". Here he will run after the two commands inside the "lambda"  if we will not call this method he will continue litsen even the component was dropped from the DOM and when the next client will connect it will create a new litsener and the first litsener still working and make a memory leak.  
            setClientType(authStore.getState().role)
            setIsConnected(authStore.getState().role !== "")
            return () => unsubscribe() // "return()=>"  : when this component will exit from the DOM the "unsubscribe" will apply. this return is not an ordnery "return" because he dont return a value only he will apply the method unsubscribe.// We use "()=>" here because that will apply the method only when the component will exit from the DOM or when the useEffect will apply again compard to- return unsubscribe() that will apply immediatelly 
        })
    }, [])



    return (
        <div>
            {isConnected && (<> {/* we added this sign: "<> </>" because JSX must return a single element*/}
                <div className="Menu">
                    {clientType === "Customer" && (<NavLink className={"nuv_link"} to={"/coupons_list"}>Home</NavLink>)}
                    {clientType === "Administrator" && (<NavLink className={"nuv_link"} to={"/clients"}>Home</NavLink>)}
                    {clientType === "Customer" && (<NavLink className={"nuv_link"} to={"/coupons_list"}>Cart</NavLink>)}
                    {clientType === "Customer" || clientType === "Company" ? <NavLink className={"nuv_link"} to={"/get_all_coupons"}>My coupons</NavLink>: ''}
                    <NavLink className={"nuv_link"} to={"/user_profile"}>Profile</NavLink>
                </div>
            </>)}
        </div>
    );
}

//TODO: change the useEffect to authStore.subscribe