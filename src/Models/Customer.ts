import { Coupon } from "./Coupon";

export class Customer{
    id?: number | undefined;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    coupons: Coupon[];

    constructor(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        coupons: Coupon[],
        id?: number | undefined
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.coupons = coupons;
    }
}