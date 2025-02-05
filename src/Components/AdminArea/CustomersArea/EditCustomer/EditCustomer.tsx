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
        defaultValues: {id: props.customer.id, coupons: props.customer.coupons}
    })

    function submitUpdateCustomer(form: Customer) {
        adminService.updateCustmer(form)
        .then(updatedCustmer =>{
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
			<h3>Edit Customer</h3>
            <form onSubmit={handleSubmit(submitUpdateCustomer)}>
                <p>Customer ID: {props.customer.id}</p>
                <input type="text" placeholder="Customer first name" required {...register("firstName")}  /><br />
                <input type="text" placeholder="Customer last name" required {...register("lastName")}   /><br />
                <input type="text" placeholder="Customer email" required {...register("email")}      /><br />
                <input type="text" placeholder="Customer password" required minLength={5} maxLength={99}{...register("password")}      /><br />
                <button type="submit">Save</button>
            </form>
            <button type="button" onClick={handleClose}>Close</button>
            <button type="button" onClick={() => reset()}>Reset</button>
        </div>
    );
}
