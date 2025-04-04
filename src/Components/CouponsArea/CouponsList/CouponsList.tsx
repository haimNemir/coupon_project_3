import { useEffect, useState, createContext, useContext, useRef } from "react";
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
import { useNavigate } from "react-router-dom";
import { Company } from "../../../Models/Company";
import { render } from "@testing-library/react";



interface CouponsListProps {
    list: Coupon[];
    firstTimeRequested: boolean;
}

export function CouponsList(props: CouponsListProps): JSX.Element {

    const [allCoupons, setAllCoupons] = useState<Coupon[]>(props.list);
    const [error, setError] = useState<string>("");
    const [addingMode, setAddingMode] = useState<boolean>(false)
    const [fetchingDataCompany, setFetchingDataCompany] = useState<boolean>(true)
    const [fetchingDataCustomer, setFetchingDataCustomer] = useState<boolean>(true)
    const clientType = authStore.getState().role
    const navigate = useNavigate()

    useEffect(() => {
        if (!props.firstTimeRequested) {
            setAllCoupons(props.list);
            setFetchingDataCustomer(false)
            setFetchingDataCompany(false)

            // in case the client is an Customer:       
        } else if (props.firstTimeRequested && authStore.getState().role === "Customer") {
            customerService.getAllCoupons()
                .then(result => {
                    setAllCoupons(result);
                    setFetchingDataCustomer(false);
                    setFetchingDataCompany(false);
                    // alert("fetched data customer")

                })
                .catch((error) => { setError(error || "An unknown error occurred") })
            // in case the client is an Company:       
        } else if (props.firstTimeRequested && authStore.getState().role === "Company") {
            companyService.getCompanyCoupons()
                .then(result => {
                    setAllCoupons(result);
                    setFetchingDataCompany(false);
                    setFetchingDataCustomer(false);
                    alert("fetched data company")

                })
                .catch((error) => { setError(error || "An unknown error occurred") })
        }
    }, [props.list]) // [props.list]-   if the value "props.list" will change "UseEffect" will do another render.

    function handleClick() {
        setAddingMode(!addingMode)
        resetPopup()
    }


    const formattedDateToday: string = moment().format("YYYY-MM-DDTHH:mm") //gets Date "today" from moments.js libreary with format of ("YYYY-MM-DD-HH-mm")
    const formattedDateTomorrow = moment().add(1, "days").format("YYYY-MM-DDTHH:mm")
    const { register, handleSubmit, reset, setValue } = useForm<Coupon>({
        mode: "onSubmit",
        //defined a default values for the form:
        defaultValues: {
            id: 0, startDate: new Date(formattedDateToday),
            endDate: new Date(formattedDateTomorrow)
        }
    });
    const [minEndDate, setMinEndDate] = useState<string>(formattedDateTomorrow)// defined the min end date the client can enter based on the start date the client entered, initialized to tomorrow from present.
    function enterStartDate(event: React.ChangeEvent<HTMLInputElement>) { // will run only when client will enter full date, it will take the input and enter in "enteredStartDate"
        let enteredStartDate = new Date(event.target.value)
        setValue("startDate", enteredStartDate) // save the value the client enter to the form, we use new Date() to convert the "value: string" to "value: Date"
        setMinEndDate(moment(enteredStartDate).add(1, "days").format("YYYY-MM-DDTHH:mm")) // adding one day to the date the client entered and use it to prevent from user enter end date erlier then start date.// it will handle it in case is the last day in the month to change to month too.
    }


    useEffect(() => {
        setAllCoupons(props.list)
    }, [props.list]);

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
                reset()
            })
            .catch(error => alert(error.response.data))
    }

    const [showStartDate, setShowStartDate] = useState<boolean>(false)
    const [showEndDate, setShowEndDate] = useState<boolean>(false)

    function resetPopup() {
        setShowStartDate(false)
        setShowEndDate(false)
    }

    useEffect(() => { // getting the current company to set default creating company as current
        companyService.getCompanyDetails()
            .then(result => setValue("company", result))
            .catch(error => alert(error))
    }, [])

    return (
        <div >

            {error ? <p>{error}</p> :
                <div className="CouponsList">
                    {clientType == "Company" && !addingMode &&
                        <button onClick={handleClick} className="coupon_list__add_coupon customized_card"><h1 className="coupon_list_add_coupon">Add coupon</h1><AddIcon className="coupon_list_add_coupon" sx={{ fontSize: 120 }} /></button>
                    }
                    {clientType == "Company" && addingMode &&
                        <form className="coupon_list__form" onSubmit={handleSubmit(handleAddingCoupon)}>
                            <p className="coupons_list__title coupons_list__grid_title">Create new coupon</p>
                            <input className="coupons_list__input T" type="text" placeholder="Title" required {...register("title")} />
                            <input className="coupons_list__input D" type="text" placeholder="Description" required {...register("description")} />
                            <input className="coupons_list__input A" title="Amount in stock" type="number" placeholder="Amount in stock" min={1} max={999999} required {...register("amount")} />
                            <input className="coupons_list__input P" type="number" placeholder="Price" min={1} max={999999} required {...register("price")} />
                            <select className="C coupon_list__select" defaultValue={""} required {...register("category")}>
                                <option disabled value="">Category</option>
                                {listOfCategories.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select><br />
                            <input className="coupons_list__input I" type="text" placeholder="Image" required {...register("image")} /><br />
                            {/*here line below you dont need to enter {...register("startDate")} because onChange handle it. */}
                            {showStartDate ? <input className="coupons_list__input SD" type="datetime-local" min={formattedDateToday} required onChange={enterStartDate} /> :
                                <button className="customized_button coupons_list__helpTitle SD coupons_list__buttons" type="button" onClick={() => setShowStartDate(!showStartDate)} >Enter start date</button>
                            }
                            {showEndDate ? <input className="coupons_list__input ED" type="datetime-local" min={minEndDate ?? formattedDateTomorrow} required {...register("endDate")} /> :
                                <button className="customized_button ED coupons_list__helpTitle coupons_list__buttons" type="button" onClick={() => setShowEndDate(!showEndDate)} >Enter end date</button>
                            }
                            <button className="S customized_button coupons_list__buttons" type="submit">Save</button>
                            <button className="R customized_button coupons_list__buttons" type="button" onClick={() => { reset(); resetPopup() }}>Reset</button>
                            <button className="CL customized_button coupons_list__buttons" type="button" onClick={handleClick}>Close</button>
                        </form>
                    }

                    {
                        fetchingDataCustomer || fetchingDataCompany ?  clientType == "Company" ?
                            <div className="coupon_list__company_spinner-container">
                                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                            </div>
                            :
                            <div className="coupon_list__customer_spinner-container">
                                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                            </div>
                            :

                            allCoupons.length > 0 ?
                                allCoupons?.map(coupon => <CouponCard key={coupon.id} coupon={coupon} />)
                                :
                                allCoupons.length === 0 && clientType == "Company" ?
                                    <div className="coupons_list__errorMessageDiv"><h2 className="coupons_list__errorMessage">You haven't created any coupons from this category yet, Please create one first</h2></div>
                                    :
                                    allCoupons.length === 0 && clientType == "Customer" && <div>
                                        <div className="coupons_list__errorMessageDiv"> <h2 className="coupons_list__errorMessage">You haven't purchased any coupons from this category yet, Please purchase one first</h2></div>
                                    </div>
                    }

                    
                </div>}
        </div>
    );
}

