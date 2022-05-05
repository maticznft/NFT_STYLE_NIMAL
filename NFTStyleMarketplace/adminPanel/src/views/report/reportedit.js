import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../loaders';

import Web3 from "web3";
import EXCHANGE from 'ABI/ABI.json';
import Modal from 'react-modal';
//import avatar from "assets/img/faces/marc.jpg";
import isEmpty from '../../lib/isEmpty';
import config from '../../lib/config'
import {  getfaq,updatefaq,getReportView,BurnField,deleteStatus,gettokendata } from '../../actions/users';
import SINGLE from 'ABI/SINGLE.json'
import MULTIPLE from 'ABI/MULTIPLE.json'
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
  "imageName":"" ,
  "imagehash":"",
  "imageOwner":"",
  "imageId":"",
  "imageType":"",
  "imageContractAddress":"",
  "report":"",
  "noofitems":"",
  "burnToken":""
  ,
  "currAddr":"",
  "CreatedAt":""
}

const useStyles = makeStyles(styles);

export default function UserProfile(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [userdet, setUser] = useState();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [validateError, setValidateError] = useState({});
  const [showingLoader, setshowingLoader] = React.useState(false);
  const [showtryagain, setshowtryagain] = React.useState("false");
  const [deleted,setdeleted]=useState(0)
 
  const[owner_Get,set_Owner_Get]=useState('')
  const [noofitemss, setnoofitems] = useState(1);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const { Id } = useParams();
   // //console.lo(userId,"asdfdsfdsfdsf");

   const[compeBtn,setcompeBtn]=useState('nodone')

  // function
  const onChange = (e) => {
    e.preventDefault();
   // //console.lo(e.target);
    const { id, value } = e.target;
    let formData = { ...formValue, ...{ [id]: value } }
    setFormValue(formData)
    //console.lo(formValue);
    //setValidateError(formData)
  }
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

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
    const {
      id,
      imageName ,
      imagehash,
      imageOwner,
      imageId,
      imageType,
      imageContractAddress,
      report,
      noofitems,
      burnToken,
      currAddr,
      CreatedAt
    } = formValue

    const Burntoken=async(data)=>{
      var tokenowner = data.imageOwner,
      tokenCounts = data.imageId,
      tokenConractAdd=data.imageContractAddress,
      type=data.imageType,
      NOFToken=noofitemss;
      var posdata={
        actionVal: "reportPage",
        tokenCounts:tokenCounts,
        contractAddress:tokenConractAdd,
        type:type,
        balance:NOFToken,
        tokenOwner:tokenowner,
        quant:data.noofitems
  
      }
      var ownget="";
      var web31=new Web3(config.BNBProvider)
      var CoursetroContract = new web31.eth.Contract(EXCHANGE, config.singleContract);
      ownget=await CoursetroContract.methods.owner().call()
      console.log("jkjkkdjks",ownget)
       ownget=String(ownget).toLowerCase();
      set_Owner_Get(ownget)
      
      // burn(address from, uint256 tokenCounts, address token, uint256 _type, uint256 NOFToken )
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        // setweb3s(web3)
        try {
                // alert(window.web3.eth.defaultAccount)
               
                if (typeof web3 !== 'undefined') {
                        window.ethereum.enable().then(async()=> {
                                const web3 = new Web3(window.web3.currentProvider)
                                if (window.web3.currentProvider.isMetaMask === true) {
                                  if((window.web3.eth.defaultAccount).toLowerCase() != ownget ){
                                    toast.error("You're not a admin.. can't burn token",toasterOption)
                                  }else{
                                
                                  var currAddr = window.web3.eth.defaultAccount;
                                        var result = await web3.eth.getAccounts()
                                        var setac = result[0]
                                        // alert(setac)
                                        var addes=String(setac).toLowerCase()
                                        if (window.web3.currentProvider.networkVersion == config.networkVersion) {
                                          console.log("dshadsa",tokenowner,tokenCounts,tokenConractAdd,type,NOFToken)
                                          var CoursetroContract1=null;
                                          if(type==721){
                                            setshowtryagain('process')
                                           
                                         CoursetroContract1 = new web3.eth.Contract(SINGLE, config.singleContract);
                                        //  burnData={tokenCounts}
                                         await CoursetroContract1
                                         .methods
                                         .burn(tokenCounts)
                                         .send({from:setac})
                                         .then(async(data)=>{
                                           
                                              var updateBurnField = await BurnField(posdata)

                                              if(updateBurnField){
                                                setshowtryagain('done')
                                                toast.success('Burned successfully',toasterOption)
                                                history.push('/reportlist')
                                              }
                                              else{
                                                // toast.error('')
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
                                          .burn(addes,tokenCounts,noofitemss)
                                          .send({from:setac})
                                          .then(async(data)=>{
                                            var updateBurnField = await BurnField(posdata)
                                            if(updateBurnField){
                                              setshowtryagain('done')
                                              toast.success('Burned successfully',toasterOption)
                                              history.push('/reportlist')
                                            }
                                            else{
                                              // toast.error('')
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
                                }                      })
        }
        else{
          toast.warning('please connect metamsk',toasterOption)
        }
        }
        catch(e){
  
        }
      }
    }
  
    function openModal(userDe) { 
      //console.lo(userDe);
      setIsOpen(true);
    }
  

  useEffect(() => {
    getFaqData11();
  }, [])

  useEffect(() => {
    getTokenData()
  },[imageId,imageOwner])

  const getTokenData = async () => {
var reqdata={
tokenCounts:imageId,
tokenOwner:imageOwner
}
var test = await gettokendata(reqdata);
console.log("jbiusbnifusb",test)
if (test&&test.cmsData&&(test.cmsData).length>0) {
  //alert(test.cmsData[0].tokenOwnerDb.deleted)
  setdeleted(test.cmsData[0].tokenOwnerDb.deleted)
}
}

  const hideshow=async(deleted)=>{
    console.log('varuthu',deleted)
    if(deleted==1){
        var postdata={
            deleted:0,
            tokenCounts:imageId,
            tokenOwner:imageOwner
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
            tokenCounts:imageId,
            tokenOwner:imageOwner
        }
        var resp=await deleteStatus(postdata)
        if(resp&&resp.userValue){
            setTimeout(() => {
                window.location.reload()
            }, (2000));
             }
    }
    

}

  const getFaqData11 = async () => {  
    var test = await getReportView(Id);
    console.log("sdasdasdsadas",test.userValue.userValue)
    if(test.userValue.userValue){
    let formdata = {};
    formdata['imageName'] = test.userValue.userValue.imageName;
    formdata['imagehash'] = test.userValue.userValue.imagehash;
    formdata['imageOwner'] = test.userValue.userValue.imageOwner;
    formdata['imageId'] = test.userValue.userValue.imageId;
    formdata['imageType'] = test.userValue.userValue.imageType;
    formdata['imageContractAddress'] = test.userValue.userValue.imageContractAddress;
    formdata['report'] = test.userValue.userValue.report;
    formdata['noofitems'] = test.userValue.userValue.noofitems;
    formdata['burnToken'] = test.userValue.userValue.burnToken;
    formdata['currAddr'] = test.userValue.userValue.currAddr;
    formdata['CreatedAt'] = test.userValue.userValue.CreatedAt;

    setFormValue(formdata);
    //setUser(test.userValue);
    }
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <form className={classes.form} >
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>View Reports</h4>
                {/* <p className={classes.cardCategoryWhite}>Update Faq</p> */}
              </CardHeader>
              <CardBody>
                <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Image Name"
                        // onChange={onChange}
                        id="imageName"
                        value={imageName || ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                      }}
                      />
                     
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Image Hash Value"
                        // onChange={onChange}
                        id="imagehash"
                        value={imagehash || ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                      }}
                      />
                     
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Image Owner"
                        // onChange={onChange}
                        id="imageOwner"
                        value={imageOwner || ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                      }}
                      />
                     
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Image Id"
                        // onChange={onChange}
                        id="imageId"
                        value={imageId || ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                      }}
                      />
                     
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Image Type"
                        // onChange={onChange}
                        id="imageType"
                        value={imageType || ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                      }}
                      />
                     
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Image Contract Address"
                        // onChange={onChange}
                        id="imageContractAddress"
                        value={imageContractAddress || ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                      }}
                      />
                     
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Report"
                        // onChange={onChange}
                        id="report"
                        value={report || ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                      }}
                      />
                     
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="No Of Items"
                        // onChange={onChange}
                        id="noofitems"
                        value={noofitems || ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                      }}
                      />
                     
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Burn Token"
                        // onChange={onChange}
                        id="burnToken"
                        value={ burnToken|| ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                      }}
                      />
                     
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Reported By"
                        // onChange={onChange}
                        id="currAddr"
                        value={ currAddr|| ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                      }}
                      />
                     
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>                 
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Created At"
                        // onChange={onChange}
                        id="CreatedAt"
                        value={CreatedAt || ''}
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
                {/* <Button color="primary"
                  onClick={() => openModal(id)}>
                    Burn Token</Button> */}
                    <span>Click To <span className="text-danger font-weight-bold">{(deleted==1)?'Hide':'Show'}</span> {"NFT in MarketPlace ->"}</span>
                    <Button color="primary" onClick={()=>hideshow(deleted)}>{
                                (deleted==1)?'Hide':'Show'
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
                           <label for="qty">Enter quantity <span className="label_muted pl-2">({noofitems} available)</span></label>
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
                                 (document.getElementById('qtySingle').value > noofitems ?
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
