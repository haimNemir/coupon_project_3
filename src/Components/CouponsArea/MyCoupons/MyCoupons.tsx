import { createContext, useContext, useEffect, useRef, useState } from "react";
import "./MyCoupons.css";
import { Coupon } from "../../../Models/Coupon";
import { CouponsList } from "../CouponsList/CouponsList";
import { useForm } from "react-hook-form";
import { Category } from "../../../Models/Category";
import InputSlider from "../InputSlider/InputSlider";
import customerService from "../../../Services/CustomerService";
import { authStore } from "../../../Redux/AuthStore";
import companyService from "../../../Services/CompanyService";
import { error } from "console";
import { Company } from "../../../Models/Company";

//to fix: let the client change the slider and push on sort                                      
interface SortProps {
    allCoupons: boolean;
    byCategory: Category;
    byPrice: number;

}

export const Context = createContext<boolean | null>(null) // send data to his childrens (here we send to <CouponDetails/>) like we send props, but here we didnt need to pass the data throw all the components in the middle. we do it outside of <MyCoupons/> component to prevent from create useContext any time the component rerender. 


export function MyCoupons(): JSX.Element {

    // for getting the all selections and return coupons by that
    const { register, handleSubmit, getValues, setValue } = useForm<SortProps>({ mode: "onSubmit" });

    //gets purchased coupons of the customer:
    const [coupons, setCoupons] = useState<Coupon[]>([])

    useEffect(() => {
        getAllCoupons()
    }, [])

    const clientType = authStore.getState().role;
    //we want to define the most expensive coupon only in the first time the client enter to <MyCoupons> :
    let firstAccess: boolean = true
    function getAllCoupons() {
        let promise: Promise<Coupon[]>;
        if (clientType === "Company") {
            promise = companyService.getCompanyCoupons();
        } else if (clientType === "Customer") {
            promise = customerService.getCustomerCoupons();
        }
        promise!
            .then(result => {
                setCoupons(result);
                if (firstAccess) {
                    getMostExpensive(result);
                    firstAccess = false;
                }
                filterPrice(getValues(), result)
            })
            .catch(error => alert(error))
    }



    // gets the expensive coupon from customer coupons to define max value in "slider":
    // coupons.reduce() - gets two coupons and compare them for the most expensive coupon, and return to "highest" the expensive.
    const [mostExpensiveCoupon, setMostExpensiveCoupon] = useState<number>(1000);
    function getMostExpensive(list: Coupon[]) {
        const expensiveCoupon = list.reduce((highest, current) => {
            return current.price > highest.price ? current : highest
        }, list[0])// list[0]- first initialized to the coupons will be first place in the list.
        if (list.length > 0) {
            setMostExpensiveCoupon(Math.ceil(expensiveCoupon.price)) // Math.ceil takes a decimal number and returns the smallest integer that is greater than or equal to the given number.
        }
    }

    // define the max value of the slider.
    // we send this method to <InputSlider> to get the return value of the slider, he will call this method and send to her parameters that will save in "sliderValue" 
    const [sliderValue, setSliderValue] = useState<number>(1000);

    // allow user to open the slider popup or to close him:
    const [showPricing, setShowPricing] = useState<boolean>(false);
    function togglePricing() {
        setShowPricing(!showPricing)
    }

    // Put the "byPrice" from useForm into the "sliderValue".
    useEffect(() => {
        setValue("byPrice", sliderValue);
    }, [sliderValue, setValue])// if one of them will change it will do rerender to this block.

    function getSorted(form: SortProps) {
        // Get handle for the cases of selecting "One" category.
        if (form.byCategory.toString() !== "All" && form.byCategory.toString() !== "") {
            //gets result from the server depends on client role, as "Promise<Coupon[]>" :
            let promiseCategory: Promise<Coupon[]>;
            if (clientType === "Company") {
                promiseCategory = companyService.getCompanyCouponsByCategory(form.byCategory)
            }
            else if (clientType === "Customer") {
                promiseCategory = customerService.getCustomerCouponsByCategory(form.byCategory)
            }
            promiseCategory!
                .then(result => {
                    setCoupons(result);
                    filterPrice(form, result)
                })
                .catch(error => alert(error.response.data))
        }
        // Get handle for case of "All"
        else if (form.byCategory.toString() === "All") {
            getAllCoupons();
        }
        // Get handle for case of "Select category", he didn't choose anyone.
        else if (form.byCategory.toString() === "") {
            customerService.getCustomerCouponsByPrice(form.byPrice)
                .then(result => { setCoupons(result) })
                .catch(error => alert(error.response.data))
        }
        setShowPricing(false)
    }

    function filterPrice(form: SortProps, list: Coupon[]) {
        const result = list.filter(coupon => coupon.price < form.byPrice)//if you will add "{coupon.price < form.byPrice}" it will not add the result to the "const result" antil you will add key word "return", unless you will remove the sigh "{}".
        setCoupons(result);
    }

    //gets list of string values from enum "Category" as: "value- FOOD, label- Food" for each one of them 
    const listOfCategories = Object.keys(Category).map((key) => ({  // do "map" for the list and for each of a value we create two parameters:
        value: key, // save the value as "FOOD"
        label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() // save the value as "Food". key.slice(1) - return new string start from the index[1] (the second letter) until his end.
    }))

    const [showPurchaseButton] = useState<boolean>(false)


    return (
        <div className="MyCoupons">
            <div className="sort_bar">
                <form onSubmit={handleSubmit(getSorted)}>
                    <select className="sortButton" defaultValue={"All"} {...register("byCategory")}>
                        <option value={"All"}>All Categories</option>
                        {listOfCategories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                    <button className="sortButton" type="button" onClick={togglePricing}>Price</button> {/*we define the button to type "button" to prevent from him to be default value: "submit"*/}
                    <button className="sortButton" type="submit">Sort</button>

                    {showPricing ?
                        <div>
                            <InputSlider initialMaxValue={mostExpensiveCoupon} savedValue={sliderValue} setSliderValue={setSliderValue} />
                        </div> : ""}
                </form>
            </div>
            <div className="couponList">
                <Context.Provider value={showPurchaseButton}> {/*send data to his childrens inside the Provider*/}
                    {<CouponsList list={coupons} firstTimeRequested={false} />}
                </Context.Provider>
            </div>
        </div>
    );
}


// add the eresult of the sort to a element and it will be saved even the client will go to component home and return