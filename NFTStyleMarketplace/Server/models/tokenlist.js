import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TokenlistSchema = new Schema({
    tokenAddress: {
    type: String,
    required: true
  },
  tokenSymbol: {
    type: String,
    required: true
  }
});

TokenlistSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

TokenlistSchema.set("toJSON", {
  virtuals: true,
});
TokenlistSchema.methods.generateJWT = function (payload) {
  var token = jwt.sign(payload, config.secretOrKey);
  return `Bearer ${token}`;
};
module.exports = mongoose.model("tokenlist", TokenlistSchema, "tokenlist");
