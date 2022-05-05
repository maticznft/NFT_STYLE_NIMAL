import mongoose from 'mongoose';
// require('mongoose-double')(mongoose);
const Double = require('@mongoosejs/double');

import jwt from 'jsonwebtoken';
// import Double from 'bson';
import config from '../config/config';

const Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types
const ObjectId = Schema.ObjectId;

var TokenSchema = mongoose.Schema({
    image: {
        type: String,
        default:'',
    },
    tokenCounts: {
        type: Number,
        required: true,
    },
    tokenName: {
        type: String,
        required: true,
    },
    swapPrice: {
        type: Number,
        default: 0
    },
    tokenDesc: {
        type: String,
        default: ""
    },
    tokenPrice: {
        type: Double,
        default: 0
    },
    tokenRoyality: {
        type: Number,
        required: true,
    },
    tokenCategory: {
        type: String,
        default: "",
    },
    tokenBid: {
        type: Boolean,
        default: "",
    },
    tokenProperty: {
        type: String,

    },
    tokenOwner: {
        type: String,
        required: true,
    },
    tokenCreator: {
        type: String,
        required: true,
    },
    likecount: {
        type: Number,
        default: 0,
    },
    hashValue: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: '',
    },
    deleted: {
        type: Number,
        default: 1, // 1 Active 0 Deleted
    },
    categoryid: {
        type: Schema.Types.ObjectId,
        default: "",
        ref: "category",
    },
    tokenQuantity: {
        type: Number,
        default: 1
    },
    balance: {
        type: Number,
        default: 1
    },
    contractAddress: {
        type: String,
        default:1
    },
    type: {
        type: Number,
        default: 1
    },
    minimumBid: {
        type: Double,
        default: 0
    },
    endclocktime: {
        type: Date,
        default: ''
    },
    clocktime: {
        type: Date,
        default: ''
    },
    unlockcontent: {
        type: String,
        default: ""
    },
    counts: {
        type: Number,
        default:0
    },
    PutOnSale: {
        type: Boolean,
        default:false
    },
    PutOnSaleType: {
        type: String,
        default:''
    },
    ipfsimage: {
        type: String,
        default:''
    }, 
     burnToken:{
        type: Number,
        default: 0 
    },
    CoinName: {
        type: String,
        default:''
    }, 
    additionalImage:{
        type: String,
        default:''  
    },
    timestamp: { type: Date, default: Date.now }
});

TokenSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

TokenSchema.set("toJSON", {
    virtuals: true,
});

TokenSchema.methods.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
};

var Token = mongoose.model("token", TokenSchema);
module.exports = Token;



