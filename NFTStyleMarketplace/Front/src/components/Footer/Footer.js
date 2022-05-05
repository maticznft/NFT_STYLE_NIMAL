/*eslint-disable*/
import React,{useState,useEffect} from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// material-ui core components
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import {sociallinksfunction} from '../../actions/v1/report';
import styles from "assets/jss/material-kit-react/components/footerStyle.js";

import imgs from "../../assets/images/my_items_bg_new_light.png";
 import imgdark from "../../assets/images/my_items_bg_new.jpg";
 import ConnectWallet from "views/separate/Connect-Wallet";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const[sociallinks,setsociallinks]=useState([])
  const[Footer_Link,Set_Footer_link]=useState([])
  const [UserAccountAddr, Set_UserAccountAddr] = useState('');
  const [UserAccountBal, Set_UserAccountBal] = useState(0);
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
  const [Accounts, Set_Accounts] = useState('');
  const [MyItemAccountAddr, Set_MyItemAccountAddr] = useState('');
  const [Wen_Bln,set_Wen_Bln]=useState(0);
  const [Service_Fee,set_Service_Fee] = useState(0);
  const [WalletConnected, Set_WalletConnected] = useState('false');
	const [providerss,set_providers]=useState(null)
  const [convertVal, setConvertVal] = React.useState(0);
  
  useEffect(()=>{
    sociallinksfunct()
  },[])
  const sociallinksfunct=async()=>{
    
    var soci= await sociallinksfunction()
    //console.log("socisocisoci",soci)
    if(soci&& soci.data&&soci.data.soci && soci.data.soci.social.length != 0){
      //console.log"socisocisoci",soci.data.soci.social)
      setsociallinks(soci.data.soci.social)
    }
    else{
      setsociallinks([])
    }
  }

  const toggleUsermenu = () => {
    var useclass = document.getElementsByClassName("usemneu_dd");
    for(var i=0;i<useclass.length;i++)
    {
      useclass[i].classList.toggle('d-none')
    } 
  }
  

  const AfterWalletConnected=()=>{}
  const toggletheme = () => {
    document.getElementById("root").classList.toggle('light_theme');
    var roottheme = document.getElementById("root");
    if(roottheme.classList.contains("light_theme"))
    {
      //console.log("light header");
      localStorage.setItem("theme",'light_theme');

    }
    else
    {
      //console.log("dark header");

      localStorage.setItem("theme",'dark_theme');

    }

    if(localStorage.getItem("theme") == "light_theme")
    {
    //console.log("light",location.pathname);
   
      setTimeout(function(){
        var usebody = document.getElementsByClassName("mobile_nav");
        //console.log("usebody",usebody);
        for(var j=0;j<usebody.length;j++)
        {
          usebody[j].classList.add('light_theme')
        }
      },100);

      if (location.pathname == "/my-items") {
      document.getElementById("items_bg_img").src = imgs;
      }
 
   
    }
    else
    {
      //console.log("dark",location.pathname);
  
      setTimeout(function(){
        var usebody = document.getElementsByClassName("mobile_nav");
        for(var j=0;j<usebody.length;j++)
        {
          usebody[j].classList.remove('light_theme')
        }
      },100);
      if (location.pathname == "/my-items") {
      document.getElementById("items_bg_img").src = imgdark;
      }
   
    }


//     if (location.pathname == "/my-items") {
// alert(1);
// 			if (document.getElementById("root").classList.contains('light_theme')) {
//         //console.log("light ite foter");
// 				document.getElementById("items_bg_img").src = imgs;
// 			}
// 			else {
//         //console.log("dar ite foter");

// 				document.getElementById("items_bg_img").src = imgdark;
// 			}
//     }


	};
  return (
    <div>
       <ConnectWallet
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
        />
    <footer className={footerClasses}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-5 col-xl-4 mt-3 mt-lg-0">
            <Link to="/">
          <span className="img-fluid logo_przn" alt="Shape"/>
          </Link>
          {/* <img src={require("../../assets/images/lgo.png")} class="img-fluid" alt="Shape"/> */}
          {/* <img src={require("../../assets/images/footer_log_text.png")} class="img-fluid footer_logo footer_text_change" alt="Shape"/> */}
          
          <p className="footer_big_text">The best & exclusive E-NFT economy</p>
         
          </div>
         
          <div className="col-12 col-lg-7 col-xl-8 mt-3 mt-lg-0">
          <div className="row">
          <div className="col-12 col-md-3 col-lg-3 mt-3 mt-lg-4">
            <p className="footer_heade">NFT-Style</p>
            <ul className="footer_ul">
           
            <li>
            {WalletConnected=="false" ?
            <Link to="#" data-toggle="modal" data-target="#connect_modal">Connect wallet</Link>
            :
            <Link to="#"  onClick={toggleUsermenu}>Connect wallet</Link>
            }            
            </li>
            {/* <li>
            <Link to="/create">Balance</Link>
            </li> */}
            <li>
            <Link to="/create">Create</Link>
            </li>
            </ul>
            
            </div>
            <div className="col-12 col-md-3 col-lg-3 mt-3 mt-lg-4">
            <p className="footer_heade">Info</p>
            <ul className="footer_ul">
            <li>
            <Link to="/privacy-policy">Privacy Policy</Link>           
            </li>
            <li>
            <Link to="/terms-of-service">About Us</Link>           
            </li>
            <li>
            <Link to="/how-it-works">How It Works</Link>            
            </li>
          
            </ul>
            
            </div>
        
            <div className="col-12 col-md-3 col-lg-3 mt-3 mt-lg-4">
            <p className="footer_heade">Explore</p>
            <ul className="footer_ul">
            <li>
            <Link to="/my-items">My Items</Link>           
            </li>
            <li>
            <Link to="/following">Following</Link>            
            </li>
            <li>
            <Link to="/edit-profile">My Profile</Link>
            </li>
            </ul>
            
            </div>
        
            <div className="col-12 col-md-3 col-lg-3 mt-3 mt-lg-4">
            <p className="footer_heade">Social</p>
            <ul className="footer_ul">
            {sociallinks && sociallinks.length != 0 && sociallinks.map((list) => {
            return(
            <>            
            <li>
            <a href={Object.values(list)} target="_blank">{Object.keys(list)}</a>           
            </li> 
            </>)
            })
            }
            </ul>
            
            </div>
        
          </div>
          </div>
         
        </div>
        
      
      </div>
    </footer>
   
  </div>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
