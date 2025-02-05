import { useForm } from "react-hook-form";
import { Company } from "../../../../Models/Company";
import "./AddCompany.css";
import { useNavigate } from "react-router-dom";
import adminService from "../../../../Services/AdminService";
import { useState } from "react";

interface ParentProps {
    changeAddingMode: (addingMode: boolean) => void
}

export function AddCompany(props: ParentProps): JSX.Element {
    const navigate = useNavigate()
    const [company, setCompany] = useState<Company>()
    const { register, handleSubmit, reset } = useForm<Company>({
        mode: "onSubmit",
        defaultValues: { id: 0 }
    })

    function handleAdding(form: Company) {
        adminService.addCompany(form)
            .then(acceptedCompany => {
                setCompany(acceptedCompany)
                alert("Company " + acceptedCompany.id + " successful added")
                props.changeAddingMode(false)
            })
    }

    function handleClose() {
        props.changeAddingMode(false)
    }
    return (
        <div className="AddCompany">

            <form onSubmit={handleSubmit(handleAdding)}>
                <h3 >Add company</h3>
                <input placeholder="Enter company name" type="text" required minLength={2} maxLength={99} {...register("name")} /><br />
                <input placeholder="Enter company email" type="text" required minLength={2} maxLength={99} {...register("email")} /><br />
                <input placeholder="Enter company password" type="text" required minLength={5} maxLength={99} {...register("password")} /><br />
                <button type="submit">Save</button>
                <button type="button" onClick={() => reset()}>Reset</button>
                <button type="button" onClick={handleClose}>Close</button>
            </form>
        </div>
    );
}
