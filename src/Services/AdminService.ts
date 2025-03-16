import axios from "axios";
import { Company } from "../Models/Company";
import { Customer } from "../Models/Customer";

const BASE_URL = process.env.REACT_APP_API_URL + "/admin_controller"; //BASE_URL - gives flexibility to change the controller endpoint or the developing mode. when the value of "process.env.REACT_APP_API_URL" will be diffrent automaticlly when you running your project on localhost(value - "http://localhost:8080" + ...) or on server (value - "https://namir-coupons.shop" + ...) it will be take the values from file .env or from file .env.production

class AdminService {
    // Company Methods
    async addCompany(company: Company) {
        return (await axios.post<Company>(`${BASE_URL}/add_company`, company)).data;
    }

    async updateCompany(company: Company) {
        return (await axios.put<Company>(`${BASE_URL}/update_company`, company)).data;
    }

    async deleteCompany(id: number) {
        return (await axios.delete<boolean>(`${BASE_URL}/delete_company?companyId=${id}`)).data;
    }

    async getOneCompany(id: number) {
        return (await axios.get<Company>(`${BASE_URL}/get_one_company?companyId=${id}`)).data;
    }

    async getAllCompanies() {
        return (await axios.get<Company[]>(`${BASE_URL}/get_all_companies`)).data;
    }

    // Customer Methods
    async addCustomer(customer: Customer) {
        return (await axios.post<Customer>(`${BASE_URL}/add_customer`, customer)).data;
    }

    async updateCustomer(customer: Customer) {
        return (await axios.put<Customer>(`${BASE_URL}/updateCustomer`, customer)).data;
    }

    async deleteCustomer(id: number) {
        return (await axios.delete<boolean>(`${BASE_URL}/delete_customer?customerId=${id}`)).data;
    }

    async getOneCustomer(id: number) {
        return (await axios.get<Customer>(`${BASE_URL}/get_one_customer?customerId=${id}`)).data;
    }

    async getAllCustomers() {
        return (await axios.get<Customer[]>(`${BASE_URL}/get_all_customers`)).data;
    }
}

const adminService = new AdminService();
export default adminService;
