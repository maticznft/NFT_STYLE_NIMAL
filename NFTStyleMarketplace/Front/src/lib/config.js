import DETH_ABI from '../ABI/DETH_ABI.json';
import Loder from '../assets/images/loader.png'
import '@metamask/legacy-web3'
import axios from 'axios';
let fee1 = '';
//let networkVersion = '56';
let networkVersion = '97';
var chainId='0x61';
//  var chainId='0x38';
var chainIds=1;
const singleType = 721;
const multipleType = 1155;
let currencySymbol = 'BNB';
let tokenSymbol = 'NFTSTYLE';
let maxLength = 6;
var WenlamboConvertVal = 0
let PurchaseTransferType = 'currency';
var tokenAddr = {
    //DETH: "0xcF54Db463e718241220b16C51a3a8CdabF9b5384" //old data
    WBNB: "0xcF54Db463e718241220b16C51a3a8CdabF9b5384" //test

}
var tokenABI = {
    DETH: DETH_ABI,
}
let BNBPROVIDER = "";
let Front_URL = '';
let Back_URL = '';
let Users_URL = '';
let v1Url = '';
let limit = '8';
let Lod = Loder;
let limitMax = '3010';
let decimalvalues = 1000000000000000000;
let toFixed = 6;
var tokenFee = 0;
let IPFS_IMG = "https://ipfs.io/ipfs";
var nameFormat = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

var shareTag = []

var toasterOption = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    limit: 1
}
var providercon = null;
var buyerfee = 0;
var sellerfee = 0;
// console.clear(); 

// demo
const exchangeAddress = "";
// const singleContract = "0xF0f9E8B5c791e5F75E6b574EA6b9dC46d68DC44A"; //old data
// const multipleContract = "0x3241AaAbad97ebf0A22B8e88b5DB9B3758C08026"; //old data
const singleContract = "0x7F3C0A4Aa2ED97E17a5031b199ac541648fF267f"; //test
const multipleContract = "0x59210849d5dB76c2BF88FaB4931c37F274c60625"; //test
//const singleContract = "0x15b6b7A3cdF0C2A70a423c9EC461eB80ecb98cfd"; //live
//const multipleContract = "0x54E5fE6De7ec131fac349a7EAAB04720EAAee522";//live



let EnvName = 'local';
let toaster = "";
let fee = fee1;
var currAdrress = '';
if (EnvName === "production") {
    //Front_URL = 'http://localhost:3010';
    Front_URL = 'https://store.nft-style.com';
    Users_URL = 'https://store.nft-style.com/user';
    Back_URL = 'https://api.nft-style.com';
    v1Url = 'https://api.nft-style.com/v1';
    BNBPROVIDER = "https://bsc-dataseed1.binance.org";
    toaster  = "Please Connect to Binance Mainnet";
}
else if (EnvName === "demo") {
    //Front_URL = 'http://192.53.121.26/NFT-Style';
    Front_URL = 'http://localhost:3010';
    Users_URL = 'http://192.53.121.26/NFT-Style/user';
    Back_URL = 'http://192.53.121.26:2053';
    v1Url = 'http://192.53.121.26:2053/v1';
    BNBPROVIDER = "https://data-seed-prebsc-1-s1.binance.org:8545/";
    toaster  = "Please Connect to Binance Test Net";
}
else if (EnvName === "production2") {
   
}
else if (EnvName === "demoLive") {
}
else {
    Front_URL = 'http://localhost:3010';
    Users_URL = 'http://localhost:3010/user';
    Back_URL = 'http://localhost:2010';
    v1Url = 'http://localhost:2010/v1';
    BNBPROVIDER = "https://data-seed-prebsc-1-s1.binance.org:8545/";
}

async function tag() {
    var id = "0000"
    await axios.get(v1Url + '/admin/panel/getnfttag/' + id)
        .then((data) => {
            if (data && data.data && data.data.userValue) {
                (data.data.userValue).map((item) => {
                    (shareTag).push(item.nfttag)
                    return item
                })
            }
        })
}
tag();
let key = {
    Front_URL: Front_URL,
    Back_URL: Back_URL,
    v1Url: v1Url,
    vUrl: v1Url,
    fee: fee,
    decimalvalues: decimalvalues,
    toFixed: toFixed,
    networkVersion: networkVersion,
    currencySymbol: currencySymbol,
    tokenSymbol: tokenSymbol,
    toasterOption: toasterOption,
    limit: limit,
    limitMax: limitMax,
    exchangeAddress: exchangeAddress,
    singleContract: singleContract,
    multipleContract: multipleContract,
    // adminAddress: adminAddress,
    tokenAddr: tokenAddr,
    singleType: singleType,
    multipleType: multipleType,
    IPFS_IMG: IPFS_IMG,
    BNBPROVIDER: BNBPROVIDER,
    tokenABI: tokenABI,
    PurchaseTransferType: PurchaseTransferType,
    maxLength: maxLength,
    Users_URL: Users_URL,
    Lod: Lod,
    chainId: chainId,
    WenlamboConvertVal: WenlamboConvertVal,
    currAdrress: currAdrress,
    tokenFee: tokenFee,
    sellerfee: sellerfee,
    buyerfee: buyerfee,
    shareTag: shareTag,
    providercon: providercon,
    nameFormat: nameFormat,
    chainIds: chainIds,
    toaster:toaster
};

export default key;
