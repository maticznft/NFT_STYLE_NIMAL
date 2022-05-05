import React, {
    forwardRef,
    useImperativeHandle
} from 'react';
import '@metamask/legacy-web3';
import { FacebookShareButton, TwitterShareButton, TelegramShareButton, WhatsappShareButton } from 'react-share'
import config from '../../lib/config';

import { toast } from 'react-toastify';
toast.configure();
var Front_URL = config.Front_URL;

export const ShareNowRef = forwardRef((props, ref) => {

    const [item, Set_Item] = React.useState({});
    const [onwer_price, set_onwer_price] = React.useState({});

    useImperativeHandle(
        ref,
        () => ({
            async ShareSocial_Click(items, onwer_price) {
                //////console.log("ShareSocial_Click",config.Front_URL,items)
                if (items) {
                    Set_Item(items)
                    set_onwer_price(onwer_price)
                    window.$('#share_modal').modal('show');

                }
            }
        }),
    )

    return (
        <div>
            <div class="modal fade primary_modal" id="share_modal" tabindex="-1" role="dialog" aria-labelledby="share_modalCenteredLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal" role="document">
                    <div class="modal-content">
                        <div class="modal-header text-center">
                            <h5 class="modal-title" id="share_modalLabel">Share link to this page</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body  px-0">

                            <div className="row justify-content-center mx-0">
                                <div className="col-12 col-sm-6 col-lg-3 px-1">
                                    <div className="text-center icon_div">

                                        <TwitterShareButton
                                            title={`${item.tokenName}  NFT`}
                                            url={`${config.Front_URL}/info/${onwer_price.tokenCounts}` + " " +`${config.shareTag[0]}`+" "+`${config.shareTag[1]}` +" " +`${(config.shareTag[2])}`}
                                          
                                        >
                                            <i class="fab fa-twitter"></i>
                                            <p>Twitter</p>


                                        </TwitterShareButton>

                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3 px-1">
                                    <div className="text-center icon_div">

                                        <TelegramShareButton
                                            title={`${item.tokenName}  NFT`}
                                            url={`${config.Front_URL}/info/${onwer_price.tokenCounts}` + " " +`${config.shareTag[0]}`+" "+`${config.shareTag[1]}` +" " +`${(config.shareTag[2])}`}
                                        
                                        >

                                            <i class="fab fa-telegram-plane"></i>
                                            <p>Telegram</p>

                                        </TelegramShareButton>

                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3 px-1">
                                    <div className="text-center icon_div">
                                        <FacebookShareButton
                                            quote={`${item.tokenName} NFT`}
                                            // title={`${item.tokenName}  NFT`}
                                            url={`${config.Front_URL}/info/${onwer_price.tokenCounts}` + " " +`${config.shareTag[0]}`+" "+`${config.shareTag[1]}` +" " +`${(config.shareTag[2])}`}
                                        
                                        //     via={`${config.Front_URL}`}
                                        >
                                            <i class="fab fa-facebook-f"></i>
                                            <p>Facebook</p>
                                        </FacebookShareButton>

                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3 px-1">
                                    <div className="text-center icon_div">
                                        <WhatsappShareButton
                                           title={`${item.tokenName}  NFT`}
                                           url={`${config.Front_URL}/info/${onwer_price.tokenCounts}` + " " +`${config.shareTag[0]}`+" "+`${config.shareTag[1]}` +" " +`${(config.shareTag[2])}`}
                                         >
                                            <i class="fab fa-whatsapp"></i>
                                            <p>Whatsapp</p>
                                        </WhatsappShareButton>

                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

