import { NavLink, useNavigate } from "react-router-dom";
import { Coupon } from "../../../Models/Coupon";
import "./CouponCard.css";
import moment from 'moment';
import { useContext } from "react";
import { Context } from "../MyCoupons/MyCoupons";

interface CouponProps {
	coupon: Coupon;
}

export function CouponCard(props: CouponProps): JSX.Element {
	const formattedStartDate = moment(props.coupon.startDate).format('YYYY/MM/DD hh:mm:ss'); //using here "moments.js" extention to get a nice format.
	const formattedEndDate = moment(props.coupon.endDate).format('YYYY/MM/DD hh:mm:ss');

	const showPurchaseButton = useContext(Context) // gets from component <MyCoupons/> the context as boolean (false) is replase props and skip on all other components between those two.
	const navigate = useNavigate()
	function navigateToDetails() {
		navigate(`/get_one_coupon/${props.coupon.id}`, { state: { showPurchase: showPurchaseButton } }) // send to <CouponDetails/> the value of showPurchaseButton.
	}

	return (
		<div className="customized_card" onClick={navigateToDetails}> {/*go to <CouponDetails/> */}
			<h2 className="coupon_title">	<span>{props.coupon.title}</span></h2>
			<p>Company name:<span>   {props.coupon.company.name}</span></p>
			<p>Category: 	<span> {props.coupon.category.charAt(0) + props.coupon.category.slice(1).toLowerCase()}</span></p>
			<p>Description:<span>   {props.coupon.description}</span></p>
			<p>Amount left:		<span>   {props.coupon.amount}</span></p>
			<p>Started at: <span>   {formattedStartDate}</span></p>
			<p>End at: 	<span>   {formattedEndDate}</span></p>
			<p>Serial number: <span>   {props.coupon.id}</span></p>
			<p>Price: 		<span>   {props.coupon.price}</span></p>
			{/* <p>Image: 		<span>{props.coupon.image}</span></p> */}
		</div>
	);
}
