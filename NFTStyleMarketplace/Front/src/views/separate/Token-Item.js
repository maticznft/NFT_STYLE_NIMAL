import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import config from '../../lib/config';
import isEmpty from '../../lib/isEmpty';
import Avatars from "views/Avatar";
import ReactPlayer from 'react-player'
import LazyLoad from 'react-lazyload';
import LazyLoader from "../lazyloader";
export default function TokenCard(props) {
    async function showAllwithPro(data) {
    }
    async function buyToken() {
        //('buyToken')
    }
    var {
			item,
			UserAccountAddr,
			} = props;
    const renderer = ({ days, Month, Year, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span></span>
        } else {
            return <span>{days}d  {hours}h {minutes}m {seconds}s left</span>;
        }
    };
   
    //console.log("dunewaiufnuiewnfuionf",item)
    const checkerror = (e,item) => {
        e.target.src = `${config.IPFS_IMG}/${item.ipfsimage}`
        //console.log("fbsjuenbigbisbgi",e.target.src)
    }
    return (
        (item.tokenowners_current) ?

            <div className="item">
                <div className="card_inner_item">
                    {/* <div className="item_details_top">
<p className="sold_text">Sold to @mikebasker</p>
</div>            */}
                    {(item.tokenowners_current
                        && item.tokenowners_current.tokenCreator != item.tokenowners_current.tokenOwner)
                        && item.tokenowners_current.tokenPrice == 0
                        && <div className="item_details_top">
                            <p className="sold_text">Sold to {item.tokenOwnerInfo.name != '' ? item.tokenOwnerInfo.name : (item.tokenOwnerInfo.curraddress).slice(0, 8).concat('....')}</p>
                        </div>}


                    <div className="item_inner_img">
                        <Link to={"/info/" + item.tokenCounts}>
                            <LazyLoad height={200} placeholder={<LazyLoader />} offset={[-200, 0]} debounce={500}>
                                {
                                    item.image != "" && (item.image.split('.').pop() == "mp4" ?
                                        <video
                                            id="my-video"
                                            class="img-fluid"
                                            autoPlay playsInline loop muted
                                            preload="auto"
                                        >
                                            <source src={item.additionalImage == "" ? `${config.Back_URL}/compressedImage/${item.tokenCreator}/${item.image}` : `${config.Back_URL}/nftImg/${item.tokenCreator}/${item.additionalImage}`} type="video/mp4" />
                                        </video>
                                        :
                                        <img src={(item.additionalImage == "" ? `${config.Back_URL}/compressedImage/${item.tokenCreator}/${item.image}` : `${config.Back_URL}/nftImg/${item.tokenCreator}/${item.additionalImage}`)} onError={(e)=>checkerror(e,item)} alt="Collections" className="img-fluid " />
                                    )}

                            </LazyLoad>
                        </Link>
                    </div>


                    <div className="item_details_bot">
                        {(item && item.clocktime != null && item.endclocktime != null) ?
                            (new Date(item.endclocktime) > Date.now()) ?
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
                                : <p className="pl-2 times_text">Timed Auction Completed</p>
                            :
                            <div class="text-center">

                                <p className="pl-2 times_text mybadge-timer m-auto">
                                    {(
                                        item
                                        && item.tokenowners_current
                                        && item.tokenowners_current.tokenPrice > 0)
                                        ? 'OnSale'
                                        : 'Open For Bid'
                                    }
                                </p>

                            </div>
                        }
                        <Link to={"/info/" + item.tokenCounts}>
                            <h2>{item.tokenName}</h2>
                            </Link>
                            
                        {item.tokenowners_current.tokenOwner == UserAccountAddr && <h4 className="text-left">My Collections</h4>}
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="media follow_media">
                                <div className="img_tick_div">
                                    <div class="d-flex creators_details">
                                        {
                                            // item
                                            //     && item.type == 1155
                                            //     && item.tokenowners_current
                                            //     && item.tokenowners_current_count
                                            //     && item.tokenowners_current_count.count
                                            //     && item.tokenowners_current_count.count > 1
                                            //     ?
                                            //     <a href={item.tokenOwnerInfo.customurl != "" ? `${config.Front_URL}/${item.tokenOwnerInfo.customurl}` : `${config.Front_URL}/user/${item.tokenOwnerInfo.curraddress}`} data-toggle="tooltip" data-placement="top" 
                                            //     title={`Owner : ${item.tokenOwnerInfo.name != "" ? item.tokenOwnerInfo.name : item.tokenOwnerInfo.curraddress}`}>
                                            //     {
                                            //         item.tokenOwnerInfo 
                                            //         &&(item.tokenOwnerInfo.image != ""
                                            //             ?
                                            //             <img src={`${config.Back_URL}/images/${item.tokenOwnerInfo._id}/${item.tokenOwnerInfo.image}`} alt="Owner" className="img-fluid align-self-center" />

                                            //             :
                                            //                   <Avatars classValue="img-fluid align-self-center" />)    
                                            //     }
                                            //     </a>
                                            //     :
                                                <a href={item.tokenOwnerInfo.customurl != "" ? `${config.Front_URL}/${item.tokenOwnerInfo.customurl}` : `${config.Front_URL}/user/${item.tokenOwnerInfo.curraddress}`} data-toggle="tooltip" data-placement="top" 
                                                title={`Owner : ${item.tokenOwnerInfo.name != "" ? item.tokenOwnerInfo.name : item.tokenOwnerInfo.curraddress}`}>

                                                    {
                                                        item.tokenOwnerInfo 
                                                        &&(item.tokenOwnerInfo.image != ""
                                                            ?
                                                            <img src={`${config.Back_URL}/images/${item.tokenOwnerInfo._id}/${item.tokenOwnerInfo.image}`} alt="Owner" className="img-fluid align-self-center" />

                                                            :
                                                                  <Avatars classValue="img-fluid align-self-center" />)    
                                                    }

                                                </a>

                                        }

                                    </div>

                                </div>
                                <div className="media-body flex_body">
                                    <p className="mt-0 media_text mt-0 mb-0 ml-2"
                                        title={item.tokenOwnerInfo.name != "" ? item.tokenOwnerInfo.name : (item.tokenowners_current.tokenOwner)}>
                                        @{item.tokenOwnerInfo.name != "" ? item.tokenOwnerInfo.name : ((item.tokenowners_current.tokenOwner).slice(0, 8).concat('....'))}</p>
                                </div>
                            </div>
                            <div>

                                <h3 className="mb-0" >
                                    {(
                                        item
                                        && item.tokenowners_current
                                        && item.tokenowners_current.tokenPrice > 0)
                                        && <span>{item.tokenowners_current.tokenPrice} {item.tokenowners_current.CoinName}</span>}
                                    {
                                        item
                                        && item.clocktime != null
                                        && item.endclocktime != null
                                        && item.minimumBid
                                        && item.minimumBid > 0
                                        && <span>{item.minimumBid} {item.tokenowners_current.CoinName}</span>}
                                    <span className="ml-2">{item && item.tokenowners_current && item.tokenowners_current.balance} of {item && item.tokenowners_current && item.tokenowners_current.quantity}</span>
                                </h3>

                                <div>
                            {/* {/ {/ new feat /} /} */}
                            {/* <div className="text-right mt-3">
                            <div className="arr-btn text-center left-btn"> 
                            <span>
                            <img src={require("../../assets/images/arrow-left.png")} alt="logo" className="img-fluid left_icon" /> 

                               
                                </span>
                                <Link to={"/info/" + item.tokenCounts}> <button className="btn btn-arrow-theme">
                                View Item
                                </button></Link>
                                <span>
                                 
                            <img src={require("../../assets/images/arrow-right.png")} alt="logo" className="img-fluid right_icon" /> 

                                    </span>
                            </div>
                           
                            <div className="btn btn-arrow-theme btn-theme-border-hea">
                                </div> 
                              
                            </div> */}

                           
                            </div>
                            </div>
                        </div>
                    </div></div>
            </div>

            : ('')
    )
}