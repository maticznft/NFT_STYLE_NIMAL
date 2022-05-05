import React, { useEffect,useState,useRef } from "react";
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
import ConnectWallet from '../views/separate/Connect-Wallet'
import {ApproveChecked,AskApproved} from './../actions/v1/token'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import config from '../lib/config'
import { useSelector } from 'react-redux';
toast.configure();
let toasterOption = config.toasterOption;
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
  const Wallet_Details = useSelector(state => state.wallet_connect_context);
  const history = useHistory();
  const [UserAccountAddr, Set_UserAccountAddr] = useState(Wallet_Details.UserAccountAddr);
	const [UserAccountBal, Set_UserAccountBal] = useState(0);
	const [Service_Fee, set_Service_Fee] = useState(0);
	const [Wen_Bln, set_Wen_Bln] = useState(0);
	const [providerss, set_providers] = useState(null)
	const [WalletConnected, Set_WalletConnected] = useState('false');
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
	const [Accounts, Set_Accounts] = useState('');
	const [description,Set_description]=useState('')
	const [convertVal, setConvertVal] = React.useState(0);
  const[ApprovedData,setApprovedData]=useState("true")
  const[deserr,setdeserr]=useState(false)
  
  const AfterWalletConnected=()=>{
    ApproveCheck();
  }
  const ApproveCheck=async()=>{
    if(UserAccountAddr!=""){
    var ReqData = {
      addr: String(UserAccountAddr).toLowerCase()
    }
    var Resp = await ApproveChecked(ReqData);
    // console.log("Resp.data",Resp.data)
    if(Resp&&Resp.data&&Resp.data.getDat&&Resp.data.getDat.Approved){
    setApprovedData(Resp.data.getDat.Approved)}
    }
  }
  const AskApprove=async()=>{
    if(UserAccountAddr!=""){
    if(description!=""){
    var reqData={
      curradrress:UserAccountAddr,
      description:description
    }
    var ask=await AskApproved(reqData)
    if(ask){
      toast.success("Asked Approve for mint Successfully",toasterOption)
      window.location.reload();
    }
  }
  else{
    setdeserr(true)
  }
  }}
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
        <ScrollToTopOnMount />
        <div className={classes.pageHeader + " inner_pageheader inner_page_padding_big"}>

          <div className="container">
            <div className="row">
              <div className="col-12 col-md-10 col-lg-7 mx-auto">
                <div>
                  <Button className="bluebtn" onClick={() => history.push('/')}>Go Back</Button>
                  {true&&
                  <>
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
                                <Button className="grey_btn_sm mt-3 mb-2">
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
                  </>
                  }
                  {/* {false&&
                  <>
                  <div>
                    <h2 className="inner_title my-4">Create collectible</h2>
                  </div>
                  <p className="create_para">If You want to create collectible You must get approve from Admin</p>
              
                  <div className="row">
                    <div className="col-12 col-md-12 col-lg-11 col-xl-9 mx-auto">
                      <div className="row pt-5 pb-3 justify-content-center">
                        <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-3 col_create">
                          <div className="card card_create card_craete_single my-0 rad_2">
                            <div className="card-body px-4 py-5">
                              <div className="text-center">
                                <Button className=" mt-3 mb-2 bluebtn" disabled={true}>
                                  <Link to='#' >{String(UserAccountAddr).slice(0,8).concat('....')}</Link>
                                </Button>
                              </div>
                              <div className="text-center">
                                <p>Enter about collectible</p>
                               <textarea
                               id="description"
                               value={description}
                               name="description"
                               onChange={(e)=>{Set_description(e.target.value)
                              setdeserr(false)
                              }}
                               placeholder="Ex.I would like to mint.."
                               ></textarea>
                               {deserr==true&&'Description required'}
                              </div>
                              <div className="text-center">
                                <Button className=" mt-3 mb-2 bluebtn" onClick={deserr==false&&AskApprove} >
                                  <Link to='#'>Submit</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                       
                      </div>
                    </div>
                  </div>
                  <p className="create_para mt-4 text-center">We do not own your private keys and cannot access your funds without your confirmation</p>
                  </>
} */}
{ApprovedData=="inprogress"&&
                  <>
                  <div>
                    <h2 className="inner_title my-4">Create collectible</h2>
                  </div>
                  <p className="create_para">If You want to create collectible You must get approve from Admin</p>
              
                  <div className="row">
                    <div className="col-12 col-md-12 col-lg-11 col-xl-9 mx-auto">
                      <div className="row pt-5 pb-3 justify-content-center">
                        <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-3 col_create">
                          <div className="card card_create card_craete_single my-0 rad_2">
                            <div className="card-body px-4 py-5">
                              <div className="text-center">
                               <p className="create_para">Kindly Wait For Admin Approval</p>
                              </div>
                            </div>
                          </div>
                        </div>
                       
                      </div>
                    </div>
                  </div>
                  {/* <p className="create_para mt-4 text-center">We do not own your private keys and cannot access your funds without your confirmation</p> */}
                  </>
}

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
