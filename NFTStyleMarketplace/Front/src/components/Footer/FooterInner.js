/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// material-ui core components
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import styles from "assets/jss/material-kit-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function FooterInner(props) {
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses + " footer_inner"}>
      <div className={classes.container}>
        <div className="footer_left">
          <div>
            <h4 className="text-center text-white">Marketplace</h4>
            <List className={classes.list + " footer_links"}>
              <ListItem className={classes.inlineBlock}>
                <a href="#" className={classes.block}>Arts</a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a href="#" className={classes.block}>Photo</a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a href="#" className={classes.block}>Audio</a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a href="#" className={classes.block}>Video</a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a href="#" className={classes.block}>Meme</a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a href="#" className={classes.block}>Digital Asset</a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a href="#" className={classes.block}>Domains</a>
              </ListItem>
            </List>
          </div>  
  
          <div className="mt-4">
            <h4 className="text-center text-white">Account</h4>
            <List className={classes.list + " footer_links"}>
              <ListItem className={classes.inlineBlock}>
                <a href="#" className={classes.block}>Connect</a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a href="#" className={classes.block}>Profile</a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a href="#" className={classes.block}>Balance</a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
              <Link to="/privacy-policy" className={classes.block}>Policy</Link>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
              <Link to="/terms-of-service" className={classes.block}>Terms & Conditions</Link>
              </ListItem>
            </List>
          </div>
          
        </div>
        <hr/>
        <div className="footer_right">
          <div className="text-center">
            <ul className="social_links">
              <li><a href="#" target="_blank"><i className="fab fa-telegram-plane"></i></a></li>
              <li><a href="#" target="_blank"><i className="fab fa-twitter"></i></a></li>
                <li><a href="#" target="_blank"><i className="fab fa-facebook-f"></i></a></li>
            </ul>
            <p className="copyright_txt">All Rights Reserved @2021</p>  
          </div> 
        </div>
      </div>
    </footer>
  );
}

FooterInner.propTypes = {
  whiteFont: PropTypes.bool
};
