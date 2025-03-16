import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Routing } from './Components/Routing/Routing';
import axios from 'axios';
import { Menu } from './Components/Menu/Menu';
import { AuthChecker } from './Components/AuthArea/AuthChecker/AuthChecker';

axios.interceptors.request.use(function (config) {// + before any request to the server, this function will add this to the request to the Header if there is a token inside the local storge.
  if (localStorage.getItem("my_token") !== "")
    config.headers.Authorization = "Bearer " + localStorage.getItem("my_token")
  return config;
})


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter> {/* We wrap the entire project with <BrowserRouter> to allow all its children to use "react-router-dom" components, such as NavLink, Route, and others. This ensures smooth transitions between components */}
    <AuthChecker />
    <Menu />
    <Routing />
  </BrowserRouter>
  
);

//TODO: 2/10 Add a cart to purchase products
//TODO: 2/10 add a button of <previes page> to go back from where you came , and not use the default button of chrome. 
//TODO: 6/10 on hover on CompanyCard/CustomerCard it will show decription what will happend if you will click
//TODO: 1/10 theme light dark mode
//TODO: 1/10 allow customer change password and name 
// see all comments inside all classes
// 1/10 disallow to purchase coupon if his out of stock, add more filters
// fitcher: 2/10 add profile picture
//TODO: 1/10 add validation of the input the client enter
//TODO: 10/10 when select remember me is disconnect right away (so the probleme is not setTimout)
// 10/10 add logs! in developing mode and in regular
// 1/10. add default cennection details on login erea. 
// 1/10 when the all companies loading from the sever after login to server you need to remove button of add customer/company and give more bigger font to the words.

//7/10 : TODO: remember me not working, after some time the user get code 401 error and not diconnected message and the account is disconnected 

//10/10 : loading image when fetch data.
// 10/10 : on reloading the user get authorized.