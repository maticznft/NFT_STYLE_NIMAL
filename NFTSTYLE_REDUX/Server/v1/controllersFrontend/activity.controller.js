import e from 'express';
import fs from 'fs'
import path from 'path'
import mongoose, {now} from 'mongoose';

const async = require("async");

const ObjectId = mongoose.Types.ObjectId;

const Config = require(path.resolve('./config/config')).default;

// const Activity = require(path.resolve('./models/activiy'));
import Activity from '../../models/activity'

export const activityUpdate = async (req, res) => {

    // routes.post('/activityUpdate', (req, res) => {
      var reqBody=req.body
      //console.log(reqBody)
      var activity = new Activity({
        owner:reqBody.owner,
        user:reqBody.user,
        activity:reqBody.activity,
        icon:reqBody.icon,
        link:reqBody.link
      })
      activity.save()
      .then((data)=>{
        res.json(data)
      })
      .catch((e)=>{
       res.json(e)
      })
     }