const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let cmsimage = new Schema({
	Name:{
		type:String
	},
	Size:{
		type:String,
	},
	deleted:{
		type:Number,
		default:0
	},
	created_date:{
		type:Date,
		default: Date.now
	},
});
module.exports = mongoose.model('cmsimage',cmsimage,'cmsimage');
