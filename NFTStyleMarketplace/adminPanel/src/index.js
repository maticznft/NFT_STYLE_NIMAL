/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import {  BrowserRouter as Router, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from './store';

import ConditionRoute from './components/Route/ConditionRoute';

// core components
import Admin from "layouts/Admin.js";
import Login from "views/Login/login.js";
import Forogt from "views/forgotpass/forgot.js";
import changepass from "views/forgotpass/changepass.js";

// import RTL from "layouts/RTL.js";

import "assets/css/material-dashboard-react.css?v=1.9.0";

const hist = createBrowserHistory();

ReactDOM.render(
  <Provider store={store} >
    <Router history={hist} basename="/nimdaelytstfn">
      <Switch>
        <ConditionRoute path="/login" component={Login} type={"auth"} />        
        <ConditionRoute path="/forgot" component={Forogt} type={"auth"} />
        <ConditionRoute path="/change-password/:userId" component={changepass} type={"auth"} />
        <ConditionRoute path="/user" component={Admin} type={"private"} />        
        <ConditionRoute path="/" component={Admin} type={"private"} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
