import React, {useEffect,useState} from "react";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import config from '../../lib/config';
import isEmpty from '../../lib/isEmpty';
import Avatars from "views/Avatar";
import ReactPlayer  from 'react-player'
import LazyLoad from 'react-lazyload';
import LazyLoader from "../lazyloader";
export default function TokenCard(props) {
    async function showAllwithPro(data) {
    }
    async function buyToken() {
        //('buyToken')
    }
    var {
        burn,
        item,
        LikedTokenList,
        hitLike,
        UserAccountAddr,
        UserAccountBal,
        PutOnSale_Click,
        PurchaseNow_Click,
        Burn_Click,
        CancelOrder_Click,
        WalletConnected,
        ShareSocial_Click,
        SubmitReport_Click
    } = props;

    const renderer = ({ days, Month, Year, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span></span>
        } else {
            return <span>{days}d  {hours}h {minutes}m {seconds}s left</span>;
        }
    };
    //("check owner",item)
    return (
        (item.tokenowners_current) ?
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3 masonry mb-4">
                   
        <div className="item">
            <div className="card_inner_item">
                {/* <div className="item_details_top">
                        <p className="sold_text">Sold to @mikebasker</p>
                      </div>            */}
              {(item.tokenowners_current
                    &&item.tokenowners_current.tokenCreator != item.tokenowners_current.tokenOwner)
                    && item.tokenowners_current.tokenPrice == 0 
                    &&  <div className="item_details_top">
                            <p className="sold_text">Sold to {item.tokenOwnerInfo.name!=''?item.tokenOwnerInfo.name:(item.tokenOwnerInfo.curraddress).slice(0,8).concat('....')}</p>
                          </div>   }        


                <div className="item_inner_img">
                    <Link to={"/info/" + item.tokenCounts}>
                    <LazyLoad height={200} placeholder={<LazyLoader/>} offset={[-200, 0]} debounce={500}>  
                    {
                            item.image!=""&&(item.image.split('.').pop() == "mp4" ?
                                    // <video src={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" alt="Collections" className="img-fluid" autoPlay controls muted playsInline loop />
                                //     <video className="video-container img-fluid video-container-overlay" autoPlay loop muted controls playsInline data-reactid=".0.1.0.0" alt="Collections">
                                //     <source type="video/mp4" data-reactid=".0.1.0.0.0" src={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}/>
                                //    </video> 
                                <ReactPlayer  playing={true}  url={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}
                                loop={true}
                                controls={true}
                                muted={true}
                                playsinline={true}
                                />
                                    :
                                    <img src={(isEmpty(item.image) || item.image =="" || item.image == null || item.image == undefined)? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid " />
                             ) }
                        
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
                              :
                              <div>
                                
                              <badge className="badge badge-dark badge-timer mb-3">
                              <p className="pl-2 times_text">
                              {(
                                item
                                &&item.tokenowners_current
                                &&item.tokenowners_current.tokenPrice > 0) 
                                ?'Fixed Price'
                                :'Open For Bid'
                                }
                                   </p>
                                </badge>
                            </div>
                              } 
                     <Link to={"/info/" + item.tokenCounts}>
                 <h2>{item.tokenName}</h2></Link>
                {item.tokenowners_current.tokenOwner == UserAccountAddr && <h4 className="text-left">My Collections</h4> }    
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="media follow_media">
                            <div className="img_tick_div">
                                {/* <img src={require("../assets/images/small-profile.png")} alt="User" className="img-fluid mr-2 img_user_new_sm" /> */}
                                {/* owner */}
                                    {/*creator  */}
                                    <div class="d-flex creators_details">   
                    {
                    item
                    &&item.tokenCreatorInfo                  
                    &&
                    
                    <a href={item.tokenCreatorInfo.customurl!=""?`${config.Front_URL}/${item.tokenCreatorInfo.customurl}`:`${config.Front_URL}/user/${item.tokenCreatorInfo.curraddress}`} data-toggle="tooltip" data-placement="top" title={`Creator : ${item.tokenCreatorInfo.name!=""?item.tokenCreatorInfo.name:item.tokenCreatorInfo.curraddress}`}>
                       {item.tokenCreatorInfo.image!=""? <img src={`${config.Back_URL}/images/${item.tokenCreatorInfo._id}/${item.tokenCreatorInfo.image}`} alt="Creator" className="img-fluid align-self-center" />:
                       <div className="img-fluid align-self-center">
                           <Avatars item={item.tokenCreatorInfo.curraddress}/>
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
                           
                                <a href={item.tokenCreatorInfo.customurl!=""?`${config.Front_URL}/${item.tokenOwnerInfo.customurl}`:`${config.Front_URL}/user/${item.tokenOwnerInfo.curraddress}`} title={`Owner : ${item.tokenOwnerInfo.name}`}>
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

                            </div>
                            <div className="media-body flex_body">
                                <p className="mt-0 media_text mt-0 mb-0 ml-2"  style={{"wordBreak":"break-all"}} title={item.tokenOwnerInfo.name!=""?item.tokenOwnerInfo.name:(item.tokenowners_current.tokenOwner)}>@{item.tokenOwnerInfo.name!=""?item.tokenOwnerInfo.name:((item.tokenowners_current.tokenOwner).slice(0,8).concat('....'))}</p>
                            </div>
                        </div>
                        <div>
                            
                        <h3 className="mb-0" >
                    {/* {(item.PutOnSale == false || (item.PutOnSale == true && item.PutOnSaleType=='FixedPrice' && item.tokenowners_current.tokenPrice == 0)) && <span>Not for sale </span>}
                    {(item.PutOnSale == true && item.PutOnSaleType=='FixedPrice' && item.tokenowners_current.tokenPrice > 0) && <span>{item.tokenowners_current.tokenPrice} {config.currencySymbol} </span>}
                    {(item.PutOnSale == true && item.PutOnSaleType=='TimedAuction') && <span>Minimum Bid </span>}
                    {(item.PutOnSale == true && item.PutOnSaleType=='UnLimitedAuction') && <span>Open for Bids </span>}
                    {item.tokenowners_current.balance} of {item.tokenowners_current.quantity} */}
                    {/* {(item.PutOnSale == true && item.PutOnSaleType=='FixedPrice' && item.tokenowners_current.tokenPrice > 0) && <span>{item.tokenowners_current.tokenPrice} {config.currencySymbol} </span>}
                    {(item.PutOnSale == true && item.PutOnSaleType=='TimedAuction') && <span>{item.minimumBid} {config.tokenSymbol} </span>}
                    {(item.PutOnSale == true && item.PutOnSaleType=='UnLimitedAuction') && <span>Open for Bids </span>}
                    {item.tokenowners_current.balance} of {item.tokenowners_current.quantity}  */}
               
                      {(
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
                        && <span>{item.minimumBid} {config.tokenSymbol} </span>}
                        {/* {(
                            item.PutOnSale == true 
                            && item.PutOnSaleType=='UnLimitedAuction'
                            ) && <span>Open For Bid</span>} */}
                        {(burn)?item && item.tokenQuantity && item.balance && (item.tokenQuantity - item.balance):item&&item.tokenowners_current&&item.tokenowners_current.balance} of {item&&item.tokenowners_current&&item.tokenowners_current.quantity}
               
                </h3>
                            {/* <h3    >{item.tokenowners_current.tokenPrice > 0 && <span>{item.tokenowners_current.tokenPrice} {config.currencySymbol} </span>} </h3> */}
                        </div>
                    </div>

                </div></div>

        </div>
        </div> 
        : ('')  
    )
}