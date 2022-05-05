import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { useHistory, useParams, Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import isEmpty from '../../lib/isEmpty';
import Web3 from "web3";
import EXCHANGE from 'ABI/ABI.json';
import Modal from 'react-modal';
import SINGLE from '../../ABI/SINGLE.json';
import MULTIPLE from '../../ABI/MULTIPLE.json';
import { getcatory, gettokendata, updatecategory, BurnField } from '../../actions/users';
import config from '../../lib/config'
import axios from "axios";
const useStyles = makeStyles(styles);
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
let toasterOption = config.toasterOption

const initialFormValue = {

	"image": "",
	"swapPrice": 0,
	"tokenDesc": "",
	"tokenPrice": 0,
	"tokenCategory": "",
	"likecount": 0,
	"hashValue": "",
	"status": "",
	"deleted": 0,
	"tokenQuantity": 0,
	"balance": 0,
	"contractAddress": "",
	"type": 721,
	"minimumBid": 0,
	"endclocktime": null,
	"clocktime": null,
	"unlockcontent": "",
	"counts": 0,
	"PutOnSale": true,
	"PutOnSaleType": "",
	"ipfsimage": "",
	"tokenCounts": 0,
	"tokenName": "",
	"tokenRoyality": 0,
	"tokenBid": true,
	"tokenOwner": "",
	"tokenCreator": "",
	"timestamp": null,


}
function afterOpenModal() {
	// references are now sync'd and can be accessed.
	// subtitle.style.color = '#f00';
}


export default function EditServiceFee() {
	const classes = useStyles();
	const history = useHistory();
	const [UserAccountAddr, Set_UserAccountAddr] = useState('')
	const [Accounts, Set_Accounts] = useState('')
	const [owner_Get, set_Owner_Get] = useState('')
	const [owner_Get1, set_Owner_Get1] = useState('')
	const [UserAccountBal, Set_UserAccountBal] = useState(0)
	const [default_service_fee, set_default_service_fee] = useState(0)
	const [default_service_fee1, set_default_service_fee1] = useState(0)


	const [ContractCall, setContractCall] = useState(null)
	const [primary_service_fee_collector, set_primary_service_fee_collector] = useState('')
	const [tertairy_service_fee_collector, set_tertairy_service_fee_collector] = useState('')
	const [secondary_service_fee_collector, set_secondary_service_fee_collector] = useState('')

	const [secondary_service_fee, set_secondary_service_fee] = useState('')
	const [primary_service_fee, set_primary_service_fee] = useState('')
	const [tertairy_service_fee, set_tertairy_service_fee] = useState(0)

	const [tertairy_service_fee_Number, set_tertairy_service_fee_Number] = useState('')
	const [secondary_service_fee_Number, set_secondary_service_fee_Number] = useState('')
	const [primary_service_fee_Number, set_primary_service_fee_Number] = useState('')


	const [ServiceDisable, setServiceDisable] = useState('start')
	const [ServiceDisable1, setServiceDisable1] = useState('start')

	const { Id } = useParams();
	console.log("shgdhsjghsdfgfsdjfsdfd", Id)
	useEffect(() => {
		getConnect();
		callMeth();

	}, [])
	const getConnect = async () => {
		// if (window.ethereum) {
		var web3s = new Web3(config.BNBProvider)


		if (web3s) {
			var contractCall = new web3s.eth.Contract(SINGLE, config.singleContract)
			setContractCall(contractCall)

			var ownerGet = await contractCall.methods.owner().call()
			var ownget = String(ownerGet).toLowerCase();
			set_Owner_Get(ownget)
			set_Owner_Get1(ownget)
			// get service fee
			var servicefee = await contractCall.methods.getServiceFee().call()
			console.log("jkjkkdjks", servicefee)

			set_default_service_fee((servicefee) / config.decimalValues)

		}
	}


	const callMeth = async () => {
		if (window.ethereum) {
			var web3 = new Web3(config.BNBProvider)
			if (web3 !== undefined) {
				await window.ethereum.enable()
					.then(async function () {
						const web3 = new Web3(window.web3.currentProvider)
						if (window.web3.currentProvider.networkVersion == config.networkVersion) {
							if (window.web3.currentProvider.isMetaMask === true) {
								if (window.web3 && window.web3.eth && window.web3.eth.defaultAccount) {
									var currAddr = window.web3.eth.defaultAccount;
									var CurAddr = String(currAddr).toLowerCase();
									Set_UserAccountAddr(CurAddr);
									var result = await web3.eth.getAccounts()
									var setacc = result[0];
									console.log('Account :', setacc);
									Set_Accounts(setacc);
									web3.eth.getBalance(setacc)
										.then(val => {
											var balance = val / 1000000000000000000;
											Set_UserAccountBal(balance);

										})


								}
							}
						}
						else {
							toast.warning("Please Connect to Rinkeby Network", toasterOption);
						}
					})
			}
		}
	}

	const onChangeFUnc = async (e) => {
		var val = e.target.id
		console.log("idssss", val)
		setServiceDisable('start')
		switch (val) {
			case 'primaryowner':
				if (e.target.value) {
					set_Owner_Get1(e.target.value)
				}
				else {
					set_Owner_Get1('')
				}
				break;
			case 'servicefeecheck':
				if (e.target.value) {
					set_default_service_fee(e.target.value)
				}
				else {
					set_default_service_fee(0)
				}
		}


	}
	const EditServiceFeesOnly = async (e) => {
		if (window.ethereum) {
			setServiceDisable1('process')
			var web3 = new Web3(window.ethereum)
			var contractCall = new web3.eth.Contract(SINGLE, config.singleContract)
			console.log("iwueiwueuiwueuw", contractCall.methods)
			await contractCall
				.methods
				.serviceFunction(web3.utils.toWei(String(default_service_fee)))
				.send({ from: Accounts })
				.then(async () => {
					var contractCall1 = new web3.eth.Contract(MULTIPLE, config.multipleContract)
					await contractCall1
						.methods
						.serviceFunction(web3.utils.toWei(String(default_service_fee)))
						.send({ from: Accounts })
						.then(async () => {
									setServiceDisable1('done')
									toast.success("Service fee updated")
									setTimeout(() => {
										window.location.reload();
									}, 2000);
						}).catch(() => {
							setServiceDisable1('try')
						})
				})
				.catch(() => {
					setServiceDisable1('try')
				})
		}
		else {
			toast.error("Please Connect metamask")
		}


	}
	const EditServiceFees = async () => {
		setServiceDisable('process')
		var web3 = new Web3(window.ethereum)
		var contractCall = new web3.eth.Contract(SINGLE, config.singleContract)

		console.log("contract call", contractCall.methods)
		await contractCall
			.methods
			.transferOwnership(owner_Get1.toString())
			.send({ from: Accounts })
			.then(async () => {
				var contractCall1 = new web3.eth.Contract(MULTIPLE, config.multipleContract)

				console.log("contract call", contractCall1.methods)
				await contractCall1
					.methods
					.transferOwnership(owner_Get1.toString())
					.send({ from: Accounts })
					.then(() => {
						setServiceDisable('done')
						toast.success("Service fee updated")
						window.location.reload();
					})
					.catch(() => {
						window.location.reload();
						setServiceDisable('try')
					})
			})
			.catch(() => {
				window.location.reload();
				setServiceDisable('try')
			})



		// }
		// else {
		// 	setServiceDisable('error')
		// }
	}


	return (
		<div>
			<div className="page_header">
				<button className="btn btn-success mr-3"><Link to="/">Back</Link></button>
			</div>
			<GridContainer>
				<GridItem xs={12} sm={12} md={12}>
					<Card>
						<form className={classes.form}>
							<CardHeader color="primary">
								<h4 className={classes.cardTitleWhite}>View Service Fee</h4>
								<h5><u>Note</u></h5>
								<h6> (MUST same both Single and Multiple) Note - This process take Two Transaction Please Confirm One by One</h6>
							</CardHeader>
							<CardBody>
								<GridContainer>
									<GridItem xs={12} sm={12} md={3} >
										<CustomInput
											labelText="Service Fee"
											id="servicefeecheck"
											// defaultValue="0"
											value={default_service_fee || ""}
											onChange={(e) => onChangeFUnc(e)}
											formControlProps={{
												fullWidth: true
											}}
										/>
										{default_service_fee == 0 && <span className="text-danger">Check service fee</span>}
									</GridItem>

									{UserAccountAddr && String(UserAccountAddr).toLowerCase() == String(owner_Get).toLowerCase() &&
										<GridItem xs={12} sm={12} md={3} style={{ marginTop: 20 }}>
											<Button color="primary"
												disabled={(ServiceDisable1 == 'init') || (ServiceDisable1 == 'process') || (ServiceDisable1 == 'done') || (ServiceDisable == 'error')}
												onClick={((ServiceDisable1 == 'start') || (ServiceDisable1 == 'try')) && EditServiceFeesOnly}
											>
												{ServiceDisable1 == 'init' && 'Edit Owners Service Fee'}
												{ServiceDisable1 == 'error' && 'Error.. Check Input Fields'}
												{ServiceDisable1 == 'start' && 'Edit Owners Service Fee'}
												{ServiceDisable1 == 'process' && 'In-Progress'}
												{ServiceDisable1 == 'done' && 'Done'}
												{ServiceDisable1 == 'try' && 'Try-Again'}
											</Button>
											{/* <Button color="primary" onClick={EditServiceFeesOnly}>Edit Service Fee</Button> */}
										</GridItem>}
								</GridContainer>
								<br />
								<GridContainer>
									<GridItem xs={12} sm={12} md={3}>

										<CustomInput
											labelText="Primary Owner"
											id="primaryowner"
											value={owner_Get1 || ""}
											formControlProps={{
												fullWidth: true
											}}
											onChange={(e) => onChangeFUnc(e)}
										/>

									</GridItem>

								</GridContainer>

								<GridContainer>

									<GridItem xs={12} sm={12} md={3}>
										{UserAccountAddr && (String(UserAccountAddr).toLowerCase() == String(owner_Get).toLowerCase()) &&
											<Button color="primary"
												disabled={(ServiceDisable == 'init') || (ServiceDisable == 'process') || (ServiceDisable == 'done') || (ServiceDisable == 'error')}
												onClick={((ServiceDisable == 'start') || (ServiceDisable == 'try')) && EditServiceFees}
											>
												{ServiceDisable == 'init' && 'Edit Owners Fee'}
												{ServiceDisable == 'error' && 'Error.. Check Input Fields'}
												{ServiceDisable == 'start' && 'Edit Owners Service Fee'}
												{ServiceDisable == 'process' && 'In-Progress'}
												{ServiceDisable == 'done' && 'Done'}
												{ServiceDisable == 'try' && 'Try-Again'}
											</Button>}
									</GridItem>
								</GridContainer>

							</CardBody>

						</form>
					</Card>
				</GridItem>
			</GridContainer>

		</div>
	);
}
