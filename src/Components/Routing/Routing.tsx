import { JSX } from "react";
import "./Routing.css";
import { Route, Routes } from "react-router-dom";
import { NotFound } from "../NotFound/NotFound";
import { Companies } from "../CompaniesArea/Companies/Companies";
import { Login } from "../AuthArea/Login/Login";
import { CouponsList } from "../CouponsArea/CouponsList/CouponsList";
import { CouponDetails } from "../CouponsArea/CouponDetails/CouponDetails";
import { MyCoupons } from "../CouponsArea/MyCoupons/MyCoupons";
import { Coupon } from "../../Models/Coupon";

export function Routing(): JSX.Element {
    return (
        <div className="Routing">
            <Routes>
                <Route path="/" Component={Login} />
                <Route path="/companies" Component={Companies} />
                <Route
                    path="/coupons_list"
                    element={<CouponsList list={[]} />}
                />
                <Route path="/get_one_coupon/:id" Component={CouponDetails} />
                <Route path="/get_all_coupons" Component={MyCoupons} />
                <Route path="*" Component={NotFound} />
            </Routes>
        </div>
    );
}
