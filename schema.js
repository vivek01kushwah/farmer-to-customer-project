const mongoose = require('mongoose');
const myschema = new mongoose.Schema({
   email: {
      type: String,
      unique: true,
      required: true
   },
   name: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
 
   gender:{
      type:String
   },
   verified:{
      type:Boolean
   },
   addToCart:[String],
   addToWishlist:[String]

})
const mymodel = new mongoose.model("user", myschema);   //mymodel naam ka table ban jaayega wahan
module.exports = mymodel;