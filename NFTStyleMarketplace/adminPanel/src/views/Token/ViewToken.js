import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { useHistory, useParams ,Link} from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import isEmpty from '../../lib/isEmpty';
import Web3 from "web3";
import EXCHANGE from 'ABI/ABI.json';
import Modal from 'react-modal';
import SINGLE from 'ABI/SINGLE.json';
import MULTIPLE from 'ABI/MULTIPLE.json'
import { getcatory, gettokendata, updatecategory,BurnField,deleteStatus } from '../../actions/users';
import config from '../../lib/config'
const useStyles = makeStyles(styles);
const styles = {
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    }
};

// toaster config
toast.configure();
let toasterOption =config.toasterOption

const initialFormValue = {
    
        "image" : "",
        "swapPrice" : 0,
        "tokenDesc" : "",
        "tokenPrice" : 0,
        "tokenCategory" : "",
        "likecount" : 0,
        "hashValue" : "",
        "status" : "",
        // "deleted" : 0,
        "tokenQuantity" : 0,
        "balance" : 0,
        "contractAddress" : "",
        "type" : 721,
        "minimumBid" : 0,
        "endclocktime" : null,
        "clocktime" : null,
        "unlockcontent" : "",
        "counts" : 0,
        "PutOnSale" : true,
        "PutOnSaleType" : "",
        "ipfsimage" : "",
        "tokenCounts" : 0,
        "tokenName" : "",
        "tokenRoyality" : 0,
        "tokenBid" : true,
        "tokenOwner" : "",
        "tokenCreator" : "",
         "timestamp" : null,

       
}
function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

 
export default function EditCategory() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [userdet, setUser] = useState();
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [accounts, setaccount] = React.useState(0);
    const [tokenbalance, setTokenbalance] = React.useState(0);
    const [bnbbalance, setBNBbalance] = React.useState(0);
    const [categoryurl, setImage] = React.useState("");
    const [category, setCategory] = useState([]);
    const [categoryname, setCategoryname] = useState('');
    const [catdata, setcatdata] = useState('');
    const [showingLoader, setshowingLoader] = React.useState(false);
    const [showtryagain, setshowtryagain] = React.useState("false");
 
    const[owner_Get,set_Owner_Get]=useState('')
    const [selectedOption, setselectedOption] = useState(null);
    const [noofitemss, setnoofitems] = useState(0);
  
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [noofitems,setnoofitemss]=useState(0)

    const[token_price,set_token_price]=useState(0);
    const[token_balance,set_token_balance]=useState(0);
    const[token_owner,set_token_owner]=useState('');
    // const [timestamp,set_timestamp]=useState(null);

    const[compeBtn,setcompeBtn]=useState('nodone')
const [deleted,setdeleted]=useState(0)
    const { Owner,Id } = useParams();
    console.log("shgdhsjghsdfgfsdjfsdfd",Id,Owner)
    useEffect(() => {
        getCategory()
        getTokenData();
    }, [])
    const customStyles1 = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };
      function closeModal() {
        setIsOpen(false);
      }
    async function getCategory() {

        var data = await getcatory()
        if (data && data.userValue != undefined) {

            var category = [];
            data.userValue.map((item) => {
                var cname = item.name;
                category.push({ value: item._id, label: cname })
            })
            setCategory(category)
        }
    }
    const handleChange = (optionsTerms) => {
        //console.lo("handleChange", optionsTerms)
        setCategoryname({ categoryname: optionsTerms.value });
    };
    const getTokenData = async () => {
        console.log("qewqweqwewqeqweqw",Id,Owner)
var reqdata={
    tokenCounts:Id,
    tokenOwner:Owner
}
        var test = await gettokendata(reqdata);
        console.log("userValue", test.cmsData[0])
        if (test&&(test.cmsData).length>0) {
               let formdata = {};
               formdata['image'] = test.cmsData[0].image;
               formdata['swapPrice'] = test.cmsData[0].swapPrice;
               formdata['tokenDesc'] = test.cmsData[0].tokenDesc;
               if(test.cmsData[0].tokenOwnerDb&&test.cmsData[0].tokenOwnerDb.tokenPrice){
                formdata['tokenPrice'] = test.cmsData[0].tokenOwnerDb.tokenPrice;
                set_token_price(test.cmsData[0].tokenOwnerDb.tokenPrice)

            }
                else{
                 formdata['tokenPrice'] = test.cmsData[0].tokenPrice;
                 set_token_price(test.cmsData[0].tokenPrice)
                }
            //    formdata['tokenPrice'] = test.cmsData[0].tokenPrice;
               formdata['likecount'] = test.cmsData[0].likecount;
               formdata['tokenCategory'] = test.cmsData[0].tokenCategory;
               formdata['hashValue'] = test.cmsData[0].hashValue;
               formdata['status'] = test.cmsData[0].status;
               setdeleted(test.cmsData[0].tokenOwnerDb.deleted)
            //    formdata['deleted'] = test.cmsData[0].deleted;
               formdata['tokenQuantity'] = test.cmsData[0].tokenQuantity;
               formdata['balance'] = test.cmsData[0].tokenOwnerDb.balance;
                setnoofitemss(test.cmsData[0].tokenOwnerDb.balance)
                set_token_balance(test.cmsData[0].tokenOwnerDb.balance)
               formdata['contractAddress'] = test.cmsData[0].contractAddress;
               formdata['type'] = test.cmsData[0].type;
               formdata['minimumBid'] = test.cmsData[0].minimumBid;
               formdata['endclocktime'] = test.cmsData[0].endclocktime;
               formdata['clocktime'] = test.cmsData[0].clocktime;
               formdata['unlockcontent'] = test.cmsData[0].unlockcontent;
               formdata['counts'] = test.cmsData[0].counts;
               formdata['PutOnSale'] = test.cmsData[0].PutOnSale;
               formdata['PutOnSaleType'] = test.cmsData[0].PutOnSaleType;
               formdata['ipfsimage'] = test.cmsData[0].ipfsimage;
               formdata['tokenCounts'] = test.cmsData[0].tokenCounts;
               formdata['tokenName'] = test.cmsData[0].tokenName;
               formdata['tokenRoyality'] = test.cmsData[0].tokenRoyality;
               formdata['tokenBid'] = test.cmsData[0].tokenBid;
                formdata['tokenOwner'] = test.cmsData[0].tokenOwnerDb.tokenOwner;
                set_token_owner(test.cmsData[0].tokenOwnerDb.tokenOwner)
               formdata['tokenCreator'] = test.cmsData[0].tokenCreator;
            //    if(test.cmsData[0].tokenOwnerDb&&test.cmsData[0].tokenOwnerDb.timestamp!=""){
                formdata['timestamp'] = test.cmsData[0].tokenOwnerDb.timestamp;
                // set_timestamp(test.cmsData[0].tokenOwnerDb.timestamp)
            // }
                // else{
                //  formdata['timestamp'] = test.cmsData[0].timestamp;
                //  set_timestamp(test.cmsData[0].timestamp)
                // }
               console.log("uweyreuwrtweruew",test.cmsData[0])
             setFormValue(formdata)
        }
      
    }
    const Burntoken=async(data)=>{
        var ownget=""
        // var tokenowner = data.tokenowners_current[0].tokenOwner,
       var tokenCounts = data.tokenCounts;
       var tokenConractAdd=data.contractAddress;
       var type=data.type;
        // NOFToken=data.tokenowners_current[0].balance;
        var posdata={
          tokenCounts:tokenCounts,
          contractAddress:tokenConractAdd,
          type:type,
          balance:noofitemss,
          tokenOwner:token_owner,
          quant:token_balance
    
        }
        var web31=new Web3(config.BNBProvider)
        var CoursetroContract = new web31.eth.Contract(SINGLE, config.singleContract);
        ownget=await CoursetroContract.methods.owner().call()
        console.log("jkjkkdjks",ownget)
         ownget=String(ownget).toLowerCase();
        set_Owner_Get(ownget)
        // burn(address from, uint256 tokenCounts, address token, uint256 _type, uint256 NOFToken )
        if (window.ethereum) {
          var web3 = new Web3(window.ethereum);
              if ( web3 !== undefined) {
                    //   alert('1')
                          await window.ethereum.enable()
                          .then(async()=> {
                            // alert('2')
                                  const web3 = new Web3(window.web3.currentProvider)
                                  if (window.web3.currentProvider.isMetaMask === true) {
                                    if(((window.web3.eth.defaultAccount).toLowerCase()) !=  ownget){
                                      toast.error("Can Admin only burn token",toasterOption)
                                    }else{
                                  
                                    var currAddr = window.web3.eth.defaultAccount;
                                          var result = await web3.eth.getAccounts()
                                          var setac = result[0]
                                        //   alert('3')
                                            var addes=String(setac).toLowerCase()
                                          if (window.web3.currentProvider.networkVersion == config.networkVersion) {
                                            // alert(token_owner,data.tokenCounts,data.contractAddress,data.type,token_balance)
                                            console.log("yertyewtrtyewrew",noofitemss,tokenCounts,setac,addes,token_owner,data.type,token_balance)
                                            //console.lo("dshadsa",tokenowner,tokenCounts,tokenConractAdd,type,NOFToken)
                                            var CoursetroContract1=null
                                            var burnData=null

                                            if(type==721){
                                                setshowtryagain('process')
                                               
                                             CoursetroContract1 = new web3.eth.Contract(SINGLE, config.singleContract);
                                            //  burnData={tokenCounts}
                                             await CoursetroContract1
                                             .methods
                                             .burnToken(tokenCounts,setac)
                                             .send({from:setac})
                                             .then(async(data)=>{
                                              
                                                 var updateBurnField = await BurnField(posdata)
                                                 if(updateBurnField){
                                                    showtryagain('done')
                                                   toast.success('Burned successfully')
                                                   history.goBack()
                                                 }
                                                 else{
                                                  
                                                 }
     
                                             })
                                             .catch((e)=>{
                                               setshowingLoader(true)
                                               setshowtryagain("true")
                                             })
                                            }
                                            else{
                                                setshowtryagain('process')
                                               
                                                CoursetroContract1 = new web3.eth.Contract(MULTIPLE, config.multipleContract);
                                                // burnData={};
                                                await CoursetroContract1
                                                .methods
                                                .burnToken(setac,tokenCounts,noofitemss)
                                                .send({from:setac})
                                                .then(async(data)=>{
                                                 
                                                    var updateBurnField = await BurnField(posdata)
                                                    if(updateBurnField){
                                                        setshowtryagain('done')
                                                      toast.success('Burned successfully',toasterOption)
                                                      history.goBack()
                                                    }
                                                    else{
                                                     
                                                    }
        
                                                })
                                                .catch((e)=>{
                                                  setshowingLoader(true)
                                                  setshowtryagain("true")
                                                })
                                            }
                                           
                                             
                                          } else {
                                            toast.warning('please connect binance network' ,toasterOption)
                                               
                                          }
                                        }
                                  }
                                  else{
                                    toast.warning('please connect metamsk',toasterOption)
                                  }
          
                          })
          }
          else{
            toast.warning('please connect metamsk',toasterOption)
          }
         
        }
      }
    
      function openModal(userDe) { 
        //console.lo(userDe);
        setIsOpen(true);
      }
    

    const handleFile = (event) => {
        event.preventDefault();
        const { id, files } = event.target;
        let formData = { ...formValue, ...{ [id]: files[0] } }
        setFormValue(formData)
    };
 const back = async () => {
     window.location.href='/nimdaelytstfn/SupportTicket';
    }
    const onChange = (e) => {
        e.preventDefault();
        const { id, value } = e.target;
        let formData = { ...formValue, ...{ [id]: value } }
        setFormValue(formData)
    }

    const {
   
        image,
        swapPrice,
        tokenDesc,
        tokenPrice,
        tokenCategory,
        likecount,
        hashValue,
        status,
        // deleted,
        tokenQuantity,
        balance,
        contractAddress,
        type,
        minimumBid,
        endclocktime,
        clocktime,
        tokenProperty,
        unlockcontent,
        counts,
        PutOnSale,
        PutOnSaleType,
        ipfsimage,
        tokenCounts,
        tokenName,
        tokenRoyality,
        tokenBid,
        tokenOwner,
        tokenCreator,
        timestamp,
    } = formValue

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        var name = categoryname.categoryname;
        let reqData = {
            name,
            // Photofile,
            // userId
        }

        //console.lo("updatecategory", reqData)
        const { error } = await updatecategory(reqData);
        if (isEmpty(error)) {
            toast.success('Category details updated successfully', toasterOption);
            setTimeout(
                () => window.location.href = '/nimdaelytstfn/TokenList'
                , 1000)

        } else {
            setValidateError(error);
        }

    }

const hideshow=async(deleted)=>{
    // console.log('varuthu')
    if(deleted==1){
        var postdata={
            deleted:0,
            tokenCounts:tokenCounts,
            tokenOwner:tokenOwner
        }
        var resp=await deleteStatus(postdata)
        if(resp&&resp.userValue){
            setTimeout(() => {
                window.location.reload()
            }, (2000));
      
          }
    }
    else if(deleted==0){
        var postdata={
            deleted:1,
            tokenCounts:tokenCounts,
            tokenOwner:tokenOwner
        }
        var resp=await deleteStatus(postdata)
        if(resp&&resp.userValue){
            setTimeout(() => {
                window.location.reload()
            }, (2000));
             }
    }
    

}

    return (
        <div>
        <div className="page_header">
         <button className="btn btn-success mr-3"><Link to="/TokenList">Back</Link></button> 
      </div>
            <GridContainer>

                <GridItem xs={12} sm={12} md={12}>
                    <Card>

                        <form className={classes.form}>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>View Token</h4>

                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token count"
                                            // onChange={onChange}
                                            id="tokenCounts"
                                         
                                            value={tokenCounts}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
          
                                        <CustomInput
                                            labelText="Token Name"
                                            // onChange={onChange}
                                            id="tokenName"

                                            value={tokenName}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                   {tokenDesc !== undefined && tokenDesc != "" &&
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Description"
                                            // onChange={onChange}
                                            id="tokenDesc"

                                            value={tokenDesc}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>}
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Bid"
                                            // onChange={onChange}
                                            id="tokenBid"

                                            value={tokenBid}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                   {
                                   clocktime == null && endclocktime == null && tokenPrice !=0 &&
                                   <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Price"
                                            onChange={onChange}
                                            id="tokenPrice"

                                            value={token_price}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>}
                                    {clocktime!=null && endclocktime !=null&&
                                       (<>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Starting Time"
                                         
                                            id="clocktime"

                                            value={clocktime}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Ending Time"
                                         
                                            id="endclocktime"

                                            value={endclocktime}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Minimum Bid"
                                         
                                            id="minimumBid"

                                            value={minimumBid}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>


                                    </>)}   
                                      <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Royalty (in Percentage)"
                                            onChange={onChange}
                                            id="tokenRoyality"

                                            value={tokenRoyality}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Total Quantity"
                                            onChange={onChange}
                                            id="tokenQuantity"

                                            value={tokenQuantity}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Available Quantity(balance)"
                                            // onChange={onChange}
                                            id="balance"
                                            value={token_balance}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                  

                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="TokenCateory"
                                            onChange={onChange}
                                            id="tokenCategory"

                                            value={tokenCategory}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                  {tokenProperty !== undefined && tokenProperty != ""&& 
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Property"
                                            // onChange={onChange}
                                            id="tokenProperty"

                                            // value={tokenProperty}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>}
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Creator"
                                            onChange={onChange}
                                            id="tokenCreator"

                                            value={tokenCreator}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Owner"
                                            onChange={onChange}
                                            id="tokenOwner"

                                            value={token_owner}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                  
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Contract Address"
                                            id="contractAddress"
                                            value={contractAddress}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Type"
                                            id="type"
                                            value={type}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                  
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Status"
                                            // onChange={onChange}
                                            id="status"

                                            value={status}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>

                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Token Hash Value"

                                            id="hashValue"

                                            value={hashValue}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Created At"

                                            id="timestamp"

                                            value={timestamp}
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                             inputProps={{
                                              disabled: true
                                          }}
                                        />

                                    </GridItem>
                                  
                                  
                                   </GridContainer>

                            </CardBody>
                            <CardFooter>
                                {/* <Button color="primary" onClick={openModal}>Burn Token</Button> */}
                                <Button color="primary" onClick={()=>hideshow(deleted)}>{
                                (deleted==1)?'Visible':'Hidden'
                                }</Button>
                            
                            </CardFooter>
                        </form>
                    </Card>
                </GridItem>
            </GridContainer>
            <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles1}
        contentLabel="Example Modal"
      >
        {/* {showingLoader == true ? <Loader/>:null} */}

        {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
        <button onClick={closeModal}>close</button>
        <div>Burn Token</div>
        <div class="modal-body px-0">
                       
                       
                       <form className="bid_form">
                         <div className="bor_bot_modal mb-3 px-4 ">
                           <div className="mx-0 pb-3">

                           </div>
                           <label for="qty">Enter quantity <span className="label_muted pl-2">({balance} available)</span></label>
                           <div class="mb-3 input_grp_style_1">
                             <input type="text" id="qtySingle" class="form-control text-center" placeholder="1" onChange={(e)=>setnoofitems(e.target.value)} />

                           </div>
                           </div>
                       </form>

                     
                   
                       <form className="px-4">
                         <div className="text-center">
                           {
                             isEmpty(document.getElementById('qtySingle') || {}.value) ?
                               <Button className="create_btn btn-block" disabled={true}>Enter Available Quantity</Button> :
                               ((document.getElementById('qtySingle').value) == parseFloat(0) ?
                                 <Button className="create_btn btn-block" disabled={true}>Enter Available Quantity</Button> :
                                 (document.getElementById('qtySingle').value > balance ?
                                   <Button className="create_btn btn-block" disabled={true}>Enter Available Quantity</Button> :
                                   <div>
                                     <div class="mb-3">
                                   { showtryagain == "false"&&
                                       <Button className="create_btn btn-block" data-dismiss="modal" aria-label="Close" id="btn1s" onClick={()=>Burntoken(formValue)} >Burn Token</Button>
                           }{
                            showtryagain == "true"&&
                            <Button className="create_btn btn-block" data-dismiss="modal" aria-label="Close" id="btn2s"  onClick={()=>Burntoken(formValue)}>Try Again</Button>
                                    }</div>

                                { showtryagain == "done"&&
                                       <Button className="create_btn btn-block">Done</Button>
                                     }
                                       { showtryagain == "process"&&
                                       <Button className="create_btn btn-block">In-Progress</Button>
                                     }
                                     <Button className="btn_outline_red create_btn btn-block"  onClick={()=>{window.location.reload()}}>Cancel</Button>

                                   </div>))

                           }

                           </div></form>
                         </div>
      </Modal>
 
        </div>
    );
}
