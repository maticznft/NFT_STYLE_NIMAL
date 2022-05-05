import React, {
    forwardRef,
    useEffect,
    useImperativeHandle
} from 'react';

import Web3 from 'web3';
import $ from 'jquery';
import config from '../../lib/config';

import {
    AddLikeAction,
    GetLikeDataAction
} from '../../actions/v1/token';

import {
    getCurAddr
} from '../../actions/v1/user';

import { toast } from 'react-toastify';
import isEmpty from 'lib/isEmpty';
toast.configure();
let toasterOption = config.toasterOption;

export const LikeRef = forwardRef((props, ref) => {

    async function getLikesDataCall () {
        var currAddr = await getCurAddr();
        if(currAddr) {
            var payload = {
                currAddr: currAddr
            }
            var check = await GetLikeDataAction(payload);
            if(check && check.data && check.data.records) {
                props.setLikedTokenList(check.data.records);
            }
        }
    }

    useImperativeHandle(
        ref,
        () => ({
            async getLikesData() {
                getLikesDataCall();
            },
            async hitLike(data) {
                
                if(isEmpty(config.address)){
                    config.address = await getCurAddr()
                }
                if(config.providercon){
                if(!isEmpty(config.address)) {
                    var currAddr = config.address;
                    var likeData = {
                        // actions:"like",
                        currAddr: currAddr,
                        tokenCounts: data.tokenCounts,
                        tokenOwner: data.tokenOwner,
                        activity:"Liked by"
                    }
                    //console.log"Like Working",likeData)
                    var resp = await AddLikeAction(likeData);
                    if(resp && resp.data && resp.data.toast && resp.data.toast.msg) {
                        if(resp.data.toast.type == 'success') {
                            
                            toast.success(resp.data.toast.msg, toasterOption);
                            if(
                                resp.data.tokenData
                                && resp.data.tokenData.record
                                && typeof resp.data.tokenData.record.likecount != 'undefined'
                            ) {
                                $('.'+data.tokenCounts+'-likecount').html(resp.data.tokenData.record.likecount);
                            }
                        }
                    }
                    getLikesDataCall();
                }
                
            }
            else{
                window.$('#connect_modal').modal('show');
            }
            }
        }),
    )
    return (
      <div></div>
    )
})

