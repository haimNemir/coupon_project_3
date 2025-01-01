import { useEffect, useState } from "react";
import "./MyCoupons.css";
import { Coupon } from "../../../Models/Coupon";
import { CouponsList } from "../CouponsList/CouponsList";
import { useForm } from "react-hook-form";
import { Category } from "../../../Models/Category";
import InputSlider from "../../InputSlider/InputSlider";
import customerService from "../../../Services/CustomerService";
import { render } from "@testing-library/react";


//to fix: let the client change the slider and push on sort                                      
interface SortProps {
    allCoupons: boolean;
    byCategory: Category;
    byPrice: number;
}

export function MyCoupons(): JSX.Element {
    const { register, handleSubmit, setValue } = useForm<SortProps>({ mode: "onSubmit" }); // for getting the all selections and return coupons by that

    //gets purchased coupons of the customer:
    const [coupons, setCoupons] = useState<Coupon[]>([])
    useEffect(() => {
        customerService.getCustomerCoupons()
            .then(result => {
                setCoupons(result);
            })
            .catch(error => alert(error))
    }, [])

    // gets the expensive coupon from customer coupons to define max value in "slider":
    // coupons.reduce() - gets two coupons and compare them for the most expensive coupon, and return to "highest" the expensive.
    const [mostExpensiveCoupon, setMostExpensiveCoupon] = useState<Coupon>();
    useEffect(() => {
        const expensiveCoupon = coupons.reduce((highest, current) => {
            return current.price > highest.price ? current : highest
        }, coupons[0])// coupons[0]- first initialized to the coupons
        setMostExpensiveCoupon(expensiveCoupon)
    }, [coupons]) // [coupons] - make rerender to the block if this list get update.


    // define the max value of the slider.
    let maxValue: number = mostExpensiveCoupon ? mostExpensiveCoupon.price : 100;
    // we send this method to <InputSlider> to get the return value of the slider, he will call this method and send to her parameters that will save in "sliderValue" 
    const [sliderValue, setSliderValue] = useState<number>(0);

    // allow user to show the slider or to close him.
    const [showPricing, setshowPricing] = useState<boolean>(false);
    function togglePricing() {
            setshowPricing(!showPricing)
    }

    useEffect(() => {
        setValue("byPrice", sliderValue);
    }, [sliderValue, setValue])

    const [byCategoryList, setByCategoryList] = useState<Coupon[]>([]);
    const [byPriceList, setByPriceList] = useState<Coupon[]>([]);

    function getSorted(form: SortProps) {
        customerService.getCustomerCouponsByCategory(form.byCategory)
            .then(result => {if (result.length > 0) {
                setCoupons(result); 
            } else {
                alert(`No coupons found for category: ${form.byCategory}`);
                setCoupons([]); 
            }})
            .catch(error => alert(error))

            
        // customerService.getCustomerCouponsByPrice(form.byPrice)
        //     .then(result => { setByPriceList(result) })
        //     .catch(error => alert(error))

        // setCoupons([...byCategoryList, ...byPriceList])
        
        
    }




    return (
        <div className="MyCoupons">
            <div className="sort_bar">
                <form onSubmit={handleSubmit(getSorted)}>
                    <select defaultValue={""} {...register("byCategory")}>
                        <option  disabled value={""}>Select category</option>
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
                            <InputSlider initialMaxValue={maxValue} savedValue={sliderValue} setSliderValue={setSliderValue} />
                        </div> : ""}
                    <button type="submit">Sort</button>
                </form>


            </div>
            {<CouponsList list={coupons} />}
        </div>
    );
}


//add condition to see the slider only if the user is logged in