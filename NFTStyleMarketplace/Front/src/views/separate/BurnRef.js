import React, {
    forwardRef,
    useImperativeHandle, useState, useEffect
} from 'react';

import { Button } from '@material-ui/core';
import Web3 from 'web3';
import $ from 'jquery';
import config from '../../lib/config';
import { useLoaction, useHistory } from 'react-router-dom'
import {
    AddLikeAction,
    GetLikeDataAction
} from '../../actions/v1/token';

import {
    getCurAddr
} from '../../actions/v1/user';
import { BurnField, checkOtherPlatformDetais1155 } from '../../actions/v1/token';
import EXCHANGE from 'ABI/EXCHANGE.json'
import { toast } from 'react-toastify';
import SINGLE from '../../ABI/userContract721.json'
import MULTIPLE from '../../ABI/userContract1155.json'
import { getReceipt } from '../../actions/v1/report';
toast.configure();
let toasterOption = config.toasterOption;

export const BurnRef = forwardRef((props, ref) => {
    const [BuyerName, Set_BuyerName] = React.useState('');
    const [blns, Set_blns] = React.useState('');
    const [dethBln, Set_dethBln] = React.useState('');
    const [bidProfile1, Set_bidProfile1] = React.useState([]);
    const [burnLoading, setBurnLoading] = useState('empty');

    const [FormSubmitLoading, Set_FormSubmitLoading] = useState('init');
    const [CoinName, setCoinNames] = useState('');
    const [CoinName_Initial, set_CoinName_Initial] = useState('');

    const [ValidateError, Set_ValidateError] = useState({});
    const [YouWillGet, Set_YouWillGet] = useState(0);
    const [Items, Set_Items] = useState({})
    ////////console.log('props.item.tokenPrice', props.item);

    const [TokenPrice, Set_TokenPrice] = useState(0);
    const [TokenPrice_Initial, Set_TokenPrice_Initial] = React.useState(0);
    const [noofitems, setnoofitem] = useState(0)
    const [MyTokenDetail, set_MyTokenDetail] = useState({})


    useImperativeHandle(
        ref,
        () => ({
            async Burn_Click(item, MyTokenDetail) {
                if (props.providerss) {
                    if (props.providerss) {
                        var web3 = new Web3(props.providerss)
                        var balance = await checkOtherPlatformDetais1155(item, MyTokenDetail, item.type, web3);
                        //console.log'balance>>>>>>>>>', balance, MyTokenDetail.balance)
                        if (balance == 0 || balance != MyTokenDetail.balance) {
                            toast.warning("You won't buy at this moment please refresh you data", toasterOption);
                            setTimeout(() => {
                                window.location.href = "/"
                            }, 1000);
                            return false;
                        }
                    else {
                        if (props.UserAccountAddr != "") {
                            props.Set_HitItem(item);
                            Set_Items(item)
                            setnoofitem(MyTokenDetail.balance)
                            set_MyTokenDetail(MyTokenDetail)
                            Set_ValidateError({});
                            window.$('#burn_token_modal').modal('show');
                        }
                        else {
                            window.$('#connect_modal').modal('show');
                        }
                    }
                }
                }
            }
        }),
    )
    const history = useHistory();


    async function FormSubmit(data, MyTokenDetail) {
        var receipt = null;
        var handle = null;
        if (props.UserAccountBal < 0) {
            toast.error('Enter vaid balance');
            return false;
        }
        if (props.providerss) {
            var web3 = new Web3(props.providerss)
            if (
                web3
            ) {
                setBurnLoading('processing');
                var CoursetroContract = null;
                var contractCall = null;
                try {
                    if (Items.type == 721) {
                        var CoursetroContract = new web3.eth.Contract(
                            SINGLE,
                            config.singleContract
                        );
                        await CoursetroContract.methods
                            .burn(

                                data.tokenCounts
                            )
                            .send({ from: props.Accounts })
                            .on('transactionHash', async (transactionHash) => {
                                handle = setInterval(async () => {
                                    receipt = await getReceipt(web3, transactionHash)
                                    clr1();
                                }, 8000)
                            })
                    }
                    else {
                        var CoursetroContract = new web3.eth.Contract(
                            MULTIPLE,
                            config.multipleContract
                        );
                        await CoursetroContract.methods
                            .burn(
                                UserAccountAddr,
                                data.tokenCounts, noofitems
                            )
                            .send({ from: props.Accounts })

                            .on('transactionHash', async (transactionHash) => {
                                handle = setInterval(async () => {
                                    receipt = await getReceipt(web3, transactionHash)
                                    clr1();
                                }, 8000)
                            })
                    }
                }
                catch (error) {
                    setBurnLoading('try');
                    ////////console.log('error : ', error);
                    toast.error('Order not placed', toasterOption)
                }

                async function clr1() {

                    if (receipt != null) {
                        clearInterval(handle);
                        if (receipt.status == true) {

                            ////////console.log('result : ', result);
                            var postData = {
                                tokenOwner: UserAccountAddr,
                                tokenCounts: data.tokenCounts,
                                blockHash: receipt.blockHash,
                                transactionHash: receipt.transactionHash,
                                contractAddress: data.contractAddress,
                                type: data.type,
                                balance: noofitems,
                                currAddr: UserAccountAddr,
                                quant: MyTokenDetail.balance


                            }
                            setBurnLoading('done');
                            ////////console.log('postDatafrominfo',postData);
                            var updateBurnField = await BurnField(postData)
                            if (updateBurnField) {
                                toast.success('Burned successfully', toasterOption)
                                document.getElementById('closeburn').click()
                                // history.push('/')
                                window.location.href = "/";
                            }
                        }
                    }



                }
            }
        }
    }
    var {
        item,
        UserAccountAddr,
        UserAccountBal,
        Service_Fee
    } = props;

    useEffect(() => {
        Set_ValidateError({});
    }, []);


    const inputChange = (e) => {
        if (e.target && e.target.value)
            // ////////console.log("lalalalalalallala",MyTokenDetail)
            if (MyTokenDetail.balance >= e.target.value) {
                setnoofitem(e.target.value)
                setBurnLoading('init');
            }
            else if (e.target.value == 0) {
                setBurnLoading('zero');
            }
            else if (e.target.value == "") {
                setBurnLoading('empty');
            }
            else if (e.target.value == undefined) {
                setBurnLoading('empty');
            }
            else {
                setBurnLoading('errors');
            }

    }

    return (

        <div class="modal fade primary_modal" id="burn_token_modal" tabindex="-1" role="dialog" aria-labelledby="burn_token_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header text-center">
                        <h5 class="modal-title" id="burn_token_modalLabel">Burn token</h5>
                        <button type="button" id="closeburn" class="close" data-dismiss="modal" aria-label="Close"
                            disabled={(burnLoading == 'processing')}

                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body px-0">
                        <form className="bid_form">
                            <div className="px-4">
                                <p className="checkout_text_light_white text-center" style={{ color: 'black', fontWeight: 'bold' }}>{MyTokenDetail.balance} Tokens Available</p>
                            </div>
                            <div className="px-4">
                                <p className="checkout_text_light_white">Are you sure to burn this token? This action cannot be undone. Token will be transfered to zero address</p>
                            </div>
                            <div className="px-4 mt-4 pt-2">
                                <input
                                    id="burn"
                                    name="burn"
                                    class="form-control"
                                    onChange={(e) => { inputChange(e) }}
                                />
                                <div className="text-center mt-3">
                                    <Button
                                        className="burn_btn_red primary_btn btn-block"
                                        onClick={(burnLoading == 'init' || burnLoading == 'try') && (() => FormSubmit(Items, MyTokenDetail))}
                                        disabled={(burnLoading == 'done' || burnLoading == 'processing' || burnLoading == 'zero' || burnLoading == 'errors' || burnLoading == 'empty')}
                                    >
                                        {burnLoading == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                                        {burnLoading == 'init' && 'Continue'}
                                        {burnLoading == 'processing' && 'In-progress...'}
                                        {burnLoading == 'done' && 'Done'}
                                        {burnLoading == 'try' && 'Try Again'}
                                        {burnLoading == 'errors' && 'Check Balance'}
                                        {burnLoading == 'zero' && "Qty can't be Zero"}
                                        {burnLoading == 'empty' && "Qty can't be Empty"}

                                    </Button>
                                    <Button className="btn_outline_grey cancel_btn btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
})

