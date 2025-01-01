import { Coupon } from "../../../Models/Coupon";
import customerService from "../../../Services/CustomerService";
import { CouponCard } from "../CouponCard/CouponCard";
import "./Coupons.css";
import React, { JSX, useEffect, useState } from "react";

export function Coupons(): JSX.Element {
    
    const [coupons, setCoupons] = useState<Coupon[]>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        customerService.getCustomerCoupons()
            .then(result => { setCoupons(result) })
            .catch((error) => {setError(error.response.data || "An unknown error occurred")})
    }, [])

    return (
        <div className="Coupons">
            <p>{error}</p>
            {coupons?.map(coupon => 
                <CouponCard
                key={coupon.id}
                coupon={coupon}
                />
            )}
        </div>
    );
}
