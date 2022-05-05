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

export default function CreateSingle(props) {
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
      <div className={classes.pageHeader + " inner_pageheader inner_page_padding_big"}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <div>
              <div>
              <Button className="btn btn_outline_new">Go Back</Button>
              </div>
                <h2 className="inner_title my-4">Create Multiple Collectible</h2>
              </div>
            </GridItem>
          </GridContainer>
        </div>
        <div className="container mt-4">
          <GridContainer>
            <GridItem xs={12} sm={4} md={3}>
              <label className="primary_label">Preview</label>
              <div className="masonry mb-3 mb-lg-0 craete_card">
              <div className="item item_multiple">
<div className="card_inner_item">
<div className="item_details_top">
  <p className="sold_text">Sold to @mikebasker</p>
  </div>
<div className="item_inner_img">
<img src={require("../assets/images/img-product2.png")} alt="Collections" className="img-fluid" />
</div>
<div className="item_details_bot">
<h2>The heap of the galaxy in the loop of Galaxy...</h2>
<div className="d-flex justify-content-between align-items-center">
<div className="media follow_media">
    <div className="img_tick_div">
    <span class="img_tick"><img src={require("../assets/images/large-profile-tick.png")} /></span>
    <img src={require("../assets/images/small-profile.png")} alt="User" className="img-fluid mr-2 img_user_new_sm" />

    </div>
      <div className="media-body flex_body">
      <p className="mt-0 media_text mt-0 mb-0">@artsindepth</p>
      </div>
    </div>
    <div>
    <h3 className="mb-0"><span>1.15 BNB</span> </h3>
      </div>
    </div>

</div>
</div>
</div>
                    </div>
            </GridItem>
            <GridItem xs={12} sm={8} md={9}>
              <form>
                <div className="form-row">
                  
                  <div className="form-group col-lg-6">

                  <div className="">
                      <div>
                        <label className="primary_label" htmlFor="inputEmail4">Upload file</label>
                        <p className="form_note">PNG, GIF, WEBP, MP4 or MP3. Max 100mb.</p>
                      </div>
                      <div className="file_btn grey_btn">Choose a file
                        <input className="inp_file" type="file" name="file"/>
                      </div>
                   </div>
                  
                    {/* <select className="form-control primary_inp custom-select">
                      <option>Enter price for one iteam</option>
                      <option>Enter price for one iteam 2</option>
                    </select> */}
                  
                  </div>
                  <div className="form-group col-lg-6">
                  <div className="">
                      <div>
                        <label className="primary_label" htmlFor="inputEmail4">Choose Collection</label>
                        <p className="form_note invisible d-none d-lg-block">PNG, GIF, WEBP, MP4 or MP3. Max 100mb.</p>

                      </div>
                      <Button className="grey_btn" data-toggle="modal" data-target="#choose_collection_modal">Create ERC - 721</Button>
                   </div>
                    </div>
                </div>

                <div className="form-row mt-3">
                  <div className="form-group col-xl-6">
                  <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <label className="primary_label" htmlFor="inputEmail4">Put on Sale</label>
                        <p className="form_note form_note_slider">You’ll receive bids on this item</p>
                      </div>
                      <label className="switch toggle_custom">
                        <input type="checkbox"/>
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="puton_sale_sec d-none">
                  <Scrollbars style={{ height: 180 }}>
                  <div className="colct_img_section">
                  <div className="card card_bl_grey mr-2">
                    <div className="card-body p-3">
                     <img src={require("../assets/images/price.svg")} class="img-fluid img_radius img_col_change" alt="Fixed Price"/>
                      <p className="colctn_card_txt mt-2">Fixed Price</p>

                    </div>
                  </div>
     
                  <div className="card card_bl_grey mr-2">
                    <div className="card-body p-3">
                     <img src={require("../assets/images/unlimited.svg")} class="img-fluid img_radius img_col_change" alt="Unlimited Auction"/>

                      <p className="colctn_card_txt">Unlimited Auction</p>

                    </div>
                  </div>
                
                  </div>
                  </Scrollbars>
                  </div>
                  <div className="fiexd_price_sec d-none">
                  <label className="primary_label" htmlFor="price">Price</label>

                  <div className="input-group input_grp_input_h mb-2 input_grp_style_sel">
                <input type="text" className="form-control bor_rit_rad" placeholder="0" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                <div className="input-group-append px-0">
                  <span className="input-group-text px-0" id="basic-addon2">
                  <select className="form-control custom-select selc_hg">
                     <option>Select</option>
                      <option>ETH</option>
                      <option>BTC</option>
                    </select>
                  </span>
                </div>
              </div>
              <p className="form_note form_note_slider">Service fee 2.5%<br/>
              You will receive ETH</p>
                  </div>


                    <div className="d-flex justify-content-between align-items-start mt-3">
                      <div>
                        <label className="primary_label" htmlFor="inputEmail4">Instant Sale Price</label>
                        <p className="form_note form_note_slider">Enter the price for which item will be instantly sold</p>
                      </div>
                      <label className="switch toggle_custom">
                        <input type="checkbox"/>
                        <span className="slider"></span>
                      </label>
                    </div>
                  
                  {/* <label className="primary_label" htmlFor="inputEmail4">Price</label>
                    <p className="form_note mb-0">Enter price to allow users instantly purchase your NFT</p>
                    <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Enter price for one item" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                    <div class="input-group-append">
                    <select className="form-control  custom-select selc_hg">
                      <option>WOOP</option>
                      <option>BTC</option>
                    </select>
                    </div>
                  </div> */}
                  </div>
                  <div className="form-group col-xl-6">
                  <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <label className="primary_label" htmlFor="inputEmail4">Unlock Once Purchased</label>
                        <p className="form_note form_note_slider">Content will be unlocked after<br/> successful transaction</p>
                      </div>
                      <label className="switch toggle_custom">
                        <input type="checkbox"/>
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="form-group unlock_des d-none">
                    <label className="primary_label" htmlFor="unlock">Unlock</label>
                      <input type="text" className="form-control" id="unlock" placeholder='Digital key, code to redeem or link to a file..'/>
                      <p className="form_note form_note_slider mt-2">Tip: Markdown syntax is supported</p>
                  
                  </div>
                    <div className="form-group">
                    <label className="primary_label" htmlFor="copies">No.of copies</label>
                    <input type="text" className="form-control" id="copies" placeholder='e.g. 10'/>
                  </div>
                  </div>
                </div>
               
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="primary_label" htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" placeholder='e.g. Vibraniums'/>
                  </div>
                  <div className="form-group col-md-6">
                    <label className="primary_label" htmlFor="name">Royalty</label>
                    <div className="inp_grp">
                      <input type="text" className="form-control" id="name" placeholder='e.g. 10%'/>
                      <p className="inp_append">%</p>
                    </div>
                  </div>
                  
                </div>

                <div className="form-row">
                <div className="form-group col-md-6">
                    <label className="primary_label" htmlFor="desccription">Description </label>
                    <input type="text" className="form-control" id="desccription" placeholder='Description about your NFTs'/>
                  </div>
                  <div className="form-group col-md-6">
                    <label className="primary_label" htmlFor="category">Category</label>
                    {/* <input type="text" className="form-control" id="category" placeholder='e.g. "size"'/> */}
                    <div class="input-group mb-3 input_grp_style_1 single_option_grp">
                    {/* <input type="text" id="bid" class="form-control primary_inp" placeholder="" aria-label="bid" aria-describedby="basic-addon2" /> */}
                      <span class="input-group-text w-100" id="basic-addon2">
                      {/* <img src={require("../assets/images/arrow_circle.png")} alt="Collections" className="img-fluid selct_arrow_pos" /> */}

                      <select class="form-control" id="exampleFormControlSelect1">
                        <option>Select</option>
                        <option>ETH</option>
                      
                      </select>
                      </span>
                  </div>
                  </div>
                </div>
                <div className="form-row">
              
                  <div className="form-group col-md-6">
                    <label className="primary_label" htmlFor="desccription">Properties</label>
                    <input type="text" className="form-control" id="desccription" placeholder='Optionals'/>
                  </div>
                  <div className="form-group col-md-6">
                  <div>
                  <Button className="connect_btn craete_item_btn" data-toggle="modal" data-target="#create_item_modal">Create item</Button>
                </div>
                  </div>
                </div>
              
              </form>
            </GridItem>
          </GridContainer>
        </div>
      </div>
      <Footer/>

      {/* Choose Collection Modal */}
      <div class="modal fade primary_modal" id="choose_collection_modal" tabindex="-1" role="dialog" aria-labelledby="choose_collection_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="modal-title" id="choose_collection_modalLabel">Collection</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body pt-2">
              <div className="d-flex align-items-center">
              <div className="creat_logo_re mr-2">
                <img src={require("../assets/images/img_01.png")} alt="logo" className="img-fluid"/>
                </div>
                {/* <img src={require("../assets/images/img_01.png")} alt="logo" className="img-fluid mr-2"/> */}
                <div>
                  <p className="form_note font_600 line_20 mb-2">We recommend an image of at least 400x400. Gifs work too.</p>
                  <div className="file_btn grey_btn_sm">Choose a file
                        <input className="inp_file" type="file" name="file"/>
                      </div>
                  {/* <div className="file_btn primary_btn btn_white d-inline-block">Choose File
                    <input className="inp_file" type="file" name="file"/>
                  </div> */}
                </div>
              </div>
              <form>
                <div className="form-row mt-4">
                  <div className="form-group col-md-12 mb-2">
                    <label className="primary_label pl_font_sm" htmlFor="name">Display Name <span className="text-muted">(30 available)</span></label>
                    <input type="text" className="form-control" id="name" placeholder="Enter token name"/>
                  </div>
                  <div className="form-group col-md-12 mb-2">
                    <label className="primary_label pl_font_sm" htmlFor="desccription">Symbol <span className="text-muted">(required)</span></label>
                    <input type="text" className="form-control" id="desccription" placeholder="Enter token symbol"/>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-12 mb-2">
                    <label className="primary_label pl_font_sm" htmlFor="name">Description <span className="text-muted">(Optional)</span></label>
                    <input type="text" className="form-control" id="name" placeholder="Spread some words about token collection"/>                  
                  </div>
                  <div className="form-group col-md-12 mb-2">
                    <label className="primary_label pl_font_sm" htmlFor="desccription">Short url</label>
                    <input type="text" className="form-control" id="desccription" defaultValue="Company/Enter URL"/>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <Button className="primary_btn btn-block">Create Collection</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Create Item Modal */}
      <div class="modal fade primary_modal" id="create_item_modal" tabindex="-1" role="dialog" aria-labelledby="create_item_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="modal-title" id="create_item_modalLabel">Follow Steps</h5>
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
              <Button className="primary_btn btn-block">Done</Button>                
              </div>
              <div className="media approve_media">
            <i className="fas fa-check mr-3 pro_initial" aria-hidden="true"></i>
              {/* <i className="fas fa-check mr-3 pro_complete" aria-hidden="true"></i> */}
              {/* <i className="fas fa-check mr-3 pro_incomplete" aria-hidden="true"></i> */}
              {/* <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i> */}
              <div className="media-body">
                <p className="mt-0 approve_text">Upload files & Mint token</p> 
                <p className="mt-0 approve_desc">Call contract method</p>
              </div>
            </div>
              <div className="text-center my-3">
              <Button className="primary_btn btn-block">Start</Button>                
              </div>

              <div className="media approve_media">
             {/* <i className="fas fa-check mr-3 pro_initial" aria-hidden="true"></i> */}
       {/* <i className="fas fa-check mr-3 pro_complete" aria-hidden="true"></i> */}
       <i className="fas fa-check mr-3 pro_incomplete" aria-hidden="true"></i>
       {/* <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i> */}
              <div className="media-body">
                <p className="mt-0 approve_text">Sign sell order</p> 
                <p className="mt-0 approve_desc">Sign sell order using tour wallet</p>
              </div>
            </div>
              <div className="text-center my-3">
              <Button className="primary_btn btn-block" disabled>Start</Button>                
              </div>

              <div className="media approve_media">
             {/* <i className="fas fa-check mr-3 pro_initial" aria-hidden="true"></i> */}
       {/* <i className="fas fa-check mr-3 pro_complete" aria-hidden="true"></i> */}
       {/* <i className="fas fa-check mr-3 pro_incomplete" aria-hidden="true"></i> */}
       <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i>
              <div className="media-body">
                <p className="mt-0 approve_text">Sign lock order</p> 
                <p className="mt-0 approve_desc">Sign lock order using tour wallet</p>
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
   {/* place_bid multiple */}
   <div class="modal fade primary_modal" id="place_bid_multiple_modal" tabindex="-1" role="dialog" aria-labelledby="place_bid_multiple_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="modal-title" id="place_bid_multiple_modalLabel">Place a bid</h5>
              <p className="text-center place_bit_desc">You are about to place a bid for</p>
              <p className="text_grey_clickb mb-0">0x0dsleowdslsaldjfldssh213221</p>
              <p className="place_bit_desc_2">by Xrteprt</p>
                          
              
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body px-0 pt-0">
              <form className="px-4 bid_form">
            <label for="bid">Your bid</label>
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

        <label for="qty">Enter quantity <span className="label_muted pl-2">(30 available)</span></label>
            <div class="mb-3 input_grp_style_1">
          <input type="text" id="qty" class="form-control" placeholder="1"  />
         
        </div>
              
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
      {/* end place_bid modal multiple */}
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
