import React, {
    useEffect,
    forwardRef,
    useState,
    useImperativeHandle
} from 'react';

import { Button, TextField } from '@material-ui/core';

import $ from 'jquery';
import Web3 from 'web3';
import '@metamask/legacy-web3'
import isEmpty from 'lib/isEmpty';
import EXCHANGE from '../../ABI/EXCHANGE.json'
import { useLocation, useHistory } from 'react-router-dom'
import config from '../../lib/config';
import SINGLE from '../../ABI/userContract721.json'
import MULTIPLE from '../../ABI/userContract1155.json'

import {
    AddLikeAction,
    GetLikeDataAction,
    TokenPriceChange_update_Action,
    checkOtherPlatformDetais1155
} from '../../actions/v1/token';
import { getReceipt } from 'actions/v1/report';
import {
    getCurAddr,
} from '../../actions/v1/user';


import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
toast.configure();
let toasterOption = config.toasterOption;
const exchangeAddress = config.exchangeAddress;

export const CancelOrderRef = forwardRef((props, ref) => {
    const Wallet_Details = useSelector(state => state.wallet_connect_context);
    const history = useHistory();
    const [FormSubmitLoading, Set_FormSubmitLoading] = React.useState('start');
    const [TokenPrice, Set_TokenPrice] = React.useState(0);
    // const [MyTokenDetail, set_MyTokenDetail] = React.useState({});

    const [Owners, Set_Owners] = React.useState({});
    const [Item_Owner, Set_Item_Owner] = React.useState({});
    const [Items, Set_Item] = React.useState({});


    const location = useLocation();
    var location_name = location.pathname;
    //////////console.log("locationanme",location_name)
    var {
        item,
        MyTokenDetail,
        UserAccountAddr,
        UserAccountBal,
        Service_Fee
    } = props;
    async function FormSubmit() {
        if (Wallet_Details.providerss) {

            var web3 = new Web3(Wallet_Details.providerss)
            if (
                web3
            ) {
                if (Items.type == 721) {
                    var CoursetroContract = new web3.eth.Contract(
                        SINGLE,
                        config.singleContract
                    );

                }
                else {
                    var CoursetroContract = new web3.eth.Contract(
                        MULTIPLE,
                        config.multipleContract
                    );

                }
                try {
                    var handle = null;
                    var receipt = null;

                    Set_FormSubmitLoading('processing');
                    await CoursetroContract.methods
                        .cancelOrder(
                            Items.tokenCounts,
                        )
                        .send({ from: Wallet_Details.Accounts })
                        .on('transactionHash', async (transactionHash) => {
                            handle = setInterval(async () => {
                                //////console.log("asasa",)
                                receipt = await getReceipt(web3, transactionHash)
                                clr1();

                            }, 8000)
                        })
                }

                catch (error) {
                    Set_FormSubmitLoading('try');
                    toast.error('Order not placed', toasterOption)
                }

            }
            async function clr1() {
                if (receipt != null) {
                    clearInterval(handle);
                    if (receipt.status == true) {
                        var postData = {
                            tokenOwner: UserAccountAddr,
                            tokenCounts: Items.tokenCounts,
                            tokenPrice: 0,
                            blockHash: receipt.blockHash,
                            transactionHash: receipt.transactionHash,
                            PutOnSale:false
                        }
                        var Resp = await TokenPriceChange_update_Action(postData)
                        if (Resp && Resp.data && Resp.data.RetType && Resp.data.RetType == 'success') {
                            toast.success("Collectible cancelled successfully", toasterOption)
                            window.$('.modal').modal('hide');
                            setTimeout(() => {
                                window.location.reload();
                            }, 8000);

                        }
                        Set_FormSubmitLoading('done');
                    }
                }
            }

        }

    }

    var {
        item,
        UserAccountAddr,
    } = props;

    useImperativeHandle(
        ref,
        () => ({
            async CancelOrder_Click(item, Owner, itemOwner) {
                if (Wallet_Details.providerss) {
                    var web3 = new Web3(Wallet_Details.providerss)
                    var balance = await checkOtherPlatformDetais1155(item, itemOwner, item.type, web3);
                    //console.log'balance>>>>>>>>>', balance, item, itemOwner, item.type, web3)
                    if (balance == 0) {
                        toast.warning("You won't buy at this moment please refresh you data", toasterOption);
                        setTimeout(() => {
                            window.location.href = "/"
                        }, 1000);
                        return false;
                    }
                    else {
                        if (Wallet_Details.providerss) {
                            props.Set_HitItem(item);
                            Set_Item(item)
                            Set_TokenPrice(0);
                            Set_Owners(Owner)
                            Set_Item_Owner(itemOwner)
                            window.$('#cancel_order_modal').modal('show');
                        }
                    }
                }
                else {
                    window.$('#connect-wallet').modal('show');
                }
            }
        }),
    )
    return (
        <div class="modal fade primary_modal" id="cancel_order_modal" tabindex="-1" role="dialog" aria-labelledby="cancel_order_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header text-center">
                        <h5 class="modal-title" id="cancel_order_modalLabel">Cancel Order</h5>
                        <div className="change_price_img_div">
                            {
                                Items && Items.image &&
                                (String(Items.image).split('.').pop() == "mp4" ||
                                    (String(Items.image).split('.').pop() == "webm") ||
                                    (String(Items.image).split('.').pop() == "WEBM") ||
                                    (String(Items.image).split('.').pop() == "ogv") ||
                                    (String(Items.image).split('.').pop() == "OGV")
                                ) &&
                                <video
                                    id="my-video"
                                    class="img-fluid"
                                    autoPlay controls playsInline loop muted
                                    preload="auto"
                                // poster={Items.ipfsimage != "" ? `${config.IPFS_IMG}/${Items.ipfsimage}` : `${config.Back_URL}/nftImg/${Items.tokenCreator}/${Items.image}`}
                                // data-setup="{}"
                                >
                                    <source src={Items.additionalImage ? (Items.additionalImage == "" ? `${config.IPFS_IMG}/${Items.ipfsimage}` : `${config.Back_URL}/nftImg/${Items.tokenCreator}/${Items.additionalImage}`) : `${config.IPFS_IMG}/${Items.ipfsimage}`} type="video/mp4" />
                                </video>}
                            {
                                Items
                                && Items.image
                                && ((String(Items.image).split('.').pop() == "mp3"
                                    || String(Items.image).split('.').pop() == "aac"
                                    || String(Items.image).split('.').pop() == "AAC"
                                    || String(Items.image).split('.').pop() == "FLAC"
                                    || String(Items.image).split('.').pop() == "flac")) &&
                                <>
                                    <img src={config.AudioImg} class="img-fluid" />

                                    <audio
                                        class=""
                                        // autoPlay
                                        muted
                                        controls
                                        playsInline
                                        loop
                                    >
                                        <source src={Items.additionalImage ? (Items.additionalImage == "" ? `${config.IPFS_IMG}/${Items.ipfsimage}` : `${config.Back_URL}/nftImg/${Items.tokenCreator}/${Items.additionalImage}`) : `${config.IPFS_IMG}/${Items.ipfsimage}`} type="audio/mp3" />
                                    </audio>
                                </>
                            }
                            {Items
                                && Items.image
                                && ((String(Items.image).split('.').pop() == "webp"
                                    || String(Items.image).split('.').pop() == "WEBP"
                                    || String(Items.image).split('.').pop() == "gif"
                                    || String(Items.image).split('.').pop() == "jpg"
                                    || String(Items.image).split('.').pop() == "GIF"
                                    || String(Items.image).split('.').pop() == "JPG"
                                    || String(Items.image).split('.').pop() == "JPEG"
                                    || String(Items.image).split('.').pop() == "jpeg"
                                    || String(Items.image).split('.').pop() == "png"
                                    || String(Items.image).split('.').pop() == "PNG")) &&
                                <img src={Items.additionalImage ? (Items.additionalImage == "" ? `${config.IPFS_IMG}/${Items.ipfsimage}` : `${config.Back_URL}/nftImg/${Items.tokenCreator}/${Items.additionalImage}`) : `${config.IPFS_IMG}/${Items.ipfsimage}`} alt="Collections" className="img-fluid" />
                            }
                        </div>
                        <p className="text-gray font_we_600 font_12">You are about to delete Instant Sale for
                            <span className="buy_desc_sm_bold pl-1 bold_red owner_break">{Items.tokenName} </span>
                            for
                            <span className="buy_desc_sm_bold pl-1 bold_red owner_break" styel={{ fontSize: 10 }}>
                                {/* {
                                    item.userprofile && item.userprofile.name ?
                                        <span >{item.userprofile.name}</span>
                                        :
                                       isEmpty(MyTokenDetail) ?
                                        item.tokenOwner && <span className="word_brak_text_inline_new" title={"Owner : "+item.tokenOwner}>{String(item.tokenOwner).slice(0, 8).concat('...')}</span>
                                        :
                                        <span className="word_brak_text_inline_new" title={"Owner : "+MyTokenDetail.tokenOwner}>{String(MyTokenDetail.tokenOwner).slice(0, 8).concat('...')}</span>
                                } */}

                                {
                                    !isEmpty(Owners)
                                        && Owners.name != ""
                                        ? <span className="word_brak_text_inline_new" title={"Owner : " + Owners.name}>{Owners.name}</span>
                                        : <span className="word_brak_text_inline_new" title={"Owner : " + Item_Owner && Item_Owner.tokenOwner}>{String(Item_Owner && Item_Owner.tokenOwner).slice(0, 10).concat("...")}</span>

                                }
                            </span>
                        </p>

                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" disabled={(FormSubmitLoading == 'processing' || FormSubmitLoading == 'done')}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body px-0 pt-0">
                        <form className="px-4 bid_form " >
                            <div className=" text-center">
                                <label for="bid" className=" text-center">
                                    {Item_Owner.tokenPrice}
                                    {config.currencySymbol}


                                </label></div>

                            <div className="text-center mt-3">
                                <Button
                                    type="button"
                                    className="primary_btn btn-block"
                                    onClick={(FormSubmitLoading == 'start' || FormSubmitLoading == 'try') && FormSubmit}
                                    disabled={(FormSubmitLoading == 'processing' || FormSubmitLoading == 'done')}
                                >
                                    {FormSubmitLoading == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                                    {FormSubmitLoading == 'processing' && 'In-Progress'}
                                    {FormSubmitLoading == 'done' && 'Done'}
                                    {FormSubmitLoading == 'start' && 'Start'}
                                    {FormSubmitLoading == 'try' && 'Try-Again'}
                                </Button>
                                <Button className="btn_outline_red btn-block"
                                    disabled={(FormSubmitLoading == 'processing')}
                                    data-dismiss="modal" aria-label="Close">Cancel</Button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
})

