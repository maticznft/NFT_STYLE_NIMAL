/*eslint-disable*/
import React from "react";
import { Notifications, AccountBalanceWallet } from '@material-ui/icons';
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import { Button } from "@material-ui/core";

// import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);


export default function HeaderLinksCommunity(props) {
  const classes = useStyles();
  return (
    <List className={classes.list + " main_navbar commun_navbar"}>
      <ListItem className={classes.listItem}>
      <div className="search_inp_group search_input_community">
        <input type="text" className="search_inp" placeholder="Search Collections/Creators" />
       
      </div>
      </ListItem>
     
      <ListItem className={classes.listItem + " ml-auto"}>
        <Button className={classes.navLink + " create_btn btn_header mr-cus-btn"} data-toggle="modal" data-target="#login_modal">
         <span> Login</span>
        </Button>
      </ListItem>

      <ListItem className={classes.listItem}>
        <Button className={classes.navLink + " create_btn btn_header"} data-toggle="modal" data-target="#register_modal">
        <span>Signup</span>
        </Button>
      </ListItem>

      


  
 
    </List>

    
  );
}
