const mongoose = require("mongoose");
const subscriberScheme = new mongoose.Schema({
  email : {
    type : String,
    required : true,
    unique : true,
    trim : true,
    lowercase: true
  },
  subcribedAt : {
    type : Date,
    default : Date.now
  },
});
module.exports = mongoose.model("Subscriber", subscriberScheme);
