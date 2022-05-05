import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Button, Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import styled from "../../node_modules/styled-components";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';
import isEmpty from "lib/isEmpty";
import config from '../lib/config'
import {
	getFollowers
} from '../actions/v1/user';
import { useState } from "react";
import { getMyActivity, getCurAddr } from '../actions/v1/user'

const Icon = styled(props => (
  <div {...props}>
    <div className="minus">-</div>
    <div className="plus">+</div>
  </div>
))`
  & > .plus {
    display: block;
    color: #3d2524;
    font-size: 24px;
  }
  & > .minus {
    display: none;
    color: #3d2524;
    font-size: 24px;
  }
  .Mui-expanded & > .minus {
    display: flex;
  }
  .Mui-expanded & > .plus {
    display: none;
  }
`;

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
	window.scrollTo(0, 0);
  return null;
}

export default function Activity(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const [expanded, setExpanded] = React.useState('panel1');
  const [followList, setFollowList ] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const handleChangeFaq = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(()=> {
	getfollowers()
	getfollowing();
  },[])

  const getfollowers = async () => {
	const currAddr =  window.web3.eth.defaultAccount
	let reqData = {
		curraddress :currAddr,
		tab : "follower"
	}
	var data = await getFollowers(reqData);
	// //("following lisisisisisit",data.follower.list);
	if (data && data.follower && !isEmpty(data.follower.list)) {
		setFollowList(data.follower.list[0]);
	}
}

const getfollowing = async () => {
	const currAddr =  window.web3.eth.defaultAccount;
	let reqData = {
		curraddress :currAddr,
		tab : "following"
	}
	var data = await getFollowers(reqData);
	// //("follower lisisisisisit",data.follower.list);
	if (data && data.follower && !isEmpty(data.follower.list)) {
		setFollowingList(data.follower.list[0]);
	}
}
    const [myActivity, setMyActivity] = React.useState([]);
    const getActivity = async(curAddr) =>{
    var curAddr = await getCurAddr();
    var myActivity = await getMyActivity(curAddr);
    setMyActivity(myActivity.result)
    // //("Activity data "+JSON.stringify(myActivity.result))
  }
  useEffect(() => {
    getActivity();
  }, []);
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
      <ScrollToTopOnMount/>
      <div className={classes.pageHeader + " inner_pageheader inner_page_padding_big"}>
        <div>
        <div className={classes.container}>
          <div className="row justify-content-center">
            {/* <div className="col-12 col-md-5 col-lg-3 activity_left_col">
            <h2 className="heading_black_main fol_txct_blk">Activity</h2>
            <p className="fiter_ac_tect">Filters</p>
            <div className="card activty_card filter_card my-3">
          <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label className="primary_label mb-0" htmlFor="listing">Listing</label>
          </div>
          <label className="switch toggle_custom">
            <input type="checkbox"/>
            <span className="slider"></span>
          </label>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label className="primary_label mb-0" htmlFor="purchase">Purchase</label>
          </div>
          <label className="switch toggle_custom">
            <input type="checkbox"/>
            <span className="slider"></span>
          </label>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label className="primary_label mb-0" htmlFor="sales">Sales</label>
          </div>
          <label className="switch toggle_custom">
            <input type="checkbox"/>
            <span className="slider"></span>
          </label>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label className="primary_label mb-0" htmlFor="transfers">Transfers</label>
          </div>
          <label className="switch toggle_custom">
            <input type="checkbox"/>
            <span className="slider"></span>
          </label>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label className="primary_label mb-0" htmlFor="burns">Burns</label>
          </div>
          <label className="switch toggle_custom">
            <input type="checkbox"/>
            <span className="slider"></span>
          </label>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label className="primary_label mb-0" htmlFor="bids">Bids</label>
          </div>
          <label className="switch toggle_custom">
            <input type="checkbox"/>
            <span className="slider"></span>
          </label>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label className="primary_label mb-0" htmlFor="likes">Likes</label>
          </div>
          <label className="switch toggle_custom">
            <input type="checkbox"/>
            <span className="slider"></span>
          </label>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label className="primary_label mb-0" htmlFor="following">Following</label>
          </div>
          <label className="switch toggle_custom">
            <input type="checkbox"/>
            <span className="slider"></span>
          </label>
        </div>
            </div>
            </div>

            </div> */}
            <div className="col-12 col-md-6 col-lg-5 activity_right_col">
            <Scrollbars style={{ height: 130 }} className="tab_style_texg">
              <nav className="masonry_tab_nav mt-4 pb-0 items_tab_outer">
      <div className="nav nav-tabs masonry_tab primary_tab items_tab activity_tab_with" id="nav-tab" role="tablist">
        <a className="nav-link active" id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all" aria-selected="true">
        <div class="tab_head"> All</div>
          </a>                 
        
          <a className="nav-link" id="following-tab" data-toggle="tab" href="#following" role="tab" aria-controls="following" aria-selected="false">
          <div class="tab_head">Following</div>
          </a>
          <a className="nav-link" id="activity-tab" data-toggle="tab" href="#activity" role="tab" aria-controls="activity" aria-selected="false">
          <div class="tab_head">My Activity</div>
          </a>
      </div>
    </nav>
    </Scrollbars>
    <div className="tab-content explore_tab_content mt-2" id="nav-tabContent">
      <div className="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab">
         <div className="proposal_panel_overall">                 
            <div className="card activty_card my-3">
            <div className="card-body px-3">
            <div className="media follow_media activity_media_full">
            <div className="img_tick_div">
            <div className="img_prgo_re_1 mr-3">
            <img src={require("../assets/images/collection_02.png")} alt="User" className="img-fluid img_user_new" />
            </div>

            </div>
            <div className="media-body flex_body">
            <div>
            <p className="mt-0 media_text mb-2">CryptoManiact</p>
            <p className="mt-0 media_num mt-0">liked by <span className="media_text">Cryptoer</span></p>

            </div>

            </div>
            </div>
            </div>
            </div>

          

        </div>
      </div>                
    
      <div className="tab-pane fade" id="following" role="tabpanel" aria-labelledby="following-tab">
      <div className="proposal_panel_overall"> 
	  {
		  followingList.users && followingList.users.map((list,index) => 
			<div className="card activty_card my-3" key={index}>
				<div className="card-body px-3">
					<div className="media follow_media activity_media_full">
						<div className="img_tick_div">
							<div className="img_prgo_re_1 mr-3">
								<img src={`${config.Back_URL}/images/${list._id}/${list.image}`} alt="User" className="img-fluid img_user_new" />
							</div>
						</div>
						<div className="media-body flex_body">
							<div>
								<p className="mt-0 media_text mb-2">{list.name}</p>
								<p className="mt-0 media_num mt-0">You followed</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		  )
	  }                
            
        </div>
      </div>
      <div className="tab-pane fade" id="activity" role="tabpanel" aria-labelledby="activity-tab">
      <div className="proposal_panel_overall"> 
       {myActivity.map((item)=>{
         return(
          <div className="card activty_card my-3">
          <div className="card-body px-3">
          <div className="media follow_media activity_media_full">
          <div className="img_tick_div">
          <div className="img_prgo_re_1 mr-3">
          <img src={require("../assets/images/collection_02.png")} alt="User" className="img-fluid img_user_new" />
          </div>

          </div>
          <div className="media-body flex_body">
          <div>
          <p className="mt-0 media_text mb-2 word_brak_text">{item.from}</p>
          <p className="mt-0 media_num mt-0">liked by <span className="media_text">Cryptoer</span></p>

          </div>

          </div>
          </div>
          </div>
          </div>

         )
       })}                
           
        </div>
      </div>
    </div>
  
  
              </div>
          </div>
         
        </div>
        </div>
      
      </div>
      </div>
      <Footer/>
    </div>
  );
}
