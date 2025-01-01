import "./PurchaseCoupon.css";
import { useState } from "react";
import customerService from "../../../Services/CustomerService";
import { Coupon } from "../../../Models/Coupon";

interface CouponProps{
    couponId: number;
}

export function PurchaseCoupon(props: CouponProps): JSX.Element {
    const [purchase, setPurchase] = useState<Coupon>()


    function confirmParchase(){
        customerService.purchaseCoupon(props.couponId)
        .then(coupon => { 
            if(coupon.id !== 0){
                setPurchase(coupon);
                alert("You have beed successfuly purchased coupon " + props.couponId)
            }
        })
        .catch(error => alert(error.response.data))
    }
    
    return (
        <div className="PurchaseCoupon">
            <button onClick={confirmParchase}>Purchase coupon</button>
        </div>
    );
}
