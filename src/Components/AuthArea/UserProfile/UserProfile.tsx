import { useEffect, useState } from "react";
import { ClientType } from "../../../Models/ClientType";
import "./UserProfile.css";
import { authSlice, authStore, JwtToken, logout } from "../../../Redux/AuthStore";
import { useSelector } from "react-redux";
import customerService from "../../../Services/CustomerService";
import { Customer } from "../../../Models/Customer";
import { Company } from "../../../Models/Company";
import companyService from "../../../Services/CompanyService";
import authService from "../../../Services/AuthService";
import { useNavigate } from "react-router-dom";

export function UserProfile(): JSX.Element {
    const [companyDetails, setCompanyDetails] = useState<Company>();
    const [customerDetails, setCustomerDetails] = useState<Customer>();
    const [role, setRole] = useState<string>('');
    const roleType = authStore.getState().role;
    const navigate = useNavigate()


    useEffect(() => {
        setRole(roleType)
        if (roleType === "Company") {
            companyService.getCompanyDetails()
                .then(result => setCompanyDetails(result))
                .catch(error => alert(error))
        } else if (roleType === "Customer") {
            customerService.getCustomerDetails()
                .then(result => setCustomerDetails(result))
                .catch(error => alert(error))
        }
    }, [])

    function handleLogout() {
        const email = authStore.getState().email;
        authService.logout(email, roleType) // to log out from the server.
            .then(() => {
                authStore.dispatch(logout()) // to clean the cache
                localStorage.removeItem("my_token") //remove token from localStorage
                navigate("/")
            })
    }

    return (
        <div className="UserProfile">
            <pre>
                {role === "Company" &&
                    <div>
                        <p>Id: {companyDetails?.id}</p>
                        <p>Name: {companyDetails?.name}</p>
                        <p>Email: {companyDetails?.email}</p>
                    </div>
                }
                {role === "Customer" &&
                    <div>
                        <p>Id: </p>{customerDetails?.id}
                        <p>Full name: </p>{customerDetails?.firstName + " " + customerDetails?.lastName}
                        <p>Email: </p>{customerDetails?.email}
                    </div>
                }
                {role === "Administrator" &&
                    <div>
                        <h2>Welcome administrator, how can i help you?</h2>
                    </div>
                }
            </pre>
            <button className="button" onClick={handleLogout}>Logout</button>
        </div>
    );
}
