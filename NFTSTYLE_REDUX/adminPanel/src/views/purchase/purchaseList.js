import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import customInputStyle from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { getpurchasetokenlist, setPromotions,getpromotion,deleteToken, getuserdaily, getusermonthly, getusercustom, getcsvdata,getburntokenlist } from '../../actions/users';
import { toast } from 'react-toastify'
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
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

export default function PURCHASELIST() {
  const customStyles = customStyle();
  const classes = useStyles();
  const classesSearch = useToolbarStyles();
  const [userdet, setUser] = useState([]);
  console.log("userder",userdet)
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
  
      key: "tokenCounts",
      text: "Token Count",
      className: "tokenId",
      align: "left",
      sortable: false
  
    },
    {
      key: "tokenNme_tokenName",
      text: "Token Name",
      className: "Name",
      align: "left",
      sortable: false,
      cell:val=>
      <>{(val.tokenNme_tokenName)}</>
    },
   {
      key: "from",
      text: "Old Token Owner",
      className: "tokenOwner",
      align: "left",
      sortable: false,
      cell:val=>
      (val.from)
    },
    {
      key: "to",
      text: "New Token Owner",
      className: "tokenOwner",
      align: "left",
      sortable: false,
      cell:val=>
      <div>{(val.to)}</div>
    },
  
    {
      key: "tokenowners_current_balance",
      text: "Token Available Quantity(balance)",
      className: "balance",
      align: "left",
      sortable: false,
      cell:val=>
      <div>{(val.tokenowners_current_balance)}</div>
  
  
    },

    {
  
      key: "amount",
      text: "Sold Token Price",
      className: "tokenPrice",
      align: "left",
      sortable: false,
      cell:val=>
      <div><>{(val.amount)!=undefined?String(val.amount):'Sold Price currently not available'}</> <>{val.amount>0?String(val.currencySymbol):''}</></div>
  
  
    },
        {
  
      key: "tokenowners_current_tokenPrice",
      text: "Current Token Price",
      className: "tokenPrice",
      align: "left",
      sortable: false,
      cell:val=>
      <div><>{String(val.tokenowners_current_tokenPrice)}</> <>{val.tokenowners_current_tokenPrice>0?String(val.tokenowners_current_CoinName):''}</></div>
  
  
    },

   
   
    {
  
      key: "action",
      text: "Token Status",
      className: "status",
      align: "left",
      sortable: false,
      cell:val=>
      <div>{String(val.action)}</div>
  
    },
  
    {
      key: "created",
      text: "Date of Sale",
      className: "Date",
      align: "left",
      sortable: false,
      cell: record =>
        // //console.lo(record.date,"date")
        <div><p>{moment(record.created).format('MMMM,Do YYYY, hh:mm A')}</p></div>
    },
  
  ];

  
  useEffect(() => {
    getTokenlist();
  }, [])


 
  const getTokenlist = async () => {
    var test = await getpurchasetokenlist();
    setUser(test.userValue);
  }
 

  return (
    <div className={classes.root}>
      <div className="page_header">
        <h2>Sales Report List</h2>
        <div>
         </div>
      </div>

      <Paper className={classes.paper}>
        
        <ReactDatatable
          className="table table-striped table-bordered table-responsive"
   
         config={configdata}
          records={userdet}
          columns={columns}
          onPageChange={pageChange()}
        />
      </Paper>

    </div>
  );
}
