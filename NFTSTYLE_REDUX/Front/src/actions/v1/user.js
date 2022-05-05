import axios from "axios";
import config from '../../lib/config';
import Web3 from 'web3';

import { toast } from 'react-toastify';
import isEmpty from "lib/isEmpty";
toast.configure();
let toasterOption = config.toasterOption;

export const getCurAddr = async () => {
  var currAddr = '';
  if (localStorage.walletConnectType && localStorage.walletConnectType == 'mt') {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        if (
          window.web3
          && window.web3.eth
          && window.web3.eth.defaultAccount
        ) {
          // var accVal = await web3.eth.getAccounts();
          // if(accVal[0]) {
          //   currAddr = accVal[0];
          // }
         // //console.log("buhnjnjhminytvyg333", window.web3.eth.defaultAccount)
          currAddr = window.web3.eth.defaultAccount;
          currAddr = currAddr.toString();
        }
      }
      if (localStorage.walletConnectType && localStorage.walletConnectType == 'wc') {
    if (!isEmpty(localStorage.walletconnect)
      &&
      JSON.parse(localStorage.walletconnect).accounts.length != 0
      &&
      JSON.parse(localStorage.walletconnect).accounts[0] != "") {
      currAddr = String(JSON.parse(localStorage.walletconnect).accounts[0]).toLowerCase()
      alert("infunc",currAddr)
    }

  }
}
  ////console.log("buhnjnjhminytvyg", currAddr)
  return currAddr;
}

export const ParamAccountAddr_Detail_Get = async (Payload) => {
  //('Payload',Payload);
  try {
    let Resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/address/details/get`,
      'data': Payload
    })
    return Resp;
  }
  catch (err) {
    return {
      // error: err.response.data
    }
  }
}

export const getfaq = async (payload) => {
  try {
    let resp = await axios({
      'method': 'get',
      'url': `${config.vUrl}/user/getfaq`,
    });
    //("faq_list:",resp.data.data)
    return {
      result: resp.data.data
    }
  }
  catch (err) {
  }
}
export const FollowChange_Action = async (Payload) => {
  //('Payload',Payload);
  try {
    let Resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/follow/change`,
      'data': Payload
    })
    return Resp;
  }
  catch (err) {
    return {
      // error: err.response.data
    }
  }
}

export const PutOnSale_Action = async (Payload) => {
}

export const ToastShow = async (data) => {
  //('datadatadatadata',data)
  if (data.toast && data.toast.type && data.toast.msg) {
    if (data.toast.type == 'success') {
      toast.success(data.toast.msg, toasterOption)
    } else {
      toast.error(data.toast.msg, toasterOption)
    }
  }
}

export const UserProfile_Update_Action = async (Payload) => {
  try {
    let Resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/profile/update`,
      'headers': {
        'Authorization': localStorage.user_token
      },
      'data': Payload
    })
    ToastShow(Resp.data);
    return Resp;
  }
  catch (err) {
    return {
      // error: err.response.data
    }
  }
}

export const User_FollowList_Get_Action = async (Payload) => {
  //('Payload',Payload);
  try {
    let Resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/follow/list/`,
      'data': Payload
    })
    return Resp;
  }
  catch (err) {
    return {
      // error: err.response.data
    }
  }
}

export const Collectibles_Get_Action = async (Payload) => {
  try {
    let Resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/collectibles`,
      'data': Payload
    })
    return Resp;
  }
  catch (err) {
    return {
      // error: err.response.data
    }
  }
}

export const changeReceiptStatus_Action = async (Payload) => {
  try {
    let Resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/changereceiptstatus`,
      'data': Payload
    })
    return {
      data: Resp
    }
  }
  catch (err) {
    return {
      // error: err.response.data
    }
  }
}

export const getprofile = async (data, dispatch) => {
  try {
    let respData = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/getprofile`,
      'headers': {
        'Authorization': localStorage.user_token
      },
      data
    });

    return {
      loading: false,
      userValue: respData.data.userValue
    }
  }
  catch (err) {
    return {
      loading: false,
      error: returnErr(err)
    }
  }
}

export const AddressUserDetails_GetOrSave_Action = async (Payload) => {
  try {
    let Resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/address/details/getorsave`,
      'data': Payload
    })
    return {
      data: Resp
    }
  }
  catch (err) {
    return {
      // error: err.response.data
    }
  }
}


export const editprofile = async (data) => {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("name", data.name);
    bodyFormData.append("personalsite", data.personalsite);
    bodyFormData.append("customurl", data.customurl);
    bodyFormData.append("bio", data.bio);
    bodyFormData.append("twitter", data.twitter);
    bodyFormData.append("instagram", data.instagram);
		bodyFormData.append("facebook", data.facebook);
		bodyFormData.append("youtube", data.youtube);
    bodyFormData.append("photo", data.photo);
    bodyFormData.append("currAddr", data.currAddr);
    let respData = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/editprofile/`,
      'headers': {
        'Authorization': localStorage.user_token
      },
      data: bodyFormData
    });
    return {
      loading: false,
      userValue: respData.data.userValue
    }

  }
  catch (err) {
    return {
      loading: false,
      error: returnErr(err)
    }
  }
}
function returnErr(err) {
  if (err.response && err.response.data && err.response.data.errors) {
    return err.response.data.errors;
  }
  else {
    return '';
  }
}

export const getSearchList = async (data) => {
  try {
    let respData = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/getSearchList`,
      'headers': {
        'Authorization': localStorage.user_token
      },
      data
    });
    return {
      loading: false,
      searchlist: respData.data
    }
  }
  catch (err) {
    return {
      loading: false,
      error: returnErr(err)
    }
  }
}
export async function coverimagevalidations(data) {
  //("profileAsSasaSadd" + JSON.stringify(data))
  var formData = new FormData();
  // //('image',data.file)
  formData.append('currAddr', data.currAddr);
  formData.append('image', data.file)
  try {
    let respData = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/test/coverimagevalidation`,
      'data': formData
    })

    //("SADASDasdasd" + JSON.stringify(respData))
    return {
      loading: false,
      error: respData.data
    }

  } catch (err) {
    return {
      loading: false,
      error: err.response.data
    }
  }
}

export const coverImage = async (data) => {
  //("coverImage", data)
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("coverimage", data.file);
    bodyFormData.append("accounts", data.currAddr);


    let respData = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/test/coverImage/`,
      'headers': {
        'Authorization': localStorage.user_token
      },
      data: bodyFormData
    });

    return {
      loading: false,
      userValue: respData.data
    }

  }
  catch (err) {

    return {
      loading: false,
      error: err.response.data.errors
    }
  }
}

export const pics1 = async (data) => {
  //("coverImage", data)
  try {


    let respData = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/test/pics1/`,
      'headers': {
        'Authorization': localStorage.user_token
      },
      data: data
    });
    return {
      // loading: false,
      userValue: respData.data
    }

  }
  catch (err) {

    return {
      loading: false,
      error: err.response.data.errors
    }
  }
}
export const checkFollower = async (data) => {
  try {
    let respData = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/checkFollower`,
      'headers': {
        'Authorization': localStorage.user_token
      },
      data
    });
    return {
      loading: false,
      follower: respData.data
    }
  }
  catch (err) {
    return {
      loading: false,
      error: returnErr(err)
    }
  }
}
export const getFollowers = async (data) => {
  try {
    let respData = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/getFollowers`,
      'headers': {
        'Authorization': localStorage.user_token
      },
      data
    });
    return {
      loading: false,
      follower: respData.data
    }
  }
  catch (err) {
    return {
      loading: false,
      error: returnErr(err)
    }
  }
}
export const followUnfollow = async (data) => {
  try {
    let respData = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/followUnfollow`,
      'headers': {
        'Authorization': localStorage.user_token
      },
      data
    });
    return {
      loading: false,
      follower: respData.data
    }
  }
  catch (err) {
    return {
      loading: false,
      error: returnErr(err)
    }
  }
}
export const getMyActivity = async (addr) => {
  //("getMyActivity checking"+addr)
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/activity/header`,
      data: addr
    });
    //("faq_list:",JSON.stringify(resp))
    return {
      result: resp.data.list
    }
  }
  catch (err) {
  }
}

export const burnToken = async (addr) => {
  //("getMyActivity checking"+addr)
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/user/burns/burnToken`,
      'headers': {
        'Authorization': localStorage.user_token
      },
      data: addr
    });
    ////console.log("burnToken:",resp)
    return {
      result: resp.data
    }
  }
  catch (err) {
  }
}