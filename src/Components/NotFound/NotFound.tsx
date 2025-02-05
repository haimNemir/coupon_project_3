import { JSX } from "react";
import "./NotFound.css";
import React from "react";
import { useNavigate } from "react-router-dom";

export function NotFound(): JSX.Element {

    const navigate = useNavigate()
    function goHome(){
        navigate("/")
    } 
    
    return (
        <div className="NotFound">
			<h3>The page you're searching for does not exist.</h3>
            <button className="button" onClick={goHome}>Home page</button>
        </div>
    );
}
