import { useNavigate } from "react-router-dom";
import "./AddCustomer.css";
import { Company } from "../../../../Models/Company";
import { useState } from "react";
import { useForm } from "react-hook-form";
import adminService from "../../../../Services/AdminService";
import { Customer } from "../../../../Models/Customer";

interface ParentProps {
    changeAddingMode: (addingMode: boolean) => void
}

export function AddCustomer(props: ParentProps): JSX.Element {
    const navigate = useNavigate()
    const [customer, setCustomer] = useState<Customer>()
    const { register, handleSubmit, reset, setValue } = useForm<Customer>({
        mode: "onSubmit",
        defaultValues: { id: 0, coupons: []}
    })

    function handleAdding(form: Customer) {
        adminService.addCustomer(form)
            .then(acceptedCustomer => {
                setCustomer(acceptedCustomer)
                alert("Customer " + acceptedCustomer.id + " successful added")
                props.changeAddingMode(false)
            })
    }

    function handleClose() {
        props.changeAddingMode(false)
    }
    return (
        <div className="AddCustomer">
            <form onSubmit={handleSubmit(handleAdding)}>
                <h3 >Add customer</h3>
                <input placeholder="Enter customer first name" type="text" required minLength={2} maxLength={99} {...register("firstName")} /><br />
                <input placeholder="Enter customer last name" type="text" required minLength={2} maxLength={99} {...register("lastName")} /><br />
                <input placeholder="Enter customer email" type="text" required minLength={2} maxLength={99} {...register("email")} /><br />
                <input placeholder="Enter customer password" type="text" required minLength={5} maxLength={99} {...register("password")} /><br />
                <button type="submit">Save</button>
                <button type="button" onClick={() => reset()}>Reset</button>
                <button type="button" onClick={handleClose}>Close</button>
            </form>
        </div>
    );
}
