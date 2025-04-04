import { JSX } from "react";
import "./Routing.css";
import { Route, Routes } from "react-router-dom";
import { NotFound } from "../NotFound/NotFound";
import { Login } from "../AuthArea/Login/Login";
import { CouponsList } from "../CouponsArea/CouponsList/CouponsList";
import { CouponDetails } from "../CouponsArea/CouponDetails/CouponDetails";
import { MyCoupons } from "../CouponsArea/MyCoupons/MyCoupons";

import { UserProfile } from "../AuthArea/UserProfile/UserProfile";
import { Clients } from "../AdminArea/Clients/Clients";
import { CompanyDetails } from "../AdminArea/CompaniesArea/CompanyDetails/CompanyDetails";
import { CustomerDetails } from "../AdminArea/CustomersArea/CustomerDetails/CustomerDetails";

export function Routing(): JSX.Element {
    return (
        <div className="Routing">
            <Routes>
                <Route path="/" Component={Login} />
                <Route
                    path="/coupons_list" 
                    element={<CouponsList list={[]} firstTimeRequested={true}/>}
                />
                <Route path="/get_one_coupon/:id" Component={CouponDetails} />
                <Route path="/get_one_company/:id" Component={CompanyDetails} />
                <Route path="/get_one_customer/:id" Component={CustomerDetails} />
                <Route path="/get_all_coupons" Component={MyCoupons} />
                <Route path="/user_profile" Component={UserProfile} />
                <Route path="/clients" Component={Clients} />
                
                <Route path="*" Component={NotFound} />
            </Routes>
        </div>
    );
}
