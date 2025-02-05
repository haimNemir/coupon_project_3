import { useEffect, useState, createContext, useContext } from "react";
import "./CouponsList.css";
import { Coupon } from "../../../Models/Coupon";
import customerService from "../../../Services/CustomerService";
import { CouponCard } from "../CouponCard/CouponCard";
import { authStore } from "../../../Redux/AuthStore";
import companyService from "../../../Services/CompanyService";
import AddIcon from '@mui/icons-material/Add';
import { useForm } from "react-hook-form";
import { Category } from "../../../Models/Category";
import moment from "moment";
import { Navigate, useNavigate } from "react-router-dom";



interface CouponsListProps {
    list: Coupon[];
    firstTimeRequested: boolean;
}

export function CouponsList(props: CouponsListProps): JSX.Element {
    const [allCoupons, setAllCoupons] = useState<Coupon[]>(props.list);
    const [error, setError] = useState<string>("");
    const [addingMode, setAddingMode] = useState<boolean>(false)
    const clientType = authStore.getState().role
    const navigate = useNavigate()

    useEffect(() => {
        if (!props.firstTimeRequested) {
            setAllCoupons(props.list)
            // in case the client is an Customer:       
        } else if (props.firstTimeRequested && authStore.getState().role === "Customer") {
            customerService.getAllCoupons()
                .then(result => {
                    setAllCoupons(result);
                })
                .catch((error) => { setError(error || "An unknown error occurred") })
            // in case the client is an Company:       
        } else if (props.firstTimeRequested && authStore.getState().role === "Company") {
            companyService.getCompanyCoupons()
                .then(result => {
                    setAllCoupons(result);
                })
                .catch((error) => { setError(error || "An unknown error occurred") })
        }
    }, [props.list]) // [props.list]-   if the value "props.list" will change "UseEffect" will do another render.


    function handleClick() {
        setAddingMode(!addingMode)
    }

    const formattedDateToday = moment().format("YYYY-MM-DD-HH-mm") //gets Date "today" from moments.js libreary with format of ("YYYY-MM-DD-HH-mm")
    const formattedDateTomorrow = moment().add(1, "days").format("YYYY-MM-DD-HH-mm")
    
    const { register, handleSubmit, reset, setValue } = useForm<Coupon>({
        mode: "onSubmit",
        //defined a default values for the form:
        defaultValues: { id: 0, startDate: new Date(formattedDateToday), endDate: new Date(formattedDateTomorrow) }
    });
    let currentCompany = props.list.find(company => company.id > 0)?.company; 
    useEffect(() => { // there is a delay in the first render of the page and default value of "company" in the useForm can be null so ve ensureing a valid value on "company value"
        setValue("company", currentCompany!)
    }, [props.list])
    const [defaultEndDate, setDefaultEndDate] = useState<string>(formattedDateTomorrow);// defined the min end date the client can enter based on the start date the client entered, initialized to tomorrow from present.
    function enterStartDate(event: React.ChangeEvent<HTMLInputElement>) {
        const enteredStartDate = new Date(event.target.value)
        // setValue("startDate", enteredStartDate) // save the value the client enter to the form, we use new Date() to convert the "value: string" to "value: Date"
        const minValueEndDate = moment(enteredStartDate).add(1, "days").format("YYYY-MM-DD-HH-mm")
        setDefaultEndDate(minValueEndDate) // adding one day to the date the client entered and use it to prevent from user enter end date erlier then start date.// it will handle it in case is the last day in the month to change to month too.
    } 

    
    //gets list of string values from enum "Category" as: "value- FOOD, label- Food" for each one of them 
    const listOfCategories = Object.keys(Category).map((key) => ({  // do "map" for the list and for each of a value we create two parameters:
        value: key, // save the value as "FOOD"
        label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() // save the value as "Food". key.slice(1) - return new string start from the index[1] (the second letter) until his end.
    }))
    function handleAddingCoupon(form: Coupon) {
        companyService.addCoupon(form)
            .then(result => { 
                alert("Coupon " + result.id + " " + result.title + " has created successfully!")
                allCoupons.push(result)
                navigate("/get_all_coupons")
                setAddingMode(!addingMode)
            })
            .catch(error => alert(error.response.data))
    }

    return (
        <div >
            {error ? <p>{error}</p> :
                <div className="CouponsList">
                    {clientType == "Company" && !addingMode &&
                        <button onClick={handleClick} className="addCoupon"><AddIcon /></button>
                    }
                    {clientType == "Company" && addingMode &&
                        <form className="form" onSubmit={handleSubmit(handleAddingCoupon)}>
                            <input className="gridA" type="text" placeholder="Title" required {...register("title")} /><br />
                            <select className="gridB" defaultValue={"FOOD"} required {...register("category")}>
                                {listOfCategories.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option> 
                                ))}
                            </select><br />
                            <input className="gridC" type="number" placeholder="Price" min={0} max={999999} required {...register("price")} /><br />
                            <input className="gridD" type="text" placeholder="Description" required {...register("description")} /><br />
                            <input className="gridE" type="datetime-local" min={formattedDateToday.toString()} required {...register("startDate")} onChange={enterStartDate} /><br /> {/*here you dont need to enter {...register("startDate")} because onChange handle it. */}
                            <input className="gridF" type="datetime-local"  min={defaultEndDate} required {...register("endDate")} /> <br />
                            <input className="gridG" type="text" placeholder="Image" required {...register("image")} /><br />
                            <button className="gridH" type="submit">Save</button>
                            <button className="gridI" type="button" onClick={() => reset()}>Reset</button>
                            <button className="gridJ" type="button" onClick={handleClick}>Close</button>
                        </form>
                    }
                    {allCoupons.length > 0 ? allCoupons?.map(coupon =>
                        <CouponCard key={coupon.id} coupon={coupon}/>) :
                        <h2>You haven't created any coupons from this categories yet, Please create one first.</h2>
                    }
                </div>}
        </div>
    );
}


// TODO: when user enter to "my coupons" and instantly press on "sort", he will show him all the coupons, or not allow him to press on sort if he didnt define eny filters.