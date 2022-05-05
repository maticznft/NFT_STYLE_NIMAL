// var package
import mongoose from  'mongoose';
import jwt from  'jsonwebtoken';

// var lib
import config from '../config/config';

const Schema = mongoose.Schema;

const ApproveSchema = new Schema({
   
    curraddress: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    Approved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },checkApprove:{
        type: String,
        default: ""
    }
})

ApproveSchema.methods.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    console.log("checkkk model",token)
    return `Bearer ${token}`;
};

const approve = mongoose.model("approve", ApproveSchema, "approve");
export default approve;