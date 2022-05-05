
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
var mongoose =require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let replyschema = mongoose.Schema({ 
	message_query:{
		type:String
	},
	replytype:{
		type:String    // admin or user
	},
	replyby:{
		type: mongoose.Schema.Types.ObjectId
	},
	query_image:{
		type: String
	},
	replydate:{
		type:Date,default: Date.now
	}
});

const SupportSchema = mongoose.Schema({
  

  
	type : {
        type: String,
        default:""
    },
    alternativeEmail: {
		type: String,
		default:""
    },
    supportMessage: {
        type: String,
        default: ""
	},
	// adminDescription : {
	// 	type: String, 
	// 	default: ""	 // withdraw deposit adminCommision
  //   },
  //   userDescription : {
	// 	type: String, 
	// 	default: ""	 // withdraw deposit adminCommision
	// },
	ticketStatus:{
		type:String,
		default:'open'
	},
  userid:{
    type: Schema.Types.ObjectId,
    ref: "users"
  },
    ticketId:{
      type:Number,
      default:''
    },
    reply:[replyschema],
    createdAt: {
        type: Date,
        default: Date.now
    },
  
})

const Support = mongoose.model("Support", SupportSchema,"Support");

exports.module= Support;