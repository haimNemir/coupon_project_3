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
	function navigateToDetails(){
		navigate(`/get_one_coupon/${props.coupon.id}` , {state: {showPurchase: showPurchaseButton}}) // send to <CouponDetails/> the value of showPurchaseButton.
	}

	return (
		<div className="CouponCard" onClick={navigateToDetails}> {/*go to <CouponDetails/> */}
				<p>Title: 		{props.coupon.title}</p>
				<p>Amount:		{props.coupon.amount}</p>
				<p>Category: 	{props.coupon.category}</p>
				<p>Company name:{props.coupon.company.name}</p>
				<p>Description: {props.coupon.description}</p>
				<p>Start date:  {formattedStartDate}</p>
				<p>End date: 	{formattedEndDate}</p>
				<p>Id: 			{props.coupon.id}</p>
				<p>Price: 		{props.coupon.price}</p>
				<p>Image: 		{props.coupon.image}</p>
		</div>
	);
}
