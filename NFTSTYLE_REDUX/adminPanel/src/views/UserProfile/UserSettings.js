import React, { useState, useEffect, Fragment } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
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
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import ReactDatatable from '@ashvin27/react-datatable';
import Paper from '@material-ui/core/Paper';
//import avatar from "assets/img/faces/marc.jpg";
import isEmpty from '../../lib/isEmpty';
import Modal from 'react-modal';
import { updateSettings, getsettdata } from '../../actions/users';
import { event } from "react-ga";

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
  },
};
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



const useStyles = makeStyles(styles);


var tempname;
var templink;
export default function UserProfile() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [userdet, setUser] = useState();
  const [formValue, setFormValue] = useState({});
  const [validateError, setValidateError] = useState({});
  const [modalshow, setmodalshow] = useState(false)
  const [dummyarr, setdummyarr] = useState()
  const [responsive, setresponsive] = useState(true);
  const [wname,setwname] = useState('')
  const [wlink,setwlink] = useState('')
  const [objectcrea, setobjectcrea] = useState([])
  const [isedit,setisedit] = useState(false)

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
  const configdata = {
    page_size: 10,
    length_menu: [10, 20, 50],
    filename: "Users",
    no_data_text: 'No user found!',

    language: {
      length_menu: "Show MENU result per page",
      filter: "Filter in records...",
      info: "Showing START to END of TOTAL records",
      pagination: {
        first: "First",
        previous: "Previous",
        next: "Next",
        last: "Last"
      }
    },
    show_length_menu: true,
    show_filter: true,
    show_pagination: true,
    show_info: true,
    defaultSortAsc: true,
  };

  const columns = [
    {
      key: "details",
      text: "Social Account",
      className: "Name",
      align: "left",
      sortable: false,
      cell: record => {
        return (
          <Fragment>
            <p>{Object.keys(record)}</p>
          </Fragment>
        );
      }
    },
    {
      key: "nfttag",
      text: "Social Link",
      className: "Name",
      align: "left",
      sortable: false,
      cell: record => {
        return (
          <Fragment>
            <p>{Object.values(record)}</p>
          </Fragment>
        );
      }
    },
    {
      key: "action",
      text: "Action",
      className: "action",
      width: 200,
      align: "left",
      sortable: false,
      cell: record => {
        return (
          <Fragment>
            <button
              data-toggle="modal"
              data-target="#update-template-modal"
              className="btn btn-primary btn-sm"
              onClick={() => editrec(record)}
              style={{ marginRight: '5px' }}>
              <i className="fa fa-edit"></i>
            </button>
            <button
              data-toggle="modal"
              data-target="#update-template-modal"
              className="btn btn-danger btn-sm"
              onClick={() => deleterec(record)}
              style={{ marginRight: '5px' }}>
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        );
      }
    },
  ];

  const deleterec = (r) => {
    const index = userdet.indexOf(r);
    if (index > -1) {
      userdet.splice(index, 1);
    }
    setobjectcrea(userdet)
  }

  const editrec = (r) => {
    setdummyarr(r)
    setmodalshow(true)
    setisedit(true)
    setwname(Object.keys(r))
    setwlink(Object.values(r))
  }

  const handleEditSubmit = () =>{
    console.log("jcbnedfjfeiofnrl",userdet)
    var index = userdet.indexOf(dummyarr)
    var temp = ({ [wname]: wlink })
    if (index !== -1) {
      userdet.splice(index, 1,temp);
  }
    setobjectcrea(userdet)
    console.log("jcbnedfjfeiofnrl",userdet,index,temp)
  }



  // function
  const onChange = (e) => {
    const { id, value } = e.target
    if (id == "WebsiteName") {
      tempname = value
      setwname(value)
    }
    if (id == "WebsiteLink") {
      templink = value
      setwlink(value)
    }
  }


  const handleFormSubmit = async (e) => {
    var temp2 = []
    var temp3 = []
    if(!isEmpty(userdet)){
      temp2 = userdet
    }
      temp3[0] = ({ [tempname]: templink })
      temp2.push(temp3[0])
      setobjectcrea(temp2)
      console.log("dnuibfuiebfuiebuii",tempname,templink,temp2);
  }

  useEffect(() =>{
    if(!isEmpty(objectcrea))
    {
    aftersubmit()
    }
  },[objectcrea])

  
  const aftersubmit = async() => {
    let reqData = {
      objectcrea
    }
    console.log("dnuibfuiebfuiebuii1",reqData);
    let { error, result } = await updateSettings(reqData);
    console.log("dnuibfuiebfuiebuiier2",result,error);
    if (isEmpty(error)) {
      setisedit(false)
      templink = ''
      tempname = ''
      setwname('')
      setwname('')
      console.log("dnuibfuiebfuiebuiier3",result,error);
      toast.success('User settings Updated', toasterOption);
      setmodalshow(false)
      setTimeout(() => {
        window.location.reload()
      }, 1000);
      
    } else {
      setValidateError(error);
    }
  }

  const getUserData = async () => {
    var test = await getsettdata();
    if (test && test.userValue && test && test.userValue.social.length != 0) {
      setUser(test.userValue.social)
    }
  }

  useEffect(() => {
    getUserData();
  }, [])


  return (
    <div>
      <Button color="primary" onClick={() => { setmodalshow(true) }}>Add</Button>
      <Paper className={classes.paper}>
        <ReactDatatable
          responsive={responsive}
          config={configdata}
          records={userdet}
          columns={columns}
        />
      </Paper>
      <Modal
        isOpen={modalshow}
        style={customStyles1}
        contentLabel="Example Modal"
      >
        <button onClick={()=>{setmodalshow(false)}}>close</button>
        <div>Social Account</div>
        <GridContainer>
                  <GridItem>
                    <CustomInput
                      labelText="Social Platform"
                      onChange={(e) => onChange(e)}
                      id="WebsiteName"
                      value={isedit&&wname||tempname}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem>
                    <CustomInput
                      labelText="Social Platform Link"
                      onChange={(e) => onChange(e)}
                      value={isedit&&wlink||templink}
                      id="WebsiteLink"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    </GridItem>
                </GridContainer>
                {isedit?
                <Button color="primary" onClick={(e) => {handleEditSubmit(e)}}>Edit</Button>
                :
                <Button color="primary" onClick={(e) => {handleFormSubmit(e)}}>Add</Button>
                  }
      </Modal>
    </div>
  );
}
