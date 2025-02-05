import { useEffect, useState } from "react";
import "./CompanyDetails.css";
import { EditCompany } from "../EditCompany/EditCompany";
import { useNavigate, useParams } from "react-router-dom";
import adminService from "../../../../Services/AdminService";
import { Company } from "../../../../Models/Company";

export function CompanyDetails(): JSX.Element {

    const navigate = useNavigate()
    const params = useParams();
    const companyId = +params.id!;
    const [company, setCompany] = useState<Company>()
    const [editMode, setEditMode] = useState<boolean>(false)

    useEffect(() => {
        adminService.getOneCompany(companyId)
            .then(result => setCompany(result))
            .catch(error => alert(error.response.data))
    }, [])

    function deleteCompany(){
        adminService.deleteCompany(companyId)
        .then(result => {
            alert("You have been successfully deleted company " + companyId)
            navigate("/clients")
        })
        .catch(error => alert(error.response.data)) 
    }

    return (
        <div className="CompanyDetails">
            <div className="details">
            {editMode ? <EditCompany company={company!}/> :
                <div>
                    <p>Company ID: {company?.id}</p>
                    <p>Company name: {company?.name}</p>
                    <p>Company email: {company?.email}</p>
                    <button onClick={ () => setEditMode(!editMode)}>Edit Company</button>
                    <button onClick={deleteCompany}>Delete company</button>
                </div>
            }
            </div>
        </div>
    );
}
