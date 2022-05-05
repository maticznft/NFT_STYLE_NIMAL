import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, TextField } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link, useHistory } from "react-router-dom";

const dashboardRoutes = [];

const useStyles = makeStyles(styles);
// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function Create(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const history = useHistory();
  return (

    <div className="home_header">
      <div className="inner_page_bg">
        <Header
          color="transparent"
          routes={dashboardRoutes}
          brand={<Link to="/"><img src={require("../assets/images/logo.png")} alt="logo" className="img-fluid" /></Link>}
          leftLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 20,
            color: "white"
          }}
          {...rest}
        />
        <ScrollToTopOnMount />
        <div className={classes.pageHeader + " inner_pageheader inner_page_padding_big"}>

          <div className="container">
            <div className="row">
              <div className="col-12 col-md-10 col-lg-7 mx-auto">
                <div>
                  <Button className="bluebtn" onClick={() => history.push('/')}>Go Back</Button>

                  <div>
                    <h2 className="inner_title my-4">Create collectible</h2>
                  </div>
                  <p className="create_para">Choose “Single” if you want your collectible to be one of a kind or “Multiple” if you want to sell one collectible multiple times</p>

                  <div className="row">
                    <div className="col-12 col-md-12 col-lg-11 col-xl-9 mx-auto">
                      <div className="row pt-5 pb-3 justify-content-center">
                        <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-3 col_create">
                          <div className="card card_create card_craete_single my-0 rad_2">
                            <div className="card-body px-4 py-5">
                              <div className="text-center">
                                <div>
                                  <img src={require("../assets/images/single_img_new.png")} alt="logo" className="img-fluid mx-auto img_radis mb-4" />
                                </div>
                                <Button className=" mt-3 mb-2 bluebtn ">
                                  <Link to='/create-single'>Create Single</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-3 col_create">
                          <div className="card card_create my-0 rad_2">
                            <div className="card-body px-4 py-5">
                              <div className="text-center">
                                <div>
                                  <img src={require("../assets/images/multiple_img_new.png")} alt="logo" className="img-fluid mx-auto img_radis mb-4" />
                                </div>
                                <Button className="theme-btn mt-3 mb-2">
                                  <Link to='/create-multiple' className="mul_link_a_hit">Create Multiple</Link>
                                </Button>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>



                  <p className="create_para mt-4 text-center">We do not own your private keys and cannot access your funds without your confirmation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
