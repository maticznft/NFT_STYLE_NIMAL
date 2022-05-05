import React, { useEffect,useState } from "react";

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
import {
	getCurAddr,
	editprofile,
	getprofile,
} from '../actions/v1/user';
import Web3 from 'web3';
import '@metamask/legacy-web3';
import config from '../lib/config';
import isEmpty from '../lib/isEmpty';
import { toast } from 'react-toastify';
import ConnectWallet from '../views/separate/Connect-Wallet'
import { useSelector } from 'react-redux';
toast.configure();
let toasterOption = config.toasterOption;

const dashboardRoutes = [];

const useStyles = makeStyles(styles);
const initialFormValue = {
	'name': "",
	'personalsite': "",
	'customurl': "",
	'bio': "",
	'twitter': "",
	'instagram': "",
	'facebook': "",
	'youtube': "",
	'photo': ""
}

// Scroll to Top
function ScrollToTopOnMount() {
useEffect(() => {
	window.scrollTo(0, 0);
}, []);
return null;
}

export default function EditProfile(props) {
const classes = useStyles();
const { ...rest } = props;
const Wallet_Details = useSelector(state => state.wallet_connect_context);
const [formValue, setFormValue]         = useState(initialFormValue);
const [disablebtn, setDisablebtn]       = useState(0)
const [imageVal,setImageVal]			= useState('')
const [onchangeimg, setOnchangeimg]     = useState("")
const [validateError, setValidateError] = useState({});
const [Service_Fee, set_Service_Fee] = useState(0);
const [UserAccountAddr, Set_UserAccountAddr] = useState(Wallet_Details.UserAccountAddr);
const [UserAccountBal, Set_UserAccountBal] = useState(0);
const [Wen_Bln,set_Wen_Bln]=useState(0);
const [WalletConnected, Set_WalletConnected] = useState('false');
const [providerss,set_providers]=useState(null)
const [convertVal, setConvertVal] = React.useState(0);
const [Promotion_List,Set_Promotion_list] =useState({})
const [AddressUserDetails, Set_AddressUserDetails] = useState({});
const [Accounts, Set_Accounts] = useState('');
const [Ids,setIds]=useState('');
const [ImageVal,setImageVal1]=useState('');
const [tokenValues, settokenValues] = React.useState("");
 
const history = useHistory();

const {
	name,
	personalsite,
	customurl,
	bio,
	twitter,
	instagram,
	facebook,
	youtube,
	photo
} = formValue

const editprofileUI=async(data)=>{
	//alert(JSON.stringify(data))
	var validateError={};
	let imageFormat = /\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|gif)$/;
	let nameRegex = /^[:]+(\s{0,1}[a-zA-Z-, ])*$/;
	let imageSize=5000000;
	if (onchangeimg != "") {
		//console.log("epwopeopwope",data.imageVal,onchangeimg,onchangeimg.split('.').pop())
		if(data.imageVal!=""){
			if (imageSize < (data.imageVal).size) {
			validateError.image = "File size must be below 5mb"
			}
			
			if (!(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|gif|GIF)$/i).test((data.imageVal).name))  {
			validateError.image = "file is invalid. only allowed JPG,PNG,WEBP,gif";
			}
		}
		
		}
	if((data.name)==""){
		validateError.names="Name is Required"
	}
	if(data.name!=""){
		if((config.nameFormat).test(data.name)){
			validateError.names = "Cannot allowed smiley"
		}
		}
		if ((data.customurl) == "") {
			validateError.customurl = "customurl is Required"
		  }
		  if ((data.customurl) != "") {
			if((config.nameFormat).test(data.customurl)){
			validateError.customurl = "Cannot allowed smiley"
			}
		  }
		  if ((data.customurl) != "") {
			  if((nameRegex).test(data.customurl)){
			  validateError.customurl = "No Spaces are Numbers"
			  }
			}
			if ((data.customurl) != "") {
			  if((data.customurl).includes('.')){
			  validateError.customurl = "Dots are not allowed"
			  }
			}
			if ((data.customurl) != "") {
			  if((data.customurl).match(/^(?:.*[|,/,\\])/)){
			  validateError.customurl = "Slashes are not allowed"
			  }
			}
			
	setValidateError(validateError)
	return validateError;	
}

	const onChange = (e) => {
		setDisablebtn(0)
		e.preventDefault();
		const { id, value } = e.target;
		let formData = { ...formValue, ...{ [id]: value } }
		setFormValue(formData)
	}
	useEffect(() => {
		getProfiledata();
	},[UserAccountAddr])
	const handleFormSubmit = async (e) => {
		e.preventDefault();
		const currAddr = UserAccountAddr;
		const custUrl= String(customurl).replace(/\s+/g, "").trim().toLowerCase();
		let reqData = {
			imageVal,
			name,
			personalsite,
			customurl:custUrl,
			bio,
			twitter,
			instagram,
			facebook,
			youtube,
			photo,
			currAddr
		}
		editprofileUI(reqData)
		// const { Errors } = await editprofileUI(reqData);
		var errorUI  = await editprofileUI(reqData);
		if(isEmpty(errorUI)){
		//(reqData,'reqDatareqDatareqDatareqData')
		const { error } = await editprofile(reqData);
	
		if (isEmpty(error)) {
			setDisablebtn(3)
			setDisablebtn(0)
			setValidateError("");
			toast.success('Profile has been updated', toasterOption);
			setTimeout(
				() => history.push("/my-items")
				, 3000)
			setValidateError({});
		} else {
		setDisablebtn(1)
		setValidateError(error);
		}
	}
	else {
		setDisablebtn(1)
		setValidateError(errorUI);
		}

	}
	async function getProfiledata() {
		setDisablebtn(0)
		var web3 = new Web3(config.providercon);
		const currAddr = UserAccountAddr;
		let reqData = {
			currAddr
		}
		var data = await getprofile(reqData);
		if (data && data.userValue != undefined) {
			let formdata = {};
			if (data && data.userValue != undefined) {
				let formdata = {};
			if (data.userValue.image != '') {
				var profileimage = config.Back_URL + '/images/'+ data.userValue._id+'/'+data.userValue.image;
				setOnchangeimg(profileimage);
			} else {
			}
			formdata['photo'] = data.userValue.image;
			formdata['bio'] = data.userValue.bio;
			formdata['curraddress'] = data.userValue.curraddress;
			formdata['customurl'] = data.userValue.customurl;
			formdata['twitter'] = data.userValue.twitter;
			formdata['instagram'] = data.userValue.instagram;
			formdata['facebook'] = data.userValue.facebook;
			formdata['youtube'] = data.userValue.youtube;
			formdata['name'] = data.userValue.name;
			formdata['personalsite'] = data.userValue.personalsite;
			setFormValue(formdata)
		}
		else {
			
		}
	}}

	const AfterWalletConnected=()=>{}

	const handleFile = (event) => {
		setDisablebtn(0)
		event.preventDefault();
		var reader = new FileReader()
		const { id, files } = event.target;
		setDisablebtn(0)
	   	if (event.target.files && event.target.files[0]) {
			var file = event.target.files[0];
			setImageVal(file)
			var url = reader.readAsDataURL(file);
			reader.onloadend = function (e) {
				if(reader.result) {
					setOnchangeimg(reader.result);
				}
			}
		}
		let formData = { ...formValue, ...{ [id]: files[0] } };
		setFormValue(formData);
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
	<ScrollToTopOnMount/>
	<div className={classes.pageHeader + " inner_pageheader inner_page_padding_big"}>
	
		<div className="container mt-4">
		<h2 className="heading_black_main">Edit Your Profile</h2>
		<GridContainer>
			<GridItem xs={12} lg={4} md={5}>
			<div className="d-flex align-items-center mt-4">
			<div className="profile_img_edit mr-2">
					{onchangeimg=='' &&
						<img src={require("../assets/images/profile_img.png")} alt="logo" id="imgPreview" className="img-fluid"/> 
					}
					{onchangeimg!='' &&
						<img src={onchangeimg? onchangeimg : null} alt={onchangeimg? onchangeimg.name : null} id="imgPreview" className="img-fluid"/>
					}
			</div>
				<div>
					<div className="file_btn grey_btn_sm grey_btn_sm_edit">Choose a photo
							<input 
								className="inp_file" 
								type="file" 
								name="photo"
								name="photo" 
								id="photo"
								onChange={(e)=>handleFile(e)} required="true"
							/>
					</div>
					{validateError.image && <span className="text-danger">{validateError.image}</span>}
                  
				</div>
			</div>
			<p className="form_note font_600 line_20 mb-2 mt-4">We recommend an image below of at least 400x400. <br />Gifs work too.</p>
			</GridItem>
			<GridItem xs={12} lg={8} md={7}>
			<form className="edit_profile_form mt-4">
				<div className="form-row">
				<div className="form-group col-lg-12 col-xl-6">
					<label className="primary_label" htmlFor="name">Name</label>
					<input 
						type="text" 
						className="form-control" 
						id="name" 
						onChange={onChange} 
						value={name}
						placeholder="e.g. Han"
						/>
				</div>
				{validateError.names && <span className="text-danger">{validateError.names}</span>}
                                   
				</div>
				<div className="form-row">
				<div className="form-group col-lg-12 col-xl-6">
					<label className="primary_label" htmlFor="name">Bio</label>
					<input 
						type="text" 
						className="form-control" 
						id="bio" 
						onChange={onChange} 
						value={bio}
						placeholder="e.g. I'm a pro illustrator"/>
				</div>                 
				</div>

				<div className="form-row">
				<div className="form-group col-lg-12 col-xl-6">
					<label className="primary_label" htmlFor="name">Custom URL</label>
					<span className="input-group-text pl-0 min_h_45_px min_h_35" id="basic-addon2">{`${config.Front_URL}/${(customurl == "")?'your URL':customurl}`}</span>
				
					<input 
						type="text" 
						className="form-control" 
						id="name"
						id="customurl"
						onChange={onChange} 
						value= { customurl } 
						placeholder="Ex.ronaldo, @ronaldo"/>
				</div>
				{validateError.customurl && <span className="text-danger">{validateError.customurl}</span>}
                  
				
				</div>
			
				<div className="form-row">
				<div className="form-group col-lg-12 col-xl-6">
					<label className="primary_label" htmlFor="name">Twitter </label>
					<input 
						type="text" 
						className="form-control" 
						onChange={onChange} 
						value={twitter} 
						id="twitter"
						placeholder="Complete Link including https"/>				
				</div>
				
				
				</div>
				<div className="form-row">
				<div className="form-group col-lg-12 col-xl-6">
					<label className="primary_label" htmlFor="name">Instagram</label>
					<input 
						type="text" 
						className="form-control" 
						onChange={onChange} 
						value={instagram} 
						id="instagram"
						placeholder="Complete Link including https"/>				
				</div>
				
				</div>
				<div className="form-row">
				<div className="form-group col-lg-12 col-xl-6">
					<label className="primary_label" htmlFor="name">Facebook</label>
					<input 
						type="text" 
						className="form-control" 
						onChange={onChange} 
						value={facebook} 
						id="facebook"
						placeholder="Complete Link including https"/>				
				</div>
				
				</div>
				<div className="form-row">
				<div className="form-group col-lg-12 col-xl-6">
					<label className="primary_label" htmlFor="name">YouTube</label>
					<input 
						type="text" 
						className="form-control" 
						onChange={onChange} 
						value={youtube} 
						id="youtube"
						placeholder="Complete Link including https"/>				
				</div>
				
				</div>
			
			
				<div className="form-row">
				<div className="form-group col-lg-12 col-xl-6">
					<label className="primary_label" htmlFor="name">Personal Site or portfolio</label>
					<input 
						type="text" 
						className="form-control" 
						onChange={onChange}
						id="personalsite"
						value={personalsite}
						placeholder="Complete Link including https"/>
				</div>
				
				</div>
				<div className="mt-3">
					{ disablebtn == 0 &&
						<Button className="primary_btn" onClick={handleFormSubmit}>Update Profile</Button>
					}
					{
						disablebtn == 1 && 
						<Button className="primary_btn" disabled="true">Form Error</Button>
					}
				</div>
			</form>
			</GridItem>
		</GridContainer>
		</div>
		</div>
	</div>
	<Footer/>
	</div>
);
}
