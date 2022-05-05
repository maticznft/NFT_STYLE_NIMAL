import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import "@metamask/legacy-web3"
import Web3 from 'web3';
import SINGLE from 'ABI/SINGLE.json';
import MULTIPLE from 'ABI/MULTIPLE.json';
//import avatar from "assets/img/faces/marc.jpg";
import isEmpty from '../../lib/isEmpty';
import config from '../../lib/config';

import { updateProfile, getuserdata,getadminuserdata,updateAdminProfile,logout } from '../../actions/users';

const styles = {
cardCategoryWhite: {
	color: "rgba(255,255,255,.62)",
	margin: "0",
	fontSize: "14px",
	marginTop: "0",
	marginBottom: "0"
},
cardTitleWhite: {
	color: "#FFFFFF",
	marginTop: "0px",
	minHeight: "auto",
	fontWeight: "300",
	fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
	marginBottom: "3px",
	textDecoration: "none"
}
};

// toaster config
toast.configure();
let toasterOption = {
position: "top-right",
autoClose: 2000,
hideProgressBar: false,
closeOnClick: true,
pauseOnHover: true,
draggable: true,
progress: undefined,
}


const initialFormValue = {
'name': "",
'email': "",
'mobilenumber': 0,
'photo': "",
'company': "",
'designation': "",
'detail': "",

}



const useStyles = makeStyles(styles);



export default function UserProfile() {
const classes = useStyles();
const history = useHistory();
const dispatch = useDispatch();
const [userdet, setUser] = useState();
const [photoimage, setPhoto] = useState();
const [formValue, setFormValue] = useState({});
const [validateError, setValidateError] = useState({});


useEffect(() => {
	getUserData();
}, [])
const logoutuser = (e) => {
	logout(history);
      }

const handleFile = (event) => {
	event.preventDefault();
	//alert("sasasasa");
	//console.lo(event.target.files[0])
	//settmpupimagefront(URL.createObjectURL(event.target.files[0]));
	const { id, files } = event.target;
	let formData = { ...formValue, ...{ [id]: files[0] } }
	setFormValue(formData)
};


// function
const onChange = (e) => {
	e.preventDefault();
	const { id, value } = e.target;
	let formData = { ...formValue, ...{ [id]: value } }
	setFormValue(formData)
}

const {
	email,
	mobilenumber,
	photo,
	company,
	designation,
	password,
	detail,
	name,adminAddress
} = formValue

const handleFormSubmit = async (e) => {
	// console.lo("saran");
	// e.preventDefault();
if(window.ethereum){
  var web3 = new Web3(window.ethereum);
 
  if(web3&&web3.eth){
	var addrs = window.web3.eth.defaultAccount;
	var currAddr = addrs.toString().toLowerCase();
	const CoursetroContract = new web3.eth.Contract(SINGLE, config.singleContract);
	var adminAddress = await CoursetroContract.methods.owner().call();
	adminAddress = adminAddress.toLocaleLowerCase();

	console.log('handleForm>>>>',currAddr, adminAddress);
	if ( adminAddress !== currAddr) {
		toast.warning('Admin can only edit',toasterOption)
		return false;
	}
	var currAddress = adminAddress;
	let reqData = {
		email,
		mobilenumber,
		photo,
		company,
		designation,
		password,
		detail,
		currAddress,
		name
	}
	let data = await updateAdminProfile(reqData);
	console.log('reQData',data);
	if (data && data.microValue && data.microValue.data && data.microValue.data.success === true) {
		setValidateError("");
		toast.success('Profile updated Successfully', toasterOption);
		// window.location.reload()
		logoutuser()
		getUserData();
	} else {
		setValidateError('Error Occured');
	}
}
}
else{
	toast.warning("Connect metamask")
}
}


const getUserData = async () => {
	var adminAddress=""
var web3 = new Web3(config.BNBProvider);
  if(web3){
    const CoursetroContract = new web3.eth.Contract(SINGLE, config.singleContract);
    adminAddress = await CoursetroContract.methods.owner().call();
	  adminAddress = adminAddress.toLocaleLowerCase();
    config.adminAddress=adminAddress
    console.log("admin address",adminAddress)
  }
    var postadata={
      currAddr : adminAddress
    }
	var test = await getadminuserdata(postadata);

	let formdata = {};

	console.log("----formdata", test)
	if(test && test.adminData && test.adminData.userValue){
		var data = test.adminData;
		formdata['email'] = data.userValue.email;
		formdata['mobilenumber'] = data.userValue.phoneNo;
		formdata['designation'] = data.userValue.designation;
		formdata['detail'] = data.userValue.about;
		formdata['company'] = data.userValue.company;
		formdata['password'] = data.userValue.normalPassword;
		formdata['name'] = data.userValue.name;
    formdata['adminAddress'] = data.userValue.adminAddress;
		setPhoto(data.userValue.profileImage);
		setFormValue(formdata);
	}

}


return (
	<div>
	<GridContainer>
		<GridItem xs={12} sm={12} md={8}>
		<Card>
			<form className={classes.form} noValidate >
			<CardHeader color="primary">
				<h4 className={classes.cardTitleWhite}>Admin Profile</h4>
				{/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
			</CardHeader>
			<CardBody>
				<GridContainer>
				<GridItem xs={12} sm={12} md={5}>
					<CustomInput
					labelText="Company"
					value={company}
					onChange={onChange}
					id="company"
					formControlProps={{
						fullWidth: true
					}}
					// inputProps={{
					//   disabled: true
					// }}
					/>
					{
				validateError.company && <span className={classes.textDanger}>{validateError.company}</span>
			}
				</GridItem>
				<GridItem xs={12} sm={12} md={3}>
					<CustomInput
					labelText="Name"
					onChange={onChange}
					id="name"
					value={name}
					formControlProps={{
						fullWidth: true
					}}
					/>

			{
				validateError.name && <span className={classes.textDanger}>{validateError.name}</span>
			}
				</GridItem>
				<GridItem xs={12} sm={12} md={4}>
					<CustomInput
					labelText="Email address"
					onChange={onChange}
					value={email}
					id="email"
					formControlProps={{
						fullWidth: true
					}}
					/>

			{
			validateError.email && <span className={classes.textDanger}>{validateError.email}</span>
			}
				</GridItem>
				</GridContainer>
				<GridContainer>
				{/* <GridItem xs={12} sm={12} md={4}>
					<CustomInput
					labelText="Mobile"
					onChange={onChange}
					value={mobilenumber}
					id="mobilenumber"
					formControlProps={{
						fullWidth: true
					}}
					/>

			{
			validateError.mobilenumber && <span className={classes.textDanger}>{validateError.mobilenumber}</span>
			}
				</GridItem> */}
				<GridItem xs={12} sm={12} md={4}>
					<CustomInput
					labelText="Designation"
					onChange={onChange}
					id="designation"
					value={designation}
					formControlProps={{
						fullWidth: true
					}}
					/>

			{
			validateError.designation && <span className={classes.textDanger}>{validateError.designation}</span>
			}
				</GridItem>
				<GridItem xs={12} sm={12} md={4}>
					<CustomInput
					labelText="Password"
					onChange={onChange}
					id="password"
					value={password}
					formControlProps={{
						fullWidth: true
					}}
					/>
				</GridItem>
</GridContainer>
<GridContainer>
				
				<GridItem xs={12} sm={12} md={4}>
					<CustomInput
					// labelText="Admin Address"
          id="adminAddress"
					value={config.adminaddress||adminAddress}
					formControlProps={{
						fullWidth: true,
						
					}}
					inputProps={{
						disabled: true
					}}
					/>

			<p>Admin fee called from contract</p>
				</GridItem>
				
				</GridContainer>
			</CardBody>
			<CardFooter>
				<Button color="primary"onClick={handleFormSubmit}>Update Profile</Button>
			</CardFooter>
			</form>
		</Card>
		</GridItem>
		<GridItem xs={12} sm={12} md={4}>
		
		</GridItem>
	</GridContainer>
	</div>
);
}
