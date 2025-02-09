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
            {error ? <p>{error}</p> :
                editMode ?
                    <form className="form" onSubmit={handleSubmit(submitUpdateCoupon)}>
                        <h2 className="gridTitle">Update coupon</h2>
                        <span className="details">
                            <p className="para ">Coupon id: </p> <span className="ParaDetails">{coupon?.id}</span> <br />
                            <p className="para">Company name:</p> <span className="ParaDetails">{coupon?.company.name}</span> <br />
                        </span>
                        <input className="T" type="text" placeholder="Title" required {...register("title")} /><br />
                        <input className="D" type="text" placeholder="Description" required {...register("description")} /><br />
                        <input className="A" type="number" placeholder="Amount in stock" min={1} max={999999} required {...register("amount")} /><br />
                        <input className="P" type="number" placeholder="Price" min={1} max={999999} required {...register("price")} /><br />
                        <select className="C select" defaultValue={""} required {...register("category")}>
                            <option disabled value="">Category</option>
                            {listOfCategories.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select><br />
                        <input className="I" type="text" placeholder="Image" required {...register("image")} /><br />
                        {/*here line below you dont need to enter {...register("startDate")} because onChange handle it. */}
                        {showStartDate ? <input className="SD" type="datetime-local" min={formattedDateToday} required onChange={enterStartDate} /> :
                            <button type="button" onClick={() => setShowStartDate(!showStartDate)} className="SD helpTitle">Enter start date</button>
                        }
                        {showEndDate ? <input className="ED" type="datetime-local" min={minEndDate ?? formattedDateTomorrow} required {...register("endDate")} /> :
                            <button type="button" onClick={() => setShowEndDate(!showEndDate)} className="ED helpTitle">Enter end date</button>
                        }
                        <button className="S" type="submit">Save</button>
                        <button className="R" type="button" onClick={() => { reset(); resetPopup() }}>Reset</button>
                        <button className="CL" type="button" onClick={handleClick}>Close</button>
                    </form>
                    :
                    <div className="oldCouponDetails">
                        <div className="p-details">Coupon id:</div>     <span className="s-details">{coupon?.id}</span><br />
                        <div className="p-details">Title:</div>         <span className="s-details">{coupon?.title}</span><br />
                        <div className="p-details">Category:</div>      <span className="s-details">{coupon?.category}</span><br />
                        <div className="p-details">Company name:</div>  <span className="s-details">{coupon?.company.name}</span><br />
                        <div className="p-details">Price:</div>         <span className="s-details">{coupon?.price}</span><br />
                        <div className="p-details">Description:</div>   <span className="s-details">{coupon?.description}</span><br />
                        <div className="p-details">Start date:</div>    <span className="s-details">{coupon?.startDate.toString()}</span><br />
                        <div className="p-details">End date:</div>      <span className="s-details">{coupon?.endDate.toString()}</span><br />
                        <div className="p-details">Left in stock:</div> <span className="s-details">{coupon?.amount}</span><br />
                        <div className="p-details">Image:</div>         <span className="s-details">{coupon?.image}</span><br />
                        <div className="buttons-area">
                            {clientType === "Company" && <button className="buttons-edit" onClick={handleClick}>Edit coupon</button>}
                            {clientType === "Company" && <button className="buttons-edit" onClick={handleDelete}>Delete coupon</button>}
                        </div>
                    </div>
            }
            {/*  */}
            {clientType === "Customer" && showPurchaseButton.state?.showPurchase !== false && <PurchaseCoupon couponId={coupon?.id!} />}
        </div>
    );
}
