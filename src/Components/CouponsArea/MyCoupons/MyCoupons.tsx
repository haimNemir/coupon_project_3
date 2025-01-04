import { useEffect, useState } from "react";
import "./MyCoupons.css";
import { Coupon } from "../../../Models/Coupon";
import { CouponsList } from "../CouponsList/CouponsList";
import { useForm } from "react-hook-form";
import { Category } from "../../../Models/Category";
import InputSlider from "../InputSlider/InputSlider";
import customerService from "../../../Services/CustomerService";


//to fix: let the client change the slider and push on sort                                      
interface SortProps {
    allCoupons: boolean;
    byCategory: Category;
    byPrice: number;
}

export function MyCoupons(): JSX.Element {
    // for getting the all selections and return coupons by that
    const { register, handleSubmit, getValues, setValue } = useForm<SortProps>({ mode: "onSubmit" }); 

    //gets purchased coupons of the customer:
    const [coupons, setCoupons] = useState<Coupon[]>([])
   
    useEffect(() => {
        getAllCoupons()
    }, [])

    //we want to define the most expensive coupon only in the first time the client enter to <MyCoupons> :
    let firstAccess: boolean = true
    function getAllCoupons() {
        customerService.getCustomerCoupons()
            .then(result => {
                setCoupons(result);
                if(firstAccess){
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
    function getMostExpensive(list: Coupon[]){
        const expensiveCoupon = list.reduce((highest, current) => {
            return current.price > highest.price ? current : highest
        }, list[0])// list[0]- first initialized to the coupons will be first place in the list.
        setMostExpensiveCoupon(expensiveCoupon.price + 1) // +1 - because the filter not including the last number himself
    } 


    // define the max value of the slider.
    // we send this method to <InputSlider> to get the return value of the slider, he will call this method and send to her parameters that will save in "sliderValue" 
    const [sliderValue, setSliderValue] = useState<number>(1000);

    // allow user to open the slider popup or to close him:
    const [showPricing, setshowPricing] = useState<boolean>(false);
    function togglePricing() {
        setshowPricing(!showPricing)
    }

    // Put the "byPrice" from useForm into the "sliderValue".
    useEffect(() => {
        setValue("byPrice", sliderValue);
    }, [sliderValue, setValue])// if one of them will change it will do rerender to this block.

    function getSorted(form: SortProps) {
        // Get handle for the cases of selecting "One" category.
        if (form.byCategory.toString() !== "All" && form.byCategory.toString() !== "") {
            customerService.getCustomerCouponsByCategory(form.byCategory)
                .then(result => {
                    setCoupons(result);
                    filterPrice(form, result)
                })
                .catch(error => alert(error))
        }
        // Get handle for case of "All"
        else if (form.byCategory.toString() === "All") {
            getAllCoupons();
        }
        // Get handle for case of "Select category", he didn't choose anyone.
        else if (form.byCategory.toString() === "") {
            customerService.getCustomerCouponsByPrice(form.byPrice)
                .then(result => { setCoupons(result) })
                .catch(error => alert(error))
        }
    }

    function filterPrice(form: SortProps, list: Coupon[]){
        const result = list.filter(coupon => coupon.price < form.byPrice)//if you will add "{coupon.price < form.byPrice}" it will not add the result to the "const result" antil you will add key word "return", unless you will remove the sigh "{}".
        setCoupons(result);
    }

    return (
        <div className="MyCoupons">
            <div className="sort_bar">
                <form onSubmit={handleSubmit(getSorted)}>
                    <select defaultValue={""} {...register("byCategory")}>
                        <option disabled value={""}>Select category</option>
                        <option value={"All"}>All Categories</option>
                        <option value={"FOOD"}>Food</option>
                        <option value={"ELECTRICITY"}>Electricity</option>
                        <option value={"RESTAURANT"}>Restaurant</option>
                        <option value={"VACATION"}>Vacation</option>
                        <option value={"FASHION"}>Fashion</option>
                        <option value={"CINEMA"}>Cinema</option>
                        <option value={"SPA"}>Spa</option>
                        <option value={"TECH"}>Tech</option>
                        <option value={"SPORT"}>Sport</option>
                    </select>
                    <button type="button" onClick={togglePricing}>Price</button> {/*we define the button to type "button" to prevent from him to be default value: "submit"*/}
                    {showPricing ?
                        <div>
                            <InputSlider initialMaxValue={mostExpensiveCoupon} savedValue={sliderValue} setSliderValue={setSliderValue} />
                        </div> : ""}
                    <button type="submit">Sort</button>
                </form>
            </div>
            {<CouponsList list={coupons} firstTimeRequested={false} />}
        </div>
    );
}


// add condition to see the slider only if the user is logged in
// add the eresult of the sort to a element and it will be saved even the client will go to component home and return