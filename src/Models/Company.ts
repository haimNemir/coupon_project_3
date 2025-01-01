export class Company {
    id: number;
    name: string;
    email: string;
    password: string;

    constructor(
        id: number,
        name: string,
        email: string,
        password: string
    ){
        this.id =id;
        this.email = email;
        this.name = name;
        this.password = password;
    }
}