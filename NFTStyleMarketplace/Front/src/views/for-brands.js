import React, { useEffect ,useState} from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import styled from "../../node_modules/styled-components";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link } from "react-router-dom";
import {faqlists} from '../actions/v1/report'
import ReactHTMLParser from 'react-html-parser'
const Icon = styled(props => (
  <div {...props}>
    <div className="minus">-</div>
    <div className="plus">+</div>
  </div>
))`
  & > .plus {
    display: block;
    color: #ed6b4d;
    font-size: 24px;
  }
  & > .minus {
    display: none;
    color: #ed6b4d;
    font-size: 24px;
  }
  .Mui-expanded & > .minus {
    display: flex;
  }
  .Mui-expanded & > .plus {
    display: none;
  }
`;

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function ForBrands(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const [expanded, setExpanded] = React.useState('panel100');
const [faqlist,setfalist]=useState([])
  const handleChangeFaq = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  useEffect(()=>{
    faqlistfunc()
  },[])
  const faqlistfunc=async()=>{
    var fql = await faqlists()
    //console.log("ksaldjjsadkls",fql)
    if(fql && fql.data && fql.data.soci){
      setfalist(fql.data.soci)
    }
  }
  return (
    <div className="home_header">
      <div className="inner_page_bg">
       <Header
        color="transparent"
        routes={dashboardRoutes}
            brand={<Link to="/"><img src={require("../assets/images/logo.png")} alt="logo" className="img-fluid" /></Link>}
    leftLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 20,
          color: "white"
        }}
        {...rest}
      />
      <ScrollToTopOnMount/>
      <div className={classes.pageHeader + " inner_pageheader"}>  
      <div className="row mx-0">
        <div className="col-12 mx-auto">
        <div className="container mt-3">
        <h2 className="inner_title mb-4">How it Works</h2>
        <div className="pb-5">
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <div className="faq_panel">
                {faqlist.map((item,ind)=>{
                    if(ind%2 == 0){
                  return(
                  
                <Accordion expanded={expanded === 'panel'+(ind+1)} onChange={handleChangeFaq('panel'+(ind+1))} className="mt-5">
                  <AccordionSummary expandIcon={<Icon />} aria-controls="panel1bh-content" id="panel1bh-header">
                    <div className="accordian_head"><h2>{item.question}</h2></div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="accordian_para">
                      <p>{ReactHTMLParser(item.answer)}</p>
                    </div>
                  </AccordionDetails>
                </Accordion>

)}
})}
                     </div>
            </GridItem>
            <GridItem xs={12} sm={6} md={6}>
           
            <div className="faq_panel">
                {faqlist.map((item,ind)=>{
                    if(ind%2 != 0){
                      // alert(ind%2)
                  return(
                  
                <Accordion expanded={expanded === 'panel'+(ind+1)} onChange={handleChangeFaq('panel'+(ind+1))} className="mt-5">
                  <AccordionSummary expandIcon={<Icon />} aria-controls="panel1bh-content" id="panel1bh-header">
                    <div className="accordian_head"><h2>{item.question}</h2></div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="accordian_para">
                      <p>{ReactHTMLParser(item.answer)}</p>
                    </div>
                  </AccordionDetails>
                </Accordion>

)}
})}
                     </div>
            </GridItem>
            
          </GridContainer>
      
       </div>
        </div>
      
        </div>
        </div>   
       
      </div>
      </div>
      <Footer/>
    </div>
  );
}
