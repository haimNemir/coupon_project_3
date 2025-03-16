import { NavLink } from "react-router-dom";
import "./CompanyCard.css";
import { Company } from "../../../../Models/Company";

interface CompanyProp {
    company: Company
}

export function CompanyCard(props: CompanyProp): JSX.Element {
    return (
        <div className="CompanyCard customized_card">
            {<NavLink to={`/get_one_company/${props.company.id}`}>
                <h2 className="company_title"><span>{props.company.name}</span></h2>
                <p>Serial number: <span>  {props.company.id}  </span></p>
                <p>Company email: <span>{props.company.email}</span></p>
            </NavLink>}
        </div>
    );
}
 