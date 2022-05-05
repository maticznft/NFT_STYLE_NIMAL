import e from 'express';
import fs from 'fs'
import path from 'path'
import mongoose, { now } from 'mongoose';
import { userInfo } from 'os';
import UserDb from '../../models/User'
import settings from '../admin/Model/settings'
import FAQS from './../admin/Model/faq';
import Activity from '../../models/activity'
import isEmpty from '../../config/isEmpty'
import FollowerDB from '../../models/follower';
import cmsnew from '../admin/Model/cmsnew'
import ApproveDb from '../../models/approve';
import TokenList from '../../models/tokenlist'
const async = require("async");
const ObjectId = mongoose.Types.ObjectId;
const Config = require(path.resolve('./config/config')).default;
const CategoryDb = require(path.resolve('./models/category'));
const TokenDb = require(path.resolve('./models/Token'));
const FollowDb = require(path.resolve('./models/follower'));
const BiddingDb = require(path.resolve('./models/bid'));
const MyItemAddrDb = require(path.resolve('./models/myItemAddr'));
const TokenOwnerDb = require(path.resolve('./models/TokenOwner'));
const LikeDb = require(path.resolve('./models/like'));
const TokenIdtableDb = require(path.resolve('./models/tokenIdtable'));
const reports = require(path.resolve('./models/reports'));

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath)
var compress_images = require('compress-images');
const sharp = require("sharp");
const gify = require("gify");
// ipfs
import ipfsClient, { CID } from 'ipfs-http-client';
////////console.log("SasASasaSasS", Config.ipfskey, Config.ipfspass)
// const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https', method:'POST',auth:'1wTkMQG2WBoQZCCrSiCSRo7FrbZ:315050ed68b62693df30cf1648664ed6' });
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https', method: 'POST', auth: `${Config.ipfskey}:${Config.ipfspass}` });

const MongooseHelper = require('../helpers/mongoose-helper');
const ActivityHelper = require('../helpers/activity-helper');

let AllowedUploadFormat = /\.(png|PNG|gif|WEBP|webp|mpeg|mp4|mp3|video|audio)$/;

export const BidCancel = async (req, res) => {
  var ReqBody = req.body;
  var RetData = {}
  var FindData = {
    tokenBidAddress: ReqBody.tokenBidAddress,
    tokenCounts: ReqBody.tokenCounts
  };

  FindData['$and'] = [
    { status: { $ne: 'cancelled' } },
    { status: { $ne: 'partiallyCancelled' } },
    { status: { $ne: 'completed' } }
  ];

  var AlreadyChk = await BiddingDb.findOne(FindData).exec();
  if (AlreadyChk) {
    var status = AlreadyChk.status;
    // if(status == 'cancelled' || status == 'partiallyCancelled' || status == 'completed') {
    //   RetData.type = 'error';
    //   RetData.toast = { type:'error', message: 'Bid already closed' }
    //   return res.status(200).json(RetData); 
    // }
    var FindData = { _id: AlreadyChk._id };
    var UpdateData = {};
    if (status == 'pending') {
      UpdateData.status = 'cancelled';
    }
    else if (status == 'partiallyCompleted') {
      UpdateData.status = 'partiallyCancelled';
    }
    BiddingDb.findOneAndUpdate(
      FindData,
      { $set: UpdateData },
      { new: true }
    )
      .exec(async function (err, data) {
        if (data) {
          RetData.type = 'success';
          RetData.toast = {
            type: 'success',
            message: 'Bid successfully cancelled'
          }
        }
        else {
          RetData.type = 'error';
          RetData.toast = {
            type: 'error',
            message: 'Bid not cancelled'
          }
        }
        var checkLa = await ActivityHelper.save({
          createData: {
            action: 'bid',
            activity: 'Bid Cancelled by',
            from: ReqBody.tokenBidAddress,
            to:ReqBody.tokenBidAddress,
            tokenCounts: ReqBody.tokenCounts,
          }
        });
        ////////console.log("=========================================================================================================================================================================", checkLa)


        return res.status(200).json(RetData);
      });
  }
  else {
    RetData.type = 'error';
    RetData.toast = {
      type: 'error',
      message: 'Active bid not found'
    }
    return res.status(200).json(RetData);
  }
}

export const BidAccept = async (req, res) => {
  var RetData = {};
  RetData.toast = {};
  var ReqBody = req.body;
  var UserAccountAddr_byaccepter = ReqBody.UserAccountAddr_byaccepter;
  var tokenBidAddress = ReqBody.tokenBidAddress;
  var FindData = {
    tokenBidAddress: ReqBody.tokenBidAddress,
    tokenCounts: ReqBody.tokenCounts,
    '$and': [
      { status: { '$ne': 'completed' } },
      { status: { '$ne': 'cancelled' } }
    ]
  };
  ////////console.log("");
  if (ReqBody.transactionHash && ReqBody.transactionHash != '') {
    var hashValue = ReqBody.transactionHash;
  }
  else {
    RetData.toast.type = 'error';
    RetData.toast.msg = 'Transaction not completed';
    return res.json(RetData);
  }

  var NoOfToken = ReqBody.NoOfToken;
  var AlreadyChk = await BiddingDb.find(FindData).exec();
  if (AlreadyChk && AlreadyChk.length > 0) {
    var Already = AlreadyChk[0];

    var UpdateData = {};
    if (Already.completed > 0) {
      UpdateData.completed = Already.completed + NoOfToken;
    }
    else {
      UpdateData.completed = NoOfToken;
    }

    UpdateData.pending = Already.pending - NoOfToken;

    if (UpdateData.pending == 0) {
      UpdateData.status = 'completed';
    }
    else if (UpdateData.pending > 0) {
      UpdateData.status = 'partiallyCompleted';
    }

    BiddingDb.findOneAndUpdate(
      FindData,
      { $set: UpdateData },
      { new: true }
    )
      .exec(async function (err, data) {
        if (data) {
          RetData.toast = { type: 'success', msg: 'Bid accept successfully' }
          TokenOwnerDb.findOne(
            {
              tokenOwner: UserAccountAddr_byaccepter,
              tokenCounts: ReqBody.tokenCounts,
            },
            {
              _id: 0,
              timestamp: 0,
              __v: 0
            }
          ).exec(async function (err, respOfPur) {


            var UpdateData = {};
            if (
              (respOfPur.type == 721)
              ||
              (respOfPur.type == 1155 && respOfPur.balance == NoOfToken)
            ) {
              UpdateData.balance = 0;
              UpdateData.status='afterbid';
            }
            else if (respOfPur.type == 1155 && respOfPur.balance > NoOfToken) {
              UpdateData.balance = respOfPur.balance - NoOfToken;
              // UpdateData.status='afterbid';
            }

            if (UpdateData.balance == 0) {
              UpdateData.tokenPrice = 0;
            }
          
            TokenOwnerDb.findOneAndUpdate(
              {
                tokenOwner: UserAccountAddr_byaccepter,
                tokenCounts: ReqBody.tokenCounts,
              },
              { $set: UpdateData },
              { new: true }
            )
              .exec(async function (err, UpdResp) {
                if (err) {
                  RetData.toast.type = 'error';
                  RetData.toast.msg = Config.errorOccured;
                  return res.json(RetData);
                }
                else if (UpdResp == null) {
                  RetData.toast.type = 'error';
                  RetData.toast.msg = 'Collectible bid accept failed';
                  return res.json(RetData);
                }
                else {
                  if (respOfPur.type == 721) {
                    var newBalance = 1;
                    NoOfToken = 1;
                    respOfPur.status="afterbid"
                  }
                  else {
                    var newBalance = NoOfToken;
                    respOfPur.status="afterbid"
                  }
                  await neworoldownerupdate(
                    respOfPur,
                    tokenBidAddress,
                    newBalance,
                    hashValue,
                    NoOfToken,
                    'afterbid'
                  );



                  var checkLa = await ActivityHelper.save({
                    createData: {
                      action: 'accept',
                      activity: 'Bid Accept by',
                      from: UserAccountAddr_byaccepter,
                      to: tokenBidAddress,
                      tokenCounts: ReqBody.tokenCounts,
                    }
                  });
                  ////////console.log("=========================================================================================================================================================================", checkLa)


                  return res.json(RetData);
                }
              });


          })
        }
        else {
          ////////console.log('err : ', err);
          RetData.toast = { type: 'error', msg: 'Bid not accepted' }
          res.json(RetData);
        }
      })
  }
  else {
    RetData.toast = { type: 'error', msg: 'Bid not found' }
    res.json(RetData);
  }
}

export const BidApply = async (req, res) => {
  console.log("______________________________________________________________________________________________________________________________", req.body)
  var ReqBody = req.body;
  var FindData = {
    tokenBidAddress: ReqBody.tokenBidAddress,
    tokenCounts: ReqBody.tokenCounts,
    // status : 'pending',
    '$or': [
      { status: 'pending' },
      { status: 'partiallyCompleted' }
    ]
  };
  var AlreadyChk = await BiddingDb.find(FindData).exec();
  if (AlreadyChk && AlreadyChk.length > 0) {
    var UpdateData = {
      tokenBidAmt: ReqBody.tokenBidAmt,
      tokenBidAddress: ReqBody.tokenBidAddress,
      tokenCounts: ReqBody.tokenCounts,
      NoOfToken: ReqBody.NoOfToken,
      pending: ReqBody.NoOfToken,
      coinname: ReqBody.coinname,
      timestamp:Date.now()
    }
    BiddingDb.findOneAndUpdate(
      FindData,
      { $set: UpdateData },
      { new: true }
    )
      .exec(async function (err, data) {
        if (data) {
          var checkLa = await ActivityHelper.save({
            createData: {
              action: 'editbid',
              activity: 'Bid edited by',
              from: ReqBody.tokenBidAddress,
              to:ReqBody.owner,
              tokenCounts: ReqBody.tokenCounts,
            }
          });
          //////console.log("=========================================================================================================================================================================", checkLa)

          res.json({ "type": "success", data: data });
        }
        else {
          res.json({ "type": "fail", e: e });
        }
      })
  }
  else {
    var NewBidAdd = new BiddingDb({
      tokenBidAmt: ReqBody.tokenBidAmt,
      tokenBidAddress: ReqBody.tokenBidAddress,
      tokenCounts: ReqBody.tokenCounts,
      NoOfToken: ReqBody.NoOfToken,
      pending: ReqBody.NoOfToken,
      coinname: ReqBody.coinname
    })
    NewBidAdd.save()
      .then(async (data) => {
        var checkLa = await ActivityHelper.save({
          createData: {
            action: 'bid',
            activity: 'Bid by',
            from: ReqBody.tokenBidAddress,
            to:ReqBody.owner,
            // to: tokenOwner,
            tokenCounts: ReqBody.tokenCounts,
          }
        });
        ////////console.log("=========================================================================================================================================================================", checkLa)

        res.json({ "type": "success", data: data });
      })
      .catch((e) => {
        res.status(200).json({ "type": "fail", e });
      })
  }
}





// export const TokenCounts = async (req, res) => {
// 	var RetData = {};
// 	RetData.toast = {};
// 	var ReqBody = req.body;
// 	var tokenCounts = ReqBody.tokenCounts ? parseInt(ReqBody.tokenCounts) : 0;
  
// 	var Detail = {
// 	  Resp: {}
// 	};
// 	var Tdata = await TokenOwnerDb.aggregate([
// 		{
// 			$match : { 
// 				tokenCounts : tokenCounts,
// 				balance : { $ne : 0 }
// 			}
// 		},
// 		{
// 				$lookup : {
// 						from : 'users',
// 						localField : 'tokenOwner',
// 						foreignField : 'curraddress',
// 						as : 'tusers'
// 				} 
// 		},
// 		{
// 				$unwind : {
// 						path : '$tusers',
// 						preserveNullAndEmptyArrays: true,
// 				}
// 		},
// 		{
// 			$sort : { timestamp : 1 }
// 		}
// 	]);

// 	async.waterfall([
// 	  function (done) {
// 		var Query = [
// 		  { $match: { tokenCounts: tokenCounts } },
// 		  {
// 			$lookup:
// 			{
// 			  from: "tokenowners",
// 			  localField: "tokenCounts",
// 			  foreignField: "tokenCounts",
// 			  as: "tokenowners_all"
// 			},
// 		  },
// 		  {
// 			$lookup:
// 			{
// 			  from: "tokenowners",
// 			  let: { tC: "$tokenCounts" },
// 			  pipeline: [
// 				{
// 				  $match:
// 				  {
// 					$expr:
// 					{
// 					  $and:
// 						[
// 						  { $eq: ["$tokenCounts", "$$tC"] },
// 						  { $gt: ["$balance", 0] }
// 						]
// 					}
// 				  }
// 				},
// 				{ $project: { _id: 0 } }
// 			  ],
// 			  as: "tokenowners_current"
// 			}
// 		  },
// 		  {
// 			$lookup:
// 			{
// 			  from: "tokenowners",
// 			  let: { tC: "$tokenCounts" },
// 			  pipeline: [
// 				{
// 				  $match:
// 				  {
// 					$expr:
// 					{
// 					  $and:
// 						[
// 						  { $eq: ["$tokenCounts", "$$tC"] },
// 						  { $eq: ["$status", 'true'] },
// 						  { $gt: ["$tokenPrice", 0] },
// 						  { $gt: ["$balance", 0] }
// 						]
// 					}
// 				  }
// 				},
// 				{ $project: { _id: 0 } }
// 			  ],
// 			  as: "OnSaleOwner"
// 			}
// 		  },
  
// 		  {
// 			$lookup: {
// 			  from: "users",
// 			  localField: "tokenCreator",
// 			  foreignField: "curraddress",
// 			  as: "tokencreatorinfo"
// 			},
// 		  },
// 		  {
// 			$lookup: {
// 			  from: "contracts",
// 			  localField: "contractAddress",
// 			  foreignField: "conAddr",
// 			  as: "usercontract"
// 			},
// 		  },
// 		  {
// 			$unwind: {
// 			  path: '$usercontract',
// 			  preserveNullAndEmptyArrays: true,
// 			}
// 		  },
// 		  {
// 			$lookup: {
// 			  from: "users",
// 			  localField: "tokenowners_all.tokenOwner",
// 			  foreignField: "curraddress",
// 			  as: "tokenuser"
// 			}
// 		  },
// 		  {
// 			$project: {
// 			  _id: 1,
// 			  tokenPrice: 1,
// 			  tokenCategory: 1,
// 			  tokenCharity: 1,
// 			  image: 1,
// 			  tokenCounts: 1,
// 			  tokenName: 1,
// 			  tokenDesc: 1,
// 			  tokenBid: 1,
// 			  tokenOwner: 1,
// 			  tokenCreator: 1,
// 			  tokenRoyality: 1,
// 			  status: 1,
// 			  hashValue: 1,
// 			  type: 1,
// 			  additionalImage: 1,
// 			  balance: 1,
// 			  tokenQuantity: 1,
// 			  contractAddress: 1,
// 			  minimumBid: 1,
// 			  endclocktime: 1,
// 			  clocktime: 1,
// 			  likecount: 1,
// 			  PutOnSale: 1,
// 			  PutOnSaleType: 1,
// 			  ipfsimage: 1,
// 			  unlockcontent: 1,
// 			  tokenowners_current: 1,
// 			  coinname: 1,
// 			  tokenowners_all: 1,
// 			  OnSaleOwner: 1,
// 			  tokenOwnerInfo: {
// 				_id: "$tokenuser._id",
// 				image: "$tokenuser.image",
// 				name: "$tokenuser.name",
// 				curraddress: "$tokenuser.curraddress",
// 				customurl: "$tokenuser.customurl"
// 			  },
// 			  tokenCreatorInfo: {
// 				_id: "$tokencreatorinfo._id",
// 				image: "$tokencreatorinfo.image",
// 				name: "$tokencreatorinfo.name",
// 				curraddress: "$tokencreatorinfo.curraddress",
// 				customurl: "$tokencreatorinfo.customurl"
// 			  },
// 			  usercontract: {
// 				imageUser: "$usercontract.imageUser",
// 				type: "$usercontract.type",
// 				name: "$usercontract.name",
// 				url: "$usercontract.url",
// 				conAddr: "$usercontract.conAddr"
// 			  },
// 			}
// 		  }
// 		];
// 		TokenDb.aggregate(Query).exec(async function (err, resp) {
// 		  if (err) {
// 			RetData.toast.type = 'error';
// 			RetData.toast.msg = Config.errorOccured;
// 			return res.json(RetData);
// 		  }
// 		  else {
// 			Detail.Resp.Token = resp;
// 			Detail.Resp.Tusers = Tdata;
// 			done();
// 		  }
// 		});
// 	  },
// 	  function (done) {
// 		// var findData = {
// 		//   tokenCounts:tokenCounts,
// 		//   status:'pending'
// 		// '$or':[
// 		//   {status:'pending'},
// 		//   {status:'partiallyCompleted'}
// 		// ]
// 		// }
// 		// BiddingDb
// 		// .find(findData)
// 		// .sort({tokenBidAmt:-1})
// 		var aggregateData = [
// 		  {
// 			$match: {
// 			  tokenCounts: tokenCounts,
// 			}
// 		  },
// 		  {
// 			$match: {
// 			  '$or': [
// 				{ status: 'pending' },
// 				{ status: 'partiallyCompleted' }
// 			  ]
// 			}
// 		  },
// 		  {
// 			$sort: { tokenBidAmt: -1 }
// 		  },
// 		  {
// 			$lookup: {
// 			  from: "users",
// 			  localField: "tokenBidAddress",
// 			  foreignField: "curraddress",
// 			  as: "bidUsers"
// 			}
// 		  },
// 		  {
// 			$unwind: {
// 			  path: '$bidUsers',
// 			  preserveNullAndEmptyArrays: true,
// 			}
// 		  },
// 		];
  
  
  
// 		// / BiddingDb
// 		// .find(findData)
// 		// .sort({tokenBidAmt:-1})
// 		BiddingDb.aggregate(aggregateData)
// 		  .exec(async function (err, resp) {
// 			if (err) {
// 			  //console.log('err : ', err);
// 			  RetData.toast.type = 'error';
// 			  RetData.toast.msg = Config.errorOccured;
// 			  return res.json(RetData);
// 			}
// 			else {
// 			  Detail.Resp.Bids = { pending: [], completed: [], highestBid: {}, myBid: {} };
// 			  Detail.Resp.Bids.pending = resp;
  
// 			  if (resp.length > 0) {
// 				Detail.Resp.Bids.highestBid = resp[0];
// 				//console.log("chcek1 highestBid : ", resp)
// 				//console.log(ReqBody.curAddr)
// 				if (resp && resp.length > 0) {
// 				  var IndexVal = resp.findIndex(val => val.tokenBidAddress == ReqBody.curAddr);
// 				  //console.log("chcek1 IndexVal : ", IndexVal)
// 				  if (IndexVal > -1) {
// 					//console.log("chcek1 myBid ", resp[IndexVal])
// 					Detail.Resp.Bids.myBid = resp[IndexVal];
// 				  }
// 				}
// 			  }
  
// 			  var findData = {
// 				tokenCounts: tokenCounts,
// 				'$or': [
// 				  { status: 'completed' },
// 				  { status: 'partiallyCancelled' },
// 				  { status: 'partiallyCompleted' }
// 				]
// 			  }
// 			  var resp = await BiddingDb.find(findData).exec();
// 			  Detail.Resp.Bids.completed = resp;
// 			  done();
// 			}
// 		  });
// 	  },
// 	  function (done) {
  
// 		var OnSaleBalance = 0;
// 		var TotalQuantity = 0;
  
// 		if (Detail.Resp.Token && Detail.Resp.Token[0]) {
// 		  if (Detail.Resp.Token[0].tokenowners_all) {
// 			TotalQuantity = Detail.Resp.Token[0].tokenQuantity;
// 			var tokenowners_all = Detail.Resp.Token[0].tokenowners_all
// 			for (let i = 0; i < tokenowners_all.length; i++) {
// 			  const element = tokenowners_all[i];
// 			  if (element.balance > 0 && element.tokenPrice > 0) {
// 				OnSaleBalance = OnSaleBalance + element.balance;
// 			  }
// 			}
// 		  }
// 		}
  
// 		Detail.Resp.OnSaleBalance = OnSaleBalance;
// 		Detail.Resp.TotalQuantity = TotalQuantity;
// 		done();
// 	  },
// 	  function (done) {
// 		RetData.Detail = Detail;
// 		//console.log("find all valuess", RetData)
// 		return res.json(RetData);
// 	  }
// 	], function (err, result) {
// 	  if (err) return false;
// 	});
//   }




export const TokenCounts = async (req, res) => {
	var RetData = {};
	RetData.toast = {};
	var ReqBody = req.body;
	var tokenCounts = ReqBody.tokenCounts ? parseInt(ReqBody.tokenCounts) : 0;
  
	var Detail = {
	  Resp: {}
	};
	var Tdata = await TokenOwnerDb.aggregate([
		{
			$match : { 
				tokenCounts : tokenCounts,
				balance : { $ne : 0 }
			}
		},
		{
				$lookup : {
						from : 'users',
						localField : 'tokenOwner',
						foreignField : 'curraddress',
						as : 'tusers'
				} 
		},
		{
				$unwind : {
						path : '$tusers',
						preserveNullAndEmptyArrays: true,
				}
		},
		{
			$sort : { timestamp : 1 }
		}
	]);

	async.waterfall([
	  function (done) {
		var Query = [
		  { $match: { tokenCounts: tokenCounts } },
		  {
			$lookup:
			{
			  from: "tokenowners",
			  localField: "tokenCounts",
			  foreignField: "tokenCounts",
			  as: "tokenowners_all"
			},
		  },
		  {
			$lookup:
			{
			  from: "tokenowners",
			  let: { tC: "$tokenCounts" },
			  pipeline: [
				{
				  $match:
				  {
					$expr:
					{
					  $and:
						[
						  { $eq: ["$tokenCounts", "$$tC"] },
						  { $gt: ["$balance", 0] }
						]
					}
				  }
				},
				{ $project: { _id: 0 } }
			  ],
			  as: "tokenowners_current"
			}
		  },
		  {
			$lookup:
			{
			  from: "tokenowners",
			  let: { tC: "$tokenCounts" },
			  pipeline: [
				{
				  $match:
				  {
					$expr:
					{
					  $and:
						[
						  { $eq: ["$tokenCounts", "$$tC"] },
						  { $eq: ["$status", 'true'] },
						  { $gt: ["$tokenPrice", 0] },
						  { $gt: ["$balance", 0] }
						]
					}
				  }
				},
				{ $project: { _id: 0 } }
			  ],
			  as: "OnSaleOwner"
			}
		  },
  
		  {
			$lookup: {
			  from: "users",
			  localField: "tokenCreator",
			  foreignField: "curraddress",
			  as: "tokencreatorinfo"
			},
		  },
		  {
			$lookup: {
			  from: "contracts",
			  localField: "contractAddress",
			  foreignField: "conAddr",
			  as: "usercontract"
			},
		  },
		  {
			$unwind: {
			  path: '$usercontract',
			  preserveNullAndEmptyArrays: true,
			}
		  },
		  {
			$lookup: {
			  from: "users",
			  localField: "tokenowners_all.tokenOwner",
			  foreignField: "curraddress",
			  as: "tokenuser"
			}
		  },
		  {
			$project: {
			  _id: 1,
			  tokenPrice: 1,
			  tokenCategory: 1,
			  tokenCharity: 1,
			  image: 1,
			  tokenCounts: 1,
			  tokenName: 1,
			  tokenDesc: 1,
			  tokenBid: 1,
			  tokenOwner: 1,
			  tokenCreator: 1,
			  tokenRoyality: 1,
			  status: 1,
			  hashValue: 1,
			  type: 1,
			  additionalImage: 1,
			  balance: 1,
			  tokenQuantity: 1,
			  contractAddress: 1,
			  minimumBid: 1,
			  endclocktime: 1,
			  clocktime: 1,
			  likecount: 1,
			  PutOnSale: 1,
			  PutOnSaleType: 1,
			  ipfsimage: 1,
			  unlockcontent: 1,
			  tokenowners_current: 1,
			  CoinName: 1,
			  tokenowners_all: 1,
			  OnSaleOwner: 1,
			  tokenOwnerInfo: {
				_id: "$tokenuser._id",
				image: "$tokenuser.image",
				name: "$tokenuser.name",
				curraddress: "$tokenuser.curraddress",
				customurl: "$tokenuser.customurl"
			  },
			  tokenCreatorInfo: {
				_id: "$tokencreatorinfo._id",
				image: "$tokencreatorinfo.image",
				name: "$tokencreatorinfo.name",
				curraddress: "$tokencreatorinfo.curraddress",
				customurl: "$tokencreatorinfo.customurl"
			  },
			  usercontract: {
				imageUser: "$usercontract.imageUser",
				type: "$usercontract.type",
				name: "$usercontract.name",
				url: "$usercontract.url",
				conAddr: "$usercontract.conAddr"
			  },
			}
		  }
		];
		TokenDb.aggregate(Query).exec(async function (err, resp) {
		  if (err) {
			RetData.toast.type = 'error';
			RetData.toast.msg = Config.errorOccured;
			return res.json(RetData);
		  }
		  else {
			Detail.Resp.Token = resp;
			Detail.Resp.Tusers = Tdata;
			done();
		  }
		});
	  },
	  function (done) {
		// var findData = {
		//   tokenCounts:tokenCounts,
		//   status:'pending'
		// '$or':[
		//   {status:'pending'},
		//   {status:'partiallyCompleted'}
		// ]
		// }
		// BiddingDb
		// .find(findData)
		// .sort({tokenBidAmt:-1})
		var aggregateData = [
		  {
			$match: {
			  tokenCounts: tokenCounts,
			}
		  },
		  {
			$match: {
			  '$or': [
				{ status: 'pending' },
				{ status: 'partiallyCompleted' }
			  ]
			}
		  },
		  {
			$sort: { tokenBidAmt: -1 }
		  },
		  {
			$lookup: {
			  from: "users",
			  localField: "tokenBidAddress",
			  foreignField: "curraddress",
			  as: "bidUsers"
			}
		  },
		  {
			$unwind: {
			  path: '$bidUsers',
			  preserveNullAndEmptyArrays: true,
			}
		  },
		];
  
  
  
		// / BiddingDb
		// .find(findData)
		// .sort({tokenBidAmt:-1})
		BiddingDb.aggregate(aggregateData)
		  .exec(async function (err, resp) {
			if (err) {
			  //console.log('err : ', err);
			  RetData.toast.type = 'error';
			  RetData.toast.msg = Config.errorOccured;
			  return res.json(RetData);
			}
			else {
			  Detail.Resp.Bids = { pending: [], completed: [], highestBid: {}, myBid: {} };
			  Detail.Resp.Bids.pending = resp;
  
			  if (resp.length > 0) {
				Detail.Resp.Bids.highestBid = resp[0];
				//console.log("chcek1 highestBid : ", resp)
				//console.log(ReqBody.curAddr)
				if (resp && resp.length > 0) {
				  var IndexVal = resp.findIndex(val => val.tokenBidAddress == ReqBody.curAddr);
				  //console.log("chcek1 IndexVal : ", IndexVal)
				  if (IndexVal > -1) {
					//console.log("chcek1 myBid ", resp[IndexVal])
					Detail.Resp.Bids.myBid = resp[IndexVal];
				  }
				}
			  }
  
			  var findData = {
				tokenCounts: tokenCounts,
				'$or': [
				  { status: 'completed' },
				  { status: 'partiallyCancelled' },
				  { status: 'partiallyCompleted' }
				]
			  }
			  var resp = await BiddingDb.find(findData).exec();
			  Detail.Resp.Bids.completed = resp;
			  done();
			}
		  });
	  },
	  function (done) {
  
		var OnSaleBalance = 0;
		var TotalQuantity = 0;
  
		if (Detail.Resp.Token && Detail.Resp.Token[0]) {
		  if (Detail.Resp.Token[0].tokenowners_all) {
			TotalQuantity = Detail.Resp.Token[0].tokenQuantity;
			var tokenowners_all = Detail.Resp.Token[0].tokenowners_all
			for (let i = 0; i < tokenowners_all.length; i++) {
			  const element = tokenowners_all[i];
			  if (element.balance > 0 && element.tokenPrice > 0) {
				OnSaleBalance = OnSaleBalance + element.balance;
			  }
			}
		  }
		}
  
		Detail.Resp.OnSaleBalance = OnSaleBalance;
		Detail.Resp.TotalQuantity = TotalQuantity;
		done();
	  },
	  function (done) {
		RetData.Detail = Detail;
		//console.log("find all valuess", RetData)
		return res.json(RetData);
	  }
	], function (err, result) {
	  if (err) return false;
	});
  }


export const PurchaseComplete = async (req, res) => {
  var RetData = {};
  RetData.toast = {};
  var ReqBody = req.body;
  var tokenOwner = ReqBody.tokenOwner;
  var UserAccountAddr = ReqBody.UserAccountAddr;
  var tokenCounts = ReqBody.tokenCounts;
  var tokenType = ReqBody.tokenType;
  // var tprice=ReqBody.tokenPrice;
  //////console.log("jhagdaghsddhsahdgsah req body",req.body)
  var NoOfToken = 1;
  if (ReqBody.NoOfToken) {
    NoOfToken = ReqBody.NoOfToken;
  }

  if (ReqBody.transactionHash && ReqBody.transactionHash != '') {
    var hashValue = ReqBody.transactionHash;
  }
  else {
    RetData.toast.type = 'error';
    RetData.toast.msg = 'Transaction not completed';
    return res.json(RetData);
  }

  ////////console.log('PurchaseComplete', ReqBody);

  async.waterfall([
    function (done) {
      TokenDb.findOne({
        tokenCounts: tokenCounts,
        type: tokenType
      }).exec(async function (err, resp) {
        ////////console.log('1', err, resp);
        if (err) {
          RetData.toast.type = 'error';
          RetData.toast.msg = Config.errorOccured;
          return res.json(RetData);
        }
        else if (resp == null) {
          RetData.toast.type = 'error';
          RetData.toast.msg = 'Collectible not found';
          return res.json(RetData);
        }
        else {
          ////////console.log('done');
          done();
        }
      });
    },
    function (done) {
      TokenOwnerDb.findOne(
        {
          tokenOwner: tokenOwner,
          tokenCounts: tokenCounts,
          type: tokenType,
          // balance: {'$ne': 0}
        },
        {
          _id: 0,
          timestamp: 0,
          __v: 0
        }
      ).exec(async function (err, respOfPur) {
        ////////console.log('2', err, respOfPur);
        if (err) {
          RetData.toast.type = 'error';
          RetData.toast.msg = Config.errorOccured;
          return res.json(RetData);
        }
        else if (respOfPur == null) {
          RetData.toast.type = 'error';
          RetData.toast.msg = 'Collectible not found';
          return res.json(RetData);
        }
        else {
          if (respOfPur.balance == 0) {
            RetData.toast.type = 'error';
            RetData.toast.msg = 'Collectible sale already completed';
            return res.json(RetData);
          }
          else if (respOfPur.type == 721 && respOfPur.balance == 1) {
            done('', respOfPur);
          }
          else if (respOfPur.type == 1155) {
            if (respOfPur.balance >= NoOfToken) {
              done('', respOfPur);
            }
            else {
              RetData.toast.type = 'error';
              RetData.toast.msg = 'Collectible sale already completed';
              return res.json(RetData);
            }
          }
        }
      });
    },
    function (respOfPur, done) {
      var UpdateData = {};
      if (
        (respOfPur.type == 721)
        ||
        (respOfPur.type == 1155 && respOfPur.balance == NoOfToken)
      ) {
        UpdateData.tokenPrice = 0;
        // UpdateData.previousPrice=tprice;
        UpdateData.balance = 0;
        UpdateData.status='afterpurchase';
        UpdateData.timestamp=Date.now();
      }
      else if (respOfPur.type == 1155 && respOfPur.balance > NoOfToken) {
        UpdateData.balance = respOfPur.balance - NoOfToken;
    
      }
      // UpdateData.status='afterpurchase';
      TokenOwnerDb.findOneAndUpdate(
        {
          tokenOwner: tokenOwner,
          tokenCounts: tokenCounts
        },
        { $set: UpdateData },
        { new: true }
      )
        .exec(async function (err, UpdResp) {
          if (err) {
            RetData.toast.type = 'error';
            RetData.toast.msg = Config.errorOccured;
            return res.json(RetData);
          }
          else if (UpdResp == null) {
            RetData.toast.type = 'error';
            RetData.toast.msg = 'Collectible purchase failed';
            return res.json(RetData);
          }
          else {
            if (respOfPur.type == 721) {
              var newBalance = 1;
              NoOfToken = 1;
              respOfPur.status="afterpurchase"
            }
            else {
              var newBalance = NoOfToken;
              respOfPur.status="afterpurchase"
            }

            await neworoldownerupdate(
              respOfPur,
              UserAccountAddr,
              newBalance,
              hashValue,
              NoOfToken,
              'afterpurchase',
              
            );

            RetData.toast.type = 'success';
            RetData.toast.msg = 'Collectible purchase successfully';
            var checkLa = await ActivityHelper.save({
              createData: {
                action: 'purchase',
                activity: 'purchased by',
                from: UserAccountAddr,
                to: tokenOwner,
                tokenCounts: tokenCounts,
              }
            });
            // //////console.log("=========================================================================================================================================================================", checkLa)

            return res.json(RetData);
            // Notes : Need to delete bidding data
          }
        })
    }
  ], function (err, result) {
    if (err) return false;
  });
}
async function neworoldownerupdate(respOfPur, UserAccountAddr, newBalance, hashValue, NoOfToken, from) {
  try {
    var IsOldItem = await TokenOwnerDb.findOne(
      {
        tokenCounts: respOfPur.tokenCounts,
        tokenOwner: UserAccountAddr
      }
    ).exec();
    //////console.log("++++++++++++++++++++++++++++++++++++++++++++",IsOldItem)
    if (IsOldItem == null) {
      //////console.log("uywteqtwtetwqueyqwteqwyteqwueqwue++++++++++++++++++++++++++++++++")
   
      var NewData = {
        tokenCounts: respOfPur.tokenCounts,
        tokenOwner: UserAccountAddr,
        tokenPrice: 0,
        balance: newBalance,
        quantity: newBalance,
        contractAddress: respOfPur.contractAddress,
        hashValue: hashValue,
        status: respOfPur.status,
        type: respOfPur.type,
        tokenCreator: respOfPur.tokenCreator,
        burnToken: 0,
        status:from,
        PutOnSale:false,
        //previousPrice:Number(tprice),
        timestamp:new Date()
      }
      //////console.log("uywteqtwtetwqueyqwteqwyteqwueqwue++++++++++++++++++++++++++++++++",NewData)
   
      //////console.log("uywteqtwtetwqueyqwteqwyteqwueqwue",NewData)
      var TokenOwnerNew = new TokenOwnerDb(NewData);
      TokenOwnerNew.save();
      //////console.log("uywteqtwtetwqueyqwteqwyteqwueqwue++++++++++++++++++++++++++++++++",TokenOwnerNew)
     
      return true;
    }
    else {
      //////console.log("++++++++++++++++++++++++++++++++++++++++++++1")
   
      var UpdData = {
        tokenCounts: respOfPur.tokenCounts,
        tokenOwner: UserAccountAddr,
        contractAddress: respOfPur.contractAddress,
        hashValue: hashValue,
        status: respOfPur.status,
        type: respOfPur.type,
        tokenCreator: respOfPur.tokenCreator,
        //previousPrice:tprice,
        CoinName:respOfPur.CoinName
      };
      //////console.log("++++++++++++++++++++++++++++++++++++++++++++1",UpdData)
   
      var newbalance = parseInt(newBalance) + parseInt(IsOldItem.balance);
      UpdData.balance = newbalance;
      UpdData.timestamp=Date.now();
      var newquantity = 0;

      if (parseInt(IsOldItem.quantity) == 0) {
        newquantity = parseInt(newBalance);
        UpdData.quantity = newquantity;
      }
      else if (parseInt(IsOldItem.quantity) == parseInt(IsOldItem.balance)) {
        newquantity = parseInt(IsOldItem.quantity) + parseInt(newBalance);
        UpdData.quantity = newquantity;
      }
      else if (parseInt(IsOldItem.quantity) > parseInt(IsOldItem.balance)) {
        var diff = parseInt(IsOldItem.quantity) - parseInt(IsOldItem.balance);
        if (diff < NoOfToken) {
          UpdData.quantity = UpdData.balance;
        }
      }

      await TokenOwnerDb.findOneAndUpdate(
        {
          tokenCounts: respOfPur.tokenCounts,
          tokenOwner: UserAccountAddr
        },
        {
          $set: UpdData
        }
      ).exec();

      return true;
    }
  }
  catch (err) {
    return false;
  }
}
export const TokenPriceChange = async (req, res) => {
  var RetData = {};
  var ReqBody = req.body;
  var tokenOwner = ReqBody.tokenOwner;
  var tokenCounts = ReqBody.tokenCounts;
  var tokenPrice = ReqBody.tokenPrice;
  var coinname = ReqBody.coinname;
  var owners=ReqBody.owner;
  var PutOnSale = ReqBody.PutOnSale;
  var status;
  if(tokenPrice==0){
    status = "cancelled"
  }
  else{
    status="true"
  }
  // var previewPrice = ReqBody.tokenPrice;
  TokenOwnerDb
    .findOneAndUpdate(
    { 
        "tokenOwner": tokenOwner,
        "tokenCounts": tokenCounts,
      },
      { $set: {"tokenPrice":parseFloat(tokenPrice),"previousPrice":parseFloat(tokenPrice),"CoinName":coinname,"PutOnSale":PutOnSale,"status":status}}
    ).then(async(data) => {
      RetData.RetType = 'success';
      var activitys=""
      if(tokenPrice==0){
        activitys="token Cancelled by"
      }
      else{
        activitys="Price Changed  by"
      }
      var checkLa = await ActivityHelper.save({
        createData: {
          action: 'changeprice',
          activity: activitys,
          from: tokenOwner,
          tokenCounts: tokenCounts,
          to:tokenOwner,
          amount:tokenPrice
        }
      });
      ////console.log("=========================================================================================================================================================================", checkLa)

      res.json(RetData);
    }).catch(e => {
      RetData.RetType = 'error';
      res.json(RetType);
    })
}

export const CountGet = async (req, res) => {
  var counts = await TokenIdtableDb.findOne({}).sort({ tokenId: -1 });
  if (counts == null) {
    var tok = new TokenIdtableDb({
      tokenId: 20000
    })
    await tok.save()
      .then(data => {
        res.json(data);
      })
  }
  else {
    TokenIdtableDb.findOneAndUpdate({ "tokenId": counts.tokenId }, { "$set": { "tokenId": counts.tokenId + 1 } })
      .then((data) => {
        res.json(data);
      })
      .catch((e) => {
        return res.json(e);
      })
  }
}

export const LikeList = async (req, res) => {
  var retRes = {};
  retRes.toast = {};
  var reqBody = req.body;
  let useraddress = reqBody.currAddr;

  var data = {};
  data.tableName = LikeDb;
  data.findData = { "useraddress": useraddress }
  data.selectData = { "tokenCounts": 1 };
  var resp = await MongooseHelper.find(data);
  retRes = resp;
  //////console.log("lkjkkljljluiouoiuuotrrttetrffdsfdscxcxvcx",retRes)
  return res.json(retRes);
}

export const Like = async (req, res) => {
  var retRes = {};
  retRes.toast = {};
  var reqBody = req.body;
  var tokenOwner = reqBody.tokenOwner;
  var tokenCounts = reqBody.tokenCounts;
  var useraddress = reqBody.currAddr;

  var data = {};
  data.tableName = LikeDb;
  data.findData = { "tokenCounts": tokenCounts, "useraddress": useraddress }
  var resp = await MongooseHelper.findOne(data);

  if (typeof resp.record == 'undefined') {
    res.json(resp);
  }
  else if (resp.record == null) {
    retRes.likeOrUnlike = 'like';

    var data = {};
    data.tableName = LikeDb;
    data.createData = { "tokenCounts": tokenCounts, "useraddress": useraddress }
    var resp = await MongooseHelper.save(data);
    retRes.likeData = resp;

    if (resp.record) {
      var data = {};
      data.tableName = TokenDb;
      data.findData = { tokenCounts: tokenCounts, tokenOwner: tokenOwner }
      data.updateData = { $inc: { likecount: 1 } };
      data.newormulti = { new: true };
      var resp = await MongooseHelper.findOneAndUpdate(data);
      if (resp.record) {
        retRes.tokenData = resp;
        retRes.toast.type = 'success';
        retRes.toast.msg = 'Token like successfully';

        await ActivityHelper.save({
          createData: {
            action: retRes.likeOrUnlike,
            from: tokenOwner,
            to:useraddress,
            activity:'Token liked by',
            tokenCounts: tokenCounts
          }
        });
        return res.json(retRes);
      }
      else {
        return res.json(retRes);
      }
    }
    else {
      return res.json(retRes);
    }
  }
  else {
    retRes.likeOrUnlike = 'unlike';

    var data = {};
    data.tableName = LikeDb;
    data.findData = { "tokenCounts": tokenCounts, "useraddress": useraddress }
    var resp = await MongooseHelper.findOneAndRemove(data);
    retRes.likeData = resp;

    if (resp.record) {
      var data = {};
      data.tableName = TokenDb;
      data.findData = { tokenCounts: tokenCounts, tokenOwner: tokenOwner }
      data.updateData = { $inc: { likecount: -1 } }
      data.newormulti = { new: true };
      var resp = await MongooseHelper.findOneAndUpdate(data);
      if (resp.record) {
        retRes.tokenData = resp;
        retRes.toast.type = 'success';
        retRes.toast.msg = 'Token unlike successfully';
        await ActivityHelper.save({
          createData: {
            action: retRes.likeOrUnlike,
            from: tokenOwner,
            to:useraddress,
            tokenCounts: tokenCounts,
            activity: 'Unliked by'
          }
        });

        ////////console.log("dsajhdkjashdkjsahdsadsadhkjashdhaskjdhkjasdkasdksadhksaj", checkLa)
        return res.json(retRes);
      }
      else {
        return res.json(retRes);
      }
    }
    else {
      return res.json(retRes);
    }
  }
}

export const TokenHashStatusChange = async (req, res, Addr) => {
  try {
    var a = await MyItemAddrDb.aggregate([
      {
        $match: {
          "currAddress": Addr,
          'status': { '$ne': 'true' }
        }
      },
      {
        $lookup:
        {
          from: "tokens",
          localField: "currAddress",
          foreignField: "tokenCreator",
          as: "checkAdd"
        },
      },
      {
        $unwind: {
          path: '$checkAdd',
          preserveNullAndEmptyArrays: true,
        }
      },

      {
        $project: {
          id: 1,
          currAddress: 1,
          createdAt: 1,
          deleted: 1,
          checkAdd: "$checkAdd"
        }
      }
    ]);
  }
  catch (err) {
    ////////console.log('err', err);
    return [];
  }
}

export const MyItems_CollectiblesList = async (req, res) => {
  var RetData = {};
  var ReqBody = req.body;

  var Addr = ReqBody.Addr;
  var Target = ReqBody.Target;
  var TabName = ReqBody.TabName;

  if (ReqBody.init == true) {
    var changeStatusList = await TokenHashStatusChange(req, res, Addr);
    RetData.changeStatusList = changeStatusList;
  }

  let limit = ReqBody.limit ? parseInt(ReqBody.limit) : Config.limitMax;
  let page = ReqBody.page ? parseInt(ReqBody.page) : 1;
  let skip = (page - 1) * limit;

  var data = {};
  data.limit = limit;
  data.skip = skip;
  data.initial = {
    status: 'true',
    // balance:{'$gt':0}
  };
  data.sorts={
    'timestamp':-1
  }
  data.tokenowners_current = {
    'tokenowners_current.balance': { '$gt': 0 },
    'tokenowners_current.deleted':{$gt:0}
  }

  if (TabName == 'onsale') {
    data.tokenowners_current['tokenowners_current.tokenOwner'] = String(Addr);
    data.tokenowners_current['tokenowners_current.tokenPrice'] = { '$gt': 0 };
  }
  else if (TabName == 'collectibles') {
    data.tokenowners_current['$or'] = [
      // { 'tokenowners_current.tokenCreated': String(Addr) },
      { 'tokenowners_current.tokenOwner': String(Addr) }
    ];
  }
  // else if (TabName == 'created') {
  //   data.tokenowners_current.tokenCreator = String(Addr);
  //   // data.tokenowners_initial.tokenCreator = String(Addr);

  // }
  // change this from above
  else if(TabName == 'created') {
    data.initial['tokenCreator'] = String(Addr);
  }
  else if (TabName == 'owned') {
    data.tokenowners_current['tokenowners_current.tokenOwner'] = String(Addr);
  }
  else if (TabName == 'liked') {
    var passdata = {};
    passdata.tableName = LikeDb;
    passdata.findData = { "useraddress": String(Addr) }
    passdata.selectData = {
      "tokenCounts": 1,
      _id: 0
    };
    var resp = await MongooseHelper.find(passdata);
    if (resp.records && resp.records.length > 0) {
      data.initial['$or'] = resp.records;
    }
    else {
      return res.json({
        from: 'My-Items',
        Target: Target,
        success: true,
        list: [],
      });
    }
  }

  data.ReqBody = ReqBody;
  RetData = await ItemDetailList(data);
  RetData.from = 'My-Items';
  ////console.log("1eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", RetData)
  return res.json(RetData);
}
// async function ItemDetailList(data) {
// //////console.log("opqopwqwqopwpqopwpqowoqpowq",data)
//   if (data.from == 'Home') {
//     var limitSortQuery = { $limit: 1 };
//   }
//   else {
//     var limitSortQuery = { $sort: { _id: 1 } };
//   }
//   // if (data.ReqBody.filterParam === 'highestprice') {
//   //   var filter = {$sort : {tokenPrice : 1}};
//   // } else if (data.ReqBody.filterParam === 'mostliked') {
//   //   var filter = {$sort : {likecount : 1}};
//   // } else if (data.ReqBody.filterParam === 'cheapest') {
//   //   var filter = {$sort : {tokenName : -1}};
//   // }
//   // ////////console.log(limitSortQuery);
//   var Query = [
//     { $match: data.initial },
//     // {
//     //   $lookup:
//     //   {
//     //     from: "tokenowners",
//     //     localField: "tokenCounts",
//     //     foreignField: "tokenCounts",
//     //     as: "tokenowners_current"
//     //   },
//     // },
//     {
//       $lookup:
//       {
//         from: "tokenowners",
//         let: { tC: "$tokenCounts" },
//         pipeline: [
//           {
//             $match:
//             {
//               $expr:
//               {
//                 $and:
//                   [
//                     { $eq: ["$tokenCounts", "$$tC"] },
//                     { $gt: ["$balance", 0] },
//                   ]
//               }
//             },
//           },
//           {
//             $count: "count",
//           }
//         ],
//         as: "tokenowners_current_count"
//       }
//     },
//     {
//       $unwind: {
//         path: '$tokenowners_current_count',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     {
//       $lookup:
//       {
//         from: "tokenowners",
//         let: { tC: "$tokenCounts" },
//         pipeline: [
//           {
//             $match:
//             {
//               $expr:
//               {
//                 $and:
//                   [
//                     { $eq: ["$tokenCounts", "$$tC"] },
//                     { $gt: ["$balance", 0] }
//                   ]
//               }
//             },
//           },
//           limitSortQuery
//         ],
//         as: "tokenowners_current"
//       }
//     },
//     {
//       $unwind: {
//         path: '$tokenowners_current',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     { $match: data.tokenowners_current },
//     { $sort: { "timestamp": -1 } },
//     { $skip: data.skip },
//     { $limit: data.limit },
//     {
//       $lookup: {
//         from: "users",
//         localField: "tokenCreator",
//         foreignField: "curraddress",
//         as: "tokencreatorinfo"
//       },
//     },
//     {
//       $unwind: {
//         path: '$tokencreatorinfo',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     {
//       $lookup: {
//         from: "contracts",
//         localField: "contractAddress",
//         foreignField: "conAddr",
//         as: "usercontract"
//       },
//     },
//     {
//       $unwind: {
//         path: '$usercontract',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "tokenowners_current.tokenOwner",
//         foreignField: "curraddress",
//         as: "tokenuser"
//       },
//     },
//     {
//       $unwind: {
//         path: '$tokenuser',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     {
//       $project: {
//         _id: 1,
//         tokenPrice: 1,
//         tokenCategory: 1,
//         image: 1,
//         tokenCounts: 1,
//         tokenName: 1,
//         tokenBid: 1,
//         tokenOwner: 1,
//         tokenCreator: 1,
//         status: 1,
//         hashValue: 1,
//         type: 1,
//         balance: 1,
//         ipfsimage: 1,additionalImage:1,
//         tokenQuantity: 1,
//         contractAddress: 1,
//         minimumBid: 1,
//         endclocktime: 1,
//         clocktime: 1,
//         likecount: 1,
//         PutOnSale: 1,
//         PutOnSaleType: 1,
//         tokenowners_current: 1,
//         CoinName:1,
//         tokenowners_current_count: 1,
//         // tokenowners_current: { $arrayElemAt: ["$tokenowners_current", 0] },
//         ipfsimage: 1,additionalImage:1,
//         tokenOwnerInfo: {
//           _id: "$tokenuser._id",
//           image: "$tokenuser.image",
//           name: "$tokenuser.name",
//           curraddress: "$tokenuser.curraddress",
//           customurl: "$tokenuser.customurl"
//         },
//         tokenCreatorInfo: {
//           _id: "$tokencreatorinfo._id",
//           image: "$tokencreatorinfo.image",
//           name: "$tokencreatorinfo.name",
//           curraddress: "$tokencreatorinfo.curraddress",
//           customurl: "$tokencreatorinfo.customurl"
//         },
//         usercontract: {
//           imageUser: "$usercontract.imageUser",
//           type: "$usercontract.type",
//           name: "$usercontract.name",
//           url: "$usercontract.url",
//           conAddr: "$usercontract.conAddr"
//         },
//       }
//     }
//   ];
  

//   var Target = '';
//   if (data.ReqBody && data.ReqBody.Target) {
//     Target = data.ReqBody.Target;
//   }
//   if (Target == 'Count') {
//     Query.push({ $count: "count" });
//   }

//   try {
//     var data = await TokenDb.aggregate(Query);
//     if (Target == 'Count') {
//       if (typeof data[0] == 'undefined' || typeof data[0].count == 'undefined') {
//         var data = [{ count: 0 }];
//       }
//     }
//     return {
//       Target: Target,
//       success: true,
//       list: data,
//     };
//   }
//   catch (err) {
//     return {
//       err: err,
//       success: false,
//       msg: "Error on server",
//     };
//   }
// }



async function ItemDetailList(data) {
    if (data.from == 'Home') {
      var limitSortQuery = { $limit: 1 };
    }
    else {
      var limitSortQuery = { $sort: { _id: 1 } };
    }
  // var bidderCheck={'myBid.tokenBidAddress':{$eq:(data.ReqBody.currAddr?data.ReqBody.currAddr:{$ne:''})}}
   var Query = [
      { $match: data.initial },
        {
        $lookup:
        {
          from: "tokenowners",
          let: { tC: "$tokenCounts" },
          pipeline: [
            {
              $match:
              {
                $expr:
                {
                 $and:[{
                    $and:
                    [
                      { $eq: ["$tokenCounts", "$$tC"] },
                      { $gt: ["$balance", 0] },
                    ]
                  }]
                }
              },
            },
            {
              $count: "count",
            }
          ],
          as: "tokenowners_current_count"
        }
      },
      {
        $unwind: {
          path: '$tokenowners_current_count',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup:
        {
          from: "tokenowners",
          let: { tC: "$tokenCounts" },
          pipeline: [
            {
              $match:
              {
                $expr:
                {
                 $and:[{
                    $and:
                    [
                      { $eq: ["$tokenCounts", "$$tC"] },
                      { $gt: ["$balance", 0] }
                    ]
                  }]
                }
              },
            },
            limitSortQuery
          ],
          as: "tokenowners_current"
        }
      },
      {
        $unwind: {
          path: '$tokenowners_current',
          preserveNullAndEmptyArrays: true,
        }
      },
      { $match: data.tokenowners_current },
      { $sort:  data.sorts  },
      { $skip: data.skip },
      { $limit: data.limit },
      {
        $lookup: {
          from: "users",
          localField: "tokenCreator",
          foreignField: "curraddress",
          as: "tokencreatorinfo"
        },
      },
      {
        $unwind: {
          path: '$tokencreatorinfo',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup: {
          from: "contracts",
          localField: "contractAddress",
          foreignField: "conAddr",
          as: "usercontract"
        },
      },
      {
        $unwind: {
          path: '$usercontract',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "tokenowners_current.tokenOwner",
          foreignField: "curraddress",
          as: "tokenuser"
        },
      },
      {
        $unwind: {
          path: '$tokenuser',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup: {
          from: "bidings",
          let: { tC1: "$tokenCounts" },
          
          pipeline: [
            {
              $match:
              {
                $expr:
                {
                  $and:[{
                    $and:
                      [
                        { $eq: ["$tokenCounts", "$$tC1"] },                     
                      ]},
                      {$and:
                      [
                        { $ne:['$status',"cancelled"]} ,
                        {$ne:['$status',"completed"]}
                      ]}]
                }
              },
            },
            {
              "$sort":{
                "tokenBidAmt":-1
              }
            },
            {$limit:1}
          ],
          as: "higheBd"
        },
      },
      {
        $unwind: {
          path: '$higheBd',
          preserveNullAndEmptyArrays: true, }
      },
          
    {
      $lookup: {
        from: "bidings",
        let: { tC1: "$tokenCounts" },
        
        pipeline: [
          {
            $match:
            {
              $expr:
              {
                $and:[{
                $and:
                  [
                    { $eq: ["$tokenCounts", "$$tC1"] },
                    { $eq: ["$tokenBidAddress", data.ReqBody.currAddr] },
                 
                  ]},
                  {$and:
                  [
                    { $ne:['$status',"cancelled"]} ,
                    {$ne:['$status',"completed"]}
                  ]}]
              }
            },
          },
        ],
        as: "myBid"
      },
    },
    {
      $unwind: {
        path: '$myBid',
       
        preserveNullAndEmptyArrays: true, }
    },
       
      {
        $project: {
          _id: 1,
          tokenPrice: 1,
          tokenCategory: 1,
          image: 1,
          tokenCounts: 1,
          tokenName: 1,
          tokenBid: 1,
          tokenOwner: 1,
          tokenCreator: 1,
          status: 1,
          hashValue: 1,
          type: 1,
          balance: 1,
          ipfsimage: 1,additionalImage:1,
          tokenQuantity: 1,
          contractAddress: 1,
          minimumBid: 1,
          endclocktime: 1,
          clocktime: 1,
          likecount: 1,
          PutOnSale: 1,
          PutOnSaleType: 1,
          unlockcontent:1,
          tokenowners_current: 1,
          tokenRoyality: 1,
          CoinName:1,
          tokenowners_current_count: 1,
          tokenowners_current: 1,
          ipfsimage: 1,additionalImage:1,
          tokenOwnerInfo: {
            _id: "$tokenuser._id",
            image: "$tokenuser.image",
            name: "$tokenuser.name",
            curraddress: "$tokenuser.curraddress",
            customurl: "$tokenuser.customurl"
          },
          tokenCreatorInfo: {
            _id: "$tokencreatorinfo._id",
            image: "$tokencreatorinfo.image",
            name: "$tokencreatorinfo.name",
            curraddress: "$tokencreatorinfo.curraddress",
            customurl: "$tokencreatorinfo.customurl"
          },
          usercontract: {
            imageUser: "$usercontract.imageUser",
            type: "$usercontract.type",
            name: "$usercontract.name",
            url: "$usercontract.url",
            conAddr: "$usercontract.conAddr"
          },
          myBid: {
            status: "$myBid.status",
            NoOfToken: "$myBid.NoOfToken",
            completed: "$myBid.completed",
            cancelled: "$myBid.cancelled",
            pending: "$myBid.pending",
            tokenBidAmt: "$myBid.tokenBidAmt",
            tokenBidAddress: "$myBid.tokenBidAddress",
            tokenCounts: "$myBid.tokenCounts"
          },
          higheBd: {
            status: "$higheBd.status",
            NoOfToken: "$higheBd.NoOfToken",
            completed: "$higheBd.completed",
            cancelled: "$higheBd.cancelled",
            pending: "$higheBd.pending",
            tokenBidAmt: "$higheBd.tokenBidAmt",
            tokenBidAddress: "$higheBd.tokenBidAddress",
            tokenCounts: "$higheBd.tokenCounts"
         },
        }
      }
    ];
    
  
 


var Target = '';
if (data.ReqBody && data.ReqBody.Target) {
  Target = data.ReqBody.Target;
}
if (Target == 'Count') {
  Query.push({ $count: "count" });
}

    try {
      var data = await TokenDb.aggregate(Query);
      // var bidList = await TokenDb.aggregate(biddetails);
      if (Target == 'Count') {
        if (typeof data[0] == 'undefined' || typeof data[0].count == 'undefined') {
          var data = [{ count: 0 }];
        }
      }
      //////console.log("eurewtewrweyweu",data)
      return {
        Target: Target,
        success: true,
        list: data,
      };
    }
    catch (err) {
      //////console.log("___________________________________________________",err)
      return {
        err: err,
        success: false,
        msg: "Error on server",
      };
    }
  }

export const Home_CollectiblesList = async (req, res) => {
  var RetData = {};
  var ReqBody = req.body;
 var data={}
  //////console.log("111111111111111111111111111", ReqBody)
if(ReqBody.from=='Time'){
  data.limit = 8;
  data.skip = 0;
  data.initial = {
    "$and": [
      {
        "$and": [
          {
             
             'endclocktime':{ '$ne': null },
             'endclocktime':{ '$gt': new Date() }
          },
        
        ]
      }]
     
  };
  data.sorts={
    'endclocktime':1
  }
  data.tokenowners_current = {
    '$and':[{'tokenowners_current.balance': { '$gt': 0 }},
    {'tokenowners_current.status':{'$eq':"true"}},
    {"tokenowners_current.deleted":{"$gt":0}}
  ]
 
  }
  data.ReqBody = ReqBody;

  RetData = await ItemDetailList(data);
  RetData.from = 'time-auction-token-collectibles-list-home';
  //////console.log("time")
  //////console.log("times",RetData)
  
}
else if(ReqBody.from=='recent'){
  data.limit = 8;
  data.skip = 0;
  data.sorts={
    'timestamp':-1
  }
  data.initial = {
    tokenPrice:{'$gt':0}
     
  };
  data.tokenowners_current = {
    "$and":[
      {'tokenowners_current.status':{'$eq':"true"}}
    ,{
    "$and":[{  
      'tokenowners_current.balance': { '$gt': 0 }},
    {'tokenowners_current.tokenPrice': { '$gt': 0 }},
    {"tokenowners_current.deleted":{"$gt":0}}
  
  ],
}
]
  }

  data.ReqBody = ReqBody;
  RetData = await ItemDetailList(data);
  RetData.from = 'recent-token-collectibles-list-home';
  //////console.log("time")
  //////console.log("times",RetData)
  
}
else{
  let CatName = (ReqBody.CatName && ReqBody.CatName != 'All') ? ReqBody.CatName : '';

  let limit = ReqBody.limit ? parseInt(ReqBody.limit) : Config.limitMax;
  let page = ReqBody.page ? parseInt(ReqBody.page) : 1;
  let skip = (page - 1) * limit;

  data.sorts={
    'timestamp':-1
  }
  data.limit = limit;
  data.skip = skip;
  data.initial = {
    "$and": [
      {
        "$and": [
          {
            // "tokenOwner": {"$ne": req.body.currAddr},
            "status": "true",
            'tokenCategory': CatName ? CatName : { '$ne': '' }
          }
        ]
      }
    ]
  };
  data.tokenowners_current = {
    '$and':[{
      'tokenowners_current.balance': { '$gt': 0 }
    },{
      'tokenowners_current.status': { '$eq': 'true' }
    },
    {"tokenowners_current.deleted":{"$gt":0}}
  ]
    
  }
  data.ReqBody = ReqBody;

  RetData = await ItemDetailList(data);
  RetData.from = 'token-collectibles-list-home';
  //////console.log("home")
  
}

return res.json(RetData);
}



export const timeAuctionFunction = async (req, res) => {
 
}

// export const Follow_CollectiblesList = async (req, res) => {
//   var ReqBody = req.body;
//   var RetData = {};
//   var target = ReqBody.target;
//   var addr = ReqBody.addr;

//   var FindData = {};
//   var SelectData = {};
//   if (target == 'following') {
//     FindData.userAddress = addr;
//     SelectData.followerAddress = 1;
//   } else if (target == 'follower') {
//     FindData.followerAddress = addr;
//     SelectData.userAddress = 1;
//   }

//   var aggregateData = [];
//   aggregateData.push({ $match: FindData });

//    if (target == 'following') {
//       aggregateData.push({
//         $lookup:
//         {
//           from: "followers",
//           localField: "userAddress",
//           foreignField: "userAddress",
//           as: "follows_As"
//         },
//       });
//     }
//     aggregateData.push({
//       $lookup: {
//         from: "users",
//         localField: "useraddress",
//         foreignField: "curraddress",
//         as: "tokencreatorinfo"
//       },
//     });
//     aggregateData.push({
//       $unwind: {
//         path: '$tokencreatorinfo',
//         preserveNullAndEmptyArrays: true,
//       }
//     })
//     aggregateData.push({
//       $project: {
//         owner: 1,
//         follower: 1,
//         timestamp: 1,
//         numberOfFollower: {
//           $cond: {
//             if: {
//               $isArray: "$follows_As"
//             },
//             then: {
//               $size: "$follows_As"
//             },
//             else: "NA"
//           }
//         },
//         tokenCreatorInfo: {
//           _id: "$tokencreatorinfo._id",
//           image: "$tokencreatorinfo.image",
//           name: "$tokencreatorinfo.name",
//           curraddress: "$tokencreatorinfo.curraddress",
//           customurl: "$tokencreatorinfo.customurl"
//         },
//       }
//     })
  

//   // FollowDb.find(FindData,SelectData)
//   FollowDb.aggregate(aggregateData)
//     .then(async (data) => {
//       if (data.length == 0) {
//         res.json({ list: [] });
//       }
//       else {
//         if (ReqBody.from == 'my-items') {
//           RetData.list = data;
//           return res.json(RetData);
//         }
//         else {
//           var AllAddr = [];
//           for (let i = 0; i < data.length; i++) {
//             const element = data[i];
//             if (target == 'following' && element.followerAddress) {
//               AllAddr.push(element.followerAddress);
//             } else if (target == 'follower' && element.userAddress) {
//               AllAddr.push(element.userAddress);
//             }
//           }

//           let limit = ReqBody.limit ? parseInt(ReqBody.limit) : Config.limitMax;
//           let page = ReqBody.page ? parseInt(ReqBody.page) : 1;
//           let skip = (page - 1) * limit;

//           var data = {};
//           data.limit = limit;
//           data.skip = skip;
//           // data.initial = {tokenCreator : { '$in':AllAddr }};
//           data.initial = {};
//           data.sorts={
//             'timestamp':-1
//           }
//           data.tokenowners_current = {
//             'tokenowners_current.tokenOwner': { '$in': AllAddr },
//             'tokenowners_current.balance': { '$gt': 0 }
//           }
//           data.ReqBody = ReqBody;

//           RetData = await ItemDetailList(data);
//           RetData.from = 'following';
//           return res.json(RetData);
//         }
//       }
//     })
//     .catch((e) => {
//       res.json({ "err ": e, list: [] })
//     })
// }

export const Follow_CollectiblesList = async (req, res) => {
  ////console.log("!!!!oqwueoiqweuowiquewioqueqwioueoiqwuieuiqowuieuoqwueouoqwuoeuqw",req.body)
  var RetData = {};
  var ReqBody = req.body;
  var addr=req.body.addr?String(req.body.addr):{$ne:''};
  var usedata = await FollowerDB.aggregate(
    [
      {
      "$match" : {
        "followerAddress" : {"$eq":addr}  }
      },
      {
        "$project":{
          userAddress:1,
          followerAddress:1
        }
      }
    
    ])
    .then(async(val)=>{
    
        ////console.log("___________________________oqwueoiqweuowiquewioqueqwioueoiqwuieuiqowuieuoqwueouoqwuoeuqw",val)

        if (val.length == 0) {
                  res.json({ list: [] });
                }
                else {
                    var newAddr = [];
                    for (let i = 0; i < val.length; i++) {
                      const element = val[i];
                      newAddr.push(element.userAddress);   
                      let limit = ReqBody.limit ? parseInt(ReqBody.limit) : Config.limitMax;
                      let page = ReqBody.page ? parseInt(ReqBody.page) : 1;
                      let skip = (page - 1) * limit;
                    
                      var data = {};
                      data.limit = limit;
                      data.skip = skip;
                      data.sorts={
                                    'timestamp':-1
                                  }
                      data.initial = {  };
                      data.tokenowners_current = {
                        $and:[{
                        'tokenowners_current.balance' : {'$gt': 0},},{
                        'tokenowners_current.tokenOwner' : {'$in': newAddr}}]
                      }
                      data.ReqBody = ReqBody;
                    ////console.log("???????????????????oqwueoiqweuowiquewioqueqwioueoiqwuieuiqowuieuoqwueouoqwuoeuqw",data)
                      RetData = await ItemDetailList(data);
                      RetData.from = 'Following-collectibles-list-FollowingPage';
                      ////console.log("oqwueoiqweuowiquewioqueqwioueoiqwuieuiqowuieuoqwueouoqwuoeuqw",RetData)
                   
                      return res.json(RetData);    
      }} })}




// export const Follow_CollectiblesList = async (req, res) => {
//   var ReqBody = req.body;
//   var RetData = {};
//   var target = ReqBody.target;
//   var addr = ReqBody.addr;

//   var FindData = {};
//   var SelectData = {};
//   if(target == 'following') {
//     FindData.follower = addr;
//     SelectData.owner = 1;
//   } else if(target == 'follower') {
//     FindData.owner = addr;
//     SelectData.follower = 1;
//   }

//   FollowDb.find(FindData,SelectData)
//   .then(async (data) => {
//     if(data.length == 0) {
//       res.json({list:[]});
//     }
//     else {
//       var AllAddr = [];
//       for (let i = 0; i < data.length; i++) {
//         const element = data[i];
//         if(target == 'following' && element.owner) {
//           AllAddr.push(element.owner);
//         } else if(target == 'follower' && element.follower) {
//           AllAddr.push(element.follower);
//         }
//       }

//       let limit = ReqBody.limit ? parseInt(ReqBody.limit) : Config.limitMax;
//       let page = ReqBody.page ? parseInt(ReqBody.page) : 1;
//       let skip = (page - 1) * limit;

//       var data = {};
//       data.limit = limit;
//       data.skip = skip;
//       data.initial = {tokenCreator : { '$in':AllAddr }};
//       data.tokenowners_current = {
//         'tokenowners_current.balance' : {'$ne': 0}
//       }
//       data.ReqBody = ReqBody;

//       RetData = await ItemDetailList(data);
//       RetData.from = 'following';
//       return res.json(RetData);
//     }
//   })
//   .catch((e) => {
//     res.json({ "err ": e, list:[] })
//   })
// }
// async function ItemDetailList(data) {

//   if(data.from == 'Home') {
//     var limitSortQuery = {$limit : 1};
//   }
//   else {
//     var limitSortQuery = {$sort : {_id:1}};
//   }

//   var Query = [
//     { $match: data.initial },
//     // {
//     //   $lookup:
//     //   {
//     //     from: "tokenowners",
//     //     localField: "tokenCounts",
//     //     foreignField: "tokenCounts",
//     //     as: "tokenowners_current"
//     //   },
//     // },
//     {
//       $lookup:
//       {
//         from: "tokenowners",
//         let: { tC: "$tokenCounts" },
//         pipeline: [
//         {
//           $match:
//           { $expr:
//             { $and:
//               [
//                 { $eq: [ "$tokenCounts",  "$$tC" ] },
//                 { $gt: [ "$balance", 0 ] }
//               ]
//             }
//           },
//         },
//         {
//           $count: "count",
//         }
//        ],
//        as: "tokenowners_current_count"
//       }
//     },
//     {
//       $unwind: {
//         path: '$tokenowners_current_count',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     {
//       $lookup:
//       {
//         from: "tokenowners",
//         let: { tC: "$tokenCounts" },
//         pipeline: [
//         {
//           $match:
//           { $expr:
//             { $and:
//               [
//                 { $eq: [ "$tokenCounts",  "$$tC" ] },
//                 { $gt: [ "$balance", 0 ] }
//               ]
//             }
//           },
//         },
//         limitSortQuery
//        ],
//        as: "tokenowners_current"
//       }
//     },
//     {
//       $unwind: {
//         path: '$tokenowners_current',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     { $match: data.tokenowners_current },
//     { $sort: { "timestamp": -1 } },
//     { $skip: data.skip },
//     { $limit: data.limit },
//     {
//       $lookup: {
//         from: "users",
//         localField: "tokenCreator",
//         foreignField: "curraddress",
//         as: "tokencreatorinfo"
//       },
//     },
//     {
//       $unwind: {
//         path: '$tokencreatorinfo',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     {
//       $lookup: {
//         from: "contracts",
//         localField: "contractAddress",
//         foreignField: "conAddr",
//         as: "usercontract"
//       },
//     },
//     {
//       $unwind: {
//         path: '$usercontract',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "tokenowners_current.tokenOwner",
//         foreignField: "curraddress",
//         as: "tokenuser"
//       },
//     },
//     {
//       $unwind: {
//         path: '$tokenuser',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     {
//       $project: {
//         _id: 1,
//         tokenPrice: 1,
//         tokenCategory: 1,
//         image: 1,
//         tokenCounts: 1,
//         tokenName: 1,
//         tokenBid: 1,
//         tokenOwner: 1,
//         tokenCreator: 1,
//         status: 1,
//         hashValue: 1,
//         type: 1,
//         balance: 1,
//         tokenQuantity: 1,
//         contractAddress: 1,
//         minimumBid: 1,
//         endclocktime: 1,
//         clocktime: 1,
//         likecount: 1,
//         PutOnSale: 1,
//         PutOnSaleType: 1,
//         tokenowners_current: 1,
//         tokenowners_current_count: 1,
//         // tokenowners_current: { $arrayElemAt: ["$tokenowners_current", 0] },
//         ipfsimage:1,
//         tokenOwnerInfo: {
//           _id: "$tokenuser._id",
//           image: "$tokenuser.image",
//           name: "$tokenuser.name",
//           curraddress: "$tokenuser.curraddress",
//           customurl: "$tokenuser.customurl"
//         },
//         tokenCreatorInfo: {
//           _id: "$tokencreatorinfo._id",
//           image: "$tokencreatorinfo.image",
//           name: "$tokencreatorinfo.name",
//           curraddress: "$tokencreatorinfo.curraddress",
//           customurl: "$tokencreatorinfo.customurl"
//         },
//         usercontract: {
//           imageUser: "$usercontract.imageUser",
//           type: "$usercontract.type",
//           name: "$usercontract.name",
//           url: "$usercontract.url",
//           conAddr: "$usercontract.conAddr"
//         },
//       }
//     }
//   ];

//   var Target = '';
//   if(data.ReqBody && data.ReqBody.Target) {
//     Target = data.ReqBody.Target;
//   }
//   if(Target == 'Count') {
//     Query.push({ $count: "count" });
//   }

//   try {
//     var data = await TokenDb.aggregate(Query);
//     if(Target == 'Count') {
//       if(typeof data[0] == 'undefined' || typeof data[0].count == 'undefined') {
//         var data = [{count: 0}];
//       }
//     }
//     return {
//       Target: Target,
//       success: true,
//       list: data,
//     };
//   }
//   catch(err) {
//     return {
//       err: err,
//       success: false,
//       msg: "Error on server",
//     };
//   }
// }

// async function ItemDetailList(data) {


//   var Query = [
//     { $match: data.initial },
//     {
//       $lookup:
//       {
//         from: "tokenowners",
//         localField: "tokenCounts",
//         foreignField: "tokenCounts",
//         as: "tokenowners_current"
//       },
//     },
//     {
//       $unwind: {
//         path: '$tokenowners_current',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     { $match: data.tokenowners_current },
//     { $sort: { "timestamp": -1 } },
//     { $skip: data.skip },
//     { $limit: data.limit },
//     {
//       $lookup: {
//         from: "users",
//         localField: "tokenCreator",
//         foreignField: "curraddress",
//         as: "tokencreatorinfo"
//       },
//     },
//     {
//       $unwind: {
//         path: '$tokencreatorinfo',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     {
//       $lookup: {
//         from: "contracts",
//         localField: "contractAddress",
//         foreignField: "conAddr",
//         as: "usercontract"
//       },
//     },
//     {
//       $unwind: {
//         path: '$usercontract',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "tokenowners_current.tokenOwner",
//         foreignField: "curraddress",
//         as: "tokenuser"
//       },
//     },
//     {
//       $unwind: {
//         path: '$tokenuser',
//         preserveNullAndEmptyArrays: true,
//       }
//     },
//     {
//       $project: {
//         _id: 1,
//         tokenPrice: 1,
//         tokenCategory: 1,
//         image: 1,
//         tokenCounts: 1,
//         tokenName: 1,
//         tokenBid: 1,
//         tokenOwner: 1,
//         tokenCreator: 1,
//         status: 1,
//         hashValue: 1,
//         type: 1,
//         balance: 1,
//         tokenQuantity: 1,
//         contractAddress: 1,
//         minimumBid: 1,
//         endclocktime: 1,
//         clocktime: 1,
//         likecount: 1,
//         PutOnSale: 1,
//         PutOnSaleType: 1,
//         tokenowners_current: 1,
//         ipfsimage:1,
//         tokenOwnerInfo: {
//           _id: "$tokenuser._id",
//           image: "$tokenuser.image",
//           name: "$tokenuser.name",
//           curraddress: "$tokenuser.curraddress",
//           customurl: "$tokenuser.customurl"
//         },
//         tokenCreatorInfo: {
//           _id: "$tokencreatorinfo._id",
//           image: "$tokencreatorinfo.image",
//           name: "$tokencreatorinfo.name",
//           curraddress: "$tokencreatorinfo.curraddress",
//           customurl: "$tokencreatorinfo.customurl"
//         },
//         usercontract: {
//           imageUser: "$usercontract.imageUser",
//           type: "$usercontract.type",
//           name: "$usercontract.name",
//           url: "$usercontract.url",
//           conAddr: "$usercontract.conAddr"
//         },
//       }
//     }
//   ];

//   var Target = '';
//   if(data.ReqBody && data.ReqBody.Target) {
//     Target = data.ReqBody.Target;
//   }
//   if(Target == 'Count') {
//     Query.push({ $count: "count" });
//   }

//   try {
//     var data = await TokenDb.aggregate(Query);
//     return {
//       Target: Target,
//       success: true,
//       list: data,
//     };
//   }
//   catch(err) {
//     return {
//       err: err,
//       success: false,
//       msg: "Error on server",
//     };
//   }
// }

export const CategoryList = async (req, res) => {
  var retJson = {};
  var reqQuery = req.query;
  let limit = reqQuery.limit ? parseInt(reqQuery.limit) : Config.limitMax;

  CategoryDb.find({deleted:1})
    .limit(limit)
    .exec(function (err, data) {
      if (err) {
        retJson = {
          success: false,
          msg: "Error on server",
          from: 'tokenCategoryList'
        };
        return res.status(200).json(retJson);
      } else {
        retJson = {
          success: true,
          list: data,
          from: 'tokenCategoryList'
        };
        return res.status(200).json(retJson);
      }
    });
}

export const AddItemValidation = async (req, res) => {
  let imageFormat = /\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|gif|mp4)$/;
  var retJson = {};
  var reqBody = req.body;
  var errors = {};
  ////////console.log('reqBody', reqBody);

  var data = {};
  data.tableName = TokenDb;
  data.findData = { "tokenName": reqBody.TokenName }
  data.selectData = { "tokenName": 1 };
  var resp = await MongooseHelper.findOne(data);
  // if(file==null){
  //   errors.photo = "Image is Required"
  //     }else if (!imageFormat.test(file.Image.name)) {
  //             errors.photo = "Please select valid image."
  //     }else if (30000000<file.Image.size ) {  // 5 MB
  //             errors.photo = "Too large"
  //     }

  if (resp.record) {
    errors.TokenName = "Name Exits";
  }
  retJson.errors = errors;
  return res.status(200).json(retJson);
}

export const AddItem = async (req, res) => {
  try{
  var ReqBody = req.body;
  var ReqFiles = req.files;
  console.log("hbsdjkebkdcjewbdkjfcwnbjkf",ReqBody)
  const { data, name, mimetype} = ReqFiles.Image;
	const timestamp = new Date().toISOString();
	if (mimetype != 'video/mp4') {
		var ref = `${timestamp}.webp`;
	} else {
		var ref = `${timestamp}.mp4`;
	}
  var Name = ReqBody.Name;
  var Count = ReqBody.Count;
  var Description = ReqBody.Description;
  var Price = ReqBody.Price;
  var Royalities = ReqBody.Royalities;
  var Category = ReqBody.Category_label;
  var Bid = ReqBody.Bid;
  var Properties = ReqBody.Properties;
  var Owner = ReqBody.Owner;
  var Creator = ReqBody.Creator;
  var CategoryId = ReqBody.CategoryId;
  var Quantity = ReqBody.Quantity;
  var Balance = ReqBody.Balance;
  var ContractAddress = ReqBody.ContractAddress;
  var Status = ReqBody.Status;
  var HashValue = ReqBody.HashValue;
  var Type = ReqBody.Type;
  var MinimumBid = ReqBody.MinimumBid;
  var EndClocktime = ReqBody.EndClocktime;
  var Clocktime = ReqBody.Clocktime;
  var UnLockcontent = ReqBody.UnLockcontent;
  var swapPrice = ReqBody.swapPrice;
  // var ImageName=ReqBody.Image
  var ImageName = (ReqFiles.Image !== undefined) ? ReqFiles.Image.name : "";
  var ipfsimage = ReqBody.ipfsimage;
  var CoinName = ReqBody.coinname;
  var findTokenDb1=await TokenDb.findOne({tokenOwner:String(Owner).toLowerCase(),contractAddress:ContractAddress,tokenCounts:Count})
  .then(async(findTokenDb) => {
    if(!isEmpty(findTokenDb)){
      res.json({ RespType: "fail" });
     }
     else{
  var NewItem = {
    tokenCounts: Count,
    tokenName: Name,
    tokenDesc: Description,
    tokenPrice: Price,
    tokenRoyality: Royalities,
    tokenCategory: Category,
    tokenBid: Bid,
    tokenProperty: Properties,
    tokenOwner: Owner,
    tokenCreator: Creator,
    categoryid: CategoryId,
    tokenQuantity: Quantity,
    balance: Balance,
    contractAddress: ContractAddress,
    status: Status,
    hashValue: HashValue,
    type: Type,
    minimumBid: MinimumBid,
    unlockcontent: UnLockcontent,
    image: ImageName,
    ipfsimage: ipfsimage,
    swapPrice: swapPrice,
    burnToken: 0,
    CoinName:CoinName,
    additionalImage : ""
  }

  if (ReqBody.Clocktime) {
    NewItem.clocktime = ReqBody.Clocktime;
  }
  if (ReqBody.EndClocktime) {
    NewItem.endclocktime = ReqBody.EndClocktime;
  }

  if (typeof ReqBody.PutOnSale != 'undefined') {
    NewItem.PutOnSale = ReqBody.PutOnSale;
  }
  if (typeof ReqBody.PutOnSaleType != 'undefined') {
    NewItem.PutOnSaleType = ReqBody.PutOnSaleType;
  }



  var TokenNews = new TokenDb(NewItem);
  ////////console.log('TokenNew', TokenNew)


  var TokenNew = await TokenNews.save();
  console.log('TokenNew', TokenNew)
  var UploadFullPath = 'public/compressedImage/' + Creator + '/' + ImageName;
	var additionalFile = "nftImg/" + Creator + '/' + ref;
	
  if (TokenNew) {
    await fs.mkdir('public/compressedImage/' + Creator, { recursive: true }, async function (err) {
      if (err) return;
  if (ImageName != "" && ReqFiles && ReqFiles.Image) {
     console.log(Creator)
			if (ImageName != "" && ReqFiles && ReqFiles.Image) {
				ReqFiles.Image.mv(UploadFullPath, function (err) {
					if (err) return;
				});
			}
	
		// await fs.mkdir("public/nftImg/" + Creator, { recursive: true }, function (err) {
		// 	if (err) return;
		// 	//File compression concepts here 
		// 	var restrictImageFiles = ['image/jpeg' , 'image/jpg' , 'image/gif', 'image/png', 'image/webp', 'image/JPG', 'image/JPEG', 'image/PNG', 'image/GIF', 'image/WEBP']; // add relevent types here haha
		// 	if (restrictImageFiles.includes(mimetype)) {
		// 		sharp(data, { animated: true })
		// 		// .resize({ width: 500 })
		// 		.webp({ quality: 80 })
		// 		.toFile("public/" + additionalFile)
		// 		.then((data) => {
		// 			console.log('dataa>>>>', data);
		// 		})
		// 		.catch(error => {
		// 			console.log('dataa>>>>', error);
		// 		});
		// 	}
		// 	var restrictVideoType = ['video/mp4']; // add relevent types here 
		// 	if (restrictVideoType.includes(mimetype)) {
				
		// 		ffmpeg(UploadFullPath)
		// 		.setStartTime('00:00:01')
		// 		.setDuration(5)
		// 		.output('public/nftImg/'+ Creator + "/" + ref)
		// 		.on('end', function(err) {
		// 		if(!err)
		// 		{
		// 			console.log('successfully converted',data);
		// 		}                 
		// 		})
		// 		.on('error', function(err){
		// 			console.log('conversion error: ', err);
		// 		}).run();
		// 	}	
		// });
  }
});

 res.json({ RespType: "success", RespData: TokenNew });
  }
  var checkLa = await ActivityHelper.save({
    createData: {
      action: 'mint',
      activity:'minted by',
      from: Creator,
      to:Creator,
      tokenCounts: Count
    }
  });
}
  })
  }
  catch(e){
    console.log("errorinadditem",e)
  }
}



export const AddOwner = async (req, res) => {
  try{
  var ReqBody = req.body;
  console.log("hbsdjkebkdcjewbdkjfcwnbjkf",ReqBody)
  var Count = ReqBody.Count;
  var Owner = ReqBody.Owner;
  var Price = ReqBody.Price;
  var Balance = ReqBody.Balance;
  var Quantity = ReqBody.Quantity;
  var ContractAddress = ReqBody.ContractAddress;
  var HashValue = ReqBody.HashValue;
  var Status = ReqBody.Status;
  var Type = ReqBody.Type;
  var tokenCreator = ReqBody.tokenCreator;
  var CoinName = ReqBody.coinname;
  var PutOnSale = ReqBody.PutOnSale;
  var findTokenOwneDb1=await TokenOwnerDb.findOne({tokenOwner:String(Owner).toLowerCase(),contractAddress:ContractAddress,tokenCounts:Count})
  .then((findTokenOwneDb) => {
    if(!isEmpty(findTokenOwneDb)){
      res.json({ RespType: "fail" });
     }
     else{
  // var previousPrice = ReqBody.previousPrice;
  var TokenOwnerNew = new TokenOwnerDb({
    tokenCounts: Count,
    tokenOwner: Owner,
    tokenPrice: Price,
    balance: Balance,
    quantity: Quantity,
    contractAddress: ContractAddress,
    hashValue: HashValue,
    status: Status,
    type: Type,
    tokenCreator: tokenCreator,
    // previousPrice:Price,
    CoinName:CoinName,
    PutOnSale:PutOnSale
  })
  TokenOwnerNew.save()
    .then((data) => {
      ////console.log("wqoeuoiqwueiqwieowquoieqw",data)
      res.json({ "RespType": "success", RespData: data });
    })
    .catch((err) => {
      ////console.log("wqoeuoiqwueiqwieowquoieqw",err)
  
      res.json({ RespType: "error", err: err });
    })
  }
})
  }
  catch(e){
    console.log("errorinaddowner",e)
  }
  }

export const Home_New_CollectiblesList = async (req, res) => {
  var RetData = {};
  var ReqBody = req.body;

  let limit = ReqBody.limit ? parseInt(ReqBody.limit) : Config.limitMax;
  let page = ReqBody.page ? parseInt(ReqBody.page) : 1;
  let skip = (page - 1) * limit;

  var data = {};
  data.limit = 4;
  data.skip = skip;
  data.initial = {

  };
  data.sorts={
    'timestamp':-1
  }
  data.tokenowners_current = {
    'tokenowners_current.balance': { '$gt': 0 },
    'tokenowners_current.deleted': { '$gt': 0 },
    // "tokenowners_current.tokenOwner": {"$eq" : ReqBody.currAddr}
  }
  data.ReqBody = ReqBody;

  RetData = await ItemDetailList(data);
  RetData.from = 'token-collectibles-list-home';
  ////////console.log(RetData)
  return res.json(RetData);
}



export const topCreatorsApi = async (req, res) => {

  var collections=await TokenOwnerDb.find({"burnToken":{"$eq":0}}).count()
  var users=await UserDb.find({}).count()
  var creator=await TokenDb.find({"burnToken":{"$eq":0}}).count()
  
  res.json({collections:collections,users:users,creator:creator})


}

export const ipfsImageHashGet = async (req, res) => {

  var ReqFiles = req.files;

  ////////console.log('filesssssssssssssssssssssssssssssssss', req.files)
  const file = { path: 'nftstyle', content: Buffer.from(req.files.Image.data) }

  const filesAdd = await ipfs.add(file)
  // const hash = await Hash.of(file)


  ////////console.log("filesssssssssssssssssssssssssssssssss", filesAdd)
  var ipfsimage = filesAdd.cid.string;
  ////////console.log(ipfsimage)
  res.json({ ipfsval: ipfsimage })
}

export const reportFunc = async (req, res) => {

  var imageName = req.body.imageName;
  var imagehash = String(req.body.imagehash);
  var currAddr = req.body.currAddr;
  var imageOwner = req.body.imageOwner;
  var imageContractAddress = req.body.imageContractAddress
  var imageType = parseInt(req.body.imageType)
  var imageId = req.body.imageId;
  var noofitems = req.body.noofitems;
  //////console.log("djgfhdsgfjdgfgsdgfsdf",req.body)
  var report = req.body.report;
  var burnToken =req.body.burnToken;
  var findVa = await reports.findOne({ "currAddr": currAddr, "imageOwner": imageOwner, "imageId": imageId, "imageType": imageType })
  if (isEmpty(findVa)) {
    var took1 = new reports({
      imageName: imageName,
      imagehash: imagehash,
      currAddr: currAddr,
      imageOwner: imageOwner,
      report: report,
      imageContractAddress: imageContractAddress,
      imageType: imageType,
      imageId: imageId,
      noofitems: parseInt(noofitems),
      burnToken: burnToken,
      Links:req.body.Links,
    })
    ////////console.log(took1)
    took1.save()
      .then((data) => {
        //////console.log("varuthu")
        res.json({ "success": "updated", data });
        ////////console.log("save ah", data)
      })
      .catch((e) => {
        ////////console.log("save ah ila", e)
        return res.status(200).json({ "success": "fail", "errors": e });
      })
  }
  else {
    //////console.log("varala",findVa)
    var findVa = await reports.findOneAndUpdate(
      { "currAddr": currAddr, "imageOwner": imageOwner, "imageId": imageId, "imageType": imageType },
      {
        $set: {
         "imageName": imageName,
          "imagehash": imagehash,
           "report": report,
           "imageContractAddress": imageContractAddress
          ,"noofitems": findVa.noofitems,
          "burnToken": parseInt(findVa.burnToken),
          "Links":req.body.Links,
          "burnToken":req.body.burnToken,
          "CreatedAt":req.body.CreatedAt

        }
      },{new:true})
      res.json({ "success": "updated", findVa})

  }
}


export const sociallinksfunction = async (req, res) => {

  var soci = await settings.findOne({})
  if (soci) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>",soci)
    res.json({ soci: soci })
  }
  else {
    res.json({})
  }
}

export const faqlists = async (req, res) => {

  var soci = await FAQS.find({deleted:1})
  ////////console.log("11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111", soci)
  if (soci) {
    res.json({ soci: soci })
  }
  else {
    res.json([])
  }
}


export const null_time_auction = async (req, res) => {
  ////////console.log("=============================================================", req.body)
  var check = await TokenDb.findOneAndUpdate({
    "tokenOwner": req.body.UserAccountAddr_byaccepter,
    "tokenCreator": req.body.UserAccountAddr_byaccepter,
    "tokenCounts": req.body.tokenCounts,
    "clocktime": { $ne: null },
    "endclocktime": { $ne: null }
  },
    { $set: { "clocktime": null, "endclocktime": null } }, { new: true })
  ////////console.log(check)
}


export const notifications = async (req, res) => {
  var addr=req.body.currAddr;
   var limits=req.body.limit?req.body.limit:Config.limitMax;
 try{
//    if(req.body.tab=="load"){
    var countsVal = await Activity.find({"from":String(addr)}).count();
//    }

// if()
// 
var test={
"tokenownerField.tokenOwner":addr}

console.log("555555%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",addr)
     var checkAllVal=await Activity.aggregate([
    {
      $match:{
        "$or":[
          {"from":String(addr)},
          {"to":String(addr)}
        ]
      }
    },
    {
      $sort:{
        "created":-1
      }
    },
    {
      $limit:limits
    },
    {
      $lookup:{
        from:"tokens",
        localField:"tokenCounts",
        foreignField:'tokenCounts',
        as:'tokenField'
      }
    },
    {$unwind:{
      path: '$tokenField',
     preserveNullAndEmptyArrays: true,
   }},
    {
      $lookup:{
        from: "tokenowners",
        localField:"tokenCounts",
        foreignField:'tokenCounts',
        as:'tokenownerField'
      }
    },
    {$unwind:{
       path: '$tokenownerField',
      preserveNullAndEmptyArrays: true,
    }},
    {
      $lookup:{
        from:'users',
        localField:"from",
        foreignField:'curraddress',
        as:'userField'
      }
    },
    {$unwind:{
       path: '$userField',
      preserveNullAndEmptyArrays: true,
    }},
    {
      $lookup:{
        from:'users',
        localField:"to",
        foreignField:'curraddress',
        as:'touserField'
      }
    },
    {$unwind:{
       path: '$touserField',
      preserveNullAndEmptyArrays: true,
    }},
    {
      $match:
        test
      },
    {
      $project:{
        from:1,
        to:1,
        activity:1,
        action:1,
        status:1,
        statusOpen:1,
        tokenCounts:1,
        currencySymbol:1,
        created:1,
        tokenField:{
          tokenName:"$tokenField.tokenName",
          tokenPrice:"$tokenField.tokenPrice",
          balance:"$tokenField.balance",
        },
        tokenownerField:{
          tokenPrice:"$tokenownerField.tokenPrice",
          balance:"$tokenownerField.balance",
        }
        ,
        userField:{
          name:"$userField.name",
          curraddress:"$userField.curraddress",
          customurl:"$userField.customurl",
          image:"$userField.image",
          _id:"$userField._id"
        },
        touserField:{
          name:"$touserField.name",
          curraddress:"$touserField.curraddress",
          customurl:"$touserField.customurl",
          image:"$touserField.image",
          _id:"$touserField._id"
        }

      }
    }
  
  ],(err,data)=>{
    // if(err) ////console.log(err)
   
   
  })
// } 
////console.log("1111111111111111111111111111ahdjkhaskjdhjaksdhasdkjhaskdjhasjkhdjkashjdhkasjhdjashkdj_____________________",checkAllVal)

  return res.json({data:checkAllVal,count:countsVal})
 }
catch(e){
  //////console.log("err------------------99999999999999999999999999",e)
}
}

export const notificationStatusChange = async (req, res) => {
  //////console.log("notification status change=============================================================", req.body)
  var checkAll=await Activity.findOne(
    {"tokenCounts":req.body.tokenCounts,"from":req.body.currAddr,_id:req.body._id})
 var checkAllVal=await Activity.findOneAndUpdate(
   {"tokenCounts":req.body.tokenCounts,"from":req.body.currAddr,"_id":req.body._id},
   {$set:{"statusOpen":"open"}},{new:true})
  //////console.log("ahdjkhaskjdhjaksdhasdkjhaskdjhasjkhdjkashjdhkasjhdjashkdj",checkAll,checkAllVal)
}

export const TokenImageCalls = async (req, res) => {
  var data={};
  var tokenimages=await UserDb.findOne({curraddress:req.body.currAddr})
  if(tokenimages){
  data.image=tokenimages.image;
  data.curraddress=tokenimages.curraddress;
  data.name=tokenimages.name;
  data.customurl=tokenimages.customurl
  data._id=tokenimages._id}
  res.json({data:data})
  ////console.log("owqpiepwqie",tokenimages)
}

export const getSearchList = async (req,res) => {
  var ReqBody = req.body;
  ////////console.log(ReqBody);
  var RetData = {
    users:[],
    items:[],
    collections:[]
    };
    var ReqBody = req.body;
    var keyword = ReqBody.keyword;

    async.waterfall([
    async function (done) {
      var findData = {};
      findData.name = {
      $regex : keyword
      }
    var respData=await  UserDb.aggregate([
        {
          $match:{
            "name":{
              "$regex" : keyword
            }
          }
        },
        {
          $lookup:{
            from:'followers',
            localField:'curraddress',
            foreignField:'followerAddress',
            as:'FollowerList'
          }
        },
     
        {
          $unwind:{
            path:'$FollowerList',
            preserveNullAndEmptyArrays:true
          }
        },
        {
          $limit:ReqBody.limit
        },
        {$project:{
          name:1,
          curraddress:1,
          bio:1,
          customurl:1,
          _id:1,
          image:1,
          coverimage:1,
          count: { $sum: '$FollowerList.userAddress' }
         }}
      ])
      RetData.users = respData;
      done();
    },
    async function (done) {
      var findData = {};
      findData.tokenName = {
      $regex : keyword
      }
     let limit = ReqBody.limit ? parseInt(ReqBody.limit) : Config.limitMax;
      let page =  1;
      let skip = (page - 1) * limit;
      var data = {};
      data.sorts={
        'timestamp':-1
      }
      data.limit = limit;
      data.skip = skip;
      data.initial = {
        "tokenName":{ 
            "$regex": keyword, 
    }}
      data.tokenowners_current = {
        '$and':[{'tokenowners_current.balance': { '$gt': 0 }},
        {"tokenowners_current.deleted":{"$gt":0}}
      ]  
      }
        
      data.ReqBody = ReqBody;
    
     var respData = await ItemDetailList(data);
      respData.from = 'search-token-collectibles-list-home';
      if(respData) {
         RetData.items=respData;
       }
      done();
     },
  
    function (done) {    
      //////console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",RetData)
  
      return res.json(RetData);
    },
    ], function (err, result) {
      // ////console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",err)
    if (err) {
      ////console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",err)
  
      return false};

    });
}


export const ActivityCall = async (req, res) => {
  ////console.log("home",req.body)
 var RetData={};
 var reqBody=req.body;
 var data={};
 let tabName = (reqBody.tabName && reqBody.tabName != 'All') ? reqBody.tabName : 'All';

  let limit = reqBody.limit ? parseInt(reqBody.limit) : Config.limitMax;
  let page = reqBody.page ? parseInt(reqBody.page) : 1;
  let skip = (page - 1) * limit;
  ////console.log("home1",data)
  data.sorts={
    'created':-1
  }
  ////console.log("home1",data)
  data.limit = limit;
  data.skip = skip;
  
  ////console.log("home134",data)
  if(tabName ==  "All"){
    ////console.log("home1340",data)
    data.initial = {  };
    data.tokenowners_current={};
  }
  else{
    ////console.log("home1349",data)
  
  data.initial = {
         "$or":[{ "from": {$eq:reqBody.currAddr} },{"to": {$eq:reqBody.currAddr}}]
}
data.tokenowners_current={
  // "tokenowners_current.tokenOwner":{$eq:reqBody.currAddr}
}
}
////console.log("home1345",data)
  data.ReqBody = reqBody;
  ////console.log("home13",data)
  ////console.log("home12",data)
  RetData = await ActivityList(data);
  RetData.from = 'activity-list-activity';
  ////console.log("home________________",RetData)
  res.json(RetData)
}

async function ActivityList(data) {

 var Query = [
    { $match: data.initial} ,
      {
      $lookup:
      {
        from: "tokens",
        let: { tC: "$tokenCounts" },
        pipeline: [
          {
            $match:
            {
              $expr:
              {
                $and:
                  [
                    { $eq: ["$tokenCounts", "$$tC"] },
                    { $gt: ["$balance", 0] },
                  ]
              }
            },
          },
        ],
        as: "tokens_current"
      }
    },
    {
      $unwind: {
        path: '$tokens_current',
        preserveNullAndEmptyArrays: true,
      }
    },
    {
      $lookup:
      {
        from: "tokenowners",  
        let: { tC: "$tokenCounts" ,tO:"$tokenOwner"},
        pipeline: [
          {
            $match:
            {
              $expr:
              {
                $and:
                  [
                    { $eq: ["$tokenCounts", "$$tC"] },
                    { $eq: ["$tokenOwner", "$$tO"] },
                    { $gt: ["$balance", 0] }
                  ]
              }
            },
          },
          
        ],
        as: "tokenowners_current"
      }
    },
    {
      $unwind: {
        path: '$tokenowners_current',
        preserveNullAndEmptyArrays: true,
      }
    },
    { $match:data.tokenowners_current },
    { $sort:  data.sorts  },
    { $skip: data.skip },
    { $limit: data.limit },
    {
      $lookup: {
        from: "users",
        localField: "from",
        foreignField: "curraddress",
        as: "fromField"
      },
    },
    {
      $unwind: {
        path: '$fromField',
        preserveNullAndEmptyArrays: true,
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "to",
        foreignField: "curraddress",
        as: "toField"
      },
    },
    {
      $unwind: {
        path: '$toField',
        preserveNullAndEmptyArrays: true,
      }
    },    
    {
      $project: {
        _id: 1,
        action: 1,
        from: 1,
        to: 1,
        tokenCounts: 1,
        amount: 1,
        fee: 1,
        total: 1,
        currencySymbol: 1,
        tokenSymbol: 1,
        activity: 1,
        status: 1,
        statusOpen: 1,
        created: 1,
        tokenowners_current: 1,
        CoinName:1,
        tokens_current: {
          tokenPrice: '$tokens_current.tokenPrice',
          tokenCategory: '$tokens_current.tokenCategory',
          image: '$tokens_current.image',
          tokenCounts: '$tokens_current.tokenCounts',
          tokenName: '$tokens_current.tokenName',
          tokenBid: '$tokens_current.tokenBid',
          tokenOwner: '$tokens_current.tokenOwner',
          tokenCreator: '$tokens_current.tokenCreator',
          status: '$tokens_current.status',
          hashValue: '$tokens_current.hashValue',
          type: '$tokens_current.type',
          balance: '$tokens_current.balance',
          ipfsimage: '$tokens_current.ipfsimage',
          tokenQuantity: '$tokens_current.tokenQuantity',
          contractAddress: '$tokens_current.contractAddress',
          minimumBid: '$tokens_current.minimumBid',
          endclocktime: '$tokens_current.endclocktime',
          clocktime: '$tokens_current.clocktime',
          likecount: '$tokens_current.likecount',
          PutOnSale: '$tokens_current.PutOnSale',
          PutOnSaleType: '$tokens_current.PutOnSaleType',
          tokenowners_current: '$tokens_current.tokenowners_current',
          CoinName:'$tokens_current.CoinName',
         
        },
        fromField: {
          _id: "$fromField._id",
          image: "$fromField.image",
          name: "$fromField.name",
          curraddress: "$fromField.curraddress",
          customurl: "$fromField.customurl"
        },
        toField: {
          _id: "$toField._id",
          image: "$toField.image",
          name: "$toField.name",
          curraddress: "$toField.curraddress",
          customurl: "$toField.customurl"
        },
       
      }
    }
  ];
  
  try {
    var data = await Activity.aggregate(Query);
    ////console.log("eurewtewrweyweu____________________________________",data)
    return {
      success: true,
      list: data,
    };
  }
  catch (err) {
    ////console.log("___________________________________________________",err)
    return {
      err: err,
      success: false,
      msg: "Error on server",
    };
  }
}

export const getcmslistinhome = async (req, res) => {
	
	var data = await cmsnew.findOne({"question":req.body.load})
  console.log("11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",req.body,data)
	if (data) {
	  res.json({ data: data })
	}
	else {
	  res.json({})
	}
      }

export const IpfsMetadata = async (req, res) => {
  ////console.log("Metadata checking%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
  var newmetadata={
    name:req.body.name ,
    image:req.body.image,
    description:req.body.desc,
  }

  const file={path:'nftstyle',content:Buffer.from(JSON.stringify(newmetadata))}

  
  const filesAdd=await ipfs.add(file)


  var ipfsmetadata = filesAdd.cid.string;
  ////console.log("MEtataadataaa",ipfsmetadata)
  res.json({ipfsval:ipfsmetadata})
  }
      
  export const burnToken = async (req, res) => {
    var ReqBody=req.body;
    ////console.log("eqwewquetqwteywqetywtquetywqutewqyeytwquewq",req.body)
     if(ReqBody.status=='click'){
      var RetData = {};
    let limit = ReqBody.limit ? parseInt(ReqBody.limit) : Config.limitMax;
    let page = ReqBody.page ? parseInt(ReqBody.page) : 1;
    let skip = (page - 1) * limit;
  
    var data = {};
    data.limit = limit;
    data.skip = skip;
    data.sorts={
      'timestamp':-1
    }
    data.initial = {
        // 'burnToken': { '$ne': 0 }  ,       
    };
    data.tokenowners_current = {
      $and:[{
      'tokenowners_current.burnToken': { '$ne': 0 },},
      {'tokenowners_current.tokenOwner':{'$eq': String(req.body.currAddr)}}
      ]
    }
    // data.tokenowners_current['tokenowners_current.tokenOwner'] = String(req.body.currAddr);
   
    var list = await TokenDb.aggregate(
     [
      { $match: data.initial },
     
      {
        $lookup:
        {
          from: "tokenowners",
          let: { tC: "$tokenCounts" },
          pipeline: [
            {
              $match:
              {
                $expr:
                {
                  $and:
                    [
                      { $eq: ["$tokenCounts", "$$tC"] },
                     
                    ]
                }
              },
            },
           
          ],
          as: "tokenowners_current"
        }
      },
      {
        $unwind: {
          path: '$tokenowners_current',
          preserveNullAndEmptyArrays: true,
        }
      },
      { $match: data.tokenowners_current },
      { $sort:  data.sorts  },
      { $skip: data.skip },
      { $limit: data.limit },
      {
        $lookup: {
          from: "users",
          localField: "tokenCreator",
          foreignField: "curraddress",
          as: "tokencreatorinfo"
        },
      },
      {
        $unwind: {
          path: '$tokencreatorinfo',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup: {
          from: "contracts",
          localField: "contractAddress",
          foreignField: "conAddr",
          as: "usercontract"
        },
      },
      {
        $unwind: {
          path: '$usercontract',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "tokenowners_current.tokenOwner",
          foreignField: "curraddress",
          as: "tokenuser"
        },
      },
      {
        $unwind: {
          path: '$tokenuser',
          preserveNullAndEmptyArrays: true,
        }
      },
     
       
      {
        $project: {
          _id: 1,
          tokenPrice: 1,
          tokenCategory: 1,
          image: 1,
          tokenCounts: 1,
          tokenName: 1,
          tokenBid: 1,
          tokenOwner: 1,
          tokenCreator: 1,
          status: 1,
          hashValue: 1,
          type: 1,
          balance: 1,
          ipfsimage: 1,additionalImage:1,
          tokenQuantity: 1,
          contractAddress: 1,
          minimumBid: 1,
          endclocktime: 1,
          clocktime: 1,
          likecount: 1,
          PutOnSale: 1,
          PutOnSaleType: 1,
          tokenowners_current: 1,
          CoinName:1,
          tokenowners_current_count: 1,
          // tokenowners_current: { $arrayElemAt: ["$tokenowners_current", 0] },
          ipfsimage: 1,additionalImage:1,
          tokenOwnerInfo: {
            _id: "$tokenuser._id",
            image: "$tokenuser.image",
            name: "$tokenuser.name",
            curraddress: "$tokenuser.curraddress",
            customurl: "$tokenuser.customurl"
          },
          tokenCreatorInfo: {
            _id: "$tokencreatorinfo._id",
            image: "$tokencreatorinfo.image",
            name: "$tokencreatorinfo.name",
            curraddress: "$tokencreatorinfo.curraddress",
            customurl: "$tokencreatorinfo.customurl"
          },
          usercontract: {
            imageUser: "$usercontract.imageUser",
            type: "$usercontract.type",
            name: "$usercontract.name",
            url: "$usercontract.url",
            conAddr: "$usercontract.conAddr"
          },
         
        }
      }
    ]);
    
    data.ReqBody = ReqBody;
  
    // RetData = await ItemDetailList(data);
    RetData.list=list;
    RetData.from = 'token-collectibles-list-home';
    ////console.log("dashdgsajhasgj*********************************************************************",RetData)
    return res.json({data:RetData});   
      }
     else if(ReqBody.status=='load'){
      var counts=await TokenOwnerDb.find({"tokenOwner":req.body.currAddr,"burnToken":{$gt:0}}).count()
      if(counts){
      return res.json({count:counts})}
     }
  
    }

    export const TransferComplete = async (req, res) => {
      var Datas={}
     var RqBody=req.body;
     var userData= await UserDb.findOne({'curraddress':RqBody.UserAccountAddr})
     var findData=await TokenOwnerDb.findOne({
       'tokenCounts':RqBody.tokenCounts,
       'tokenOwner':RqBody.tokenOwner,
       'type':RqBody.tokenType,
    
     })
    
     var findDataSave=await TokenOwnerDb.findOne({
      'tokenCounts':RqBody.tokenCounts,
      'tokenOwner':RqBody.UserAccountAddr,
      'type':RqBody.tokenType,
    
    })
    if(userData==null){
      var addDates=new UserDb({
        '_id':RqBody.UserAccountAddr,
        'curraddress':RqBody.UserAccountAddr
      })
      await addDates.save() 
    }
    if(findDataSave==null){
     var addDate=new TokenOwnerDb({
      tokenCounts: RqBody.tokenCounts,
      tokenOwner: RqBody.UserAccountAddr,
      tokenPrice: 0,
      balance: RqBody.NoOfToken,
      quantity: RqBody.NoOfToken,
      contractAddress: RqBody.contractAddress,
      hashValue: RqBody.transactionHash,
      status: "transfer",
      type: RqBody.tokenType,
      tokenCreator: RqBody.tokenCreator,
      burnToken: 0,
      previousPrice:0
     })
     await addDate.save()
     .then((data)=>{
        Datas.load="success"
        console.log("uewutewtwerwerweyutrewur",data)
     })

    }
    else{
      await TokenOwnerDb.findOneAndUpdate({
        'tokenCounts':RqBody.tokenCounts,
        'tokenOwner':RqBody.UserAccountAddr,
        'type':RqBody.tokenType,
      
      },
      {"$set":{
        'balance': findDataSave.balance+RqBody.NoOfToken,
        'timestamp':Date.now()
      }},{
       new:true
     }
      )
      .exec((data)=>{
        console.log("uewutewtwerwerweyutrewur",data)
      })
    }

     if(findData){
      if(findData.tokenOwner!=RqBody.UserAccountAddr){
       if(findData.balance==RqBody.NoOfToken){
        await TokenOwnerDb.findOneAndUpdate({
          'tokenCounts':RqBody.tokenCounts,
          'tokenOwner':RqBody.tokenOwner,
          'type':RqBody.tokenType
       },
       {"$set":{
         'balance': 0,  'timestamp':Date.now()
       }},{
        new:true
      }).exec((err,data)=>{
         if(err) console.log(err)
         Datas.updatelod="success"
         console.log("uewutewtwerwerweyutrewur",data)
       })
     
    }
    else{
      await TokenOwnerDb.findOneAndUpdate({
        'tokenCounts':RqBody.tokenCounts,
        'tokenOwner':RqBody.tokenOwner,
        'type':RqBody.tokenType,
     },
     {"$set":{
       'balance': findData.balance-RqBody.NoOfToken,
       'timestamp':Date.now()
     }},{
       new:true
     }).exec((err,data)=>{
      if(err) console.log(err)
      data.updatelod="success"
      console.log("uewutewtwerwerweyutrewur",data)
    })
    }
  
  }
    
    else{
      await TokenOwnerDb.findOneAndUpdate({
        'tokenCounts':RqBody.tokenCounts,
        'tokenOwner':RqBody.UserAccountAddr,
        'type':RqBody.tokenType,
     },
     {"$set":{
       'balance': findData.balance,
       'tokenPrice':0,
       'timestamp':Date.now()
     }},{
       new:true
     }).exec((err,data)=>{
      if(err) console.log(err)
      data.updatelod="success"
      console.log("uewutewtwerwerweyutrewur",data)
    })
    }
    }

    res.json(Datas)
    }

    export const ShowTop = async(req,res)=>{
      try{
      var totalSales=await Activity.find({$or:[{action:"purchase"},{action:'accept'}]}).count()
      var totalUsers=await UserDb.find({}).count()
      // var totalNft=await TokenDb.find({deleted:1,burnToken:{$gt:0}}).count()
      var totalBidings=await BiddingDb.find({status:{$in:['partiallyCompleted','pending']}}).count()
      var totalNft=await TokenDb.aggregate(
        [{$lookup:{
             from: "tokenowners",
             let: { tC: "$tokenCounts",tO: "$tokenOwner" },
             pipeline: [{$match:{$expr:{ $and:[{ $eq: ["$tokenCounts", "$$tC"] }, 
                         {$gt:["$balance",0]},
                        ]}},},],
             as: "tokenowners_current"
           }
         },
           {
           $unwind: {
             path: '$tokenowners_current',
             preserveNullAndEmptyArrays: true,
           }
         },
         {$group:{
              '_id': null,
              'users_count': {
                   '$sum':  "$tokenowners_current.balance"  }}}
              ])

      res.json({totalSales:totalSales,totalUsers:totalUsers,totalBidings:totalBidings,totalNft:totalNft})
      }
      catch(e){
        res.json({})
     
      }
    }

    
    export const ApproveChecked = async(req,res)=>{
      try{
        console.log("req data",req.body)
        var getDat=await UserDb.findOne({"curraddress":req.body.addr},{"curraddress":1,"Approved":1,"name":1,"_id":0})
        res.json({getDat:getDat})
      }
      catch(e){
        res.json({})
     
      }
    }


 export const AskApproved = async(req,res)=>{
      try{
        console.log("sadhgsagdshadsa",req.body)
      var newDate=new ApproveDb({
        curraddress:req.body.curradrress,
        description:req.body.description,
        checkApprove:new Date().getTime()
      }) 
      await newDate.save()
      var gyu=await UserDb.findOne({"curraddress":req.body.curradrress,"Approved":"false"})
      if(gyu){
        console.log("dsadasdsadsadsadsadsadasdas",gyu)
        var updateApproveStatus =await UserDb.findOneAndUpdate({"curraddress":req.body.curradrress},{$set:{"Approved":'inprogress'}},{new:true})
      }
      res.json({success:true})
      }
      catch(e){
        res.json({})
     
      }
    }

    
    export const ApproveCh = async(req,res)=>{
      try{
        
        var gyu=await UserDb.findOne({"curraddress":req.body.curraddress,"Approved":'true'})
        console.log("------------------------------",req.body.curraddress)
     
     if(gyu!=null){
     
      res.json({success:true})
    }
      }
      catch(e){
        res.json({})
     
      }
    }

    
      
    export const approvefalse = async(req,res)=>{
      try{
        console.log("sadhgsagdshadsa",req.body)
     
      var gyu=await UserDb.findOneAndUpdate({curraddress:req.body.currAddr,"Approved":'true'},{$set:{
        Approved:'false'
      }},{new:true})
      if(gyu){
      res.json({success:true})}
      }
      catch(e){
        res.json({})
     
      }
    }

    export const findAndUpdataBalance = async (req,res) => {
      var ReqBody = req.body;
      var tokenCounts = ReqBody.tokenCounts;
      var currentOwner = ReqBody.currentOwner;
      var balance = ReqBody.balance;
      var owner=ReqBody.owner;
      var checkExistingbalance = await TokenOwnerDb.find(
        {tokenOwner : currentOwner, tokenCounts : tokenCounts},
        {_id : 0, quantity : 1, balance:1}
      );
      console.log('>>>checkExistingbalance',checkExistingbalance,req.body);
      checkExistingbalance = checkExistingbalance.shift();
      console.log('>>>checkExistingbalance',checkExistingbalance,req.body);
      
      if (checkExistingbalance != null ) {
        console.log('>>>checkExistingbalance',checkExistingbalance.balance);
        if(checkExistingbalance.balance !== balance) {
          var update = {}
          if(checkExistingbalance.quantity < balance)
          {
          update = { $set : {
             balance : balance ,
             quantity:balance
            }
            }
          }
          else {
            update = { $set : {
              balance : balance
             }
             }
           }
          var updatedData = await TokenOwnerDb.update({tokenOwner : currentOwner, tokenCounts : tokenCounts},update,{new : true});
          console.log('>>>>updatedData',updatedData);
        }
      }
      return res
        .status(200)
        .json({ success: true});
    }

    export const TokenOptionList = async (req, res) => {

      var data = await TokenList.find({})
      if (data) {
        res.json({ data: data })
      }
      else {
        res.json({error : "Throwing Error"})
      }
    }