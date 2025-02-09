import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import { Routing } from './Components/Routing/Routing';
import axios from 'axios';
import { Menu } from './Components/Menu/Menu';

axios.interceptors.request.use(function (config) {// + before any request to the server, this function will add this to the request to the Header if there is a token inside the local storge.
  if (localStorage.my_token)
    config.headers.Authorization = "Bearer " + localStorage.my_token; 
  return config;
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);



root.render(
  <BrowserRouter> {/* We wrap the entire project with <BrowserRouter> to allow all its children to use "react-router-dom" components, such as NavLink, Route, and others. This ensures smooth transitions between components */}
      <Menu/>
      <Routing />
  </BrowserRouter>
);

//TODO: add button show password and remember me in login component
//TODO: 2/10 Add a cart to purchase products
//TODO: 2/10 add a button of <previes page> to go back from where you came , and not use the default button of chrome. 
//TODO: 6/10 on hover on CompanyCard/CustomerCard it will show decription what will happend if you will click
//TODO: 1/10 theme light dark mode
//TODO: 1/10 allow customer change password and name 
// see all comments inside all classes
// 1/10 disallow to purchase coupon if his out of stock, add more filters