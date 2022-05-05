
let key = {};
var EnvName = 'production';
let IPFS_IMG = "https://ipfs.infura.io/ipfs"
var networkVersion=''
var BNBProvider="";
let Back_Url=""
let decimalValues = 1000000000000000000;
let toasterOption = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
}
if (EnvName === "demo") {
    var exchangeAddress = "0x08aF65036535b0a90F65c395bd6811b9f1E9a0A4";
    var adminaddress = "";
    var singleContract="0x7F3C0A4Aa2ED97E17a5031b199ac541648fF267f";
    var multipleContract="0x59210849d5dB76c2BF88FaB4931c37F274c60625";
    var API_URL = '';
    var IMAGE_URL = '';
    var PORT = 2053;
    networkVersion='97';
    BNBProvider="";
    Back_Url=''
}
 else if(EnvName === "production") {
    var exchangeAddress = "";
    var adminaddress = "";
    var singleContract="0x15b6b7A3cdF0C2A70a423c9EC461eB80ecb98cfd";
    var multipleContract="0x54E5fE6De7ec131fac349a7EAAB04720EAAee522";
    var API_URL = 'https://api.nft-style.com';
    var IMAGE_URL = 'https://api.nft-style.com/images/user';
    var PORT = 2053;
    networkVersion='56';
    Back_Url='https://api.nft-style.com';
    BNBProvider="https://bsc-dataseed1.binance.org";
    var Front_URL="https://store.nft-style.com/nimdaelytstfn"
    
}
else if(EnvName === "local") {
    var exchangeAddress = "";
    var adminaddress = "";
    var singleContract="0x7F3C0A4Aa2ED97E17a5031b199ac541648fF267f";
    var multipleContract="0x59210849d5dB76c2BF88FaB4931c37F274c60625";
    var API_URL = 'http://localhost:2010';
    var IMAGE_URL = 'http://localhost:2010/images/user';
    var PORT = 2010;
    Back_Url='http://localhost:2010'
    networkVersion='97';
    BNBProvider="https://data-seed-prebsc-1-s1.binance.org:8545/";
    var Front_URL="http://localhost:3000/nimdaelytstfn"
}

key = {
    secretOrKey: "",
    Recaptchakey: "",
    API:`${API_URL}/v1`,
    IMAGE_URL:IMAGE_URL,
    exchangeAddress:exchangeAddress,
    toasterOption:toasterOption,
    IPFS_IMG:IPFS_IMG,
    networkVersion:networkVersion,
    adminaddress:adminaddress,
    decimalValues:decimalValues,
    Back_Url:Back_Url,
    singleContract:singleContract,
    multipleContract:multipleContract,
    networkVersion:networkVersion,
    BNBProvider:BNBProvider,
    Front_URL:Front_URL
};

export default key;