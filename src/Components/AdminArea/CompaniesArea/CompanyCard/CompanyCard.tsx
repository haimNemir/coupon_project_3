import { NavLink } from "react-router-dom";
import "./CompanyCard.css";
import { Company } from "../../../../Models/Company";

interface CompanyProp {
    company: Company
}

export function CompanyCard(props: CompanyProp): JSX.Element {
    return (
        <div className="CompanyCard">
            {<NavLink to={`/get_one_company/${props.company.id}`}>
                <p>ID: {props.company.id}</p>
                <p>Company name: {props.company.name}</p>
                <p>Company email: {props.company.email}</p>
            </NavLink>}
        </div>
    );
}
 