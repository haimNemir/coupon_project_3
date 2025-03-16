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
        defaultValues: { id: props.company.id, }
    })

    function submitUpdateCompany(form: Company) {
        adminService.updateCompany(form)
            .then(updatedCompany => {
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
            <div className="edit_company__details">
            <p className="edit_company__title">Edit Company</p>
            <form className="edit_company__form " onSubmit={handleSubmit(submitUpdateCompany)}>
                <input className="grid_A edit_company__input edit_company__input_disabled" title="Cannot be changed, a permanently fixed serial number." disabled type="text" placeholder= {`Serial number: ${props.company.id}`} /><br />
                <input className="grid_B edit_company__input edit_company__input_disabled" title="Cannot be changed, a permanently fixed name." disabled type="text" placeholder= {`Name: ${props.company.name}`}  /><br />
                <input className="grid_C edit_company__input" type="text" placeholder="Change company email" required {...register("email")} /><br />
                <input className="grid_D edit_company__input" type="text" placeholder="Change company password" required minLength={5} maxLength={99} {...register("password")} /><br />
                <button className="grid_E customized_button edit_company__buttons" type="submit">Save</button>
                <button className="grid_F customized_button edit_company__buttons" type="button" onClick={() => reset()}>Reset</button>
                <button className="grid_G customized_button edit_company__buttons" type="button" onClick={handleClose}>Close</button>
            </form>
            </div>
        </div>
    );
}
