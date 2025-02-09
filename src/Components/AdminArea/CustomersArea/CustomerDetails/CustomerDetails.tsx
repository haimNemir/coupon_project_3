import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./CustomerDetails.css";
import { useEffect, useState } from "react";
import { Customer } from "../../../../Models/Customer";
import adminService from "../../../../Services/AdminService";
import { CouponCard } from "../../../CouponsArea/CouponCard/CouponCard";
import { EditCustomer } from "../EditCustomer/EditCustomer";

export function CustomerDetails(): JSX.Element {

    const params = useParams()
    const customerId = +params.id!
    const [editMode, setEditMode] = useState<boolean>(false)
    const [customer, setCustomer] = useState<Customer>(new Customer('', '', '', '', []))
    const navigate = useNavigate()

    useEffect(() => {
        adminService.getOneCustomer(customerId)
            .then(result => {
                setCustomer(result)
            })
            .catch(error => alert(error))
    }, [])

    function deleteCustomer() {
        const confim = window.confirm(`Are you sure you want to delete customer ${customerId}?`)
        if (confim) {
            adminService.deleteCustomer(customerId)
                .then(result => {
                    alert("You have been successfully deleted customer " + customerId)
                    navigate("/clients")
                })
                .catch(error => alert(error.response.data))
        }
    }


    return (
        <div className="CustomerDetails">
            {editMode ? <EditCustomer customer={customer} />
                :
                <div className="displayGrid">
                    <div className="GridA">
                        <h3>Customer details:</h3>
                        <p>Customer ID: {customer?.id}</p>
                        <p>First name: {customer?.firstName}</p>
                        <p>Last name: {customer?.lastName}</p>
                        <p>Email: {customer?.email}</p>
                    </div>
                    <div className="GridB">
                        <h3>Purchased coupons:</h3>
                        {customer.coupons.length > 0 ? customer.coupons.map(coupon =>
                            <p>
                                Coupon ID: {coupon.id} <br />
                                Description: {coupon.description} <br />
                            </p>
                        )
                            :
                            <h3 className="errorMessage">You haven't created any coupons from this categories yet, Please create one first.</h3>
                        }
                    </div>
                    <button className="GridC" onClick={() => setEditMode(!editMode)}>Edit customer</button>
                    <button className="GridD" onClick={deleteCustomer} >Delete customer</button>
                </div>
            }
        </div>
    );
} 
