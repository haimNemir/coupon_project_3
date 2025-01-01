import { useEffect, useState } from "react";
import { Company } from "../../../Models/Company";
import "./Companies.css";
import adminService from "../../../Services/AdminService";

export function Companies(): JSX.Element {
    const [allCompanies, setAllCompanies] = useState<Company[]>(); 

    // useEffect(()=>{
    //     adminService.getAllCompanies
    // },[])

    return (
        <div className="Companies">
			<p>companies here...</p>
        </div>
    );
}
