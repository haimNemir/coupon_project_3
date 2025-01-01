import { NavLink } from "react-router-dom";
import { Coupon } from "../../../Models/Coupon";
import "./CouponCard.css";
import moment from 'moment';

interface CouponProps {
	coupon: Coupon;
}

export function CouponCard(props: CouponProps): JSX.Element {

	const formattedStartDate = moment(props.coupon.startDate).format('YYYY/MM/DD hh:mm:ss'); //using here "moments.js" extention
	const formattedEndDate = moment(props.coupon.endDate).format('YYYY/MM/DD hh:mm:ss');
	return (
		<div className="CouponCard">
			{<NavLink to={`/get_one_coupon/${props.coupon.id}`}>
				<p>Title: {props.coupon.title}</p>
				<p>Amount: {props.coupon.amount}</p>
				<p>Category: {props.coupon.category}</p>
				<p>Company name: {props.coupon.company.name}</p>
				<p>Description: {props.coupon.description}</p>
				<p>Start date: {formattedStartDate}</p>
				<p>End date: {formattedEndDate}</p>
				<p>Id: {props.coupon.id}</p>
				<p>Price: {props.coupon.price}</p>
				<p>Image: {props.coupon.image}</p>
			</NavLink>}
		</div>
	);
}
