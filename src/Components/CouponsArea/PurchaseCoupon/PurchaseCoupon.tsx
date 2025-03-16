import { useNavigate } from "react-router-dom";
import "./PurchaseCoupon.css";
import customerService from "../../../Services/CustomerService";

interface CouponProps{
    couponId: number;
}
 
export function PurchaseCoupon(props: CouponProps): JSX.Element {
    const navigate = useNavigate()
 
    function confirmParchase(){
        customerService.purchaseCoupon(props.couponId)
        .then(coupon => { 
            if(coupon.id !== 0){
                alert("You have beed successfuly purchased coupon " + props.couponId)
                navigate("/coupons_list")
            }
        })
        .catch(error => {
            alert(error.response.data)
            navigate("/coupons_list")
        })
    }
    
    return (
        <div className="PurchaseCoupon">
            <button onClick={confirmParchase} className="customized_card purchase_coupon__button">Purchase coupon</button>
        </div>
    );
}
