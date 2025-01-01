import { useParams } from "react-router-dom";
import "./CouponDetails.css";
import { useEffect, useState } from "react";
import { Coupon } from "../../../Models/Coupon";
import customerService from "../../../Services/CustomerService";
import { PurchaseCoupon } from "../PurchaseCoupon/PurchaseCoupon";

export function CouponDetails(): JSX.Element {
    const params = useParams();
    const id = +params.id!;
    const [coupon, setCoupon] = useState<Coupon>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        customerService.getOneCoupon(id)
            .then(getCoupon => setCoupon(getCoupon))
            .catch(error => setError(error.response.data))
    }, [])

    return (
        <div className="CouponDetails">
            {error}
            {error ? <p>{error}</p> :
                <div>
                    Coupon id: {coupon?.id}<br/>
                    Title: {coupon?.title}<br/>
                    Cusegory: {coupon?.category}<br/>
                    Company name: {coupon?.company.name}<br/>
                    Price: {coupon?.price}<br/>
                    Description: {coupon?.description}<br/>
                    Start date: {coupon?.startDate.toString()}<br/>
                    End date: {coupon?.endDate.toString()}<br/>
                    <PurchaseCoupon couponId={coupon?.id!}/>
                </div>}
        </div>
    );
}
