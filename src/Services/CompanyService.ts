import axios from "axios";
import { Category } from "../Models/Category";
import { Company } from "../Models/Company";
import { Coupon } from "../Models/Coupon";

const BASE_URL = process.env.REACT_APP_API_URL + "/company_controller"; //BASE_URL - gives flexibility to change the controller endpoint or the developing mode. when the value of "process.env.REACT_APP_API_URL" will be diffrent automaticlly when you running your project on localhost(value - "http://localhost:8080" + ...) or on server (value - "https://namir-coupons.shop" + ...) it will be take the values from file .env or from file .env.production

class CompanyService {
    async addCoupon(coupon: Coupon) { 
        return (await axios.post<Coupon>(`${BASE_URL}/add_coupon`, coupon)).data;
    }

    async updateCoupon(coupon: Coupon) {
        return (await axios.put<Coupon>(`${BASE_URL}/update_coupon`, coupon)).data;
    }

    async deleteCoupon(id: number) {
        return (await axios.delete(`${BASE_URL}/delete_coupon?couponId=${id}`)).data;
    }

    async getCompanyCoupons() {
        return (await axios.get<Coupon[]>(`${BASE_URL}/get_company_coupons`)).data;
    }

    async getCompanyCouponsByCategory(category: Category) { 
        return (await axios.get<Coupon[]>(`${BASE_URL}/get_company_coupons_by_category?category=${category.toString()}`)).data;
    }

    async getCompanyCouponsByPrice(maxPrice: number) {
        return (await axios.get<Coupon[]>(`${BASE_URL}/get_company_coupons_by_price?maxPrice=${maxPrice}`)).data;
    }

    async getCompanyDetails() {
        return (await axios.get<Company>(`${BASE_URL}/get_company_details`)).data;
    }
}

const companyService = new CompanyService();
export default companyService;
