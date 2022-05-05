import axios from "axios";
import config from '../../lib/config';
import Single from '../../ABI/userContract721'
import Multiple from '../../ABI/userContract1155'
import { toast } from 'react-toastify';
import Web3 from "web3";
toast.configure();
let toasterOption = config.toasterOption;

export const ToastShow = async (data) => {
  ////('ToastShow data',data)
  if (data.toast && data.toast.type && data.toast.msg) {
    if(data.toast.type == 'success') {
      toast.success(data.toast.msg, toasterOption)
    } else {
      toast.error(data.toast.msg, toasterOption)
    }
  }
}

export const CancelBid_Action = async (payload) => {
  try {
    let Resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/bid/cancel`,
      data: payload
    });
    ToastShow(Resp.data);
    return {
      data: Resp.data
    }
  }
  catch (err) {
  }
}

export const acceptBId_Action = async (payload) => {
  try {
    let Resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/bid/accept`,
      data: payload
    });
    ToastShow(Resp.data);
    return {
      data: Resp.data
    }
  }
  catch (err) {
  }
}

export const BidApply_ApproveAction = async (payload) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/bid/apply`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}

export const TokenCounts_Get_Detail_Action = async (payload) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/tokenCounts`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}

export const PurchaseNow_Complete_Action = async (payload) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/purchase/complete`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}

export const TokenPriceChange_update_Action = async (payload) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/price/change`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}
export const TokenCount_Get_Action = async (payload) => {
  try {
    let resp = await axios({
      'method': 'get',
      'url': `${config.vUrl}/token/count/get`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}

export const TokenAddItemAction = async (payload) => {
  //console.log'payload', payload);
  try {
    var formData = new FormData();
    if(payload.Image) { formData.append('Image', payload.Image); }
    if(payload.ipfsimage) { formData.append('ipfsimage', payload.ipfsimage); }
    if(payload.Name) { formData.append('Name', payload.Name); }
    if(payload.Count) { formData.append('Count', payload.Count); }
    if(payload.Description) { formData.append('Description', payload.Description); }
    if(payload.Price) { formData.append('Price', payload.Price); }
    if(payload.Royalities) { formData.append('Royalities', payload.Royalities); }
    if(payload.Category_label) { formData.append('Category_label', payload.Category_label); }
    // if(payload.Bid) { 
      formData.append('Bid', payload.Bid);
    //  }
    if(payload.Properties) { formData.append('Properties', payload.Properties); }
    if(payload.Owner) { formData.append('Owner', payload.Owner); }
    if(payload.Creator) { formData.append('Creator', payload.Creator) }
    if(payload.CategoryId) { formData.append('CategoryId', payload.CategoryId) }
    if(payload.Quantity) { formData.append('Quantity', payload.Quantity) }
    if(payload.Balance) { formData.append('Balance', payload.Balance) }
    if(payload.ContractAddress) { formData.append('ContractAddress', payload.ContractAddress) }
    if(payload.Status) { formData.append('Status', payload.Status) }
    if(payload.HashValue) { formData.append('HashValue', payload.HashValue) }
    if(payload.Type) { formData.append('Type', payload.Type) }
    if(payload.MinimumBid) { formData.append('MinimumBid', payload.MinimumBid) }
    if(payload.EndClocktime) { formData.append('EndClocktime', payload.EndClocktime) }
    if(payload.Clocktime) { formData.append('Clocktime', payload.Clocktime) }
    if(payload.UnLockcontent) { formData.append('UnLockcontent', payload.UnLockcontent) }
    if (payload.CoinName) { formData.append('coinname', payload.CoinName) }
    if(payload.PutOnSale) { formData.append('PutOnSale', payload.PutOnSale) }
    if(payload.PutOnSaleType) { formData.append('PutOnSaleType', payload.PutOnSaleType) }
    if(payload.swapPrice) { formData.append('swapPrice', payload.swapPrice) }

    let respData = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/add/item`,
      'headers': {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    });
    ////("respData : " + JSON.stringify(respData.data))
    return { data: respData.data }
  }
  catch (err) {
    return { error: err }
  }
}

export const TokenAddOwnerAction = async (payload) => {
  //console.log'payload', payload);
  try {
    var SendData = {}
    if(payload.Count) { SendData.Count = payload.Count; }
    if(payload.Price) { SendData.Price = payload.Price; }
    if(payload.Owner) { SendData.Owner = payload.Owner; }
    if (payload.CoinName) { SendData.coinname = payload.CoinName; }
    if(payload.tokenCreator) { SendData.tokenCreator = payload.tokenCreator; }
    if(payload.Balance) { SendData.Balance = payload.Balance; }
    if(payload.Quantity) { SendData.Quantity = payload.Quantity; }
    if(payload.ContractAddress) { SendData.ContractAddress = payload.ContractAddress; }
    if(payload.Type) { SendData.Type = payload.Type; }
    if(payload.PutOnSale) { SendData.PutOnSale = payload.PutOnSale; }
    if(payload.HashValue) { SendData.HashValue = payload.HashValue; }
    if(payload.Status) { SendData.Status = payload.Status; }
    let resp1Data = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/add/owner`,
      data: SendData
    });
    return { data: resp1Data.data }
  }
  catch (err) {
    ////('TokenAddOwnerAction err',err)
    return {
    //errors: err.response.data
    }
  }
}

export const CreateTokenValidationAction = async (payload) => {
  ////('payload', payload);
  try {
    let respData = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/add/item/validation`,
      data: payload
    });
    return {
      data: respData.data
    }
  }
  catch (err) {
  }
}

export const GetCategoryAction = async (payload) => {
  try {
    let respData = await axios({
      'method': 'get',
      'url': `${config.vUrl}/token/category/list`,
      data: payload
    });
    return {
      data: respData.data
    }
  }
  catch (err) {
  }
}

export const GetLikeDataAction = async (payload) => {
  try {
    let respData = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/like/list`,
      data: payload
    });
    return {
      data: respData.data
    }
  }
  catch (err) {
  }
}

export const AddLikeAction = async (payload) => {
  try {
    var route=""
    switch (payload.action) {
    case 'like':
      route="token/like"
      break;
    case 'mint':
      route='token/add/item'
      break;  
    }

    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/like`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}



export const CollectiblesList_MyItems = async (payload) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/collectibles/list/myitems`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}

export const CollectiblesList_Home = async (payload) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/collectibles/list/home`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}
export const NewCollectiblesList_Home = async (payload) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/collectibles/list/newHome`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}

export const CollectiblesList_Follow = async (payload) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/collectibles/list/follow`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}

export async function activityUpdate(data) {
  try {
    let checkAddr = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/test/activityUpdate`,
      'data': data
    })
    return {
      data: checkAddr.data
    }
  }
  catch (err) {
    return {
      // error: err.response.data
    }
  }
}



export const topCreatorsApi = async (data) => {
  // //("datra" + JSON.stringify(data))
  try {
          let respData = await axios({
                  'method': 'get',
                  'url': `${config.vUrl}/token/home/topCreatorsApi`,

          });
          return {

                  data: respData.data
          }
  }
  catch (err) {
          return {
                  // error: err.response.data
          }
  }
}

export const ipfsImageHashGet = async (payload) => {
  // //("datra" + JSON.stringify(data))
  var formData = new FormData();
  if(payload.Image) { formData.append('Image', payload.Image); }

  try {
          let respData = await axios({
                  'method': 'post',
                  'url': `${config.vUrl}/token/create/ipfsImageHashGet`,
                  data:formData,

          });
          return {
                  data: respData.data
          }
  }
  catch (err) {
          return {
                  // error: err.response.data
          }
  }
}


export const BurnField = async (data) => {
  // //console.lo(data,"dataaaaaaaaaaaaaaaaaaaa")
  try {
    
        let respData = await axios({
          'method': 'post',
          'url': `${config.vUrl}/admin/panel/BurnField`,
        
          data: data
      });
      return {
          loading: false,

      }

  }
  catch (err) {
      return {
          loading: false,
          error: err.response.data.errors
      }
  }
}


export const null_time_auction = async (data) => {
  // //console.lo(data,"dataaaaaaaaaaaaaaaaaaaa")
  try {
    
        let respData = await axios({
          'method': 'post',
          'url': `${config.vUrl}/token/null_time_auction`,
        
          data: data
      });
      return {
          loading: false,

      }

  }
  catch (err) {
      return {
          loading: false,
          error: err.response.data.errors
      }
  }
}
export const ipfsmetadatafunciton = async (payload) => {

  var formData = new FormData();
  // if(payload.Image) { formData.append('Image', payload.Image); }
  if(payload.name) { formData.append('name', payload.name); }
  if(payload.image) { formData.append('image', payload.image); }
  if(payload.description) { formData.append('desc', payload.description); }

  try {
          let respData = await axios({
                  'method': 'post',
                  'url': `${config.vUrl}/token/ipfsmetadata`,
                  data:formData,

          });
          return {
                  data: respData.data
          }
  }
  catch (err) {
          return {
                  // error: err.response.data
          }
  }
}

// convert
export const convertionValue = async (data) => {
  // ////console..log("datra" + JSON.stringify(data))
  try {
          let respData = await axios({
                  'method': 'get',
                  'url': 'https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD',

          });
          return {

                  data: respData.data
          }
  }
  catch (err) {
          return {
                  // error: err.response.data
          }
  }
}

export const convertionValue2 = async (data) => {
  // ////console..log("datra" + JSON.stringify(data))
  try {
          let respData = await axios({
                  'method': 'get',
                  'url': 'https://api.pancakeswap.info/api/v2/tokens/0x5d33e26336c445c71f206dd18b64ce11c2eee3f0',

          });
          return {

                  data: respData.data
          }
  }
  catch (err) {
          return {
                  // error: err.response.data
          }
  }
}


export const Transfer_Complete_Action = async (payload) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/tranfer/complete`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}


export const ApproveChecked = async (payload) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/user/ApproveChecked`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}

export const AskApproved = async (payload) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/user/AskApproved`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}


export const ApproveCh = async (payload) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/user/ApproveCh`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}


export const approvefalse = async (payload) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url': `${config.vUrl}/token/user/approvefalse`,
      data: payload
    });
    return {
      data: resp.data
    }
  }
  catch (err) {
  }
}

export const checkOtherPlatformDetais1155 = async (item,itemCur,type,web3) => {
  try{
  var currentOwner  = itemCur.tokenOwner;
        var tokenCounts= itemCur.tokenCounts;
        var owner=null;
        var balance = null;
        if(type==1155){
            
  var CoursetroContract = new web3.eth.Contract(
    Multiple,
    item.contractAddress
  );
   balance = await CoursetroContract.methods
  .balanceOf(
    currentOwner,
    tokenCounts
  ).call();
        }
        else if(type==721){
            var CoursetroContract = new web3.eth.Contract(
                Single,
                item.contractAddress
            );
            //console.log"balance>>>>>>>>",item,tokenCounts,CoursetroContract,currentOwner)
           
             owner = await CoursetroContract.methods
            .ownerOf(
              tokenCounts
            ).call();
            //console.log"balance>>>>>>>>>>>>>>>>>>",tokenCounts,owner,currentOwner)
            if ((owner).toLowerCase() === currentOwner) 
            {
              return true;
            }
            else{
              balance = 0
            }

        }
      
  if (balance !== null) {
    let payload = {
      currentOwner,
      owner,
      tokenCounts,
      balance
    }
    await findAndUpdateBalance(payload);
    //console.log'balance>>>>>',balance);
  }
  return balance;
}
catch(e){
  //console.log"ewurwe",e)
}
}

const findAndUpdateBalance = async (payload) => {
  //console.log'>>>>>>>>payload',payload);
  var data = await findAndUpdateBalanceAction(payload);
  if (data && data.data) {
    //console.log'>>>>>data', data.data.success);
  }
}

const findAndUpdateBalanceAction = async (payload) => {
	try {
		let resp = await axios({
			method : 'post',
			url : `${config.vUrl}/token/findAndUpdataBalance`,
			data : payload
		});
		return {
			data: resp.data
		}
	}
	catch (err) {
		//console.log">>>>fberror",err);
		return {
			data: [],
			error : 'Error : Oops something went to wrong'
		}
	}
}

export const getListOfToken = async () => {
  try {
    let respData = await axios({
      'method': 'get',
      'url': `${config.vUrl}/token/tokenOption`,
    });
    //console.log("CheckToken", respData.data)
    return {
      data: respData
    }
  }
  catch (err) {
  }
}
