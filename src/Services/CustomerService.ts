import axios from "axios";
import { Customer } from "../Models/Customer";
import { Coupon } from "../Models/Coupon";
import { Category } from "../Models/Category";
// import { Category } from "../Models/Category";


class CustomerService{
    async getCustomerDetails(){
        return (await axios.get<Customer>("http://localhost:8080/customer_controller/get_customer_details")).data;
    }

    async purchaseCoupon(couponId: number){
        return (await axios.post<Coupon>(`http://localhost:8080/customer_controller/purchase_coupon?couponId=${couponId}`)).data;
    }

    async getCustomerCoupons(){
        return (await axios.get<Coupon[]>("http://localhost:8080/customer_controller/get_customer_coupons")).data;
    }

    async getCustomerCouponsByPrice(maxPrice: number){
        return (await axios.get<Coupon[]>(`http://localhost:8080/customer_controller/get_customer_coupons_by_price?maxPrice=${maxPrice}`)).data;
    }

    async getCustomerCouponsByCategory(category: Category){ 
        return (await axios.get<Coupon[]>(`http://localhost:8080/customer_controller/get_customer_coupons_by_category?category=${category.toString()}`)).data;//category
    }

    async getAllCoupons(){
        return (await axios.get<Coupon[]>("http://localhost:8080/customer_controller/get_all_coupons")).data;
    }

    async getOneCoupon(id: number){
        return (await axios.get<Coupon>(`http://localhost:8080/customer_controller/get_one_coupon?id=${id}`)).data;

    }
}

const customerService = new CustomerService();
export default customerService;