import axios from "axios";
import { Company } from "../Models/Company";
import { Customer } from "../Models/Customer";


class AdminService{
    // Company-
    async addCompany(company: Company){
        return( await axios.post<Company>("http://localhost:8080/admin_controller/add_company", company)).data;
    }

    async updateCompany(company: Company){
        return( await axios.put<Company>("http://localhost:8080/admin_controller/update_company", company)).data;
    }

    async deleteCompany(id: number){
        return( await axios.delete<boolean>(`http://localhost:8080/admin_controller/delete_company?companyId=${id}`)).data;
    }

    async getOneCompany(id: number){
        return( await axios.get<Company>(`http://localhost:8080/admin_controller/get_one_company?companyId=${id}`)).data;
    }

    async getAllCompanies(){
        return( await axios.get<Company[]>("http://localhost:8080/admin_controller/get_all_companies")).data;
    }

    //Customer- 
    async addCustomer(customer: Customer){
        return( await axios.post<Customer>("http://localhost:8080/admin_controller/add_customer", customer)).data;
    }

    async updateCustmer(customer: Customer){
        return( await axios.put<Customer>("http://localhost:8080/admin_controller/updateCustomer", customer)).data;
    }

    async deleteCustomer(id: number){
        return( await axios.delete<boolean>(`http://localhost:8080/admin_controller/delete_customer?customerId=${id}`)).data;
    }

    async getOneCustomer(id: number){
        return( await axios.get<Customer>(`http://localhost:8080/admin_controller/get_one_customer?customerId=${id}`)).data;
    }

    async getAllCustomers(){
        return( await axios.get<Customer[]>("http://localhost:8080/admin_controller/get_all_customers")).data;
    }
}

const adminService = new AdminService();
export default adminService;