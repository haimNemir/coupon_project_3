import { NavLink } from "react-router-dom";
import { Customer } from "../../../../Models/Customer";
import "./CustomerCard.css";

interface CustomerProps {
    customer: Customer
}

export function CustomerCard(props: CustomerProps): JSX.Element {
    return (
        <div className="CustomerCard customized_card">
            {<NavLink to={`/get_one_customer/${props.customer.id}`}> {/*go to <CustomerDetails/> */}
                <h2 className="customer_title"><span>{props.customer.firstName} {props.customer.lastName}</span></h2>
                <p>Customer number:<span> {props.customer.id}</span></p>
                <p>Email: <span>{props.customer.email}</span></p>
            </NavLink>}

        </div>
    );
}
