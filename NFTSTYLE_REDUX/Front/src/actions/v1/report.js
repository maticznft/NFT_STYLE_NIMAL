import axios from "axios";
import config from '../../lib/config';


export const reportFunc = async (postdata) => {
  //("check allsssss",postdata)
    try {
      let resp = await axios({
        'method': 'post',
        'url'  :`${config.vUrl}/token/report/reportFunc`,
        'headers': {
          'Authorization': localStorage.user_token
        },
        data:postdata
       
      });
      return {
        data: resp.data
      }
    }
    catch (err) {
    }
  }

  
export const sociallinksfunction = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'get',
      'url'  :`${config.vUrl}/token/social/sociallinksfunction`,
     
     
    });
    //("soci1",resp.data)
    return {
      data: resp.data
    }
  }
  catch (err) {
  }

}

export const faqlists = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'get',
      'url'  :`${config.vUrl}/token/social/faqlists`,
     
     
    });
    //("soci1",resp.data)
    return {
      data: resp.data
    }
  }
  catch (err) {
  }

}


export const getPrivacyVal = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url'  :`${config.vUrl}/admin/panel/getPrivacyVal`,
      data:postdata   
    });
    //("soci1",resp.data)
    return {
      data: resp.data
    }
  }
  catch (err) {
  }

}


export const notifications = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url'  :`${config.vUrl}/token/notifications`,
      data:postdata   
    });
    //("soci1",resp.data)
    return {
      data: resp.data
    }
  }
  catch (err) {
  }

}

export const notificationStatusChange = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url'  :`${config.vUrl}/token/notificationStatusChange`,
      data:postdata   
    });
    //("soci1",resp.data)
    return {
      data: resp.data.data
    }
  }
  catch (err) {
  }

}
export const getcmslistinhome = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url'  :`${config.Back_URL}/v1/token/use/getcmslistinhome`,
      data:postdata   
    });
    //console.log("soci1",resp.data)
    return {
      data: resp.data.data
    }
  }
  catch (err) {
  }

}

export const TokenImageCalls = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url'  :`${config.vUrl}/token/TokenImageCalls`,
      data:postdata   
    });
   
    return {
      data: resp.data.data
    }
  }
  catch (err) {
  }

}

export const getReceipt=async(web3,approveCall)=>{
  var receipt =  await web3.eth.getTransactionReceipt(approveCall)
   return receipt
}
export const ActivityCall = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url'  :`${config.vUrl}/token/ActivityCall`,
      data:postdata   
    });
    ////console..log("soci1",resp.data)
    return {
      data: resp.data
    }
  }
  catch (err) {
  }

}

export const getpromotion = async (filterData, dispatch) => {
  try {
    let respData = await axios({
      'method': 'get',
      'url': `${config.vUrl}/admin/panel/getpromotion`,
      params: filterData
    });
    return {
      loading: false,
      userValue: respData.data.userValue
      
    }
  }
  
  catch (err) {
    
    return {
      loading: false,
    }
  }
}