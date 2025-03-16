import axios from "axios";
import { Category } from "../Models/Category";
import { Coupon } from "../Models/Coupon";
import { Customer } from "../Models/Customer";

const BASE_URL = process.env.REACT_APP_API_URL + "/customer_controller"; //BASE_URL - gives flexibility to change the controller endpoint or the developing mode. when the value of "process.env.REACT_APP_API_URL" will be diffrent automaticlly when you running your project on localhost(value - "http://localhost:8080" + ...) or on server (value - "https://namir-coupons.shop" + ...) it will be take the values from file .env or from file .env.production

class CustomerService {
    async getCustomerDetails() {
        return (await axios.get<Customer>(`${BASE_URL}/get_customer_details`)).data;
    }

    async purchaseCoupon(couponId: number) {
        return (await axios.post<Coupon>(`${BASE_URL}/purchase_coupon?couponId=${couponId}`)).data;
    }

    async getCustomerCoupons() {
        return (await axios.get<Coupon[]>(`${BASE_URL}/get_customer_coupons`)).data;
    }

    async getCustomerCouponsByPrice(maxPrice: number) {
        return (await axios.get<Coupon[]>(`${BASE_URL}/get_customer_coupons_by_price?maxPrice=${maxPrice}`)).data;
    }

    async getCustomerCouponsByCategory(category: Category) {
        return (await axios.get<Coupon[]>(`${BASE_URL}/get_customer_coupons_by_category?category=${category.toString()}`)).data;
    }

    async getAllCoupons() {
        return (await axios.get<Coupon[]>(`${BASE_URL}/get_all_coupons`)).data;
    }

    async getOneCoupon(id: number) {
        return (await axios.get<Coupon>(`${BASE_URL}/get_one_coupon?id=${id}`)).data;
    }
}

const customerService = new CustomerService();
export default customerService;
