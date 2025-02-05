import { useForm } from "react-hook-form";
import { Company } from "../../../../Models/Company";
import "./EditCompany.css";
import adminService from "../../../../Services/AdminService";
import { useNavigate } from "react-router-dom";

interface CompanyProps {
    company: Company
}

export function EditCompany(props: CompanyProps): JSX.Element {
    
    const navigate = useNavigate()

    const { register, handleSubmit, reset } = useForm<Company>({
        mode: "onSubmit",
        defaultValues: {id: props.company.id, }
    })

    function submitUpdateCompany(form: Company) {
        adminService.updateCompany(form)
        .then(updatedCompany =>{
            alert("You have been successfully updated company " + updatedCompany.id)
            navigate("/clients")
            reset()
        })
        .catch(error => alert(error.response.data))
    }
 
    function handleClose() {
        navigate("/clients")
    }

    return (
        <div className="EditCompany">
            <h3>Edit Company</h3>
            <form onSubmit={handleSubmit(submitUpdateCompany)}>
                <p>Company ID: {props.company.id}</p>
                <p>Name: {props.company.name}</p>
                <input type="text" placeholder="Company email" required {...register("email")} /><br />
                <input type="text" placeholder="Company password" required minLength={5} maxLength={99} {...register("password")} /><br />
                <button type="submit">Save</button>
            </form>
            <button type="button" onClick={handleClose}>Close</button>
            <button type="button" onClick={() => reset()}>Reset</button>
        </div>
    );
}
