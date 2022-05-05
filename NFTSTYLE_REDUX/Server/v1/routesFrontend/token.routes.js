import express from 'express';
import passport from 'passport'
const router = express();

import * as TokenCtrl from '../controllersFrontend/token.controller';
import * as ActivityCtrl from '../controllersFrontend/activity.controller';
const passportAuth = passport.authenticate("usersAuth", { session: false });
router.route('/count/get').get(TokenCtrl.CountGet);
router.route('/category/list').get(TokenCtrl.CategoryList);
router.route('/add/item/validation').post(passportAuth,TokenCtrl.AddItemValidation);
router.route('/add/item').post(passportAuth,TokenCtrl.AddItem);
router.route('/add/owner').post(passportAuth,TokenCtrl.AddOwner);
router.route('/like').post(passportAuth,TokenCtrl.Like);
router.route('/like/list').post(TokenCtrl.LikeList);
router.route('/price/change').post(passportAuth,TokenCtrl.TokenPriceChange);
router.route('/purchase/complete').post(passportAuth,TokenCtrl.PurchaseComplete);
router.route('/collectibles/list/myitems').post(TokenCtrl.MyItems_CollectiblesList);
router.route('/collectibles/list/home').post(TokenCtrl.Home_CollectiblesList);
router.route('/collectibles/list/follow').post(TokenCtrl.Follow_CollectiblesList);
router.route('/tokenCounts').post(TokenCtrl.TokenCounts);
router.route('/bid/apply').post(passportAuth,TokenCtrl.BidApply);
router.route('/bid/accept').post(passportAuth,TokenCtrl.BidAccept);
router.route('/bid/cancel').post(passportAuth,TokenCtrl.BidCancel);
router.route('/collectibles/list/newHome').post(TokenCtrl.Home_New_CollectiblesList);
router.route('/test/activityUpdate').post(ActivityCtrl.activityUpdate);
router.route('/home/topCreatorsApi').get(TokenCtrl.topCreatorsApi); //get user,collection,creator calclation
router.route('/create/ipfsImageHashGet').post(passportAuth,TokenCtrl.ipfsImageHashGet);
router.route('/report/reportFunc').post(passportAuth,TokenCtrl.reportFunc);
router.route('/social/sociallinksfunction').get(TokenCtrl.sociallinksfunction);
router.route('/social/faqlists').get(TokenCtrl.faqlists);
router.route('/null_time_auction').post(TokenCtrl.null_time_auction);

router.route('/notifications').post(TokenCtrl.notifications);
router.route('/notificationStatusChange').post(TokenCtrl.notificationStatusChange);

router.route('/TokenImageCalls').post(TokenCtrl.TokenImageCalls);

router.route('/timeAuctionFunction').post(TokenCtrl.timeAuctionFunction);
router.route('/getSearchList/').post(TokenCtrl.getSearchList);
router.route('/ActivityCall').post(TokenCtrl.ActivityCall);

router.route('/use/getcmslistinhome').post(TokenCtrl.getcmslistinhome);
router.route('/ipfsmetadata').post(passportAuth,TokenCtrl.IpfsMetadata);

router.route('/burns/burnToken').post(passportAuth,TokenCtrl.burnToken);
router.route('/tranfer/complete').post(passportAuth,TokenCtrl.TransferComplete);
router.route('/show/top').get(TokenCtrl.ShowTop);
router.route('/user/ApproveChecked').post(TokenCtrl.ApproveChecked);

router.route('/user/AskApproved').post(TokenCtrl.AskApproved);
router.route('/user/ApproveCh').post(TokenCtrl.ApproveCh);
router.route('/user/approvefalse').post(TokenCtrl.approvefalse);
router.route('/findAndUpdataBalance').post(passportAuth,TokenCtrl.findAndUpdataBalance);
router.route('/tokenOption').get(TokenCtrl.TokenOptionList);


export default router;