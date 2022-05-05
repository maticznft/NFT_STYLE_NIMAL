import React, { useEffect, useState } from "react";
import ReactHTMLParser from 'react-html-parser';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, TextField } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import {getcmslistinhome} from '../actions/v1/report';
import Footer from "components/Footer/Footer.js";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link } from "react-router-dom";

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function Terms(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const[getcmslistinhome1,setgetcmslistinhome1]=useState({});
  useEffect(() => {
    getcmslistinhomes()
  }, []);
  const getcmslistinhomes = async () => {
    var reqdata={
      load:'about'
    }
    var convers = await getcmslistinhome(reqdata);
    console.log("sdftaevgb",convers,reqdata)
    if (convers&&convers.data) {
      setgetcmslistinhome1(convers.data)
    }
  }

  return (
    <div className="home_header">
      <div className="inner_page_bg">
      <Header
        fixed
        color="transparent"
        routes={dashboardRoutes}
        brand={<Link to="/home"><img src={require("../assets/images/logo.png")} alt="logo" className="img-fluid"/></Link>}
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
                <h2 className="inner_title">About Us</h2>
              </div>
            </GridItem>
          </GridContainer>
        </div>
        <div className="container mt-4 pb-4">
          <GridContainer>
            <GridItem xs={12} sm={12} md={12} className="static_cont">
            <>{getcmslistinhome1 && getcmslistinhome1.answer && ReactHTMLParser(getcmslistinhome1.answer)} </>
            </GridItem>
          </GridContainer>
        </div>
      </div>
      </div>
      <Footer/>
    </div>
  );
}
