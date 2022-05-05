import React, {
    useEffect,
    forwardRef,
    useImperativeHandle
} from 'react';
import {
    useHistory
} from "react-router-dom";
import { Button, TextField } from '@material-ui/core';

import $ from 'jquery';
import Web3 from 'web3';
import '@metamask/legacy-web3'

import EXCHANGE from '../../ABI/EXCHANGE.json'
import Multiple from '../../ABI/userContract1155.json'
import Single from '../../ABI/userContract721.json'
import DETH_ABI from '../../ABI/DETH_ABI.json';
import config from '../../lib/config';

import {
    AddLikeAction,
    GetLikeDataAction,
    TokenPriceChange_update_Action,
    PurchaseNow_Complete_Action,
    checkOtherPlatformDetais1155
} from '../../actions/v1/token';

import {
    getCurAddr,
} from '../../actions/v1/user';
import { getReceipt } from 'actions/v1/report';
import { toast } from 'react-toastify';
toast.configure();
let toasterOption = config.toasterOption;

const exchangeAddress = config.exchangeAddress;
const multipleAddress = config.multiple;
const singleAddress = config.single;
const contractAddr = config.smartContract;

export const PurchaseNowRef = forwardRef((props, ref) => {

    const history = useHistory();

    var {
        UserAccountAddr,
        UserAccountBal,
        TokenBalance,
        MyItemAccountAddr,
        Service_Fee
    } = props;

    const [ApproveCallStatus, setApproveCallStatus] = React.useState('init');
    const [PurchaseCallStatus, setPurchaseCallStatus] = React.useState('init');

    //var PurchaseBalance = 0;
    //var PurchaseCurrency = '';

    // if(config.PurchaseTransferType == 'token') {
    //     PurchaseBalance = TokenBalance;
    //     PurchaseCurrency = config.tokenSymbol;
    // }
    // else {
    //     PurchaseBalance = UserAccountBal;
    //     PurchaseCurrency = config.currencySymbol;
    // }

    const [BuyerName, Set_BuyerName] = React.useState('');
    const [blns, Set_blns] = React.useState('');
    const [dethBln, Set_dethBln] = React.useState('');
    const [bidProfile1, Set_bidProfile1] = React.useState([]);

    const [MultipleWei, Set_MultipleWei] = React.useState(0);
    const [ApproveWei, Set_ApproveWei] = React.useState(0);
    const [NewTokenDecimal, setNewTokenDecimal] = React.useState(0);
    const [NoOfToken, Set_NoOfToken] = React.useState(1);

    const [FormSubmitLoading, Set_FormSubmitLoading] = React.useState('');

    const [ValidateError, Set_ValidateError] = React.useState({});
    const [YouWillPay, Set_YouWillPay] = React.useState(0);

    const [TokenPrice, Set_TokenPrice] = React.useState(0);
    const [Price, Set_Price] = React.useState(0);
    const [PurchaseBalance, Set_PurchaseBalance] = React.useState(0);
    const [coinname, Set_Coinname] = React.useState(0);
    const inputChange = (e) => {
        if (e && e.target && typeof e.target.value != 'undefined' && e.target.name) {
            var value = e.target.value;
            switch (e.target.name) {
                case 'NoOfToken':
                    Set_NoOfToken(value);
                    PriceCalculate({ quantity: value });
                    break;
                case 'TokenPrice':
                    Set_TokenPrice(value);
                    if (value != '' && isNaN(value) == false && value > 0) {
                        PriceCalculate({ price: value });
                    }
                    break;
                default:
                // code block
            }
            // ItemValidation({TokenPrice:value});
        }
    }

    const PriceCalculate = async (data = {}) => {
        var web3 = new Web3(props.providerss)
        var price = (typeof data.price != 'undefined') ? data.price : TokenPrice;
        var quantity = (typeof data.quantity != 'undefined') ? data.quantity : NoOfToken;
        var newPrice = item.type == 721 ? (price * 1000000) : (quantity * (price * 1000000));
        var toMid = newPrice
        var serfee = (toMid / 100000000) * ((Service_Fee / config.decimalvalues) * 1000000)
        var totfee = serfee + toMid
        //var tot2cont = web3.utils.toWei(String(totfee/1e6))
        var tot2cont = null
        var aprrove = null
        if (NewTokenDecimal == 18) {
            tot2cont = web3.utils.toWei(String(Number((Number(totfee)) / 1000000)))
            aprrove = web3.utils.toWei(String(Number((Number(totfee)) / 1000000)))
        }
        else {
            tot2cont = web3.utils.toWei(String(Number((Number(totfee)) / 1000000)))
            var dec = 18 - (NewTokenDecimal);
            aprrove = ((tot2cont) / 10 ** dec)

        }
        //console.log("jenjfnfsufiuif",aprrove,NewTokenDecimal,serfee,toMid,newPrice,item.type,quantity,price)
        Set_YouWillPay(totfee / 1e6);
        Set_ApproveWei(aprrove)
        Set_MultipleWei(String(tot2cont));
    }
    async function BalanceCalculation(Coin) {
        if (config.providercon) {
            var web3 = new Web3(config.providercon)
            if (
                web3
            ) {
                var web3 = new Web3(config.providercon);
                const MultiContract = new web3.eth.Contract(Single, config.singleContract);
                var tokenAddress = await MultiContract.methods.getTokenAddress(Coin).call()
                const TokenObj = new web3.eth.Contract(DETH_ABI, tokenAddress);
                var TokenBalance = Number(await TokenObj.methods.balanceOf(UserAccountAddr).call())
                var TokenDecimal = Number(await TokenObj.methods.decimals().call())
                Set_PurchaseBalance(TokenBalance / (10 ** (TokenDecimal)))
                setNewTokenDecimal(TokenDecimal)
            }
        }

    }

    const ItemValidation = async (data = {}) => {
        var ValidateError = {};

        var Chk_TokenPrice = (typeof data.TokenPrice != 'undefined') ? data.TokenPrice : TokenPrice;
        var quantity = (typeof data.quantity != 'undefined') ? data.quantity : NoOfToken;

        var Collectible_balance = 0;
        if (item && item.tokenowners_current && item.tokenowners_current.balance) {
            Collectible_balance = item.tokenowners_current.balance;

        }

        if (quantity == '') {
            ValidateError.NoOfToken = '"Quantity" is not allowed to be empty';
        }
        else if (quantity == 0) {
            ValidateError.NoOfToken = '"Quantity" must be greater than 0';;
        }
        else if (isNaN(quantity) == true) {
            ValidateError.NoOfToken = '"Quantity" must be a number';
        }
        if (quantity > Collectible_balance) {
            ValidateError.NoOfToken = '"Quantity" must be below on ' + Collectible_balance;
        }

        if (Chk_TokenPrice == '') {
            ValidateError.TokenPrice = '"Token Price" is not allowed to be empty';
        }
        else if (Chk_TokenPrice == 0) {
            ValidateError.TokenPrice = '"Token Price" must be greater than 0';;
        }
        else if (isNaN(Chk_TokenPrice) == true) {
            ValidateError.TokenPrice = '"Token Price" must be a number';
        }
        else if (Chk_TokenPrice > PurchaseBalance) {
            ValidateError.TokenPrice = 'Insufficient balance, Check your wallet balance';
        }
        else {
            await props.GetUserBal();
            if (Chk_TokenPrice > PurchaseBalance) {
                ValidateError.TokenPrice = 'Insufficient balance, Check your wallet balance';
            }
            else {
                delete ValidateError.TokenPrice;
            }
        }
        Set_ValidateError(ValidateError);
        return ValidateError;
    }

    async function FormSubmit() {

        window.$('#PurchaseNow_modal').modal('hide');

        window.$('#PurchaseStep_modal').modal('show');

    }

    async function FormSubmit_StepOne() {
        setApproveCallStatus('processing')
        if (config.providercon) {
            var web3 = new Web3(config.providercon)
            if (
                web3
            ) {
                var web3 = new Web3(config.providercon);
                var Approves = null
                var handle = null;
                var receipt = null;
                const MultiContract = new web3.eth.Contract(Multiple, config.multipleContract);
                var tokenAddress = await MultiContract.methods.getTokenAddress(coinname).call()
                const bidvalue = new web3.eth.Contract(
                    DETH_ABI, tokenAddress
                );
                //console.log("djiwbsfunewfubuifanwie",tokenAddress,config.multipleContract)
                try {
                    if (item.type == 721) {
                        await bidvalue.methods.approve(config.singleContract, ApproveWei.toString()).send({ from: props.Accounts })
                            .on('transactionHash', async (transactionHash) => {
                                handle = setInterval(async () => {
                                    receipt = await getReceipt(web3, transactionHash)
                                    clr1();
                                }, 8000)
                            })
                    }
                    else {
                        await bidvalue.methods.approve(
                            config.multipleContract,
                            ApproveWei.toString()
                        ).send({
                            from: props.Accounts,
                        })
                            .on('transactionHash', async (transactionHash) => {
                                handle = setInterval(async () => {
                                    receipt = await getReceipt(web3, transactionHash)
                                    clr1();
                                }, 8000)
                            })
                    }
                }
                catch (e) {
                    //console.log("fjcbdhfhirg", e, ApproveWei)
                    setApproveCallStatus('tryagain')
                }
                async function clr1() {
                    if (receipt != null) {
                        clearInterval(handle);
                        if (receipt.status == true) {
                            setApproveCallStatus('done')
                        }
                    }
                }
            }
            else {
                window.$('#connect_modal').modal('show');
            }
        }
    }

    async function FormSubmit_StepTwo() {
        if (config.providercon) {
            var web3 = new Web3(config.providercon)
            if (
                web3
                && web3.eth
            ) {
                var handle = null;
                var receipt = null;

                var tokenContractAddress = item.contractAddress.toString();
                var tokenType = item.type.toString();
                var bal = parseInt(item.balance);

                var web3 = new Web3(config.providercon);

                // var sendAmount = ((item.tokenPrice*2.5/100) * config.decimalvalues) .toString();
                var sendAmount = web3.utils.toWei(String(Number(Number(item.tokenowners_current.tokenPrice * 1e6) * NoOfToken) / 1e6));
                //console.log("tytyyyt", sendAmount)
                // //("test all",props.Accounts, 
                //     item.tokenowners_current.tokenOwner,
                //     item.tokenCounts,
                //     // YouWillPay*config.decimalvalues,
                //     sendAmount,
                //     web3.utils.toWei(Price),
                //     tokenContractAddress,
                //     tokenType,
                //     item.type == 721 ? 1 : NoOfToken)
                try {
                    // var gas;
                    //     await web3.eth.getGasPrice()
                    //     .then(async (result)=>{
                    //     gas = result;
                    //     console.log("gas",gas)  
                    // });
                    setPurchaseCallStatus('processing');
                    if (item.type == 721) {
                        var CoursetroContract = new web3.eth.Contract(
                            Single,
                            config.singleContract
                        );
                        if(coinname == 'BNB')
                        {
                        await CoursetroContract.methods
                            .saleToken(
                                item.tokenowners_current.tokenOwner,
                                item.tokenCounts,
                                sendAmount.toString(),

                            )
                            .send({
                                from: props.Accounts,
                                value: MultipleWei

                            })
                            .on('transactionHash', async (transactionHash) => {
                                handle = setInterval(async () => {
                                    receipt = await getReceipt(web3, transactionHash)
                                    clr1();
                                }, 8000)
                            })
                        }
                        else{
                            CoursetroContract.methods.salewithToken(
                                coinname,
                                item.tokenowners_current.tokenOwner,
                                item.tokenCounts,
                                sendAmount.toString()
                                )
                            .send({
                                from: props.Accounts
                            })
                            .on('transactionHash',async (transactionHash) => {
                                handle = setInterval(async () => {
                                    receipt = await getReceipt(web3, transactionHash)
                                    clr1();
                                  }, 8000)
                                })
                        }

                    }
                    else {
                        var CoursetroContract = new web3.eth.Contract(
                            Multiple,
                            config.multipleContract
                        );
                        if(coinname == 'BNB'){
                        await CoursetroContract.methods

                            .saleToken(
                                item.tokenowners_current.tokenOwner,
                                item.tokenCounts,
                                (sendAmount).toString(),
                                NoOfToken,
                            )
                            .send({
                                from: props.Accounts,
                                value: MultipleWei,
                                // gas:gas
                            })
                            .on('transactionHash', async (transactionHash) => {
                                //console.log('error not : ', transactionHash);
                                handle = setInterval(async () => {
                                    receipt = await getReceipt(web3, transactionHash)
                                    clr1();
                                }, 8000)
                            })
                        }
                        else{
                            CoursetroContract.methods
                            .saleWithToken(
                                item.tokenowners_current.tokenOwner,
                                item.tokenCounts,
                                (sendAmount).toString(),
                                NoOfToken,
                                coinname
                                 )
                            .send({
                                from: props.Accounts
                            })
                            .on('transactionHash',async (transactionHash) => {
                                handle = setInterval(async () => {
                                    receipt = await getReceipt(web3, transactionHash)
                                    clr1();
                                  }, 8000)
                                })
                        }

                    }
                }
                catch (error) {
                    //console.log('error : ', error);
                    setPurchaseCallStatus('tryagain');
                    toast.error('Order not placed', toasterOption);
                }
                async function clr1() {
                    if (receipt != null) {
                        clearInterval(handle);
                        if (receipt.status == true) {
                            setPurchaseCallStatus('done');
                            var postData = {
                                tokenOwner: item.tokenowners_current.tokenOwner, // old owner
                                UserAccountAddr: UserAccountAddr, // new owner
                                tokenCounts: item.tokenCounts,
                                tokenType: item.type,
                                NoOfToken: item.type == 721 ? 1 : NoOfToken,
                                transactionHash: receipt.transactionHash,
                                tokenBid: true,
                                tokenPrice: item.tokenowners_current.tokenPrice
                            }
                            var Resp = await PurchaseNow_Complete_Action(postData);
                            if (Resp.data && Resp.data.toast && Resp.data.toast.type == 'success') {
                                toast.success("Collectible purchase successfully", toasterOption)
                                window.$('.modal').modal('hide');
                                // setTimeout(() => {  var payload={
                                //     curAddr:UserAccountAddr,
                                //     tokenCounts:item.tokenCounts
                                // }
                                // props.againCall(payload) }, 2000);
                                setTimeout(() =>
                                    window.location.href = config.Front_URL + "/my-items", 2000)
                            }
                        }


                    }
                }

            }
            else {
                window.$('#connect_modal').modal('show');
            }
        }
    }

    const [item, Set_item] = React.useState(props.item);

    useEffect(() => {
        Set_ValidateError({});
        ItemValidation({ NoOfToken: NoOfToken, TokenPrice: TokenPrice });
    }, [
        NoOfToken,
        TokenPrice
    ]);

    useEffect(() => {
        PriceCalculate()
        ItemValidation()
    }, [PurchaseBalance, NewTokenDecimal])

    useImperativeHandle(
        ref,
        () => ({
            async PurchaseNow_Click(item, BuyOwnerDetail = {}) {
                if (config.providercon) {
                    var web3 = new Web3(config.providercon)
                    if (BuyOwnerDetail && typeof BuyOwnerDetail.tokenOwner != 'undefined') {
                        item.tokenowners_current = {};
                        item.tokenowners_current = BuyOwnerDetail;
                    }

                    if (item && item.tokenowners_current && item.tokenowners_current.tokenPrice) {
                        var balance = await checkOtherPlatformDetais1155(item, BuyOwnerDetail, item.type, web3);
                        //console.log('balance>>>>>>>>>', balance)
                        if (balance == 0 || balance != item.tokenowners_current.balance) {
                            toast.warning("You won't buy at this moment please refresh you data", toasterOption);
                            setTimeout(() => {
                                //window.location.href="/"
                            }, 1000);
                            return false;
                        }
                        else {
                            Set_item(item);
                            //("test items",item)
                            Set_TokenPrice(item.tokenowners_current.tokenPrice);
                            Set_Coinname(item.tokenowners_current.CoinName)
                            Set_NoOfToken(1);
                            PriceCalculate({ quantity: 1, price: item.tokenowners_current.tokenPrice });
                            if (item.tokenowners_current.CoinName != "BNB")
                                BalanceCalculation(item.tokenowners_current.CoinName);
                            else
                                Set_PurchaseBalance(UserAccountBal)
                            window.$('#PurchaseNow_modal').modal('show');
                        }
                    }
                }

                else {
                    window.$('#connect_modal').modal('show');

                }
            }
        }))

    return (
        <div>
            <div class="modal fade primary_modal PurchaseNow_modal" id="PurchaseNow_modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="accept_modalCenteredLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-md" role="document">
                    <div class="modal-content">
                        <div class="modal-header text-center">
                            <h5 class="modal-title" id="buy_modalLabel">Checkout</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="close9">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body px-0">
                            <div className="row mx-0">
                                <div className="col-12 col-md-3 px-4">
                                    <p className="buy_title_sm">Owner</p>
                                </div>
                                <div className="col-12 col-md-9 px-4">
                                    <p className="buy_title_md text-md-right word_brak_text_full">
                                        {item && item.tokenowners_current && item.tokenowners_current.tokenOwner}</p>
                                </div>
                            </div>
                            <div className="row mx-0">
                                <div className="col-12 col-md-3 px-4">
                                    <p className="buy_title_sm">Buyer</p>
                                </div>
                                <div className="col-12 col-md-9 px-4">
                                    <p className="buy_title_md text-md-right word_brak_text_full"> {MyItemAccountAddr ? MyItemAccountAddr : UserAccountAddr}</p>
                                </div>
                            </div>
                            <form className="bid_form" action="#">
                                {item.type == 721 ? ('') :
                                    <div className="mb-3 px-4 ">
                                        <label for="qty">Quantity
                                            <span>({item && item.tokenowners_current && item.tokenowners_current.balance && item.tokenowners_current.balance} is available)</span>
                                        </label>

                                        <div class="mb-3 input_grp_style_1">
                                            <input
                                                type="text"
                                                className="form-control primary_inp text-center"
                                                name="NoOfToken"
                                                id="NoOfToken"
                                                onChange={inputChange}
                                                placeholder="e.g. 2"
                                                autoComplete="off"
                                                value={NoOfToken}
                                            />
                                            {ValidateError.NoOfToken && <span className="text-danger">{ValidateError.NoOfToken}</span>}
                                            {!ValidateError.NoOfToken && ValidateError.TokenPrice && <span className="text-danger">{ValidateError.TokenPrice}</span>}
                                        </div>
                                    </div>}
                            </form>
                            <div className="row mx-0 pb-3">
                                <div className="col-12 col-sm-6 px-4">
                                    <p className="buy_desc_sm">Your balance</p>
                                </div>
                                <div className="col-12 col-sm-6 px-4 text-sm-right">
                                    <p className="buy_desc_sm_bold">{PurchaseBalance} {coinname}</p>
                                </div>
                            </div>
                            <div className="row mx-0 pb-3">
                                <div className="col-12 col-sm-6 px-4">
                                    <p className="buy_desc_sm">Price</p>
                                </div>
                                <div className="col-12 col-sm-6 px-4 text-sm-right">
                                    <p className="buy_desc_sm_bold">{TokenPrice} {coinname}</p>
                                </div>
                            </div>
                            <div className="row mx-0 pb-3">
                                <div className="col-12 col-sm-6 px-4">
                                    <p className="buy_desc_sm">Service fee</p>
                                </div>
                                <div className="col-12 col-sm-6 px-4 text-sm-right">
                                    <p className="buy_desc_sm_bold">{((Service_Fee) / (10 ** 18))}% <span>{coinname}</span></p>
                                </div>
                            </div>
                            <div className="row mx-0 pb-3">
                                <div className="col-12 col-sm-6 px-4">
                                    <p className="buy_desc_sm">You will pay</p>
                                </div>
                                <div className="col-12 col-sm-6 px-4 text-sm-right">
                                    <p className="buy_desc_sm_bold">{YouWillPay} <span>{coinname}</span></p>
                                </div>
                            </div>
                            <form className="px-4">
                                <div className="text-center">
                                    <Button
                                        type="button"
                                        className="primary_btn btn-block"
                                        // data-toggle="modal"
                                        // data-target="#PurchaseStep_modal"

                                        onClick={() => FormSubmit()}
                                        disabled={(FormSubmitLoading == 'processing')}
                                    >
                                        {FormSubmitLoading == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                                        Proceed to payment
                                    </Button>
                                    <Button className="cancel_btn  btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade primary_modal PurchaseStep_modal" id="PurchaseStep_modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="PurchaseStepCenteredLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-md" role="document">
                    <div class="modal-content">
                        <div class="modal-header text-center">
                            <h5 class="modal-title" id="PurchaseStepLabel">Follow Steps</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                {coinname != "BNB" &&
                                    <div className="text-center">
                                        <p className="mt-3 purchase_desc text-center">Approve the transaction</p>
                                        <Button
                                            type="button"
                                            onClick={() => FormSubmit_StepOne()}
                                            className={"primary_btn"}
                                            disabled={(ApproveCallStatus == 'processing' || ApproveCallStatus == 'done')}
                                        >
                                            {ApproveCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                                            {ApproveCallStatus == 'init' && 'Approve'}
                                            {ApproveCallStatus == 'processing' && 'In-progress...'}
                                            {ApproveCallStatus == 'done' && 'Done'}
                                            {ApproveCallStatus == 'tryagain' && 'Try Again'}
                                        </Button>
                                    </div>
                                }
                                <div className="text-center my-3">
                                    <p className="mt-3 purchase_desc text-center">Send transaction with your wallet</p>
                                    <Button
                                        type="button"
                                        onClick={() => FormSubmit_StepTwo()}
                                        className={"primary_btn "}
                                        disabled={(PurchaseCallStatus == 'processing' || PurchaseCallStatus == 'done' || coinname != "BNB" && ApproveCallStatus == 'init' || ApproveCallStatus == 'processing' || ApproveCallStatus == 'tryagain')}
                                    >
                                        {PurchaseCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                                        {PurchaseCallStatus == 'init' && 'Purchase'}
                                        {PurchaseCallStatus == 'processing' && 'In-progress...'}
                                        {PurchaseCallStatus == 'done' && 'Done'}
                                        {PurchaseCallStatus == 'tryagain' && 'Try Again'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

