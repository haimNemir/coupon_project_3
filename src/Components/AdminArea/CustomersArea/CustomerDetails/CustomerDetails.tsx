import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./CustomerDetails.css";
import { useEffect, useState } from "react";
import { Customer } from "../../../../Models/Customer";
import adminService from "../../../../Services/AdminService";
import { CouponCard } from "../../../CouponsArea/CouponCard/CouponCard";
import { EditCustomer } from "../EditCustomer/EditCustomer";
import moment from "moment";

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
                <div className="customer_details__no_edit"> 
                    <div className="displayGrid">
                        <p className="customer_details__title Grid_title">Customer details:</p>
                        <div className="GridA">
                            <p>Customer ID: <span className="customer_details__span">{customer?.id}</span></p>
                            <p>First name:<span className="customer_details__span"> {customer?.firstName}</span></p>
                            <p>Last name: <span className="customer_details__span">{customer?.lastName}</span></p>
                            <p>Email: <span className="customer_details__span">{customer?.email}</span></p>
                        </div>
                        <div className="GridB">
                            <p className="customer_details__list">Purchased coupons list:</p>
                            {customer.coupons.length > 0 ? customer.coupons.map(coupon =>
                                <details className="customer_details__Details">
                                    <summary className="customer_details__summary">{coupon.id} - {coupon.id < 10 ? "\u00A0\u00A0" : ""}&emsp; {coupon.title} </summary>
                                    <div className="customer_details__p">
                                        <p className="customer_details__summary_expend">The issuing company: <span className="customer_details__span">{coupon.company.name}</span></p>
                                        <p className="customer_details__summary_expend">Price: <span className="customer_details__span">{coupon.price}</span></p>
                                        <p className="customer_details__summary_expend">Expired time: <span className="customer_details__span">{moment(coupon.endDate).format("DD[/]MM[/]YYYY, HH:mm")}</span> </p>
                                        <p className="customer_details__summary_expend">Description: <span className="customer_details__span">{coupon.description}</span></p>
                                        <p className="customer_details__summary_expend">Category: <span className="customer_details__span">{coupon.category.charAt(0) + coupon.category.slice(1).toLowerCase()}</span></p>
                                    </div>
                                </details>
                            )
                                :
                                <h3 className="errorMessage">This customer has not purchased any coupons yet.</h3>
                            }
                        </div>

                        <button className="customized_button GridC customer_details__buttons" onClick={() => setEditMode(!editMode)}>Edit customer</button>
                        <button className="customized_button GridD customer_details__buttons" onClick={deleteCustomer} >Delete customer</button>
                    </div>
                </div>
            }

        </div>
    );
} 
