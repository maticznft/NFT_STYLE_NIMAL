import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, TextField } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import HeaderLinks from "components/Header/HeaderLinks.js";
import HeaderLinksCommunity from "components/Header/HeaderLinksCommunity.js";

import Footer from "components/Footer/Footer.js";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function Discussion(props) {
  const classes = useStyles();
  const { ...rest } = props;

  return (
    <div className="home_header">
      <Header
        fixed
        color="transparent"
        routes={dashboardRoutes}
        brand={<Link to="/home"><img src={require("../assets/images/logo.png")} alt="logo" className="img-fluid"/></Link>}
        leftLinks={<HeaderLinksCommunity />}
        changeColorOnScroll={{
          height: 50,
          color: "dark"
        }}
        {...rest}
      />
      <ScrollToTopOnMount/>
      <div className={classes.pageHeader + " inner_pageheader"}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <div className="d-flex align-items-center mt-3 justify-content-between">               
                <h2 className="inner_title">Discussion</h2>
                <Button className="btn connect_btn" tabindex="0" type="button" data-toggle="modal" data-target="#topic_modal">
                 New Topic
                </Button>
              </div>
            </GridItem>
          </GridContainer>
        </div>
        <div className="container">
<GridContainer>
<GridItem xs={12} sm={12} md={12}>    
<Scrollbars style={{ height: 120 }}>                                   
<nav className="masonry_tab_nav items_tab_outer">
<div className="nav nav-tabs masonry_tab primary_tab items_tab activity_tab_with" id="nav-tab" role="tablist">
<a className="nav-link active" id="categories-tab" data-toggle="tab" href="#categories" role="tab" aria-controls="categories" aria-selected="true">
<div className="tab_head">Categories</div>
  </a>                 

  <a className="nav-link" id="latest-tab" data-toggle="tab" href="#latest" role="tab" aria-controls="latest" aria-selected="false">
  <div className="tab_head">Latest</div>
  </a>
  <a className="nav-link" id="top-tab" data-toggle="tab" href="#top" role="tab" aria-controls="top" aria-selected="false">
  <div className="tab_head">Top</div>
  </a>
</div>
</nav>
</Scrollbars>
<div className="tab-content explore_tab_content mt-0" id="nav-tabContent">
<div className="tab-pane fade show active" id="categories" role="tabpanel" aria-labelledby="all-tab">
 <div className="proposal_panel_overall">                 
 <div className="row">
   <div className="col-12 col-md-6">
     <div className="title_div">
       <div className="row">
         <div className="col-9">
            <p className="title_discussion mb-0">Category</p>
         </div>
         <div className="col-3">
         <p className="title_discussion mb-0 text-right">Topics</p>           
         </div>
       </div>
     </div>
     <div className="content_div">
     <ul class="list-group list_grp_style_1 p-0">
    <li class="list-group-item">
    <div className="row">
         <div className="col-9">
         <Link to="/category"><p className="cat_title">General Community</p></Link>
            <p className="cat_desc mb-0">General community discussion topics and posts</p>

         </div>
         <div className="col-3 px-0">
         <p className="cat_dur mb-0 text-right">
           <span>96 /</span>
           <span className="pl-1">week</span>

           </p>         
         </div>
       </div>
    </li>
    <li class="list-group-item">
    <div className="row">
         <div className="col-9">
         <Link to="/category"><p className="cat_title">Technical upgrades</p></Link>
            <p className="cat_desc mb-0">Technical improvements, support of new formats, bug fixes, and other tech-related questions</p>

         </div>
         <div className="col-3 px-0">
         <p className="cat_dur mb-0 text-right">
           <span>6 /</span>
           <span className="pl-1">week</span>

           </p>         
         </div>
       </div>
    </li>
    <li class="list-group-item">
    <div className="row">
         <div className="col-9">
         <Link to="/category"><p className="cat_title">Platform development / new features</p></Link>
            <p className="cat_desc mb-0">Feature requests, additions, new tabs & functions, and other questions on platform development.</p>

         </div>
         <div className="col-3 px-0">
         <p className="cat_dur mb-0 text-right">
           <span>2 /</span>
           <span className="pl-1">week</span>

           </p>         
         </div>
       </div>
    </li>
    <li class="list-group-item">
    <div className="row">
         <div className="col-9">
         <Link to="/category"><p className="cat_title">General Community</p></Link>
            <p className="cat_desc mb-0">General community discussion topics and posts</p>

         </div>
         <div className="col-3 px-0">
         <p className="cat_dur mb-0 text-right">
           <span>96 /</span>
           <span className="pl-1">week</span>

           </p>         
         </div>
       </div>
    </li>
 
    </ul>
     </div>
   </div>

   <div className="col-12 col-md-6">
     <div className="title_div">
       <div className="row">
         <div className="col-9">
            <p className="title_discussion mb-0">Latest</p>
         </div>
         <div className="col-3">
         <p className="title_discussion mb-0 text-right"></p>           
         </div>
       </div>
     </div>
     <div className="content_div">
     <ul class="list-group list_grp_style_1 p-0">
    <li class="list-group-item">
    <div className="row">
         <div className="col-9">
         <Link to="/disussion-detail"><p className="cat_title">GIVEAWAY TIME-420 by 4/20</p></Link>
         <Link to="/category"><p className="cat_link cat_link_green mb-0">General Community</p></Link>

         </div>
         <div className="col-3 px-0">
         <p className="cat_dur mb-0 text-right">
           <span>10 /</span>
           <span className="pl-1">32m</span>

           </p>         
         </div>
       </div>
    </li>
    <li class="list-group-item">
    <div className="row">
         <div className="col-9">
         <Link to="/disussion-detail"><p className="cat_title">Is Metamask still be able to connect with Rarible?</p></Link>
         <Link to="/category"><p className="cat_link cat_link_blue mb-0">Technical upgrades</p></Link>

         </div>
         <div className="col-3 px-0">
         <p className="cat_dur mb-0 text-right">
           <span>24 /</span>
           <span className="pl-1">3hr</span>

           </p>         
         </div>
       </div>
    </li>
    <li class="list-group-item">
    <div className="row">
         <div className="col-9">
         <Link to="/disussion-detail"><p className="cat_title">GIVEAWAY TIME-420 by 4/20</p></Link>
         <Link to="/category"><p className="cat_link cat_link_green mb-0">General Community</p></Link>

         </div>
         <div className="col-3 px-0">
         <p className="cat_dur mb-0 text-right">
           <span>10 /</span>
           <span className="pl-1">32m</span>

           </p>         
         </div>
       </div>
    </li>
    <li class="list-group-item">
    <div className="row">
         <div className="col-9">
         <Link to="/disussion-detail"><p className="cat_title">Is Metamask still be able to connect with Rarible?</p></Link>
         <Link to="/category"><p className="cat_link cat_link_blue mb-0">Technical upgrades</p></Link>

         </div>
         <div className="col-3 px-0">
         <p className="cat_dur mb-0 text-right">
           <span>24 /</span>
           <span className="pl-1">3hr</span>

           </p>         
         </div>
       </div>
    </li>
    
 
    </ul>
     </div>
   </div>
 </div>
</div>
</div>                

<div className="tab-pane fade" id="latest" role="tabpanel" aria-labelledby="following-tab">
<div className="proposal_panel_overall">                 
                 
<div className="table-responsive">
<table class="table table_style_1">
<thead>
    <tr>
        <th> 
          <div class="form-group mb-0">
        <select class="form-control sel_period" id="exampleFormControlSelect1">
          <option>All categories</option>
          <option>General</option>
          <option>Games</option>         
        </select>
      </div> 
  </th>
  <th className="text-right"></th>
        <th className="text-right"> Replies </th>
        <th className="text-right"> Views </th>
        <th className="text-right"> Activity </th>

    </tr>
</thead> 
<tbody>
    <tr>
        <td>          
        <Link to="/disussion-detail"><p className="cat_title mb-0">Share your art and follow let the good energy flow</p></Link>
         <Link to="/category"><p className="cat_link cat_link_green mb-0">General Community</p></Link>       
         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_4.png")} alt="User" className="img-fluid" />

        </div>
        </td>
        <td className="text-right"> 133 </td>
        <td className="text-right"> 5.9k </td>
        <td className="text-right"> 13h </td>

    </tr> 
    <tr>
        <td>          
        <Link to="/disussion-detail"><p className="cat_title mb-0">I want to buy some NFT art</p></Link>
         <Link to="/category"><p className="cat_link cat_link_blue mb-0">Technical upgrades</p></Link>       
         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />     

        </div>
        </td>
        <td className="text-right"> 2133 </td>
        <td className="text-right"> 1.7k </td>
        <td className="text-right"> 30m </td>

    </tr> 
    <tr>
        <td>          
        <Link to="/disussion-detail"><p className="cat_title mb-0">Drop Your NFT - I Will List It For Free</p></Link>
        <Link to="/category"><p className="cat_link cat_link_green mb-0">General Community</p></Link>       

         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />     
        <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />   
        </div>
        </td>
        <td className="text-right"> 89 </td>
        <td className="text-right"> 1.2k </td>
        <td className="text-right"> 20h </td>

    </tr> 

    <tr>
        <td>          
        <Link to="/disussion-detail"><p className="cat_title mb-0">Sorting through bad art</p></Link>
        <Link to="/category"><p className="cat_link cat_link_blue mb-0">Technical upgrades</p></Link>       

         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />     
        <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />   
        <img src={require("../assets/images/follower_4.png")} alt="User" className="img-fluid" />   

        </div>
        </td>
        <td className="text-right"> 541 </td>
        <td className="text-right"> 719 </td>
        <td className="text-right"> 4h </td>

    </tr> 
</tbody>
</table>
</div>

</div>
</div>
<div className="tab-pane fade" id="top" role="tabpanel" aria-labelledby="activity-tab">
<div className="proposal_panel_overall">                 
<div className="table-responsive">
<table class="table table_style_1">
<thead>
    <tr>
        <th> 
          <div class="form-group mb-0">
        <select class="form-control sel_period" id="exampleFormControlSelect1">
          <option>Select Period</option>
          <option>Yearly</option>
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Today</option>
        </select>
      </div> 
  </th>
  <th className="text-right"></th>
        <th className="text-right"> Replies </th>
        <th className="text-right"> Views </th>
        <th className="text-right"> Activity </th>

    </tr>
</thead> 
<tbody>
    <tr>
        <td>          
        <Link to="/disussion-detail"><p className="cat_title mb-0">Share your art and follow let the good energy flow</p></Link>
         <Link to="/category"><p className="cat_link cat_link_green mb-0">General Community</p></Link>       
         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_4.png")} alt="User" className="img-fluid" />

        </div>
        </td>
        <td className="text-right"> 133 </td>
        <td className="text-right"> 5.9k </td>
        <td className="text-right"> 13h </td>

    </tr> 
    <tr>
        <td>          
        <Link to="/disussion-detail"><p className="cat_title mb-0">I want to buy some NFT art</p></Link>
         <Link to="/category"><p className="cat_link cat_link_blue mb-0">Technical upgrades</p></Link>       
         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />     

        </div>
        </td>
        <td className="text-right"> 2133 </td>
        <td className="text-right"> 1.7k </td>
        <td className="text-right"> 30m </td>

    </tr> 
    <tr>
        <td>          
        <Link to="/disussion-detail"><p className="cat_title mb-0">Drop Your NFT - I Will List It For Free</p></Link>
        <Link to="/category"><p className="cat_link cat_link_green mb-0">General Community</p></Link>       

         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />     
        <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />   
        </div>
        </td>
        <td className="text-right"> 89 </td>
        <td className="text-right"> 1.2k </td>
        <td className="text-right"> 20h </td>

    </tr> 

    <tr>
        <td>          
        <Link to="/disussion-detail"><p className="cat_title mb-0">Sorting through bad art</p></Link>
        <Link to="/category"><p className="cat_link cat_link_blue mb-0">Technical upgrades</p></Link>       

         </td>
        <td className="text-right"> 
        <div className="d-flex creators_details_td justify-content-end">
        <img src={require("../assets/images/follower_1.png")} alt="User" className="img-fluid" />
        <img src={require("../assets/images/follower_2.png")} alt="User" className="img-fluid" />     
        <img src={require("../assets/images/follower_3.png")} alt="User" className="img-fluid" />   
        <img src={require("../assets/images/follower_4.png")} alt="User" className="img-fluid" />   

        </div>
        </td>
        <td className="text-right"> 541 </td>
        <td className="text-right"> 719 </td>
        <td className="text-right"> 4h </td>

    </tr> 
</tbody>
</table>
</div>

</div>
</div>
</div>
</GridItem>
</GridContainer>
</div>
      </div>
      <Footer/>
      <div class="modal fade primary_modal" id="topic_modal" tabindex="-1" role="dialog" aria-labelledby="topic_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
   <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
     <div class="modal-content">
       <div class="modal-header text-center">
         <h5 class="modal-title" id="topic_modalLabel">Create New Topic</h5>
         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
           <span aria-hidden="true">&times;</span>
         </button>
       </div>
       <div class="modal-body">                         
       <form className="login_form">
       <label for="title">Title</label>
            <div class="mb-3">
          <input type="text" id="title" class="form-control" placeholder="Title"  />
         
        </div>
        <label for="category">Choose Category</label>
            <div class="mb-3">
            <div class="input-group mb-3 input_grp_style_1 single_option_grp">
                      <span class="input-group-text w-100" id="basic-addon2">

                      <select class="form-control pl-0" id="exampleFormControlSelect1">
                        <option>Select</option>
                        <option>Category1</option>
                        <option>Category2</option>
                      
                      </select>
                      </span>
                  </div>
          {/* <input type="text" id="password" class="form-control" placeholder="************"  /> */}
         
        </div>
        <label for="message">Message</label>
            <div class="mb-3">
          <textarea id="message" rows="3" class="form-control" placeholder="Message here.."  />
         
        </div>
        <div className="text-center mt-3">
       <Button className="create_btn btn-block">Create Topic</Button>                
       </div>
     
        </form>
       </div>
     </div>
   </div>
  </div>

    </div>
  );
}
