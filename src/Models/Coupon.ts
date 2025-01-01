import { Company } from "./Company";

export class Coupon {
    id: number;
    category: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    amount: number;
    price: number;
    image: string;
    company: Company;

    constructor(
        id: number,
        category: string,
        title: string,
        description: string,
        startDate: Date,
        endDate: Date,
        amount: number,
        price: number,
        image: string,
        company: Company
    ){
        this.id = id;
        this.category = category;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.amount = amount;
        this.price = price;
        this.image = image;
        this.company = company;
    }
}