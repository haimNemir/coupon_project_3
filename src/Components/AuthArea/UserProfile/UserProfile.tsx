import { useEffect, useState } from "react";
import "./UserProfile.css";
import { authSlice, authStore, JwtToken, logout } from "../../../Redux/AuthStore";
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

    function handleLogin() {
        navigate("/")
    }

    function handleLogout() {
        const email = authStore.getState().email;
        authService.logout(email, roleType) // to log out from the server.
            .then(() => {
                authStore.dispatch(logout()) // to clean the cache
                navigate("/")
            })
    }

    return (
        <div className="UserProfile">
            <pre>
                {role === "Company" &&
                    <div>
                        <p>Id number: <span className="user_profile__span" > {companyDetails?.id}</span></p>
                        <p>Company name: <span className="user_profile__span">{companyDetails?.name}</span></p>
                        <p>Company email: <span className="user_profile__span">{companyDetails?.email}</span></p>
                    </div>
                }
                {role === "Customer" &&
                    <div>
                        <p>Id number: <span className="user_profile__span">{customerDetails?.id}</span></p>
                        <p>Full name: <span className="user_profile__span">{customerDetails?.firstName + " " + customerDetails?.lastName}</span></p>
                        <p>Email: <span className="user_profile__span">{customerDetails?.email}</span></p>
                    </div>
                }
                {role === "Administrator" &&
                    <div>
                        <p className="user_propile_p">Welcome administrator, how can i help you?</p>
                    </div>
                }
            </pre>
            <div className="buttons">
                <button className="customized_button user_profile__buttons" onClick={handleLogin}>Login</button>
                <button className="customized_button user_profile__buttons" onClick={handleLogout}>Logout</button>
            </div>

        </div>
    );
}
