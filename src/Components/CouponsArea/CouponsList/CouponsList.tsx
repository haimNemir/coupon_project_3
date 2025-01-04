import { useEffect, useState } from "react";
import "./CouponsList.css";
import { Coupon } from "../../../Models/Coupon";
import customerService from "../../../Services/CustomerService";
import { CouponCard } from "../CouponCard/CouponCard";

interface CouponsListProps {
    list: Coupon[];
    firstTimeRequested: boolean; 
}

export function CouponsList(props: CouponsListProps): JSX.Element {
    const [allCoupons, setAllCoupons] = useState<Coupon[]>(props.list);
    const [error, setError] = useState<string>("");


    useEffect(() => {
        if (!props.firstTimeRequested) {
            setAllCoupons(props.list)
        }  
        if (props.firstTimeRequested){
        customerService.getAllCoupons()
            .then(result => {
                setAllCoupons(result);
            })
            .catch((error) => { setError(error || "An unknown error occurred") })
        }
    }, [props.list]) // [props.list]-   if the value "props.list" will change "UseEffect" will do another render.

    return (
        <div className="CouponsList">
            {error ? <p>{error}</p> :
                // <div>{allCoupons?.map(coupon =>
                //     <CouponCard key={coupon.id} coupon={coupon} />)}</div>}
                <div>{allCoupons.length > 0 ? allCoupons?.map(coupon =>
                    <CouponCard key={coupon.id} coupon={coupon} />):
                    <h2>You haven't purchased any coupons from this categories yet, Please make a purchase first.</h2>
                    }</div>}
        </div>
    );
}
