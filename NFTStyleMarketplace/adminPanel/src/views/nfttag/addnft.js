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
import { useHistory,useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import isEmpty from '../../lib/isEmpty';
import {  addcategory,AddNFTlist,getnftlist } from '../../actions/users';
import ABI from '../../ABI/ABI.json';
import Fortmatic from 'fortmatic';
import config from '../../lib/config'
import Web3 from 'web3';
import '@metamask/legacy-web3';
const { web3 }      = window;
const Smartcontract = config.Smartcontract;
const OwnerAddr     = config.OwnerAddr;
const useStyles     = makeStyles(styles);
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
let toasterOption = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}

const initialFormValue = {
  'nftag': "",
}

export default function AddNFT() {
  const classes                   = useStyles();
  const history                   = useHistory();
  const {id }                       = useParams();
  const dispatch                  = useDispatch();
  const [userdet, setUser]        = useState();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [validateError, setValidateError] = useState({});
  const [accounts, setaccount]     = React.useState(0);
  const [tokenbalance, setTokenbalance]      = React.useState(0);
  const [bnbbalance, setBNBbalance]= React.useState(0);

  useEffect(()=>{
    getnftdata();
  },[])

  const getnftdata=async()=>{
    //console.log"opop",id)
    if(id&&id!=""){
      var postdata={
        id:id
      }
      var test = await getnftlist(postdata);
        // setUser(test.userValue);
        if (test&&test.userValue&&test.userValue[0].nfttag) {
          let formdata = {};
          //console.log"ewqewqewqewqe",test.userValue)
          formdata['nfttag'] = test.userValue[0].nfttag;
          
          setFormValue(formdata)
     }}
  }

  const handleFile = (event) => {
    event.preventDefault();
    const { id, files } = event.target;
    let formData = { ...formValue, ...{ [id]: files[0] } }
    setFormValue(formData)
  };

  const onChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    let formData = { ...formValue, ...{ [id]: value } }
    setFormValue(formData)
  }

    const {
      nfttag
    } = formValue

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let reqData = {
      id,
      nfttag
    }

    var data = await AddNFTlist(reqData);

      if ((data)) {
      toast.success('NFT details added', toasterOption);
        setTimeout(
        ()=> window.location.href='/nimdaelytstfn/nfttag'
        ,1000)
     
    } else {
      setValidateError({});
    }
   
  }
  
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <form className={classes.form} noValidate onSubmit={handleFormSubmit}>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>{id!="" ?'Edit':'Add'} sharing NFT tag</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>                 
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="NFT Tag Name"
                      onChange={onChange}
                      id="nfttag"
                      value={nfttag}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    {
                        validateError.nfttag && <span className="text-danger">{validateError.nfttag}</span>
                    }
                  </GridItem>
                  
                </GridContainer>
              
              </CardBody>
              <CardFooter>
                <Button color="primary" type="submit">Add</Button>
              </CardFooter>
            </form>
          </Card>
        </GridItem>       
      </GridContainer>
    </div>
  );
}
