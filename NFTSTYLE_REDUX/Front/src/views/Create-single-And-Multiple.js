import React, {
  useState,
  useRef,
  useEffect
} from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Avatar, Button, TextField } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
//myside
import $ from 'jquery';
import Web3 from 'web3';
import '@metamask/legacy-web3'
import Select from 'react-select'
import {
  getCurAddr
} from '../actions/v1/user';
import {
  ipfsImageHashGet,AddLikeAction,
  approvefalse, GetCategoryAction,
  CreateTokenValidationAction,
  TokenAddItemAction,
  TokenAddOwnerAction,
  TokenCount_Get_Action,
  ipfsmetadatafunciton,
  getListOfToken
} from '../actions/v1/token';

import Avatars from "./Avatar";

import {
  TokenImageCalls,getReceipt
} from '../actions/v1/report';
import config from '../lib/config'
import ConnectWallet from './separate/Connect-Wallet';
import EXCHANGE from '../ABI/EXCHANGE.json'
import MULTIPLE from '../ABI/userContract1155.json'
import SINGLE from '../ABI/userContract721.json'
import PreviewImg from '../assets/images/noimage.png'
import isEmpty from "lib/isEmpty";
import Web3Utils from 'web3-utils'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
toast.configure();
let toasterOption = config.toasterOption;
const dashboardRoutes = [];


const exchangeAddress = config.exchangeAddress;
const multipleAddress = config.multiple;
const singleAddress = config.single;
const singleContract = config.singleContract;
const multipleContract = config.multipleContract;
const adminAddress = config.adminAddress;
const SingleType = config.singleType;
const MultipleType = config.multipleType;
const Back_URL = config.Back_URL;

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
const history=useHistory();
  // wallet related : common state
  const Wallet_Details = useSelector(state => state.wallet_connect_context);
  const [WalletConnected, Set_WalletConnected] = React.useState('false');
  const [UserAccountAddr, Set_UserAccountAddr] = React.useState(Wallet_Details.UserAccountAddr);
  const [UserAccountBal, Set_UserAccountBal] = React.useState(Wallet_Details.UserAccountBal);
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
  const [Accounts, Set_Accounts] = React.useState(Wallet_Details.Accounts);
  const [MyItemAccountAddr, Set_MyItemAccountAddr] = React.useState('');
  var pathVal = '';
  const location = useLocation();
  if (location.pathname) {
    if (location.pathname.split('/').length >= 2) {
      pathVal = location.pathname.split('/')[1];
    }
  }
  const [location_pathname, Set_location_pathname] = useState(pathVal);
  // //('location_pathname : ' + location_pathname);

  var CollectibleType_val = (location_pathname == 'create-single') ? SingleType : MultipleType;
  var ContractAddressUser_val = (location_pathname == 'create-single') ? config.singleContract : config.multipleContract;

  const [CollectibleType, Set_CollectibleType] = useState(CollectibleType_val);
  const [ContractAddressUser, set_ContractAddressUser] = React.useState(ContractAddressUser_val);

  const [FormSubmitUserClicked, Set_FormSubmitUserClicked] = React.useState(false);
  const[fileSizes,setfilesize]=useState(0)
  
  const [TokenOwner, setTokenowner] = React.useState({
    addr: '',
    img: '',
    name: ''
  });
  const [TokenCreater, setTokenCreater] = React.useState({
    addr: '',
    img: '',
    name: ''
  });

  const [StartDate, Set_StartDate] = React.useState('Select Start Date');
  const [EndDate, Set_EndDate] = React.useState('Select End Date');

  const [MintHashVal, Set_MintHashVal] = React.useState('');
  const [TokenQuantity, Set_TokenQuantity] = React.useState(1);

  const [TokenBid, setTokenBid] = useState(true);

  const [MinimumBid, Set_MinimumBid] = React.useState(0);
  const [Clocktime, set_Clocktime] = React.useState('');
  const [EndClocktime, set_EndClocktime] = React.useState("");

  const [UnLockcontent, Set_UnLockcontent] = React.useState("");
  const [Unlockoncepurchased, Set_Unlockoncepurchased] = React.useState(false);

  const [SingleContractAddressAdmin, set_SingleContractAddressAdmin] = React.useState(config.singleContract);
  const [MultipleContractAddressAdmin, set_MultipleContractAddressAdmin] = React.useState(config.multipleContract);

  // const [SingleContractAddressUser, set_SingleContractAddressUser] = React.useState(config.singleContract);

  const [TokenCount, Set_TokenCount] = React.useState(20000);

  const [ApproveCallStatus, setApproveCallStatus] = React.useState('init');
  const [MintCallStatus, setMintCallStatus] = React.useState('init');
  const [SignCallStatus, setSignCallStatus] = React.useState('init');
  const [SignLockCallStatus, setSignLockCallStatus] = React.useState('init');
  const [Service_Fee, set_Service_Fee] = useState(0);
    

  const [TokenType, setTokenType] = React.useState('Single');

  const [ValidateError, setValidateError] = React.useState({ TokenPrice: '' });

  const [PutOnSale, setPutOnSale] = React.useState(false);
  const [PutOnSaleType, setPutOnSaleType] = React.useState('');

  const [TokenCategory, setTokenCategory] = React.useState({ label: '' });
  const [CategoryOption, setCategoryOption] = React.useState([]);
  const [TokenPrice, setTokenPrice] = React.useState(0);
  const [YouWillGet, Set_YouWillGet] = React.useState(0);
  const [TokenName, setTokenName] = React.useState('');
  const [TokenDescription, setTokenDescription] = React.useState('');
  const [TokenRoyalities, setTokenRoyalities] = React.useState('');
  const [TokenProperties, setTokenProperties] = React.useState('');

  const [TokenFile, setTokenFile] = React.useState("");
  const [TokenFilePreReader, setTokenFilePreReader] = React.useState("");
  const [TokenFilePreUrl, setTokenFilePreUrl] = React.useState("");

  const [ipfsimg, setIpfsImg] = useState(null)
  const [ipfshash, setIpfsHash] = useState("");

  const [ipfshashurl, setipfshashurl] = useState('');
  const [imgfilename, setimgfilename] = useState('');
  const [ipfsmetatag, set_ipfsmetatag] = useState('');
  const [providerss,set_providers]=useState(Wallet_Details.providerss)

  const[Wen_Bln,set_Wen_Bln]=useState(0);
  const [convertVal, setConvertVal] = React.useState(0);

  const [TokenImages, setTokenImage] = useState({});

  const [expanded6, setExpanded6] = React.useState('panel8');
  const [expanded7, setExpanded7] = React.useState('panel8');
  const [priceoption, setPriceoption] = React.useState([]);
  const [bidpriceoption, setBidPriceoption] = React.useState([]);
  const [coinname, setCoinNames] = useState('');
  const handleChangeFaq6 = (panel6) => (event, isExpanded6) => {
    setExpanded6(isExpanded6 ? panel6 : false);
  };
  const handleChangeFaq7 = (panel7) => (event, isExpanded7) => {
    setExpanded7(isExpanded7 ? panel7 : false);
  };



  useEffect(() => {
    GetCategoryCall()
    TokenImageCall();
    getBuyTokensList();
    CreateItemValidation(FormSubmitUserClicked);
  }, [
    FormSubmitUserClicked,
    StartDate,
    EndDate,
    TokenQuantity,
    TokenBid,
    MinimumBid,
    Clocktime,
    EndClocktime,
    UnLockcontent,
    Unlockoncepurchased,
    PutOnSale,
    PutOnSaleType,
    TokenCategory,
    TokenPrice,
    TokenName,
    TokenDescription,
    TokenRoyalities,
    TokenProperties,
    TokenFilePreUrl,
    ipfsimg,
    UserAccountAddr
  ]);
  var yesterday = moment().subtract( 1, 'day' );
  var valid1 = function( current ){
    return current.isAfter( new Date(Clocktime) );
  };

  
  var valid = function( current ){
      return current.isAfter( yesterday );
  };
  async function GetCategoryCall() {
    var resp = await GetCategoryAction()
    if (resp && resp.data && resp.data.list) {
      var CategoryOption = [];
      resp.data.list.map((item) => {
        CategoryOption.push({
          name: 'TokenCategory',
          value: item._id,
          label: item.name
        })
      })
      setCategoryOption(CategoryOption)
    }
  }

  const changePutOnSaleType = (type) => {
    setPutOnSaleType(type);
    if (type == 'FixedPrice') {
    }
  };

  const CheckedChange = (e) => {
    if (e && e.target && e.target.name) {
      if (e.target.name == 'putonsale') {
        if (PutOnSale == false) {
          setPutOnSale(true);
          if (PutOnSaleType == '') {
            setPutOnSaleType('FixedPrice')
          }
        }
        else {
          setPutOnSale(false);
          setTokenBid(true)
        }
      }
      else if (e.target.name == 'unlockoncepurchased') {
        if (Unlockoncepurchased == false) {
          Set_Unlockoncepurchased(true);
        }
        else {
          Set_Unlockoncepurchased(false);
        }
      }
    }
  };

  const selectFileChange = (e) => {
    var validExtensions = ["png", 'gif', 'webp', 'mp4', 'PNG', 'jpg', 'JPEG', 'JPG', 'jpeg', 'WEBP']; //array of valid extensions
    if (e.target && e.target.files) {
      var reader = new FileReader()
      var file = e.target.files[0];
      //("dakldjasdkasjdjasd",file.name)
      setimgfilename(file.name)
      var fileName = file.name;
      var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
      if ($.inArray(fileNameExt, validExtensions) == -1) {
        toast.error("Only these file types are accepted : " + validExtensions.join(', '), toasterOption);
        return false;
      }
      const fileSize = file.size;
      if (30000000 < fileSize) {
        toast.error("File size exceeds 30 MB", toasterOption);
        return false;
      }
      else {
        setfilesize(fileSize)
        setTokenFile(file);
        var url = reader.readAsDataURL(file);
        reader.onloadend = function (e) {
          if (reader.result) {
            // //('reader.result', reader.result);
            setTokenFilePreReader(reader.result);
          }
        }.bind(this);
        setTokenFilePreUrl(e.target.value);

      }
    }
  }

  const selectChange = (e) => {
    if (e && e.name && e.label && e.value) {
      switch (e.name) {
        case 'TokenCategory':
          setTokenCategory(e);
          break;
        default:
        // code block
      }
    }
  }
  const PriceCalculate = async (data = {}) => {
    var price = (typeof data.price != 'undefined') ? data.price : TokenPrice;
    var weii = price * 1e6;
    var per = (weii/1e8) * (Service_Fee/config.decimalvalues)*1e6;
    var mulWei = parseFloat(weii - per);
    Set_YouWillGet(mulWei/1e6);
    // Set_MultipleWei(mulWei);
  }

  const inputChange = (e) => {
    if (e && e.target && typeof e.target.value != 'undefined' && e.target.name) {
      var value = e.target.value;
      switch (e.target.name) {
        case 'TokenPrice':
          if (value != '' && isNaN(value) == false && value > 0) {
            setTokenPrice(value);
            PriceCalculate({ price: value });
          }
          else {
            setValidateError(ValidateError);
            setTokenPrice('0');
            PriceCalculate({ price: 0 });
          }

          break;
        case 'TokenName':
          setTokenName(value);
          break;
        case 'TokenDescription':
          setTokenDescription(value);
          break;
        case 'TokenRoyalities':
          setTokenRoyalities(value);
          break;
        case 'TokenProperties':
          setTokenProperties(value);
          break;
        case 'UnLockcontent':
          Set_UnLockcontent(value);
          break;
        case 'MinimumBid':
          Set_MinimumBid(value);
          break;
        case 'TokenQuantity':
          Set_TokenQuantity(value);
          break;
        default:
        // code block
      }
    }
  }



  async function ApproveCall() {

    var web3 = new Web3(providerss);

    if (UserAccountAddr == "") {
      toast.warning("OOPS!..connect Your Wallet", toasterOption);
      return false;
    }
    var CoursetroContract = null;
    setApproveCallStatus('processing');
    if (location_pathname == 'create-multiple') {
      CoursetroContract = new web3.eth.Contract(MULTIPLE, config.multipleContract);
    }
    else {
      CoursetroContract = new web3.eth.Contract(SINGLE, config.singleContract);
    }
    try {
      var approveCall = "";
      var handle = null;
      var receipt = null;
      await CoursetroContract.methods.setApproval(
        ContractAddressUser,
        true
        // TokenCount
      ).send({
        from: Accounts
      })
        .on('transactionHash', async (transactionHash) => {
          if (transactionHash != "") {
            handle = setInterval(async () => {
              receipt = await getReceipt(web3, transactionHash)
              clr();
            }, 8000)
          }
        })
    }
    catch (error) {
      toast.error("Approve failed", toasterOption);
      setApproveCallStatus('tryagain');
    

    }
    async function clr() {
      if (receipt != null) {
        clearInterval(handle)
        if (receipt.status == true) {
          var tokenid = receipt.logs[1].topics[2];

          const someString = Web3Utils.hexToNumber(tokenid);
          
          //console.log("some string",someString)
          Set_TokenCount(someString)
          var senddata = {
            Image: TokenFile,
          }
          var ipfsimghashget = await ipfsImageHashGet(senddata);
          if (ipfsimghashget.data !== undefined) {
            if (ipfsimghashget.data.ipfsval != "") {

              setIpfsHash(ipfsimghashget.data.ipfsval)
              setipfshashurl(`${config.IPFS_IMG}/${ipfsimghashget.data.ipfsval}`)
            }
          }
          var newobj = {
            name: TokenName,
            image: config.IPFS_IMG + "/" + ipfsimghashget.data.ipfsval,
            description: TokenDescription,

          }
          var ipfsmetatag = await ipfsmetadatafunciton(newobj);
          if (ipfsmetatag.data !== undefined) {
            if (ipfsmetatag.data.ipfsval != "") {
              var ipfsurl = ipfsmetatag.data.ipfsval
              set_ipfsmetatag(`${config.IPFS_IMG}/${ipfsmetatag.data.ipfsval}`)
            }
            //console.log"ipfsmetatagdata",newobj,ipfsmetatag.data)
          }
          toast.success("Approve Successfully", toasterOption);
          setApproveCallStatus('done');
        }
      }
    }
  }

    async function MintCall() {

      var web3 = new Web3(providerss);
      if (UserAccountAddr == "") {
        toast.warning("OOPS!..connect Your Wallet", toasterOption);
        return false;
      }
      var CoursetroContract = null;
      var contractCall = null;
      const Digits = config.decimalvalues;
      const TokenPriceInStr =web3.utils.toWei(String(TokenPrice))
      //console.log"ewytyutewr",TokenPriceInStr)

      setMintCallStatus('processing');
      try {
        var mintCall = null;
        var receipt = null;
        var handle = null;
    
      if (location_pathname == 'create-multiple') {
        CoursetroContract = new web3.eth.Contract(MULTIPLE, config.multipleContract);
        await CoursetroContract.methods.mint(
          TokenCount,
          TokenPriceInStr,
          TokenRoyalities,
          TokenQuantity,
          TokenName,
          ipfsmetatag,
          ipfsmetatag
        )
        .send({ from: Accounts })
        .on('transactionHash', (transactionHash) => {
          //////console.log("testing all 3@123", transactionHash)
          mintCall = transactionHash;
          if (mintCall) {
            handle = setInterval(async () => {
              receipt = await getReceipt(web3, transactionHash)
              //////console.log("receipt", receipt)
              clr1();
            }, 8000)
          }
        })
      }
      else {
        CoursetroContract = new web3.eth.Contract(SINGLE, config.singleContract);
        await CoursetroContract.methods.mint(
          TokenCount,
          TokenName,
          ipfsmetatag,
          ipfsmetatag,
          TokenPriceInStr,
          TokenQuantity,
          TokenRoyalities
        )
        .send({ from: Accounts })
        .on('transactionHash', (transactionHash) => {
          //////console.log("testing all 3@123", transactionHash)
          mintCall = transactionHash;
          if (mintCall) {
            handle = setInterval(async () => {
              receipt = await getReceipt(web3, transactionHash)
              //////console.log("receipt", receipt)
              clr1();
            }, 8000)
          }
        })
      }
         
        
      }
      catch (e) {
        toast.error("Mint not Successfully", toasterOption);
        setMintCallStatus('tryagain');
        //console.log"try again",e)
      }
    
      async function clr1() {
        if (receipt != null) {
          clearInterval(handle);
          if (receipt.status == true) {
            Set_MintHashVal(mintCall);
            toast.success("Your Token Added Successfully", toasterOption);
            var Status = "true";
            var TokenAddItemPayload = {
              // Image: imgfilename,
              Image: TokenFile,
              ipfsimage:ipfshash ,
              Name: TokenName,
              Count: TokenCount,
              Description: TokenDescription,
              Price: TokenPrice,
              Royalities: TokenRoyalities,
              Category_label: TokenCategory.label,
              Bid: TokenBid,
              Properties: TokenProperties,
              Owner: UserAccountAddr,
              Creator: UserAccountAddr,
              CategoryId: TokenCategory.value,
              Quantity: TokenQuantity,
              Balance: TokenQuantity,
              ContractAddress: ContractAddressUser,
              Status: "true",
              HashValue: mintCall,
              Type: CollectibleType,
              MinimumBid: 0,
              Clocktime: '',
              EndClocktime: '',
              UnLockcontent: '',
              PutOnSale: PutOnSale,
              PutOnSaleType: PutOnSaleType,
              CoinName: coinname
            };
            //("lkjhg",TokenAddItemPayload)
            if (Unlockoncepurchased == true) {
              TokenAddItemPayload.UnLockcontent = UnLockcontent;
            }

            if (PutOnSale == true) {
              if (PutOnSaleType == 'FixedPrice') {
                TokenAddItemPayload.Price = TokenPrice;
              }
              else if (PutOnSaleType == 'TimedAuction') {
                TokenAddItemPayload.MinimumBid = MinimumBid;
                TokenAddItemPayload.Clocktime = Clocktime;
                TokenAddItemPayload.EndClocktime = EndClocktime;
              }
            }
            await TokenAddItemAction(TokenAddItemPayload);
            var TokenAddOwnerPayload = {
              'Count': TokenCount,
              'Price': TokenPrice,
              'Owner': UserAccountAddr,
              'Balance': TokenQuantity,
              'Quantity': TokenQuantity,
              'ContractAddress': ContractAddressUser,
              'Type': CollectibleType,
              'tokenCreator': UserAccountAddr,
              HashValue: mintCall,
              Status: "true",
              CoinName: coinname,
              PutOnSale: PutOnSale,
            };
            if (PutOnSaleType == 'FixedPrice') {
              TokenAddOwnerPayload.Price = TokenPrice;
            }
            await TokenAddOwnerAction(TokenAddOwnerPayload);
            // var approvefalsestatus = await approvefalse({currAddr:UserAccountAddr});
            // if (approvefalsestatus&& approvefalsestatus.data ) {
            //   // setTokenImage(tokenimages.data)
            // }
            //console.log"djewnafefuifnuiwenfuijwe",TokenAddOwnerPayload,TokenAddItemPayload)
            setMintCallStatus('done');

          }
        }
      }
    }
      async function SignCall() {

        var web3 = new Web3(providerss);
        if (UserAccountAddr == "") {
          toast.warning("OOPS!..connect Your Wallet", toasterOption);
        }
        else{
        setSignCallStatus('processing');
        try {
          await web3.eth.personal.sign("Sign Sell Order", UserAccountAddr)
          toast.success("Sign Successfully", toasterOption);
          setSignCallStatus('done');

        }
        catch (e) {
          toast.error("Sign Failed", toasterOption);
          setSignCallStatus('tryagain');
        }
      }
      }
      async function SignLockCall() {

        var web3 = new Web3(providerss);
        if (UserAccountAddr == "") {
          toast.warning("OOPS!..connect Your Wallet", toasterOption);
        }
        else{
        try {
          setSignLockCallStatus('processing');
          await web3.eth.personal.sign("Sign Lock Order", UserAccountAddr)
          toast.success("Sign Lock Order Successfully", toasterOption);
          setSignLockCallStatus('done');
          setTimeout(() => window.$('#create_item_modal').modal('hide'), 1000);
          setTimeout(() => window.location.href = config.Front_URL + "/my-items", 1200);
        }
        catch (e) {
          toast.error("Sign Failed", toasterOption);
          setSignLockCallStatus('tryagain');
        }}
      }
      async function CreateItemValidation(chk) {
        if (chk) {
          // alert(1)
          var ValidateError = {};
          if (TokenName == '') {
            ValidateError.TokenName = '"Name" is not allowed to be empty';
          }

          if (TokenRoyalities == '') {
            ValidateError.TokenRoyalities = '"Royalties" is not allowed to be empty';
          }
          else if (isNaN(TokenRoyalities) == true) {
            ValidateError.TokenRoyalities = '"Royalties" must be a number';
          }
          else if (TokenRoyalities > 21) {
            ValidateError.TokenRoyalities = '"Royalties" must be less than or equal to 20';
          }
          else if (TokenRoyalities == 0) {
            ValidateError.TokenRoyalities = '"Royalties" must be above 0';
          }

          // TokenFilePreReader
          // TokenFilePreUrl
          if (TokenFilePreUrl == '') {
            ValidateError.photo = '"File" is required';
          }
          // alert(fileSizes)
          if (30000000 < fileSizes) {
            // alert("gjx")
            ValidateError.photo = '"File" Must be below 30mb';
          }


          if (typeof TokenCategory.label == 'undefined' || TokenCategory.label == '') {
            ValidateError.TokenCategory = '"Category" is required';
          }

          if (Unlockoncepurchased && UnLockcontent == '') {
            ValidateError.UnLockcontent = '"Locked content" is required';
          }

          if (PutOnSale == true && PutOnSaleType == 'FixedPrice') {
            if (TokenPrice == '' || isNaN(TokenPrice) == true && TokenPrice == 0) {
              ValidateError.TokenPrice = '"Price" must be a number';
            }
            else if (TokenPrice == 0) {
              ValidateError.TokenPrice = '"Price" must be greater than zero';
            }
            else if (TokenPrice < 0.0001) {
              ValidateError.TokenPrice = '"Price" must be greater than 0.0001';
            }
            else if(coinname == '')
            {
              ValidateError.TokenPrice = 'Please Select a Token';
            }
          }

          if (PutOnSale == true && PutOnSaleType == 'TimedAuction') {
            if (MinimumBid == '') {
              ValidateError.MinimumBid = '"Bid Price" must be a number';
            }
            if (MinimumBid != 0 && MinimumBid < 0.0001) {
              ValidateError.MinimumBid = 'set "Bid Prices" 0 or 0.0001';
            }
            if (Clocktime == '') {
              ValidateError.Clocktime = '"Start Clock Time " cant be a number';
            }
            if (EndClocktime == '') {
              ValidateError.EndClocktime = '"End Clock Time " cant be a number';
            }
            if (Clocktime == 'Select Start Date') {
              ValidateError.Clocktime = '"Start Clock Time " cant be a number';
            }
            if (EndClocktime == 'Select End Date') {
              ValidateError.EndClocktime = '"End Clock Time " cant be a number';
            }
            if (Clocktime == 'Invalid Date') {
              ValidateError.Clocktime = '"Start Clock Time " cant be a number';
            }
            if (EndClocktime == 'Invalid Date') {
              ValidateError.EndClocktime = '"End Clock Time " cant be a number';
            }
            if(coinname == '')
            {
              ValidateError.MinimumBid = 'Please Select a Token';
            }
          }

          if (TokenQuantity == '' || isNaN(TokenQuantity) == true && TokenQuantity == 0) {
            ValidateError.TokenQuantity = '"Number of copies" must be a number';
          }
          if (TokenQuantity > 500) {
            ValidateError.TokenQuantity = '"Number of copies" Allowed is 500';
          }

 
          setValidateError(ValidateError);
          return ValidateError;
        }
        else {
          return {};
        }
      }

      async function DateChange(from, val) {
        if (from == 'StartDateDropDown') {
          if (val == 'PickStartDate') {
            ModalAction('calendar_modal', 'show');
          }
          else {
            Set_StartDate(val);
            // 'Right after listing'
            var myDate = new Date();
            if (val == 'RightAfterListing') {
              var newdat = myDate.setDate(myDate.getDate());
            }
            else {
              var newdat = myDate.setDate(myDate.getDate() + parseInt(val));
            }
            var newdate = new Date(newdat);
            set_Clocktime(newdate);
          }
        }
        else if (from == 'EndDateDropDown') {
          if (val == 'PickEndDate') {
            ModalAction('calendar_modal_expire', 'show');
          }
          else {
            Set_EndDate(val);
            var myDate = new Date();
            var newdat = myDate.setDate(myDate.getDate() + parseInt(val));
            var newdate = new Date(newdat)
            set_EndClocktime(newdate)
          }
        }
      }

      async function ModalAction(id, type) {
        window.$('#' + id).modal(type);

        if (id == 'calendar_modal') {
          // //('ModalAction Clocktime', Clocktime);
          if (Clocktime) {
            var dt = new Date(Clocktime);
            var dt1 = dt.toLocaleString();
            Set_StartDate(dt1);
          }
        }
        else if (id == 'calendar_modal_expire') {
          // //('ModalAction EndClocktime', EndClocktime);
          if (EndClocktime) {
            var dt = new Date(EndClocktime);
            var dt1 = dt.toLocaleString();
            Set_EndDate(dt1);
          }
        }
      }

      async function CreateItem() {
        // alert('3')
        Set_FormSubmitUserClicked(true);
        var errors = await CreateItemValidation(true);
        var errorsSize = Object.keys(errors).length;
        //console.log"providedddd",errors)
      
        if (errorsSize != 0) {
          toast.error("Form validation error. Fix all mistakes and submit again", toasterOption);
          return false
        }
        else if (providerss) {
          
          if (providerss == null) {
            toast.error("Please Connect to Rinkeby Network", toasterOption)
            Set_WalletConnected("false");
          }
          else {
            if (typeof UserAccountBal == 'undefined' || UserAccountBal == null || UserAccountBal == 0) {
              Set_UserAccountBal(0);
            }
            else {
              Set_UserAccountBal(UserAccountBal);
            }
            if (UserAccountBal == 0) {
              toast.error("Insufficient balance", toasterOption);
              return false;
            }

            var TokenCategory_label = TokenCategory.label;
            // if(localStorage.activate===undefined){

            //   toast.error("Please Sign Up", toasterOption);
            //   return false;
            // }
            // if(localStorage.activate!="activate"){

            //   toast.error("Please Sign Up", toasterOption);
            //   return false;
            // }
            //   if(localStorage.user===undefined){
            //     toast.error("Please Sign In", toasterOption);
            //     return false;}
           
            let payload = {
              TokenName,
              TokenRoyalities,
              image: TokenFile,
              TokenCategory_label,
              PutOnSaleType,
              TokenPrice,
            }
            const resp = await CreateTokenValidationAction(payload);
            console.log("dkfnjsrntg",resp)
            if (resp && resp.data) {
              if (resp.data.errors) {
                var errors = resp.data.errors;
                var errorsSize = Object.keys(errors).length;
                if (errorsSize != 0) {
                  setValidateError(errors);
                  toast.error("Form validation error. Fix all mistakes and submit again", toasterOption);
                }
                else {
                  setValidateError({});
                  window.$('#create_item_modal').modal('show');
                }
              }
            }


          }
        }
      }

    

    const AfterWalletConnected = async () => {

    }

    const TokenImageCall = async () => {
      var reqdata = {
        currAddr: UserAccountAddr
      }
      var tokenimages = await TokenImageCalls(reqdata);
      if (tokenimages  && tokenimages.data &&!isEmpty(tokenimages.data)) {
        setTokenImage(tokenimages.data)
      }
      
     
    }

    const priceoptionfunc = (e) => {
      setCoinNames(e.label)
    };

    async function getBuyTokensList() {
      var TokenList = await getListOfToken()
      var ListOption = [];
      var BidOption = [];
      //console.log("jsbdjkfbjkfk",TokenList.data.data.data)
      if (TokenList) {
        TokenList.data.data.data.map((item) => {
          ListOption.push({
            label: item.tokenSymbol
          })
        })
        TokenList.data.data.data.slice(1).map((item) => {
          BidOption.push({
            label: item.tokenSymbol
          })
        })
        //console.log("TokenListdata", ListOption)
        setPriceoption(ListOption);
        setBidPriceoption(BidOption)
      }
  
    }
  
  return (
    <div className="home_header">
        <div className="inner_page_bg">
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
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <div>
                <div>
                  <Button className="btn grey_btn_sm" onClick={() => { history.push('/create') }}>Go Back</Button>
                </div>
                <h2 className="inner_title my-4">{location_pathname == "create-single" && 'Create Single Collectible'}{location_pathname == "create-multiple" && 'Create Multiple Collectible'}</h2>
              </div>
            </GridItem>
          </GridContainer>
        </div>
        <div className="container mt-4">
          <GridContainer>
            <GridItem xs={12} sm={4} md={3}>
              <label className="primary_label">Preview</label>
              <div className="masonry mb-3 mb-lg-0 craete_card">
                <div className="item">
                  <div className="card_inner_item">
                    {/* <div className="item_details_top">
                      <p className="sold_text">Sold to @mikebasker</p>
                    </div> */}
                    <div className="item_inner_img">
                      {/* <img src={require("../assets/images/img-product2.png")} alt="Collections" className="img-fluid" /> */}
                      {
                    (TokenFilePreUrl.split('.').pop() == 'mp4')
                    ?
                      <video id="imgPreview" src={TokenFilePreReader != "" ? TokenFilePreReader : PreviewImg} 
                      type='video/mp4' alt="Collection" className="img-fluid" autoPlay playsInLine loop muted></video>
                    :
                      <img src={TokenFilePreReader != "" ? TokenFilePreReader : PreviewImg} 
                      id="imgPreview" alt="Collections" className="img-fluid" />
                    }
                    </div>
                    <div className="item_details_bot">
                    <h2>{TokenName}</h2>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="media follow_media">
                          <div className="img_tick_div">
                            {/* <img src={require("../assets/images/small-profile.png")} alt="User" className="img-fluid mr-2 img_user_new_sm" /> */}
                            <div class="d-flex creators_details">
                           
                         {(TokenImages)
                                  &&!isEmpty(TokenImages)
                                    && TokenImages.image != ""
                                    ? 
                                    <a href={TokenImages.customurl != "" ? `${config.Front_URL}/${TokenImages.customurl}` : `${config.Users_URL}/${TokenImages.curraddress}`} title={"Creator : " + TokenImages.name != "" ? TokenImages.name : String(TokenImages.curraddress)}>
                                      <img src={`${config.Back_URL}/images/${TokenImages._id}/${TokenImages.image}`} alt="User" className="img-fluid mr-2 img_user_new_sm" /></a>
                                    : 
                                    <a href={TokenImages.customurl != "" ? `${config.Front_URL}/${TokenImages.customurl}` : `${config.Users_URL}/${TokenImages.curraddress}`} title={"Creator : " + String(TokenImages.curraddress)} >
                                      <Avatars classValue="img-fluid mr-2 img_user_new_sm" />

                                    </a>
                                  }
                      
                        </div>
                          </div>
                          <div className="media-body flex_body">
                            <p className="mt-0 media_text mt-0 mb-0 ml-2">@
                            
                            {TokenImages && !isEmpty(TokenImages)&& TokenImages.name != "" ? TokenImages.name : UserAccountAddr.slice(0, 8).concat('....')}
                                  <br></br>
                                  You Own This
                            </p>
                          </div>
                        </div>
                        <div>
                         
                        <h3>
                          {(PutOnSale == false || (PutOnSale == true && PutOnSaleType=='FixedPrice' && TokenPrice == 0)) && <span>Not for sale </span>}
                          {(PutOnSale == true && PutOnSaleType=='FixedPrice' && TokenPrice > 0) && <span>{TokenPrice} {coinname} </span>}
                          {(PutOnSale == true && PutOnSaleType=='TimedAuction') && <span>Min Bid of {MinimumBid} {coinname} </span>}
                          {(PutOnSale == true && PutOnSaleType=='UnLimitedAuction') && <span>Open for Bids </span>}
                          for Each 1 of {TokenQuantity}
                        </h3>
                        {/* <h4>
                          {(PutOnSale == true && PutOnSaleType=='TimedAuction') && <span>{MinimumBid==''?0:MinimumBid} {config.tokenSymbol} </span>}
                          {(PutOnSaleType!='TimedAuction') && <span>Place a bid</span>}
                        </h4> */}
                     
                       
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
                        <p className="form_note">PNG, GIF, WEBP, MP4, WEBP, JPG . Max 30mb.</p>
                      </div>
                      <div className="file_btn grey_btn">Choose a file
                        <input 
                        className="inp_file"
                        accept="audio/*,video/*,image/*"
                        className="yes1 inp_file"
                        type="file"
                        name="image"
                        onChange={selectFileChange}
                        />
                      </div>
                        {ValidateError.photo && <span className="text-danger">{ValidateError.photo}</span>}
                    
                    </div>

                    {/* <select className="form-control primary_inp custom-select">
                      <option>Enter price for one iteam</option>
                      <option>Enter price for one iteam 2</option>
                    </select> */}

                  </div>
                  {/* <div className="form-group col-lg-6">
                    <div className="">
                      <div>
                        <label className="primary_label" htmlFor="inputEmail4">Choose Collection</label>
                        <p className="form_note invisible d-none d-lg-block">PNG, GIF, WEBP, MP4 . Max 30mb.</p>

                      </div>{location_pathname == 'create-single' &&
                      <Button className="grey_btn" data-toggle="modal" data-target="#choose_collection_modal">Create Bep- 721</Button>}
                      {location_pathname == 'create-multiple' &&
                      <Button className="grey_btn" data-toggle="modal" data-target="#choose_collection_modal">Create Bep- 1155</Button>}
                    </div>
                  </div> */}
                </div>

                <div className="form-row mt-3">
                  <div className="form-group col-xl-6">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <label className="primary_label" htmlFor="inputEmail4">Put on Sale</label>
                        <p className="form_note form_note_slider">You’ll receive bids on this item</p>
                      </div>
                      <label className="switch toggle_custom">
                      <input
                            type="checkbox"
                            id="putonsale"
                            name="putonsale"
                            onChange={CheckedChange}
                            checked={PutOnSale}
                          />
                        <span className="slider"></span>
                      </label>
                    </div>
                    {
                  (PutOnSale==false)?(''):(
                  <>
                    <div className="puton_sale_sec">
                      <Scrollbars style={{ height: 180 }}>
                        <div className="colct_img_section">
                          <div className="card card_bl_grey mr-2" onClick={()=>{changePutOnSaleType('FixedPrice');setCoinNames('')}}> 
                            <div className={"card-body p-3"+ ((PutOnSaleType=='FixedPrice')?'active':'inactive')}  id="fixedprice">
                              <img src={require("../assets/images/price.svg")} class="img-fluid img_radius img_col_change" alt="Fixed Price" />
                              <p className="colctn_card_txt mt-2">Fixed Price</p>

                            </div>
                          </div>
                          
                      {(CollectibleType == 721) &&
                          <div className="card card_bl_grey mr-2" onClick={()=>{changePutOnSaleType('TimedAuction');setCoinNames('')}} >
                            <div className={"card-body p-3"+ ((PutOnSaleType=='TimedAuction')?'active':'inactive')}
                          id="timedauction"
                       >
                              <img src={require("../assets/images/timed.svg")} class="img-fluid img_radius img_col_change" alt="Timed Auction" />

                              <p className="colctn_card_txt">Timed Auction</p>

                            </div>
                          </div>
                        }
                          <div className="card card_bl_grey mr-2" onClick={()=>{changePutOnSaleType('UnLimitedAuction');setCoinNames('')}}>
                            <div className={"card-body p-3" + ((PutOnSaleType=='UnLimitedAuction')?'active':'inactive')} onClick={()=>setCoinNames('')}
                          id="unlimitedauction">
                              <img src={require("../assets/images/unlimited.svg")} class="img-fluid img_radius img_col_change" alt="Unlimited Auction" />

                              <p className="colctn_card_txt">Unlimited Auction</p>

                            </div>
                          </div>

                        </div>
                      </Scrollbars>
                    </div>
                    </>
                    )}
                   {(PutOnSale==true && PutOnSaleType == 'FixedPrice')&&
                
                    <div className="fiexd_price_sec ">
                      <label className="primary_label" htmlFor="price">Price</label>

                      <div className="input-group input_grp_input_h mb-2 input_grp_style_sel pricegrid d-grid">
                        <input type="text"
                         className="form-control bor_rit_rad"
                          placeholder="0" 
                          aria-label="Recipient's username"
                           aria-describedby="basic-addon2"
                           name="TokenPrice"
                           id="TokenPrice"
                           onChange={inputChange}
                           placeholder="e.g. 10"
                           autoComplete="off"
                           //maxLength={config.maxLength}
                         />
                        <div className="input-group-append px-0">
                          {/* <span className="input-group-text px-0" id="basic-addon2"> */}
                           {/* {config.currencySymbol} */}
                          {/* </span> */}
                          <div className="input-group-append">
                              <Select
                                className="input-group-text px-0"
                                id="basic-addon2"
                                name="coinname"
                                onChange={priceoptionfunc}
                                options={priceoption}
                                label="Select price"
                                formControlProps={{
                                  fullWidth: true
                                }}
                              />

                            </div>
                        </div>
                      </div>
                      {ValidateError.TokenPrice && <span className="text-danger">{ValidateError.TokenPrice}</span>}
                      <p className="form_note form_note_slider">Service fee {Service_Fee/1e18}% On sale<br />
                        Deducting service fee you will get <span className="font_we_700_note_txt text-dark"> {YouWillGet} {coinname}</span>
                        </p>
                    </div>
                    }
                    {(PutOnSale==true && PutOnSaleType == 'FixedPrice')&&
                    <div className="form-group col-md-6">
                    </div>
                    }
                     {(PutOnSale==true && PutOnSaleType == 'TimedAuction')&&
                   
                    <div className="timed_auction_sec">
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label className="primary_label" htmlFor="min_bid">Minimum Bid</label>

                          <div className="input-group mb-2 input_grp_input_h input_grp_style_sel pricegrid d-grid">
                            <input
                             type="text" 
                             name="MinimumBid"
                              id="MinimumBid"
                              onChange={inputChange}
                            className="form-control bor_rit_rad"
                             placeholder="Enter Minimum Bid"
                              aria-label="Recipient's username" 
                              aria-describedby="basic-addon3" 
                              autoComplete="off"
                              maxLength={config.maxLength}
                              />
                              <div className="input-group-append px-0">
                            {/* <span className="input-group-text px-0" id="basic-addon2">
                            BNB
                             </span> */}
                            <div className="input-group-append">
                              <Select
                                className="input-group-text px-0"
                                id="basic-addon2"
                                name="coinname"
                                onChange={priceoptionfunc}
                                options={bidpriceoption}
                                label="Select price"
                                formControlProps={{
                                  fullWidth: true
                                }}
                              />

                            </div>
                          </div>
                           
                              {ValidateError.MinimumBid && <span className="text-danger">{ValidateError.MinimumBid}</span>}
                      <p className="form_note form_note_slider">
                        Bids below this amount won't be allowed. If you not enter any amount we will consider as 0
                      </p>
                          </div>
                          </div>
                          {(PutOnSale==true && PutOnSaleType == 'TimedAuction')&&
                 
                        <div className="col-12 col-lg-6">
                          <label className="primary_label" htmlFor="min_bid">Starting Date</label>
                        
                          <Accordion expanded={expanded6 === 'panel6'} onChange={handleChangeFaq6('panel6')} className="panel_trans">
                            <AccordionSummary aria-controls="panel6bh-content" id="panel6bh-header" className="px-0">
                              <button class="btn btn-secondary dropdown-toggle filter_btn select_btn" type="button">
                                <div className="select_flex">
                                  <span>{StartDate}</span>
                                  <span>
                                    <img src={require("../assets/images/arrow_circle.png")} alt="User" className="img-fluid ml-3" />

                                  </span>
                                </div>
                              </button>
                            </AccordionSummary>
                            <AccordionDetails className="px-0">
                              <div className="accordian_para col-12 px-0 pb-0">
                                <div class="card card_bl_grey grey_dark my-0 rad_2">
                                  <div class="card-body px-2 pt-2 pb-0">
                                    <ul className="colors_ul">
                                      <li id="RightAfterListing" onClick={()=>{DateChange('StartDateDropDown','RightAfterListing')}}>
                                        <span >Right After Listing</span>
                                      </li>
                                      <li  id="PickStart" onClick={()=>{DateChange('StartDateDropDown','PickStartDate')}}>
                                        <span  >Pick Specific Date</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </AccordionDetails>
                          </Accordion>
                          {ValidateError.Clocktime && <span className="text-danger">{ValidateError.Clocktime}</span>}
                 
                        </div>
                      }
                      {(PutOnSale==true && PutOnSaleType == 'TimedAuction')&&
                   
                        <div className="col-12 col-lg-6">
                          <label className="primary_label" htmlFor="min_bid">Expiration Date</label>

                          <Accordion expanded={expanded7 === 'panel7'} onChange={handleChangeFaq7('panel7')} className="panel_trans">
                            <AccordionSummary aria-controls="panel6bh-content" id="panel6bh-header" className="px-0">
                              <button class="btn btn-secondary dropdown-toggle filter_btn select_btn" type="button">
                                <div className="select_flex">
                                  <span  id="menuBut">{EndDate}</span>
                                  <span>
                                    <img src={require("../assets/images/arrow_circle.png")} alt="User" className="img-fluid ml-3" />

                                  </span>
                                </div>
                              </button>
                            </AccordionSummary>
                            <AccordionDetails className="px-0">
                              <div className="accordian_para col-12 px-0 pb-0">
                                <div class="card card_bl_grey grey_dark my-0 rad_2">
                                  <div class="card-body px-2 pt-2 pb-0">
                                    <ul className="colors_ul">
                                      <li  onClick={()=>{DateChange('EndDateDropDown','1 Day')}}>
                                        <span >1 day</span>
                                      </li>
                                      <li onClick={()=>{DateChange('EndDateDropDown','3 Day')}}>
                                        <span  >3 days</span>
                                      </li>
                                      <li onClick={()=>{DateChange('EndDateDropDown','PickEndDate')}} >
                                        <span >Pick Specific Date</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </AccordionDetails>
                          </Accordion>

                          {ValidateError.Clocktime && <span className="text-danger">{ValidateError.Clocktime}</span>}
                 
                        </div>
 } </div>

                      <div>
                        <span class="accept_text_foor font_14" data-toggle="modal" data-target="#learn_modal">Learn more how timed auctions work</span>
                      </div>
                    </div>                  
}
                  </div>
                  <div className="form-group col-xl-6">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <label className="primary_label" htmlFor="inputEmail4">Unlock Once Purchased</label>
                        <p className="form_note form_note_slider">Content will be unlocked after<br /> successful transaction</p>
                      </div>
                      <label className="switch toggle_custom">
                      <input
                            type="checkbox"
                            id="unlockoncepurchased"
                            name="unlockoncepurchased"
                            onChange={CheckedChange}
                          />
                        <span className="slider"></span>
                      </label>
                    </div>
                  
                    {
                  (Unlockoncepurchased) &&
                
                    <div className="form-group unlock_des ">
                      <label className="primary_label" htmlFor="unlock">Unlock</label>
                      <input type="text"
                       className="form-control" 
                       name="UnLockcontent"
                       id="UnLockcontent"
                       onChange={inputChange}
                       placeholder="Digital key,code to redeem or link to a file..."/>
                     <p className="form_note form_note_slider mt-2">Tip: Markdown syntax is supported</p>

                    </div>
            }
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="primary_label" htmlFor="name">Name</label>
                    <input type="text" 
                    className="form-control"
                    name="TokenName"
                    id="TokenName"
                    onChange={inputChange}
                    placeholder="e.g. Redeemable"
                    autoComplete="off" />
                         {ValidateError.TokenName && <span className="text-danger">{ValidateError.TokenName}</span>}
                 
                  </div>
                  <div className="form-group col-md-6">
                    <label className="primary_label" htmlFor="name">Royalty</label>
                    <div className="inp_grp">
                      <input type="text"
                       className="form-control"
                       name="TokenRoyalities"
                          onChange={inputChange}
                          id="name"
                          placeholder="0"
                          autoComplete="off"
                       />
                      <p className="inp_append">%</p>
                      <span>Suggested: 1%,5%, 10%, 20%. Maximum is 20%</span>
                        {ValidateError.TokenRoyalities && <span className="text-danger"><br/>{ValidateError.TokenRoyalities}</span>}
                    </div>
                  </div>

                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="primary_label" htmlFor="desccription">Description </label>
                    <textarea type="text" 
                    className="form-control" 
                    id="desccription" 
                    name="TokenDescription"
                    onChange={inputChange}
                    placeholder="Description about your NFTs"
                    autoComplete="off"
                    ></textarea>
                  </div>
                  <div className="form-group col-md-6">
                    <label className="primary_label" htmlFor="category">Category</label>
                    <div class="input-group mb-3 input_grp_style_1 single_option_grp order_noen_sc">
                     <span class="input-group-text w-100" id="basic-addon2">
                     <Select
                        className="form-control primary_inp custom-select"
                        id="TokenCategory"
                        name="TokenCategory"
                        onChange={selectChange}
                        options={CategoryOption}
                        label="Single select"
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    

                        {/* <select class="form-control" id="exampleFormControlSelect1" onChange={selectChange}>
                          <option>Select</option>
                         {CategoryOption.map((item)=>{return( <option value={item.label}>{item.label}</option>)})}

                        </select> */}
                      </span>
                    </div>
                    {ValidateError.TokenCategory && <span className="text-danger"><br/>{ValidateError.TokenCategory}</span>}
                    
                  </div>
                </div>
                <div className="form-row">

                  <div className="form-group col-md-6">
                    <label className="primary_label" htmlFor="desccription">Properties</label>
                    <input type="text"
                     className="form-control"
                      id="desccription"
                      name="TokenProperties"
                      onChange={inputChange}
                      placeholder="e.g. size"
                      autoComplete="off" />
                  </div>
                  {location_pathname == 'create-multiple' &&
                    <div className="form-group col-md-6">
                      <label className="primary_label" htmlFor="desccription">Number of copies</label>
                      <input
                        type="text"
                        className="form-control"
                        id="TokenQuantity"
                        name="TokenQuantity"
                        onChange={inputChange}
                        placeholder="e.g. 1"
                        value={TokenQuantity}
                        autoComplete="off"
                      />
                      <span>Maximum is 500</span>
                      {ValidateError.TokenQuantity && <span className="text-danger"><br/>{ValidateError.TokenQuantity}</span>}
                    </div>
                    }
                   
                    </div>
                    <div className="form-row">
                  <div className="form-group col-md-12 text-center">
                    
                      <Button className="theme-btn" onClick={CreateItem}>Create item</Button>
                  
                  </div>
              
                </div>

              </form>
            </GridItem>
          </GridContainer>
        </div>
      </div>
      </div>
      <Footer />

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
                  <img src={require("../assets/images/img_01.png")} alt="logo" className="img-fluid" />
                </div>
                <div>
                  <p className="form_note font_600 line_20 mb-2">We recommend an image of at least 400x400. Gifs work too.</p>
                  <div className="file_btn grey_btn_sm">Choose a file
                    <input className="inp_file" type="file" name="file" />
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
                    <input type="text" className="form-control" id="name" placeholder="Enter token name" />
                  </div>
                  <div className="form-group col-md-12 mb-2">
                    <label className="primary_label pl_font_sm" htmlFor="desccription">Symbol <span className="text-muted">(required)</span></label>
                    <input type="text" className="form-control" id="desccription" placeholder="Enter token symbol" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-12 mb-2">
                    <label className="primary_label pl_font_sm" htmlFor="name">Description <span className="text-muted">(Optional)</span></label>
                    <input type="text" className="form-control" id="name" placeholder="Spread some words about token collection" />
                  </div>
                  <div className="form-group col-md-12 mb-2">
                    <label className="primary_label pl_font_sm" htmlFor="desccription">Short url</label>
                    <input type="text" className="form-control" id="desccription" defaultValue="Company/Enter URL" />
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
                {/* {ApproveCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >} */}
                      {ApproveCallStatus == 'init' && <i className="fas fa-check mr-3 pro_initial" aria-hidden="true"></i> }
                      {ApproveCallStatus == 'processing' &&  <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i> }
                      {ApproveCallStatus == 'done' && <i className="fas fa-check mr-3 pro_complete" aria-hidden="true"></i>}
                      {ApproveCallStatus == 'tryagain' &&  <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i>}
                   
                  {/* <i className="fas fa-check mr-3 pro_initial" aria-hidden="true"></i> */}
                 
                  {/* <i className="fas fa-check mr-3 pro_incomplete" aria-hidden="true"></i> */}
                  {/* <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i> */}
                  <div className="media-body">
                    <p className="mt-0 approve_text">Approve</p>
                    <p className="mt-0 approve_desc">Checking balance and approving</p>
                  </div>
                </div>
                <div className="text-center my-3">
                  <Button className={"primary_btn btn-block"}
                   disabled={(ApproveCallStatus=='processing' || ApproveCallStatus=='done')}
                   onClick={ApproveCall}
                  >
                     {ApproveCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                      {ApproveCallStatus == 'init' && 'Approve'}
                      {ApproveCallStatus == 'processing' && 'In-progress...'}
                      {ApproveCallStatus == 'done' && 'Done'}
                      {ApproveCallStatus == 'tryagain' && 'Try Again'}
                    
                  </Button>
                </div>
                <div className="media approve_media">
                  {/* <i className="fas fa-check mr-3 pro_initial" aria-hidden="true"></i> */}
                  {MintCallStatus =='init' && <i className="fas fa-check mr-3 pro_initial" aria-hidden="true"></i> }
                      {MintCallStatus == 'processing' &&  <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i> }
                      {MintCallStatus == 'done' && <i className="fas fa-check mr-3 pro_complete" aria-hidden="true"></i>}
                      {MintCallStatus == 'tryagain' &&  <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i>}
                    <div className="media-body">
                    <p className="mt-0 approve_text">Upload files & Mint token</p>
                    <p className="mt-0 approve_desc">Call contract method</p>
                  </div>
                </div>
                <div className="text-center my-3">
                  <Button className={"primary_btn btn-block" }
                      disabled={(ApproveCallStatus!='done' || MintCallStatus=='processing' || MintCallStatus=='done')}
                      onClick={MintCall}> 
                      {MintCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                      {MintCallStatus == 'init' && 'Start'}
                      {MintCallStatus == 'processing' && 'In-progress...'}
                      {MintCallStatus == 'done' && 'Done'}
                      {MintCallStatus == 'tryagain' && 'Try Again'}
                   </Button>
                </div>

                <div className="media approve_media">
                {SignCallStatus =='init' && <i className="fas fa-check mr-3 pro_initial" aria-hidden="true"></i> }
                      {SignCallStatus == 'processing' &&  <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i> }
                      {SignCallStatus == 'done' && <i className="fas fa-check mr-3 pro_complete" aria-hidden="true"></i>}
                      {SignCallStatus == 'tryagain' &&  <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i>}
                   <div className="media-body">
                    <p className="mt-0 approve_text">Sign sell order</p>
                    {/* <p className="mt-0 approve_desc">Sign sell order using tour wallet</p> */}
                  </div>
                </div>
                <div className="text-center my-3">
                  <Button className={"primary_btn btn-block"}
                      disabled={(MintCallStatus!='done' || SignCallStatus=='processing' || SignCallStatus=='done')}
                      onClick={SignCall}>
   {SignCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                      {SignCallStatus == 'init' && 'Start'}
                      {SignCallStatus == 'processing' && 'In-progress...'}
                      {SignCallStatus == 'done' && 'Done'}
                      {SignCallStatus == 'tryagain' && 'Try Again'}
                   

                      </Button>
                </div>

                <div className="media approve_media">
                {SignLockCallStatus =='init' && <i className="fas fa-check mr-3 pro_initial" aria-hidden="true"></i> }
                      {SignLockCallStatus == 'processing' &&  <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i> }
                      {SignLockCallStatus == 'done' && <i className="fas fa-check mr-3 pro_complete" aria-hidden="true"></i>}
                      {SignLockCallStatus == 'tryagain' &&  <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i>}
                    <div className="media-body">
                    <p className="mt-0 approve_text">Sign lock order</p>
                    {/* <p className="mt-0 approve_desc">Sign lock order using tour wallet</p> */}
                  </div>
                </div>
                <div className="text-center mt-3">
                  <Button className={"primary_btn btn-block"}
                      disabled={(SignCallStatus!='done' || SignLockCallStatus=='processing' || SignLockCallStatus=='done')}
                      onClick={SignLockCall}>   {SignLockCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                      {SignLockCallStatus == 'init' && 'Start'}
                      {SignLockCallStatus == 'processing' && 'In-progress...'}
                      {SignLockCallStatus == 'done' && 'Done'}
                      {SignLockCallStatus == 'tryagain' && 'Try Again'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>


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
                        {/* <option>ETH</option> */}

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
      {/* calendar Modal */}
      <div class="modal fade primary_modal" id="calendar_modal" tabindex="-1" role="dialog" aria-labelledby="calendar_modalCenteredLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="modal-title" id="calendar_modalLabel">Choose date</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div className="pb-3">
              <Datetime
                                  input={false}
                                  value={Clocktime}
                                  isValidDate={valid}
                                  onChange={(value) => set_Clocktime(value)}
                                />
              </div>
              <div class="text-center pb-3">
                              <Button className="theme-btn" id="doneStartDate" onClick={() => ModalAction('calendar_modal','hide')}>Done</Button>
                            </div>
            </div>
            
          </div>
        </div>
      </div>
      {/* end calendar modal */}
         {/* calendar Modal */}
         <div class="modal fade primary_modal" id="calendar_modal_expire" tabindex="-1" role="dialog" aria-labelledby="calendar_modalCenteredLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="modal-title" id="calendar_modalLabel">Choose date</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div className="pb-3">
              <Datetime
                                  input={false}
                                  value={EndClocktime}
                                  isValidDate={valid1}
                                  onChange={(value) => set_EndClocktime(value)}
                                />
              </div>
            </div>
            <div class="text-center pb-3">
                              <Button className="theme-btn mb-3" id="doneEndDate" onClick={() => ModalAction('calendar_modal_expire','hide')}>Done</Button>
                            </div>
          </div>
        </div>
      </div>
      {/* end calendar modal */}
   
      {/* learn Modal */}
      <div class="modal fade primary_modal learn_modal" id="learn_modal" tabindex="-1" role="dialog" aria-labelledby="learn_modalCenteredLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-md" role="document">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="modal-title" id="learn_modalLabel">Working of timed auction</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>When you put your item on timed auction, you choose currency, minimum bid, starting and ending dates of your auction.</p>

              <p>The bidder can only place a bid which satisfies the following conditions:</p>
              <ol>
                <li>
                  It is at least minimum bid set for the auction
                </li>
                <li>
                  It is at least 5% higher than the current highest bid or it is at least 0.1 ETH higher than the current highest bid

                </li>
              </ol>

              <p>Note that some bids may disappear with time if the bidder withdraws their balance. At the same time, some bids may reappear if the bidder has topped up their balance again.</p>

              
              <p>In the 48 hours after the auction ends you will only be able to accept the highest available bid placed during the auction. As with regular bids, you will need to pay some gas to accept it.Note that you can always decrease the price of your listing for free, without making a transaction or paying gas. You can view all your items here.</p>


            </div>
          </div>
        </div>
      </div>
      {/* end learn modal */}
    </div>
  );
}
