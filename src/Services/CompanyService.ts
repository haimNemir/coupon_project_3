import { Company } from "../Models/Company";
import { Coupon } from "../Models/Coupon";
import axios from "axios";

class CompanyService{
    async addCoupon(coupon: Coupon){ 
        return (await axios.post<Coupon>("http://localhost:8080/company_controller/add_coupon", coupon)).data;
    }

    async updateCoupon(coupon: Coupon){
        return (await axios.put<Coupon>("http://localhost:8080/company_controller/update_coupon", coupon)).data;
    }

    async deleteCoupon(id: number){
        return (await axios.delete<boolean>(`http://localhost:8080/company_controller/delete_coupon?couponId=${id}`)).data;
    }

    async getCompanyCoupons(){
        return (await axios.get<Coupon[]>("http://localhost:8080/company_controller/get_company_coupons")).data;
    }

    async getCompanyCouponsByCategory(category: string){
        return (await axios.get<Coupon[]>(`http://localhost:8080/company_controller/get_company_coupons_by_category?category=${category}`)).data;
    }

    async getCompanyCouponsByPrice(maxPrice: number){
        return(await axios.get<Coupon[]>(`http://localhost:8080/company_controller/get_company_coupons_by_price?maxPrice=${maxPrice}`)).data;
    }

    async getCompanyDetails(){
        return (await axios.get<Company>("http://localhost:8080/company_controller/get_company_details")).data;
    }

    
}

const companyService = new CompanyService();
export default companyService;