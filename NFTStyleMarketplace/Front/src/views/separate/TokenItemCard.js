import React, {useEffect,useState} from "react";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import config from '../../lib/config';
import isEmpty from '../../lib/isEmpty';
import LazyLoad from 'react-lazyload';
import LazyLoader from '../lazyloader'

export default function TokenItemCard(props) {
    const { item } =  props;
    return (
        <div className="col-12 col-md-6 col-lg-4 col-xl-3  mb-4">
            <div className="card card_bl_grey rad_2 border-0 m-0">
                <div className="card-body p-0">
                
                <div className="img_searc_banner">
                    <div className="img_col_search">
                        <img src={require("../assets/images/collection_02.png")} class="img-fluid img_radius_12" alt="Shape"/>
                    </div>
                    <div className="img_sesrc_pro">
                        <img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid" />
                    </div>
                </div>
                <div className="mt-5 mb-4 px-2 text-center">

                    <div className="text-center">
                    <div>
                        <p className="mt-0 banner_desc_user font_16">{item.name}</p>
                        <p className="mt-0 lates_tetx font_14">{item.bio}</p>
                    </div>
                    <div>
                        
                    </div>
                    </div>
                </div>
                
                </div>
            </div>
        </div>
    )
}
