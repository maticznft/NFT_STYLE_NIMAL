import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, TextField } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import FooterInner from "components/Footer/FooterInner.js";
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

export default function ConnectWallet(props) {
  const classes = useStyles();
  const { ...rest } = props;

  return (
    <div className="inner_header">
      <Header
        fixed
        color="transparent"
        routes={dashboardRoutes}
        brand={<Link to="/home"><img src={require("../assets/images/logo.png")} alt="logo" className="img-fluid"/></Link>}
        rightLinks={<HeaderLinks />}
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
              <div className="d-flex align-items-center">
                <Link to="/home">
                  <img src={require("../assets/images/arrow_icon.png")} alt="logo" className="arrow_icon"/>
                </Link>
                <h2 className="inner_title">Connect your wallet</h2>
              </div>
            </GridItem>
          </GridContainer>
        </div>
        <div className="container mt-4">
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <p className="create_para">Connect with one of available wallet providers or create a new wallet.</p>
              <div className="create_box_panel row connect_row">
                  <div className="col-12 col-sm-6 col-lg-4 mb-3">
                <Link to="/create-single" className="create_box">
                  <h2>Metamask</h2>
                  <img src={require("../assets/images/metamask.svg")} alt="logo" className="img-fluid mt-3"/>
                  <p className="mb-0 text-white text-center mt-3">One of the most secure wallets with great flexibility</p>
                </Link>
                </div>
                <div className="col-12 col-sm-6 col-lg-4 mb-3">
                <Link to="/create-multiple" className="create_box">
                  <h2>Torus</h2>
                  <img src={require("../assets/images/torus.svg")} alt="logo" className="img-fluid mt-3"/>
                  <p className="mb-0 text-white text-center mt-3">Connect with your Google, Facebook, Twitter or Discord</p>

                </Link>
                </div>
                <div className="col-12 col-sm-6 col-lg-4 mb-3">
                <Link to="/create-multiple" className="create_box">
                  <h2>Portis</h2>
                  <img src={require("../assets/images/poris.svg")} alt="logo" className="img-fluid mt-3"/>
                  <p className="mb-0 text-white text-center mt-3">Connect with your email and password</p>

                </Link>
                </div>
                <div className="col-12 col-sm-6 col-lg-4 mb-3">
                <Link to="/create-multiple" className="create_box">
                  <h2>WalletConnect</h2>
                  <div className="d-flex align-items-center justify-content-center">
                  <img src={require("../assets/images/wallet1.png")} alt="logo" className="img-fluid mt-3 mr-2"/>
                  <img src={require("../assets/images/wallet.svg")} alt="logo" className="img-fluid mt-3 mr-2"/>
                  <img src={require("../assets/images/wallet2.svg")} alt="logo" className="img-fluid mt-3"/>
                  </div>
                  <p className="mb-0 text-white text-center mt-3">Connect with Rainbow, Trust, Argent and more</p>

                </Link>
                </div>
                <div className="col-12 col-sm-6 col-lg-4 mb-3">
                <Link to="/create-multiple" className="create_box">
                  <h2>Coinbase</h2>
                  <img src={require("../assets/images/coinbase.svg")} alt="logo" className="img-fluid mt-3"/>
                  <p className="mb-0 text-white text-center mt-3">Connect via app on your phone</p>

                </Link>
                </div>
                <div className="col-12 col-sm-6 col-lg-4 mb-3">
                <Link to="/create-multiple" className="create_box">
                  <h2>MyEtherWallet</h2>
                  <img src={require("../assets/images/myeth.svg")} alt="logo" className="img-fluid mt-3"/>
                  <p className="mb-0 text-white text-center mt-3">Connect via app on your phone</p>

                </Link>
                </div>
              </div>
              <p className="create_para mt-3">We do not own your private keys and cannot access your funds without your confirmation.</p>
            </GridItem>
          </GridContainer>
        </div>
      </div>
      <FooterInner/>
    </div>
  );
}
