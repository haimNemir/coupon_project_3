import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./CouponDetails.css";
import { useContext, useEffect, useState } from "react";
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
    const formattedDateToday = moment().format("YYYY-MM-DD-HH-mm") //gets Date "today" from moments.js libreary with format of ("YYYY-MM-DD-HH-mm")
    const formattedDateTomorrow = moment().add(1, "days").format("YYYY-MM-DD-HH-mm")
    // useForm to update coupon:
    const { register, handleSubmit, reset, setValue } = useForm<Coupon>({
        mode: "onSubmit",
        //defined a default values for the form:
        defaultValues: { id: couponId, company: coupon?.company, startDate: new Date(formattedDateToday), endDate: new Date(formattedDateTomorrow) }
    });

    useEffect(() => { // there is a delay in the first render of the page and default value of "company" in the useForm can be null so ve ensureing a valid value on "company value"
        setValue("company", coupon?.company!)
    }, [coupon])

    const [defaultEndDate, setDefaultEndDate] = useState<string>(formattedDateTomorrow);// defined the min end date the client can enter based on the start date the client entered, initialized to tomorrow from present.
    function enterStartDate(event: React.ChangeEvent<HTMLInputElement>) {
        const enteredStartDate = new Date(event.target.value)
        // setValue("startDate", enteredStartDate) // save the value the client enter to the form, we use new Date() to convert the "value: string" to "value: Date"
        const minValueEndDate = moment(enteredStartDate).add(1, "days").format("YYYY-MM-DD-HH-mm")
        setDefaultEndDate(minValueEndDate) // adding one day to the date the client entered and use it to prevent from user enter end date erlier then start date.// it will handle it in case is the last day in the month to change to month too.
    }

    function submitUpdateCoupon(form: Coupon) {
        companyService.updateCoupon(form)
            .then(updatedCoupon => {
                setCoupon(updatedCoupon)
                handleEdit()
                navigate(`/get_one_coupon/${couponId}`) // navigate to the same page to reload the changes
                alert("You are updated coupon " + coupon!.id + " successfully!")
                reset() //this function reset all the values in object "useForm"
            })
            .catch(error => alert(error.response.data))
    }


    //allow "Company" user to edit the coupon:
    function handleEdit() {
        setEditMode(!editMode);
    }

    //gets list of string values from enum "Category" as: "value- FOOD, label- Food" for each one of them 
    const listOfCategories = Object.keys(Category).map((key) => ({  // do "map" for the list and for each of a value we create two parameters:
        value: key, // save the value as "FOOD"
        label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() // save the value as "Food". key.slice(1) - return new string start from the index[1] (the second letter) until his end.
    }))

    // Delete the current coupon from the DB:
    function handleDelete(){
        const confirmed = window.confirm("Are you sure you want to delete coupon " + couponId + "?")
        if(confirmed){ 
        companyService.deleteCoupon(couponId)
        .then(result => {console.log("Coupon " + couponId + " was deleted")})
        .catch(error => alert(error.response.data))
        }
    } 

    const showPurchaseButton = useLocation()
    

    return ( 
        <div className="CouponDetails">
            {error ? <p>{error}</p> :
                editMode ?
                    <form onSubmit={handleSubmit(submitUpdateCoupon)}>
                        Coupon id:      {coupon?.id}<br />
                        <input type="text" placeholder="Title" required {...register("title")} /><br />
                        <select defaultValue={"FOOD"} required {...register("category")}>
                            {listOfCategories.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select><br />
                        Company name:   {coupon?.company.name}<br />
                        <input type="number" placeholder="Price" min={0} max={999999} required  {...register("price")} /><br />
                        <input type="text" placeholder="Description" required                 {...register("description")} /><br />
                        <p>Start Date:</p><input type="datetime-local" min={formattedDateToday.toString()} required       {...register("startDate")} onChange={enterStartDate} /><br /> {/*here you dont need to enter {...register("startDate")} because onChange handle it. */}
                        <p>End Date:</p><input type="datetime-local" min={defaultEndDate} required                      {...register("endDate")} /> <br />
                        <input type="number" placeholder="left in stock" required min={0} max={999999} {...register("amount")} /><br />
                        <input type="text" placeholder="Image" required                       {...register("image")} /><br />
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => reset()}>Reset</button>
                        <button type="button" onClick={handleEdit}>Close</button>
                    </form>
                    :
                    <div> 
                        Coupon id:     {coupon?.id}<br />
                        Title:         {coupon?.title}<br />
                        Category:      {coupon?.category}<br />
                        Company name:  {coupon?.company.name}<br />
                        Price:         {coupon?.price}<br />
                        Description:   {coupon?.description}<br />
                        Start date:    {coupon?.startDate.toString()}<br />
                        End date:      {coupon?.endDate.toString()}<br />
                        left in stock: {coupon?.amount}<br />
                        image:         {coupon?.image}<br />
                        {clientType === "Company" && <button onClick={handleEdit}>Edit coupon</button>}
                        {clientType === "Company" && <button onClick={handleDelete}>Delete coupon</button>}
                    </div>
            }
            {/*  */}
            { clientType === "Customer" && showPurchaseButton.state?.showPurchase !== false && <PurchaseCoupon couponId={coupon?.id!} />}
        </div>
    );
}
