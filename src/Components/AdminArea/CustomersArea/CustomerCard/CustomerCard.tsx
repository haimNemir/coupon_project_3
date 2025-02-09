import { NavLink } from "react-router-dom";
import { Customer } from "../../../../Models/Customer";
import "./CustomerCard.css";

interface CustomerProps {
    customer: Customer
}

export function CustomerCard(props: CustomerProps): JSX.Element {
    return (
        <div className="CustomerCard">
            {<NavLink to={`/get_one_customer/${props.customer.id}`}> {/*go to <CustomerDetails/> */}
                <p>Customer ID: {props.customer.id}</p>
                <p>First name: {props.customer.firstName}</p>
                <p>Last name: {props.customer.lastName}</p>
                <p>Email: {props.customer.email}</p>
            </NavLink>}

        </div>
    );
}
