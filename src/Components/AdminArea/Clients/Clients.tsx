import { ChangeEvent, useContext, useEffect, useState } from "react";
import "./Clients.css";
import { Company } from "../../../Models/Company";
import { Customer } from "../../../Models/Customer";
import adminService from "../../../Services/AdminService";
import { CompanyCard } from "../CompaniesArea/CompanyCard/CompanyCard";
import { CustomerCard } from "../CustomersArea/CustomerCard/CustomerCard";
import { AddCompany } from "../CompaniesArea/AddCompany/AddCompany";
import { AddCustomer } from "../CustomersArea/AddCustomer/AddCustomer";
import AddIcon from '@mui/icons-material/Add';

export function Clients(): JSX.Element {

    const [adminSelected, setAdminSelected] = useState<string>("Companies")

    function handleChangeSelect(event: ChangeEvent<HTMLSelectElement>) {
        if (event.target.value === "Companies" || event.target.value === "Customers") {
            setAdminSelected(event.target.value)
        }
    }

    const [companyList, setCompanyList] = useState<Company[]>([])
    const [customerList, setCustomerList] = useState<Customer[]>([])
    const [addingCompanyMode, setAddingCompanyMode] = useState<boolean>(false)
    const [addingCustomerMode, setAddingCustomerMode] = useState<boolean>(false)
    const [fetchingDataCompanies, setFetchingDataCompanies] = useState<boolean>(true) ////////////////////////////////////
    const [fetchingDataCustomers, setFetchingDataCustomers] = useState<boolean>(true) ////////////////////////////////////

    useEffect(() => {
        if (adminSelected === "Companies") {
            adminService.getAllCompanies()
                .then(result => { setCompanyList(result); setFetchingDataCompanies(false) })
                .catch(error => alert(error.response.data))
        } else if (adminSelected === "Customers") {
            adminService.getAllCustomers()
                .then(result => { setCustomerList(result); setFetchingDataCustomers(false) })
                .catch(error => alert(error.response.data))
        }
    }, [adminSelected, addingCompanyMode, addingCustomerMode])



    return (
        <div className="Clients">
            <select className="selectButton" defaultValue={""} onChange={handleChangeSelect}>
                <option key={""} value={"Show Clients"}>Select client type</option>
                <option key={"companies"} value={"Companies"}>Companies list</option>
                <option key={"customers"} value={"Customers"}>Customers list</option>
            </select>
            <div className="Cards">
                {
                    adminSelected === "Companies" &&
                    (<>
                        {
                            !addingCompanyMode ? <button className="add_card customized_card" onClick={() => setAddingCompanyMode(!addingCompanyMode)}>Add company<br /><AddIcon sx={{ fontSize: 80 }} /></button>
                                : <AddCompany changeAddingMode={setAddingCompanyMode} />
                        }
                        {
                            fetchingDataCompanies ?
                                <div className="spinner-container">
                                    <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                </div>
                                :
                                companyList.length > 0 ? companyList.map(company =>
                                    <CompanyCard key={company.id} company={company} />)
                                    :
                                    "You haven't created any companies yet"
                        }

                    </>)
                }
                {
                    adminSelected === "Customers" &&
                    (<>
                        {
                            !addingCustomerMode ? <button className="add_card customized_card" onClick={() => setAddingCustomerMode(!addingCustomerMode)}>Add customer<br /><AddIcon sx={{ fontSize: 80 }} /></button>
                                : <AddCustomer changeAddingMode={setAddingCustomerMode} />}
                        {
                            fetchingDataCustomers ?
                                <div className="spinner-container">
                                    <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                </div>
                                :
                                customerList.length > 0 ? customerList.map(customer =>
                                    <CustomerCard key={customer.id} customer={customer} />)
                                    : "You haven't created any customers yet"
                        }
                    </>)
                }
            </div>
        </div>
    );
}
