import React, { useEffect,useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, TextField } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
// import HeaderLinksCommunity from "components/Header/HeaderLinksCommunity.js";

import Footer from "components/Footer/Footer.js";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link,useLocation } from "react-router-dom";
import {getPrivacyVal} from '../actions/v1/report';
import ReactHTMLParser from 'react-html-parser'
const dashboardRoutes = [];

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function Privacypolicy(props) {
  
  const classes = useStyles();
  const { ...rest } = props;
  const location =useLocation();
  const[contents,setContents]=useState({})
  var location_name =""
  if(location_name=="/privacy-policy") {
    location_name="/privacy-policy"
  }
  else if(location_name=="/terms-of-service")
  {
    location_name="/terms-of-service"
  }
else{
  location_name="/community"
}
  // ( location.pathname == "/privacy-policy" ) ? "privacy" : "community";
// alert(location.pathname)
  useEffect(()=>{
    getPrivacy();
  },[])

  const getPrivacy=async()=>{

    var reqdata={
      location:"privacy"
    }
    
    var test=await getPrivacyVal(reqdata)
      //console.log"hjgjgjghjghjutytuytyutyutuu",test.data)
    
    if(test&&test.data&&test.data.userValue){
      setContents(test.data.userValue)
    }

  }

  return (
    <div className="home_header">
      <div className="inner_page_bg">
      <Header
        fixed
        color="transparent"
        routes={dashboardRoutes}
        brand={<Link to="/home">
          <img src={require("../assets/images/logo.png")} alt="logo" className="img-fluid"/>
          </Link>}
        leftLinks={<HeaderLinks />}
        changeColorOnScroll={{
          height: 50,
          color: "dark"
        }}
        {...rest}
      />
      <ScrollToTopOnMount/>
      <div className={classes.pageHeader + " inner_pageheader"}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <div className="d-flex align-items-center mt-3">    
                         
                {/* <h2 className="inner_title">Privacy Policy</h2> */}
              </div>
            </GridItem>
          </GridContainer>
        </div>
        <div className="container mt-4 cms_content pb-4">
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <div className="meAdded">  {ReactHTMLParser(contents.answer)} </div>
                      </GridItem>
          </GridContainer>
        </div>
      </div>
      </div>
      <Footer/>
    </div>
  );
}
