import { useNavigate } from "react-router-dom";
import "./EditCustomer.css";
import { useForm } from "react-hook-form";
import { Company } from "../../../../Models/Company";
import adminService from "../../../../Services/AdminService";
import { Customer } from "../../../../Models/Customer";
 
interface CustomerProps {
    customer: Customer
}

export function EditCustomer(props: CustomerProps): JSX.Element {
    const navigate = useNavigate()
    const { register, handleSubmit, reset } = useForm<Customer>({
        mode: "onSubmit",
        defaultValues: { id: props.customer.id, coupons: props.customer.coupons }
    })

    function submitUpdateCustomer(form: Customer) {
        adminService.updateCustomer(form)
            .then(updatedCustmer => {
                alert("You have been successfully updated customer " + updatedCustmer.id)
                navigate("/clients")
                reset()
            })
            .catch(error => alert(error.response.data))
    }

    function handleClose() {
        navigate("/clients")
    }
 
    return (
        <div className="EditCustomer">
            <div className="edit_customer__div">
                <p className="edit_customer__title">Edit Customer</p>
                <form className="edit_customer__form" onSubmit={handleSubmit(submitUpdateCustomer)}>
                    <input className="grid_A edit_customer__input edit_customer__input_disabled" title="Cannot be changed, a permanently fixed serial number." disabled  type="text" placeholder= {`Serial number: ${props.customer.id}`}  /><br />
                    <input className="grid_B edit_customer__input"  type="text" placeholder="Customer first name" required {...register("firstName")} /><br />
                    <input className="grid_C edit_customer__input" type="text" placeholder="Customer last name" required {...register("lastName")} /><br />
                    <input className="grid_D edit_customer__input" type="text" placeholder="Customer email" required {...register("email")} /><br />
                    <input className="grid_E edit_customer__input" type="text" placeholder="Customer password" required minLength={5} maxLength={99}{...register("password")} /><br />
                    <button className="grid_F customized_button edit_customer__buttons" type="submit">Save</button>
                    <button className="grid_G customized_button edit_customer__buttons" type="button" onClick={handleClose}>Close</button>
                    <button className="grid_H customized_button edit_customer__buttons" type="button" onClick={() => reset()}>Reset</button>
                </form>
            </div>
        </div>
    );
}
