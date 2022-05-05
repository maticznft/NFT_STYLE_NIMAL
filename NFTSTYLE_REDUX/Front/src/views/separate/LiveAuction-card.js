import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, TextField } from '@material-ui/core';
import Countdown from "react-countdown";

import config from '../../lib/config';
import isEmpty from '../../lib/isEmpty';

import { TwitterIcon, FacebookIcon, FacebookShareButton, FacebookShareCount, TwitterShareButton, TelegramShareButton, WhatsappShareButton } from 'react-share'
import Avatars from "views/Avatar";
import ReactPlayer  from "react-player";
import LazyLoad from 'react-lazyload';
import LazyLoader from '../lazyloader'
export default function TokenItem(props) {
  
    var {
        item,
        LikedTokenList,
        hitLike,
        UserAccountAddr,
        UserAccountBal,
        PutOnSale_Click,
        PurchaseNow_Click,
        Burn_Click,
        CancelOrder_Click,
        WalletConnected
    } = props;

    const renderer = ({ days, Month, Year, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span></span>
        } else {
            return <span>{days}d  {hours}h {minutes}m {seconds}s left</span>;
        }
    };

    return (
        (item.tokenowners_current) ?
       
       
                 
   <div className="masonry">
   <div className="item">
<div className="card_inner_item">
{(item.tokenowners_current
                    &&item.tokenowners_current.tokenCreator != item.tokenowners_current.tokenOwner)
                    && item.tokenowners_current.tokenPrice == 0 
                    &&  <div className="item_details_top">
                            <p className="sold_text">Sold to {item.tokenOwnerInfo.name!=''?item.tokenOwnerInfo.name:(item.tokenOwnerInfo.curraddress).slice(0,8).concat('....')}</p>
                          </div>   } 
<div className="item_inner_img">

<Link to={"/info/" + item.tokenCounts}>
<LazyLoad height={200} placeholder={<LazyLoader/>} offset={[-200, 0]} debounce={500}>  
                             {/* <video src={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" alt="Collections" className="img-fluid" autoPlay muted controls playsInline loop /> */}
                              
                            {
                               item.image!=""&&( item.image.split('.').pop() == "mp4" ?
                            //    <video className="video-container img-fluid video-container-overlay" autoPlay loop muted controls playsInline data-reactid=".0.1.0.0" alt="Collections">
                            //     <source type="video/mp4" data-reactid=".0.1.0.0.0" src={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}/>
                            //    </video>
                            // <ReactPlayer  playing={true}  url={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}
                            // loop={true}
                            // controls={true}
                            // muted={true}
                            // playsinline={true}/> 

                            <video
                            id="my-video"
                            class="img-fluid"
                            autoPlay playsInline loop
                            preload="auto"
                            // width="640"
                            // height="264"
                            poster={item.ipfsimage!=""?`${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}
                            data-setup="{}"
                            >   
                            <source src={item.ipfsimage!=""?`${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" />
                           </video>:
                                    <img src={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid "  />
                               )}
                            
                            </LazyLoad>
                        </Link>
</div>
<div className="item_details_bot">
{(item && item.clocktime != null && item.endclocktime != null) ?
                    ( new Date(item.endclocktime) > Date.now() ) ?
                    <div>
                                
                                <badge className="badge badge-dark badge-timer mb-3">
                                    <Countdown 
                                    // date={Date.now()+100000000000}
                                    date={new Date(item.endclocktime)}
                                        autoStart={true}
                                        onStart={() => new Date(item.clocktime)}
                                        renderer={renderer}
                                    >
                                    </Countdown>
                                    <i class="fas fa-fire ml-2"></i>
                                </badge>
                               
                              </div>
                              :<p className="pl-2 times_text">Timed Auction Completed</p>
                              : ('')} 
                    <Link to={"/info/" + item.tokenCounts}>
                     <h2>{item.tokenName}</h2></Link>
<div className="d-flex justify-content-between align-items-center">
<div className="media follow_media">
<div className="img_tick_div">
<span class="img_tick"><img src={require("../../assets/images/large-profile-tick.png")} /></span>


 {/* owner */}
                                    {/*creator  */}
                                    <div class="d-flex creators_details">   
                    {
                    item
                    &&item.tokenOwnerInfo                  
                    &&item.tokenOwnerInfo.curraddress != ""  
                    &&
                    <a href={item.tokenOwnerInfo.customurl!=""?`${config.Front_URL}/${item.tokenOwnerInfo.customurl}`:`${config.Front_URL}/user/${item.tokenOwnerInfo.curraddress}`} data-toggle="tooltip" data-placement="top" title={`Owner : ${item.tokenOwnerInfo.name!=""?item.tokenOwnerInfo.name:item.tokenOwnerInfo.curraddress}`}>
                       {item.tokenOwnerInfo.image!=""? <img src={`${config.Back_URL}/images/${item.tokenOwnerInfo._id}/${item.tokenOwnerInfo.image}`} alt="Owner" className="img-fluid align-self-center" />:
                       <div className="img-fluid align-self-center">
                           <Avatars item={item.tokenOwnerInfo.curraddress}/>
                       </div>}

                    </a>
                    
                    }
                    {/* owner */}
                        {/* {
                        item
                        && item.type == 1155
                        && item.tokenowners_current_count
                        && item.tokenowners_current_count.count
                        && item.tokenowners_current_count.count > 1
                        ?
                            ('')
                        :
                            (!isEmpty(item.tokenOwnerInfo) && item.tokenOwnerInfo.curraddress && item.tokenOwnerInfo.image)
                            ?
                           
                                <a href={`${config.Users_URL}/${item.tokenOwnerInfo.curraddress}`} title={`Owner : ${item.tokenOwnerInfo.name}`}>
                                    <img src={`${config.Back_URL}/images/${item.tokenOwnerInfo._id}/${item.tokenOwnerInfo.image}`} alt="Owner" className="img-fluid align-self-center" />
                                </a>
                                
                            :
                            
                                <a href={`${config.Front_URL}/user/${item.tokenowners_current.tokenOwner}`} title={`Owner : ${item.tokenowners_current.tokenOwner}`}>
                                    <div className="img-fluid align-self-center">
                           <Avatars item={item.tokenOwnerInfo.curraddress}/>
                            </div>
                                </a>
                                 
                                 
                                
                    } */}
                        </div>


{/* <img src={require("../assets/images/small-profile.png")} alt="User" className="img-fluid mr-2 img_user_new_sm" /> */}
{/* <div class="d-flex creators_details"> */}
  {/* <a href="#" title="User1">
    <img src={require("../../assets/images/user_01.png")} alt="User" className="img-fluid align-self-center" />
    </a> 
    <a href="#" title="User1">
   <img src={require("../../assets/images/user_02.png")} alt="User" className="img-fluid align-self-center" />
   </a>
    */}
    
   {/* </div> */}
</div>
  <div className="media-body flex_body">
  <p className="mt-0 media_text mt-0 mb-0 ml-2"  style={{"wordBreak":"break-all"}} title={item.tokenOwnerInfo.name!=""?item.tokenOwnerInfo.name:(item.tokenowners_current.tokenOwner)}>@{item.tokenOwnerInfo.name!=""?item.tokenOwnerInfo.name:((item.tokenowners_current.tokenOwner).slice(0,8).concat('....'))}</p>
  </div>
</div>
<div>
<h3 className="mb-0"><span>{(
                        //     item.PutOnSale == true 
                        // && item.PutOnSaleType=='FixedPrice' 
                        // && 
                        item
                        &&item.tokenowners_current
                        &&item.tokenowners_current.tokenPrice > 0) 
                        && <span>{item.tokenowners_current.tokenPrice} {config.currencySymbol} </span>}
                        {
                        // (
                        //     item.PutOnSale == true 
                        //     && item.PutOnSaleType=='TimedAuction') 
                        item
                        &&item.clocktime!=null
                        &&item.endclocktime!=null
                        &&item.minimumBid
                        &&item.minimumBid!=0
                        && <span>Minimum Bid {item.minimumBid} {config.tokenSymbol} </span>}
                        {/* {(
                            item.PutOnSale == true 
                            && item.PutOnSaleType=='UnLimitedAuction'
                            ) && <span>Open For Bid</span>} */}
                        {item&&item.tokenowners_current&&item.tokenowners_current.balance} of {item&&item.tokenowners_current&&item.tokenowners_current.quantity}</span> </h3>
  </div>
</div>

</div>
</div>
</div>
</div>

            : ('')
    )
}