import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./CouponDetails.css";
import { ChangeEvent, useEffect, useState } from "react";
import { Coupon } from "../../../Models/Coupon";
import customerService from "../../../Services/CustomerService";
import { authStore } from "../../../Redux/AuthStore";
import companyService from "../../../Services/CompanyService";
import { useForm } from "react-hook-form";
import moment from "moment";
import { Category } from "../../../Models/Category";
import { PurchaseCoupon } from "../PurchaseCoupon/PurchaseCoupon";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


// This file presented with two situation: Company edit the Coupon or Customer buy this coupon.

export function CouponDetails(): JSX.Element {
    const navigate = useNavigate()
    const params = useParams();
    const couponId = +params.id!;
    const [coupon, setCoupon] = useState<Coupon>();
    const [error, setError] = useState<string>();
    const clientType = authStore.getState().role;
    //gets here the Company Coupons:
    const [companyCoupons, setCompanyCoupons] = useState<Coupon[]>([])

    useEffect(() => {
        // handle Customer client, get one customer coupon
        if (clientType === "Customer") {
            customerService.getOneCoupon(couponId)
                .then(getCoupon => setCoupon(getCoupon))
                .catch(error => setError(error.response.data))
            // handle Company client, gets all company coupons        
        } else if (clientType === "Company") {
            if (companyCoupons.length === 0) {
                companyService.getCompanyCoupons()
                    .then(couponsList => {
                        setCompanyCoupons(couponsList)
                        findCoupon(couponsList)
                    })
                    .catch(error => alert(error))
            } else {
                findCoupon(companyCoupons)
            }
        }
    }, [])

    function findCoupon(list: Coupon[]) {
        const selectedCoupon = list.find(couponFromList => couponFromList.id === couponId);
        setCoupon(selectedCoupon)
    }

    const [editMode, setEditMode] = useState<boolean>(false);
    const formattedDateToday = moment().format("YYYY-MM-DDTHH:mm") //gets Date "today" from moments.js libreary with format of ("YYYY-MM-DD-HH-mm")
    const formattedDateTomorrow = moment().add(1, "days").format("YYYY-MM-DDTHH:mm")
    // useForm to update coupon:
    const { register, handleSubmit, reset, setValue } = useForm<Coupon>({
        mode: "onSubmit",
        //defined a default values for the form:
        defaultValues: { id: couponId, company: coupon?.company, startDate: new Date(formattedDateToday), endDate: new Date(formattedDateTomorrow) }
    });

    const [minEndDate, setMinEndDate] = useState<string>(formattedDateTomorrow);// defined the min end date the client can enter based on the start date the client entered, initialized to tomorrow from present.
    function enterStartDate(event: ChangeEvent<HTMLInputElement>) {
        const enteredStartDate = new Date(event.target.value)// save the value the client enter to the form, we use new Date() to convert the "value: string" to "value: Date"
        setValue("startDate", enteredStartDate) // save the value the client enter to the form, we use new Date() to convert the "value: string" to "value: Date"
        setMinEndDate(moment(enteredStartDate).add(1, "days").format("YYYY-MM-DDTHH:mm")) // adding one day to the date the client entered and use it to prevent from user enter end date erlier then start date.// it will handle it in case is the last day in the month to change to month too.
    }

    useEffect(() => { // there is a delay in the first render of the page and default value of "company" in the useForm can be null so ve ensureing a valid value on "company value"
        setValue("company", coupon?.company!)
    }, [coupon])

    function submitUpdateCoupon(form: Coupon) {
        companyService.updateCoupon(form)
            .then(updatedCoupon => {
                alert("You are updated coupon " + coupon!.id + " successfully!")
                setCoupon(updatedCoupon)
                handleClick()
                navigate(`/get_one_coupon/${couponId}`) // navigate to the same page to reload the changes
                reset() //this function reset all the values in object "useForm"
            })
            .catch(error => alert(error.response.data))
    }


    //allow "Company" user to edit the coupon:
    function handleClick() {
        setEditMode(!editMode)
        resetPopup()
    }

    function resetPopup() {
        setShowStartDate(false)
        setShowEndDate(false)
    }

    //gets list of string values from enum "Category" as: "value- FOOD, label- Food" for each one of them 
    const listOfCategories = Object.keys(Category).map((key) => ({  // do "map" for the list and for each of a value we create two parameters:
        value: key, // save the value as "FOOD"
        label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() // save the value as "Food". key.slice(1) - return new string start from the index[1] (the second letter) until his end.
    }))




    // Delete the current coupon from the DB:
    function handleDelete() {
        const confirmed = window.confirm("Are you sure you want to delete coupon " + couponId + "?")
        if (confirmed) {
            companyService.deleteCoupon(couponId)
                .then(result => {
                    navigate("/get_all_coupons")
                    console.log("Coupon " + couponId + " was deleted")
                })
                .catch(error => alert(error.response.data))
        }
    }

    const showPurchaseButton = useLocation() // we gets with the URL data about how is call this component and acording this we decide if we showing the purchase button 
    const [showStartDate, setShowStartDate] = useState<boolean>(false)
    const [showEndDate, setShowEndDate] = useState<boolean>(false)


    return (
        <div className="CouponDetails">

            {
                error ? <p>
                    {error}</p> :
                    editMode ?
                        <form className="coupon_details__form" onSubmit={handleSubmit(submitUpdateCoupon)}>
                            <h2 className="coupon_details__title coupon_details__grid_title">Update coupon</h2>
                            <input className="coupon_details__input_disabled coupon_details__disabled_grid_A" title="Cannot be changed, a permanently fixed serial number." type="text" placeholder={`Serial number: ${coupon?.id}`} disabled />
                            <input className="coupon_details__input_disabled coupon_details__disabled_grid_B" title="Cannot be changed, a permanently fixed company name." type="text" placeholder={`Company name: ${coupon?.company.name}`} disabled />
                            <input className="coupon_details__input coupon_details__input_C" type="text" placeholder="Title" required {...register("title")} />
                            <input className="coupon_details__input coupon_details__input_D" type="text" placeholder="Description" required {...register("description")} />
                            <input className="coupon_details__input coupon_details__input_E" type="number" placeholder="Amount in stock" min={1} max={999999} required {...register("amount")} />
                            <input className="coupon_details__input coupon_details__input_F" type="number" placeholder="Price" min={1} max={999999} required {...register("price")} />
                            <select className="coupon_details__select coupon_details__select_G" defaultValue={""} required {...register("category")}>
                                <option disabled value="">Category</option>
                                {listOfCategories.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                            <input className="coupon_details__input coupon_details__input_H" type="text" placeholder="Image" required {...register("image")} />
                            {/*here line below you dont need to enter {...register("startDate")} because onChange handle it. */}
                            {showStartDate ? <input className="coupon_details__input coupon_details__input_I" type="datetime-local" min={formattedDateToday} required onChange={enterStartDate} /> :
                                <button className="coupon_details__button customized_button coupon_details__input_I" type="button" onClick={() => setShowStartDate(!showStartDate)}>Enter start date</button>
                            }
                            {showEndDate ? <input className="coupon_details__input coupon_details__input_J" type="datetime-local" min={minEndDate ?? formattedDateTomorrow} required {...register("endDate")} /> :
                                <button className="coupon_details__button customized_button coupon_details__input_J" type="button" onClick={() => setShowEndDate(!showEndDate)} >Enter end date</button>
                            }
                            <button className="customized_button coupon_details__button coupon_details__button_K" type="submit">Save</button>
                            <button className="customized_button coupon_details__button coupon_details__button_L" type="button" onClick={() => { reset(); resetPopup() }}>Reset</button>
                            <button className="customized_button coupon_details__button coupon_details__button_M" type="button" onClick={handleClick}>Close</button>
                        </form>
                        :
                        <div className="oldCouponDetails">
                            {clientType === "Company" && <p className="coupon_details__old_title">Update coupon</p>}
                            {clientType === "Customer" && <p className="coupon_details__old_title">{coupon?.title}</p>}
                            <div className="old_coupon_p">Serial number:</div>     <span className="old_coupon__span">{coupon?.id}</span><br />
                            <div className="old_coupon_p">Title:</div>         <span className="old_coupon__span">{coupon?.title}</span><br />
                            <div className="old_coupon_p">Category:</div>      <span className="old_coupon__span">{coupon?.category.charAt(0)! + coupon?.category.slice(1).toLowerCase()}</span><br />
                            <div className="old_coupon_p">Company name:</div>  <span className="old_coupon__span">{coupon?.company.name}</span><br />
                            <div className="old_coupon_p">Price:</div>         <span className="old_coupon__span">{coupon?.price}</span><br />
                            <div className="old_coupon_p">Description:</div>   <span title={coupon?.description} className="old_coupon__span">{coupon?.description}</span><br />
                            <div className="old_coupon_p">Start date:</div>    <span className="old_coupon__span">{moment(coupon?.startDate).format("DD[/]MM[/]YYYY, HH:mm")}</span><br />
                            <div className="old_coupon_p">End date:</div>      <span className="old_coupon__span">{moment(coupon?.endDate).format("DD[/]MM[/]YYYY, HH:mm")}</span><br />
                            <div className="old_coupon_p">Left in stock:</div> <span className="old_coupon__span">{coupon?.amount}</span><br />
                            {/* <div className="old_coupon_p">Image:</div>         <span className="old_coupon__span">{coupon?.image}</span><br /> */}
                            <div className="buttons-area">
                                {clientType === "Company" && <button className="customized_button oldCouponDetails-Edit_coupon" onClick={handleClick}>Edit coupon</button>}
                                {clientType === "Company" && <button className="customized_button oldCouponDetails-Edit_coupon" onClick={handleDelete}>Delete coupon</button>}
                                {clientType === "Customer" && showPurchaseButton.state?.showPurchase !== false && <div className="coupon_details__purchase_button"> <PurchaseCoupon couponId={coupon?.id!} /></div>}
                            </div>
                        </div>
            }

        </div>
    );
}
