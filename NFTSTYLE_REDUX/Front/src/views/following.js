import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";

import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link } from "react-router-dom";
import { useState } from "react";
import isEmpty from "lib/isEmpty";
import config from '../lib/config'
import {
	getFollowers
} from '../actions/v1/user';
import { CollectiblesList_Follow } from "actions/v1/token";
import Avatars from "./Avatar";
import TokenItem from '../views/separate/Token-Item'
import ConnectWallet from "./separate/Connect-Wallet";
import { useSelector } from 'react-redux';
const dashboardRoutes = [];

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return null;
}

export default function LikedItems(props) {
	const classes = useStyles();
	const { ...rest } = props;
	const [expanded, setExpanded] = React.useState('panel1');
	const Wallet_Details = useSelector(state => state.wallet_connect_context);
	const handleChangeFaq = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};
	const [followingList, setFollowingList] = useState([]);
	const [collectibles, setCollectibles] = useState([]);
	const [filter, setFilter] = useState('');
	const [tokenValues, settokenValues] = React.useState("");
	
	const [AddressUserDetails, Set_AddressUserDetails] = useState({});
	const [Accounts, Set_Accounts] = useState('');
	const [MyItemAccountAddr, Set_MyItemAccountAddr] = useState('');
	const [MyItemAccountAddr_Details, Set_MyItemAccountAddr_Details] = useState({})
	const [BuyOwnerDetailFirst, Set_BuyOwnerDetailFirst] = useState({});
	const [MyTokenDetail, Set_MyTokenDetail] = useState({});
	const [UserAccountAddr, Set_UserAccountAddr] = useState(Wallet_Details.UserAccountAddr);
	const [UserAccountBal, Set_UserAccountBal] = useState(Wallet_Details.UserAccountBal);
	const [Service_Fee, set_Service_Fee] = useState(0);
	const [Wen_Bln, set_Wen_Bln] = useState(0);
	const [providerss, set_providers] = useState(null)
	const [WalletConnected, Set_WalletConnected] = useState('false');
	
	const [convertVal, setConvertVal] = React.useState(0);

	useEffect(() => {

		getfollowing();

	}, [UserAccountAddr])
	const getfollowing = async (filterParam) => {
		// //(filterParam);
		const addr = UserAccountAddr;
		var resp = await CollectiblesList_Follow({
			target: 'follower',
			addr: addr,
			// follower : addr,
			// filterParam : filterParam
		});
		//   //(">>>>Resp", resp);
		if (resp.data && resp.data.list) {
			setCollectibles(resp.data.list)
		}
		else {
			setCollectibles([])
		}
	}
	const AfterWalletConnected = () => { }

	return (
		<div className="home_header">
			{/* <ConnectWallet
				Set_UserAccountAddr={Set_UserAccountAddr}
				Set_UserAccountBal={Set_UserAccountBal}
				Set_WalletConnected={Set_WalletConnected}
				Set_AddressUserDetails={Set_AddressUserDetails}
				Set_Accounts={Set_Accounts}
				WalletConnected={WalletConnected}
				set_Service_Fee={set_Service_Fee}
				Service_Fee={Service_Fee}
				AfterWalletConnected={AfterWalletConnected}
				Wen_Bln={Wen_Bln}
				set_Wen_Bln={set_Wen_Bln}
				setConvertVal={setConvertVal}
				convertVal={convertVal}
				set_providers={set_providers}
				providerss={providerss}
			/> */}
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
				<div className={classes.pageHeader + " inner_pageheader"}>


					<section className="section">

						<div className="container">
							<div className="mt-3">
								<div className="card card_light_grey">
									<div className="card-body pt-4 px-0">
										<div className="d-flex justify-content-between flex_start align-items-center">
											<h2 className="heading_black_main fol_txct_blk">Following</h2>
											{/* <div class="dropdown">
				<button class="btn btn-secondary dropdown-toggle filter_btn filter_btn_folw" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				Filters
				</button> */}
											{/* <div class="dropdown-menu filter_menu fole_menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
				<ul className="colors_ul">
				<li>
				<span onClick={() => setFilterFun('recentlyadded') }>Recently Added</span>
				</li>
				<li>
				<span onClick={() => setFilterFun('highestprice') }>Highest Price</span>
				</li>  
				<li>
				<span onClick={() => setFilterFun('mostliked') }>Most Liked</span>
				</li>  
				<li>
				<span onClick={() => setFilterFun('cheapest') }>Cheapest</span>
				</li>                               
			</ul>
				</div> */}
											{/* </div> */}
										</div>

										<div className="row mt-4 mx-0-xs">
											{
												collectibles && collectibles.map((item) =>
													<div className="col-12 col-sm-6 col-lg-4 col-xl-3 masonry mb-4 mb-lg-4">
														<TokenItem
															item={item}
															UserAccountAddr={UserAccountAddr}
															UserAccountBal={UserAccountBal}
															WalletConnected={WalletConnected}
														/>
													</div>
												)
											}


										</div>

									</div>
								</div>
							</div>
						</div>
					</section>



				</div>
			</div>
			<Footer />
			{/* place_bid Modal */}
			<div class="modal fade primary_modal" id="place_bid_modal" tabindex="-1" role="dialog" aria-labelledby="place_bid_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="place_bid_modalLabel">Place a bid</h5>
							<p className="text-center place_bit_desc">You are about to place a bid for</p>
							<p className="text_grey_clickb mb-0">0x0dsleowdslsaldjfldssh213221</p>
							<p className="place_bit_desc_2">by Xrteprt</p>


							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body px-0 pt-0">
							<form className="px-4 bid_form">
								<label for="bid">Your Bid</label>
								<div class="input-group mb-3 input_grp_style_1">
									<input type="text" id="bid" class="form-control primary_inp" placeholder="" aria-label="bid" aria-describedby="basic-addon2" />
									<div class="input-group-append">
										<span class="input-group-text" id="basic-addon2">
											{/* <img src={require("../assets/images/arrow_circle.png")} alt="Collections" className="img-fluid selct_arrow_pos" /> */}

											<select class="form-control" id="exampleFormControlSelect1">
												<option>BNB</option>
												<option>ETH</option>

											</select>
										</span>
									</div>
								</div>

								{/* <label for="qty">Enter quantity <span className="label_muted pl-2">(30 available)</span></label>
			<div class="mb-3 input_grp_style_1">
		<input type="text" id="qty" class="form-control" placeholder="1"  />
		
		</div> */}
								<div className="row pb-2">
									<div className="col-12 col-sm-6">
										<p className="buy_desc_sm">Your balance</p>
									</div>
									<div className="col-12 col-sm-6 text-sm-right">
										<p className="buy_desc_sm_bold">12 BNB</p>
									</div>
								</div>
								<div className="row pb-2">
									<div className="col-12 col-sm-6">
										<p className="buy_desc_sm">Your bidding amount</p>
									</div>
									<div className="col-12 col-sm-6 text-sm-right">
										<p className="buy_desc_sm_bold">2.21232 BNB</p>
									</div>
								</div>
								<div className="row pb-2">
									<div className="col-12 col-sm-6">
										<p className="buy_desc_sm">Service fee</p>
									</div>
									<div className="col-12 col-sm-6 text-sm-right">
										<p className="buy_desc_sm_bold">0.000002 BNB</p>
									</div>
								</div>
								<div className="row pb-2">
									<div className="col-12 col-sm-6">
										<p className="buy_desc_sm">You will pay</p>
									</div>
									<div className="col-12 col-sm-6 text-sm-right">
										<p className="buy_desc_sm_bold">2.3000002 BNB</p>
									</div>
								</div>

								<div className="text-center mt-3">
									<Button className="primary_btn btn-block" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#proceed_bid_modal">Place a bid</Button>

								</div>

							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end place_bid modal */}
			{/* proceed_bid Modal */}
			<div class="modal fade primary_modal" id="proceed_bid_modal" tabindex="-1" role="dialog" aria-labelledby="proceed_bid_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
					<div class="modal-content">
						<div class="modal-header text-center">
							<h5 class="modal-title" id="proceed_bid_modalLabel">Follow Steps</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<form>
								<div className="media approve_media">
									{/* <i className="fas fa-check mr-3 pro_initial" aria-hidden="true"></i> */}
									<i className="fas fa-check mr-3 pro_complete" aria-hidden="true"></i>
									{/* <i className="fas fa-check mr-3 pro_incomplete" aria-hidden="true"></i> */}
									{/* <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i> */}
									<div className="media-body">
										<p className="mt-0 approve_text">Approve</p>
										<p className="mt-0 approve_desc">Checking balance and approving</p>
									</div>
								</div>
								<div className="text-center my-3">
									<Button className="primary_btn btn-block">Start</Button>
								</div>
								<div className="media approve_media">
									<i className="fas fa-check mr-3 pro_initial" aria-hidden="true"></i>
									{/* <i className="fas fa-check mr-3 pro_complete" aria-hidden="true"></i> */}
									{/* <i className="fas fa-check mr-3 pro_incomplete" aria-hidden="true"></i> */}
									{/* <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i> */}
									<div className="media-body">
										<p className="mt-0 approve_text">Signature</p>
										<p className="mt-0 approve_desc">Create a signatute to place a bid</p>
									</div>
								</div>
								<div className="text-center mt-3">
									<Button className="primary_btn btn-block" disabled>Start</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			{/* end proceed_bid modal */}
		</div>
	);
}
