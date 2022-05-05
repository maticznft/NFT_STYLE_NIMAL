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
import { Link } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';
const dashboardRoutes = [];

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function Proposals(props) {
  const classes = useStyles();
  const { ...rest } = props;

  return (
    <div className="home_header">
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
      <ScrollToTopOnMount/>
      <div className={classes.pageHeader + " inner_pageheader"}>
       
        <div className="container mt-3">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 mx-auto">
            <h2 className="inner_title mt-4">Proposals</h2>
           
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>    
            <Scrollbars style={{ height: 100 }}>                                
              <nav className="masonry_tab_nav pb-0 items_tab_outer">
                <div className="nav nav-tabs masonry_tab primary_tab items_tab proposal_tab_with" id="nav-tab" role="tablist">
                  <a className="nav-link active" id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all" aria-selected="true">
                    <div className="tab_head">All</div>
                    </a>
                  <a className="nav-link" id="active-tab" data-toggle="tab" href="#active" role="tab" aria-controls="active" aria-selected="false">
                  <div className="tab_head">Active</div>
                  </a>
                  <a className="nav-link" id="pending-tab" data-toggle="tab" href="#pending" role="tab" aria-controls="pending" aria-selected="false">
                  <div className="tab_head">Pending</div>
                  </a>
                  <a className="nav-link" id="closed-tab" data-toggle="tab" href="#closed" role="tab" aria-controls="closed" aria-selected="false">
                  <div className="tab_head">Closed</div>
                  </a>
                </div>
              </nav>
              </Scrollbars>   
              <div className="tab-content explore_tab_content mt-2" id="nav-tabContent">
                <div className="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab">
                  <div className="proposal_panel_overall">
                    <div className="proposal_panel">
                      <div class="badge badge_active">active</div>
                      <div className="proposal_panel_content">
                        <h3>Make custom NFT sites and marketplaces</h3>
                        <p><span>#eKbXq By 0xa15CDFF6... </span>end in 1 day</p>
                      </div>
                    </div>
                    
                    <div className="proposal_panel">
                      <div class="badge badge_active">active</div>
                      <div className="proposal_panel_content">
                        <h3>Suggested Improvements to the platform</h3>
                        <p><span>#eKbXq By 0xa15CDFF6... </span>end in 1 day</p>
                      </div>
                    </div>

                    <div className="proposal_panel">
                      <div class="badge badge_closed">Closed</div>
                      <div className="proposal_panel_content">
                        <h3>ActiveSpeed up the verification process for all creators</h3>
                        <p><span>#eKbXq By 0xa15CDFF6... </span>end in 1 day</p>
                      </div>
                    </div>

                    <div className="proposal_panel">
                      <div class="badge badge_pending">Pending</div>
                      <div className="proposal_panel_content">
                        <h3>Mystery Drop Integration</h3>
                        <p><span>#eKbXq By 0xa15CDFF6... </span>end in 1 day</p>
                      </div>
                    </div>

                    <div className="proposal_panel">
                      <div class="badge badge_pending">Pending</div>
                      <div className="proposal_panel_content">
                        <h3>Suggested Improvements to the platform</h3>
                        <p><span>#eKbXq By 0xa15CDFF6... </span>end in 1 day</p>
                      </div>
                    </div>

                    <div className="proposal_panel">
                      <div class="badge badge_closed">Closed</div>
                      <div className="proposal_panel_content">
                        <h3>Mystery Drop Integration</h3>
                        <p><span>#eKbXq By 0xa15CDFF6... </span>end in 1 day</p>
                      </div>
                    </div>

                  </div>
                </div>
                <div className="tab-pane fade" id="active" role="tabpanel" aria-labelledby="active-tab">
                  <div className="proposal_panel_overall">
                    <div className="proposal_panel">
                      <div class="badge badge_active">active</div>
                      <div className="proposal_panel_content">
                        <h3>Make custom NFT sites and marketplaces</h3>
                        <p><span>#eKbXq By 0xa15CDFF6... </span>end in 1 day</p>
                      </div>
                    </div>
                    
                    <div className="proposal_panel">
                      <div class="badge badge_active">active</div>
                      <div className="proposal_panel_content">
                        <h3>Suggested Improvements to the platform</h3>
                        <p><span>#eKbXq By 0xa15CDFF6... </span>end in 1 day</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="pending" role="tabpanel" aria-labelledby="pending-tab">
                  <div className="proposal_panel_overall">
                    <div className="proposal_panel">
                      <div class="badge badge_pending">Pending</div>
                      <div className="proposal_panel_content">
                        <h3>Mystery Drop Integration</h3>
                        <p><span>#eKbXq By 0xa15CDFF6... </span>end in 1 day</p>
                      </div>
                    </div>

                    <div className="proposal_panel">
                      <div class="badge badge_pending">Pending</div>
                      <div className="proposal_panel_content">
                        <h3>Suggested Improvements to the platform</h3>
                        <p><span>#eKbXq By 0xa15CDFF6... </span>end in 1 day</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab-pane fade" id="closed" role="tabpanel" aria-labelledby="closed-tab">
                  <div className="proposal_panel_overall">
                    <div className="proposal_panel">
                      <div class="badge badge_closed">Closed</div>
                      <div className="proposal_panel_content">
                        <h3>ActiveSpeed up the verification process for all creators</h3>
                        <p><span>#eKbXq By 0xa15CDFF6... </span>end in 1 day</p>
                      </div>
                    </div>
                    <div className="proposal_panel">
                      <div class="badge badge_closed">Closed</div>
                      <div className="proposal_panel_content">
                        <h3>Mystery Drop Integration</h3>
                        <p><span>#eKbXq By 0xa15CDFF6... </span>end in 1 day</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GridItem>
          </GridContainer>
          </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
