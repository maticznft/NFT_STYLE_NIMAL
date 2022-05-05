import e from 'express';
import fs from 'fs'
import path from 'path'
import mongoose, {now} from 'mongoose';

var async = require('async');
// import web3 from 'web3'
// var Web3 = new web3(web3.givenProvider || 'wss://rinkeby-light.eth.linkpool.io/ws');

var syncEach = require('sync-each');
const ObjectId = mongoose.Types.ObjectId;
const Config = require(path.resolve('./config/config')).default;
const UserDb = require(path.resolve('./models/User'));
const MyItemAddrDb = require(path.resolve('./models/myItemAddr'));
const CategoryDb = require(path.resolve('./models/category'));
const TokenDb = require(path.resolve('./models/Token'));
const FollowerDB = require(path.resolve('./models/follower'));
const TokenOwnerDb = require(path.resolve('./models/TokenOwner'));
const LikeDb = require(path.resolve('./models/like'));
const FollowDb = require(path.resolve('./models/follow'));
const isEmpty = require(path.resolve('./config/isEmpty'));
const ActivityHelper = require('../helpers/activity-helper');
const MongooseHelper = require('../helpers/mongoose-helper');
const ActivityDb = require(path.resolve('./models/activity'));

export const UserUpdate = async (req, res) => {
var RetData = {};
RetData.details = {};
RetData.toast = {};
var ReqBody = req.body;
var addr = ReqBody.addr;
let UserDet = await UserDb.findOne({ "curraddress": addr });

let UserUrlAlready = await UserDb.findOne({
	"curraddress": {'$ne': ReqBody.curraddress },
	"customurl": {'$eq': ReqBody.customurl }
});
if(UserUrlAlready) {
	RetData.toast.type = 'error';
	RetData.toast.msg = 'User not available';
	return res.json(RetData);
}

if (UserDet != null) {
	var Resp = await UserDb.findOneAndUpdate(
	{ curraddress: addr },
	{ $set: {
		addr: ReqBody.currAddr,
		name: ReqBody.name,
		personalsite: ReqBody.personalsite,
		customurl: ReqBody.customurl,
		desccription: ReqBody.desccription,
		bio: ReqBody.bio,
		twitter: ReqBody.twitter,
		youtube: ReqBody.youtube,
		facebook: ReqBody.facebook,
		instagram: ReqBody.instagram,
	} },
	{ new: true }
	);
	if(Resp) {
	RetData.details = Resp;
	RetData.toast.type = 'success';
	RetData.toast.msg = 'User profile updated successfully';
	} else {
	RetData.toast.type = 'error';
	RetData.toast.msg = 'User profile not updated';
	}
	res.json(RetData);
} else {
	var NewUser = new UserDb({
	"name": ReqBody.name,
	"personalsite": ReqBody.personalsite,
	"customurl": ReqBody.customurl,
	"curraddress": addr
	})
	NewUser.save(async function (err, Resp) {
	if(Resp) {
		RetData.data = Resp;
		RetData.toast.type = 'success';
		RetData.toast.msg = 'User profile updated successfully';
	} else {
		RetData.toast.type = 'error';
		RetData.toast.msg = 'User profile not updated';
	}
	res.json(RetData);
	})
}
}

export const FollowChange = async (req, res) => {
var RetData = {};
var ReqBody = req.body;
var currAddr = ReqBody.currAddr;
var ParamAccountAddr = ReqBody.ParamAccountAddr;

var FindData = {};
FindData.follower = currAddr;
FindData.owner = ParamAccountAddr;

FollowDb.findOne(FindData)
.then(async (data) => {
	if(data == null) {
	var FollowNew = new FollowDb({
		"owner": ParamAccountAddr,
		"follower": currAddr
	})
	FollowNew.save();
	RetData.ChangeType = 'Follow';
	RetData.toast = {
		type: 'success',
		msg: 'Follow successfully'
	}
	}
	else {
	await FollowDb
	.findOne(FindData)
	.remove();
	RetData.ChangeType = 'Un-Follow';
	RetData.toast = {
		type: 'success',
		msg: 'Un-Follow successfully'
	}
	}
	res.json(RetData);
});
  var RetData = {};
  var ReqBody = req.body;
  var currAddr = ReqBody.currAddr;
  var ParamAccountAddr = ReqBody.ParamAccountAddr;

  var FindData = {};
  FindData.follower = currAddr;
  FindData.owner = ParamAccountAddr;

  FollowDb.findOne(FindData)
  .then(async (data) => {
    if(data == null) {
      var FollowNew = new FollowDb({
        "owner": ParamAccountAddr,
        "follower": currAddr
      })
      FollowNew.save();
      RetData.ChangeType = 'Follow';
      RetData.toast = {
        type: 'success',
        msg: 'Follow successfully'
      }
      RetData.type = 'Follow';
    }
    else {
      await FollowDb
      .findOne(FindData)
      .remove();
      RetData.ChangeType = 'Un-Follow';
      RetData.toast = {
        type: 'success',
        msg: 'Un-Follow successfully'
      }
      RetData.type = 'Un-Follow';
    }

    await ActivityHelper.save({
      createData : {
        action : RetData.type,
        from : currAddr,
        to : ParamAccountAddr,
      }
    });
    res.json(RetData);
  });
}

export const FollowList = async (req, res) => {
var ReqBody = req.body;
var target = ReqBody.target;
var addr = ReqBody.addr;

var FindData = {};
var SelectData = {};
if(target == 'following') {
	FindData.follower = addr;
	SelectData.owner = 1;
} else if(target == 'follower') {
	FindData.owner = addr;
	SelectData.follower = 1;
}

FollowDb.find(FindData,{})
.then((data) => {
	if(data.length == 0) {
	res.json({list:[]});
	}
	else {
	res.json({list:data});
	}
})
.catch((e) => {
	res.json({ "err ": e, list:[] })
})
}

export const ChangeReceiptStatus = async (req, res) => {
var ReqBody = req.body;
var reqStatus = ReqBody.status;
var hashValue = ReqBody.hashValue;
TokenDb.findOneAndUpdate({ "hashValue": hashValue }, { $set: { "status": reqStatus } })
.then((data) => {
	res.json(data)
})
.catch((e) => {
	res.json({ "err ": e })
})
}

export const Details_Get = async (req, res) => {
var ReqBody = req.body;
var RetData = {};
RetData.found = false;
var FindData={};
if(ReqBody.customurl) {
	 FindData = { customurl: ReqBody.customurl };
} else if (ReqBody.addr) {
	 FindData = { curraddress: ReqBody.addr };
} else {
	return res.json(RetData);
}
if(!isEmpty(FindData)){
var Respuser = await UserDb.findOne(FindData);
if(Respuser && Respuser.curraddress) {
	RetData.found = true;
	RetData.User = Respuser;
}
return res.json(RetData);
}
}


export const Details_GetOrSave = async (req, res) => {
var RetData = {};
var ReqBody = req.body;
var FindData = {};
RetData.User = {};
try{
if(ReqBody.customurl) {
	var FindData = { customurl: ReqBody.customurl }
} else if (ReqBody.addr) {
	var FindData = { curraddress: ReqBody.addr }
} else {
	return res.json(RetData)
}
if(!isEmpty(FindData)){
var Respuser = await UserDb.findOne(FindData);
if(Respuser && Respuser.curraddress) {
	RetData.found = true;
	RetData.User = Respuser;
  let payloadData = {
    "_id": Respuser.curraddress
  }
  RetData.token = new UserDb().generateJWT(payloadData);
	return res.json(RetData);
}
else {
	var SaveRec =new UserDb(
    {
        _id: ReqBody.addr,
        curraddress: ReqBody.addr 
    });
      var data = await	SaveRec.save()
      RetData.User = data;
      let payloadData = {
        "_id": data.curraddress
      }
      RetData.token = new UserDb().generateJWT(payloadData);
      return res.json(RetData);
}
}
}
catch(e){
  console.log("ErrorinAddressgetorsaveFunction",e)
}
}
export const editprofileval = async(req, res, next) => {
  var reqBody=req.body;
  var errors={};
  var urltest= await UserDb.findOne({"curraddress":reqBody.currAddr})
  var urltest= await UserDb.findOne({"curraddress":reqBody.currAddr})
  var urltest2= await UserDb.findOne({"customurl":reqBody.customurl})
 
  var urltest1= await UserDb.findOne({"curraddress":reqBody.currAddr,"customurl":reqBody.customurl})
  if (urltest1==null) {
    if (urltest!=null) {
      if (urltest2!=null) {
    errors.customurl = "Custom url field is exist";}
    }
  } 
  if (!isEmpty(errors)) {
    return res.status(400).json({"errors":errors })
  }
  // else{
  return next()
  // }

  }
  
  
  export const editprofile = async (req, res) => {
  
  //////console.log('----------FUNCT')   
  var reqBody = req.body;
  var files = req.files;
  let updateData = await UserDb.findOne({ "curraddress": reqBody.currAddr });
  if (updateData) { 
  //////console.log('----------if(updateData)')  //already inserted data
  if (files != null) {
  //////console.log('----------TESTTTTTTTTT')
  var test = await UserDb.findOneAndUpdate(
    { curraddress: updateData.curraddress },  
    {
    
    name: reqBody.name,
    customurl: reqBody.customurl,
    bio: reqBody.bio,
    twitter: reqBody.twitter,
    curraddress: reqBody.currAddr,
    image: files.photo.name,
    youtube:reqBody.youtube,
    instagram:reqBody.instagram,
    email:reqBody.email,
    facebook:reqBody.facebook,
    personalsite:reqBody.personalsite,
    facebookcheck:reqBody.facebookcheck,
    instagramcheck:reqBody.instagramcheck,
    youtubecheck:reqBody.youtubecheck,
    twittercheck:reqBody.twittercheck,
    Approved:false
      }
  );
 await fs.mkdir('public/images/' + test._id, { recursive: true },async function (err) {
    if (err) return //////console.log('cannot create public/product_images/ directory');
    //////console.log('public/product_images/ directory created');
  
    var productImage = req.files.photo;
    var path = 'public/images/'+test._id+'/'  + productImage.name;
    await productImage.mv(path, function (err) {
    if (err)
    console.log(err);
    });
  });
  return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", test })
  
  } else {
  //////console.log('----------if(1stElse)') 
  var test = await UserDb.findOneAndUpdate(
    { curraddress: updateData.curraddress },
    {
    
      name: reqBody.name,
      customurl: reqBody.customurl,
      bio: reqBody.bio,
      twitter: reqBody.twitter,
      curraddress: reqBody.currAddr,
      // image: files.photo.name,
      youtube:reqBody.youtube,
      instagram:reqBody.instagram,
      email:reqBody.email,
      facebook:reqBody.facebook,
      facebookcheck:reqBody.facebookcheck,
      personalsite:reqBody.personalsite,
    instagramcheck:reqBody.instagramcheck,
    youtubecheck:reqBody.youtubecheck,
    twittercheck:reqBody.twittercheck,
    Approved:false
    }
  );
  return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", test })
  }
  
  } else { /// new record inserted
 
 
  if (files != null) {
  var user = new UserDb({
    "_id": reqBody.currAddr,
    "name": reqBody.name,
    "youtube": reqBody.youtube,
    "customurl": reqBody.customurl,
    "bio": reqBody.bio,
    "twitter": reqBody.twitter,
    "curraddress": reqBody.currAddr,
    "image": files.photo.name,
    "instagram":reqBody.instagram,
    "facebook":reqBody.facebook,
    personalsite:reqBody.personalsite,
    "email":reqBody.email,
    facebookcheck:reqBody.facebookcheck,
    instagramcheck:reqBody.instagramcheck,
    youtubecheck:reqBody.youtubecheck,
    twittercheck:reqBody.twittercheck,
    Approved:false

  })
  user.save(async function (err, result) {
    if (err) {
      res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
    }
   await fs.mkdir('public/images/' + user._id, { recursive: true },async function (err) {
      if (err) return //////console.log('cannot create public/product_images/ directory');
      var productImage = req.files.photo;
      var path = 'public/images/user/' + productImage.name;
     await productImage.mv(path, function (err) {
        if (err)
        console.log(err);
      });
      });
  
  
    return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", result })
  })
  } else {
    var user = new UserDb({
     "_id": reqBody.currAddr,
    "name": reqBody.name,
    "youtube": reqBody.youtube,
    "customurl": reqBody.customurl,
    "bio": reqBody.bio,
    "twitter": reqBody.twitter,
    "curraddress": reqBody.currAddr,
      "email":reqBody.email,
    "instagram":reqBody.instagram,
    "facebook":reqBody.facebook,
    personalsite:reqBody.personalsite,
    facebookcheck:reqBody.facebookcheck,
    instagramcheck:reqBody.instagramcheck,
    youtubecheck:reqBody.youtubecheck,
    twittercheck:reqBody.twittercheck,
    Approved:false
  })
    UserDb.save(function (err, result) {
      if (err) {
        //////console.log("errrrrrrrrr", error)
        res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
      }
      return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", result })
    })
  }
  }
  }
  
  export const getprofile = async (req, res) => {
    var reqBody = req.body;
      ////console.log('lastone',reqBody);
      UserDb.findOne({ 'curraddress': reqBody.currAddr }, (err, userData) => {
        if (err) {
      return res
      .status(200)
      .json({ success: false, errors: { messages: "Error on server" } });
        }
        ////console.log("all dhfhasdghfasgfsafa ",userData)
        return res
      .status(200)
      .json({ success: true, userValue: userData });
    });
  }
  
  
  export const coverimagevalidations = async (req, res) => {
	let errors = {};
	let file = req.files;
	//////console.log(req.files.image.name, '----------fileee')
	//////console.log("````````````````````````````````````````````````````" + JSON.stringify(req.body))
	//////console.log('`````````````````````````````````````````````````````````````'+JSON.stringify(errors))
	let imageFormat = /\.(png|PNG|gif|WEBP|webp|JPEG|jpg|JPG)$/;
	if (file == null) {
			errors.file = "Image is Required"
	} else if (!imageFormat.test(req.files.image.name)) {
			errors.file = "Please select valid image."
	} else if (10000000 < req.files.image.size) {  // 10 MB
			errors.file = "Too large. Please upload within 5MB"
	}
	//////console.log('`````````````````````````````````````````````````````````````'+JSON.stringify(errors))
	if(!isEmpty(errors)) {
	  return res.status(400).json({ "errors": errors });
	}
	//////console.log('`````````````````````````````````````````````````````````````'+JSON.stringify(errors))
	return res.status(200).json({ "errors": errors });
}


export const coverImage = async (req, res) => {
	var files = req.files;
	//////console.log("files", files)
	var reqBody = req.body;
	let updateData = await UserDb.findOne({ "curraddress": reqBody.accounts });
	if (updateData !=null) {
		//////console.log("44444444444444444444444444444",updateData)
		UserDb.findOneAndUpdate(
			{ "curraddress": updateData.curraddress },
			{"$set":{

			"coverimage": req.files.coverimage.name
			}}
		)
		.exec((err,test)=>{
			if(err) return //////console.log(err)
			//////console.log("2121212122222222222222222222222222222222222222222222222222222222",test)
			fs.mkdir('public/images/coverimages/' + test._id, { recursive: true }, function (err) {
				if (err) return ////   //  //////console.log("('cannot create public/product_images/ directory');
				var productImage = req.files.coverimage;
				var path = 'public/images/coverimages/' + test._id + '/' + req.files.coverimage.name;
			productImage.mv(path, function (err) {
				if (err)
					console.log(err);
			});
		});
		//////console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",test)
		return res.status(200).json({ 'success': true, 'message': "Profile details updated successfully", test })
		})
		// .catch(()=>{
		//   //////console.log(e)
		// })
	} else {
	
		var test = new UserDb({
			"curraddress": reqBody.accounts,
			"coverimage": files.coverimage.name
		})
		test.save(function (err, result) {
			if (err) {
			res
				.status(500)
				.json({ success: false, errors: { messages: "Error on server" } });
			}
			fs.mkdir('public/images/coverimages/' + test._id, { recursive: true }, function (err) {
			if (err) return //   //  //////console.log("('cannot create public/product_images/ directory');

			var productImage = req.files.coverimage;
			var path = 'public/images/coverimages/' + test._id + '/' + req.files.coverimage.name;
			productImage.mv(path, function (err) {
			if (err)
				console.log(err);
			});
		});
			return res.status(200).json({ 'success': true, 'message': "Please Create profile first",test })
		})
	}
	}

	
	export const pics1 = async (req, res) => {
	var files = req.files;
	//////console.log("files", req.body)
	//////console.log("files", files)
	var reqBody = req.body;
	let updateData = await UserDb.findOne({ "curraddress": reqBody.addr });
		if (updateData !=null) {
			//////console.log(updateData)
			return res.status(200).json({ 'success': true, 'message': "image get successfully","_id":updateData._id, "coverimage":updateData.coverimage,"image":updateData.image })
		} else {
			return res.status(200).json({ 'success': true, 'message': "Please Create profile first" })
		}
	}

	export const getfollowers = async (req,res) => {
		try {
      //console.log("+++++++++++++++++++++++++++++++++++++++++++++++",req.body)
			var currAddress = req.body.curraddress? String(req.body.curraddress):{$ne:''};
			var tab = req.body.tab;
			if ( tab == 'follower' ){
      
				var data = await FollowerDB.aggregate(
						[{
							"$match" : {
								userAddress : { "$eq" :currAddress } }
							},
							{
								$lookup : {
									from: "users",
									localField: "followerAddress",
									foreignField: "curraddress",
									as: "user"
								}
							},{
                $unwind:{
                  path:'$user',
                  preserveNullAndEmptyArrays:true
                }
              },{
                $project:{
                  _id:1,
                  userAddress:1,
                  followerAddress:1,
                  timestamp:1,
                  user:{
                    _id:'$user._id',
                    name:'$user.name',
                    image:'$user.image',
                    customurl:'$user.customurl',
                    bio:'$user.bio',
                    curraddress:'$user.curraddress'
                  }
                }
              }
              
					]
				)
			}
      
      else {
				var data = await FollowerDB.aggregate(
					[{
						"$match" : {
							followerAddress : { "$eq" : currAddress } }
						},
						{
							$lookup : {
								from: "users",
								localField: "userAddress",
								foreignField: "curraddress",
								as: "user"
							}
						},{
              $unwind:{
                path:'$user',
                preserveNullAndEmptyArrays:true
              }
            },{
              $project:{
                _id:1,
                userAddress:1,
                followerAddress:1,
                timestamp:1,
                user:{
                  _id:'$user._id',
                  name:'$user.name',
                  image:'$user.image',
                  customurl:'$usercustomurl',
                  bio:'$user.bio',
                  curraddress:'$user.curraddress'
                }
              }
            }
					]
				)

			}
			////console.log(">>>following",JSON.stringify(data))
			return res.json({
				success: true,
				list: data,
			});
		}catch(err) {
      ////console.log(">>>following",JSON.stringify(err))
	
			return res.json({
				err: err,
				success: false,
				msg: "Error on server",
			  });
		}
	}
	export const followUnfollow = async (req, res) => {
		var reqBody = req.body;
		var { curraddress , followeraddress } = reqBody
		var isFollow = await FollowerDB.find( {userAddress : curraddress, followerAddress : followeraddress});
		//////console.log(isEmpty(isFollow));
		if (!isEmpty(isFollow)) {
			var unfollow = await FollowerDB.remove( {userAddress : curraddress, followerAddress : followeraddress});
      await ActivityHelper.save({
        createData: {
          action: 'unfollow',
          from: followeraddress,
          to:curraddress,
          activity:' UnFollowed ',
          // tokenCounts: tokenCounts
        }
      });
			return res.json({
				success: true,
				message : "Unfollow"
			});
		} else {
			var follow = new FollowerDB( { userAddress :  curraddress , followerAddress : followeraddress })
			var data = await follow.save();
      await ActivityHelper.save({
        createData: {
          action: 'follow',
          from: followeraddress
          
          ,
          to:curraddress,
          activity:' Followed ',
          // tokenCounts: tokenCounts
        }
      });
			//////console.log('save',data);
			return res.json({
				success: true,
				message : "Follow"
			});
		}
	}
	
	export const checkFollower = async(req,res) => {
		var reqBody = req.body;
		var { curraddress , followeraddress } = reqBody
		var isFollow = await FollowerDB.find( {userAddress : curraddress, followerAddress : followeraddress});
	
		if (!isEmpty(isFollow)) {
			return res.json({
				success: true,
				message : "Unfollow"
			});
		} else {
			return res.json({
				success: true,
				message : "Follow"
			});
		}
	}
  export const Activity = async (req, res) => {
    var RetData = {};
    var ReqBody = req.body;
    var ReqParams = req.params;
  
    var addr = ReqBody.addr;
  
    var limitQuery = {};
    if(ReqParams.from == 'header') {
      limitQuery.limit = 10;
    }
  
    var findData = {
      tokenOwner:addr,
      balance: {$gt:0}
    };
  
    //////console.log('limitQuery : ', limitQuery, 'findData : ', findData);
  
    TokenOwnerDb.find(findData, {}, limitQuery, (err, respData) => {
      var tokenCounts = [];
      for (let i = 0; i < respData.length; i++) {
        const element = respData[i];
        tokenCounts.push(element.tokenCounts);      
      }
      var matchData = {};
      matchData.status = 'new';
      // matchData.tokenCounts = {$in : tokenCounts};
      matchData.to = {$eq : addr};
  
      // matchData['$or'] = [
      //   { tokenCounts : {$in : tokenCounts} },
      //   { to : {$eq : addr} }
      // ];
  
      //////console.log('matchData : ', matchData);
  
      var query = [
        {
          $match : matchData
        },
        {
          $lookup: {
            from: "users",
            localField: "from",
            foreignField: "curraddress",
            as: "from_users"
          },
        },
        {
          $unwind: {
            path: '$from_users',
            preserveNullAndEmptyArrays: true,
          }
        },
        {
          $lookup: {
            from: "tokens",
            localField: "tokenCounts",
            foreignField: "tokenCounts",
            as: "tokens"
          },
        },
        {
          $unwind: {
            path: '$tokens',
            preserveNullAndEmptyArrays: true,
          }
        },
      ]
      ActivityDb.aggregate(query, (err, respData) => {
        if(respData) {
          RetData.list = respData;
        }
        res.json(RetData);
      });
    });
  }
  
 