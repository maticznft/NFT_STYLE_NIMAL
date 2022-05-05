import React, {useEffect,useState} from "react";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import config from '../../lib/config';
import isEmpty from '../../lib/isEmpty';

export default function TokenUserCard(props) {
    const { item } =  props;
    return (
        <div className="card activty_card my-3">
			<div className="card-body px-3">
				<div className="media follow_media activity_media_full">
				<div className="img_tick_div">
					<div className="img_prgo_re_1 mr-3">
					<img src={`${config.Back_URL}/images/${item._id}/${item.image}`} alt="User" className="img-fluid img_user_new" />
					</div>

				</div>
				<div className="media-body flex_body">
				<div>
				<p className="mt-0 media_text mb-2">{item.name}</p>
				<p className="mt-0 media_num mt-0">308 followers</p>

				</div>

				</div>
				</div>
			</div>
			</div>
    )
}
