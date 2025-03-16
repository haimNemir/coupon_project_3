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

    function deleteCompany() {
        const confim = window.confirm(`Are you sure you want to delete company ${companyId}?`)
        if (confim) {
            adminService.deleteCompany(companyId)
                .then(result => {
                    alert("You have been successfully deleted company " + companyId)
                    navigate("/clients")
                })
                .catch(error => alert(error.response.data))
        }
    }

    return ( 
        <div className="CompanyDetails">
            <div className="details">
                {editMode ? <EditCompany company={company!} /> :
                    <div className="company_details__details">
                        <p className="company_details__title">Company details</p>
                        <p>Serial number: <span className="company_details__span"> {company?.id}</span></p>
                        <p>Company name: <span className="company_details__span">{company?.name}</span></p>
                        <p>Email: <span className="company_details__span">{company?.email}</span></p>
                        <button className="customized_button company_details__buttons" onClick={() => setEditMode(!editMode)}>Edit Company</button>
                        <button className="customized_button company_details__buttons" onClick={deleteCompany}>Delete company</button>
                    </div>
                }
            </div>
        </div>
    );
}
