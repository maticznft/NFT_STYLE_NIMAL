import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import customInputStyle from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import FormControl from "@material-ui/core/FormControl";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import EditIcon from '@material-ui/icons/Edit';
import { Button } from '@material-ui/core';
import DatePicker from "react-datepicker";
import { getpromotiontokenlist,ApproveToken, getApprovelist,setPromotions,getpromotion,deleteToken, getuserdaily, getusermonthly, getusercustom, getcsvdata } from '../../actions/users';
import { toast } from 'react-toastify'
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from "@material-ui/core/Input";
import { CSVLink, CSVDownload } from "react-csv";
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
import isEmpty from 'lib/isEmpty';
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}
toast.configure();
let toasterOption = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}
var Selected123="false"


const configdata = {
  page_size: 10,
  length_menu: [10, 20, 50],
  filename: "Users",
  no_data_text: 'No user found!',

  language: {
    length_menu: "Show _MENU_ result per page",
    filter: "Filter in records...",
    info: "Showing _START_ to _END_ of _TOTAL_ records",
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


function pageChange(pageData) {
  //console.lo("OnPageChange", pageData);
}




const rows = [
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Donut', 452, 25.0, 51, 4.9),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Honeycomb', 408, 3.2, 87, 6.5),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Jelly Bean', 375, 0.0, 94, 0.0),
  createData('KitKat', 518, 26.0, 65, 7.0),
  createData('Lollipop', 392, 0.2, 98, 0.0),
  createData('Marshmallow', 318, 0, 81, 2.0),
  createData('Nougat', 360, 19.0, 9, 37.0),
  createData('Oreo', 437, 18.0, 63, 4.0),
];



const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  // { id: 'Mobile', numeric: true, disablePadding: false, label: 'Mobile' },
  { id: 'userid', numeric: true, disablePadding: false, label: 'Id' },
  { id: 'userBalance', numeric: true, disablePadding: false, label: 'Balance' },
  { id: 'plan', numeric: true, disablePadding: false, label: 'Level' },
  { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
  { id: 'Action', numeric: true, disablePadding: false, label: 'Action' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            //padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {

  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const customStyle = makeStyles(customInputStyle);

export default function PROMOTIONLIST() {
  const customStyles = customStyle();
  const classes = useStyles();
  const classesSearch = useToolbarStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [choose, setchoose] = useState();
  const [typingTimeout, setTypingTimeout] = useState(0)
  const [searchQuery, setSearchQuery] = React.useState("");
  const [hidden, sethidden] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [csvData, setcsvData] = useState([]);
  const [responsive, setresponsive] = useState(true);
  const [userdet, setUser] = useState();
  const [Selected12, setSelected1] = useState(0);
  const columns = [
    {
      key: "ind",
      text: "SNO",
      className: "name",
      align: "left",
      sortable: true,
      cell:(row, index, column, id)=>
      <p>{index+1}</p>
  
    },
    {
      key: "name",
      text: "Name",
      className: "name",
      align: "left",
      sortable: false,
      cell:record=>
      <p>{record.UsersDb&&record.UsersDb.name&&record.UsersDb.name!=""?record.UsersDb.name:record.UsersDb.curraddress}</p>
  
    },
    {
      key: "checkApprove",
      text: "User Id",
      className: "name",
      align: "left",
      sortable: false,
      cell:record=>
      <p>{record.checkApprove}</p>
  
    },
    {
      key: "description",
      text: "Token Description",
      className: "name",
      align: "left",
      sortable: false,
      cell:record=>
      <p>{record.description}</p>
  
    },
    {
      key: "Approved",
      text: "Approve Status",
      className: "name",
      align: "left",
      sortable: false,
      cell:record=>
      <p>{record.UsersDb&&record.UsersDb.Approved&&record.UsersDb.Approved}</p>
  
  
    },
   
    {
      key: "CreatedAt",
      text: "Created At",
      className: "Date",
      align: "left",
      sortable: false,
      cell: record =>
        // //console.lo(record.date,"date")
        <div><p>{moment(record.timestamp).format('MMMM,Do YYYY, hh:mm A')}</p></div>
    },
  
    {
      key: "action",
      text: "Approve Action",
      className: "action",
      width: 200,
      align: "left",
      sortable: false,
      cell: record => {
        //console.log"rec",record)
         return (
          <Fragment>
                <Button className="secondary-btn" onClick={()=>promote(record)}>
                 Approve Token
                </Button>
           </Fragment>
        );
      }
    },
  ];

  
  const removepromote =async(data)=>{
      
    var reqdata={
      tokenCounts:data.tokenCounts,
      swapPrice:1
  }
    // setSelected1(data)
    var setPromotion = await setPromotions(reqdata)
    //console.log"check wala",setPromotion.userValue)
    if(setPromotion&&setPromotion.userValue){
      window.location.reload();
      // setSelected1(setPromotion.userValue.tokenCounts)
    
   }
  }
  const promote =async(data)=>{
    //console.log"Selected12",data)
    var neddata={
      curraddress:data.curraddress,
      checkApprove:data.checkApprove
    }
    var getVal=await ApproveToken(neddata)
    if(getVal){
      window.location.reload();
    }
}
  const onValueChange=async(data)=>{
    var reqdata={
      tokenCounts:data
  }
    setSelected1(data)
    var setPromotion = await setPromotions(reqdata)
    //console.log"check wala",setPromotion.userValue)
    if(setPromotion&&setPromotion.userValue){
      setSelected1(setPromotion.userValue.tokenCounts)
    }
  
  }
  
  useEffect(() => {
    getTokenlist();
  }, [])


 
  const getTokenlist = async () => {
    var test = await getApprovelist();
    //console.log"getpairlist", test)
    if(test){
    setUser(test.userValue);}
    // getpromote();

  }
  async function getpromote(){
    var test = await getpromotion();
    //console.log"getpairlist getpromotion", test)
    if(test&&test.userValue&&test.userValue.length>0){
    // setSelected1(test.userValue[0].tokenCounts);
    // Selected123="true"+test.userValue[0].tokenCounts
    // console.log("Sadasdsadas",Selected123)
    }
  
  }

  return (
    <div className={classes.root}>
      <div className="page_header">
        <h2>Approve List</h2>
        <div>
         </div>
      </div>

      <Paper className={classes.paper}>
        
        <ReactDatatable
          className="table table-striped table-bordered table-responsive"
   
          responsive={responsive}
          config={configdata}
          records={userdet}
          columns={columns}
          onPageChange={pageChange()}
        />
      </Paper>

    </div>
  );
}
