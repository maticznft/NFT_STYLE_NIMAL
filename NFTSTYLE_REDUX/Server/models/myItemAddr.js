// import package
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// import lib
import config from '../config/config';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const myItemAddrSchema = new Schema({
        currAddress: {
                type: String,
                default: "",
        },
      
        deleted: {
                type: Number,
                default: 1, // 1 Active 0 Deleted
        },
        follow: {
                type: String,
                default: "",
        },
        following: [],
        followers: [],
        createdAt: {
                type: Date,
                default: Date.now,
        }
});

myItemAddrSchema.virtual("id").get(function () {
        return this._id.toHexString();
});

myItemAddrSchema.set("toJSON", {
        virtuals: true,
});

myItemAddrSchema.methods.generateJWT = function (payload) {
        var token = jwt.sign(payload, config.secretOrKey);
        return `Bearer ${token}`;
};

module.exports = mongoose.model("myItemAddr", myItemAddrSchema, "myItemAddr");
