const mongoose = require('mongoose');
const myVendorSchema = new mongoose.Schema({
   email: {
      type: String,
      unique: true,
      required:true
   },
   name: {
      type: String,
      required:true
   },
   aadhar: {
    type: Number,
    required:true
 },
 mobile: {
    type: Number,
    required:true
 },
   password: {
      type: String,
      required:true
   },
   
})
const myVendorModel = new mongoose.model("vendor", myVendorSchema);   //vendor naam ka table ban jaayega wahan
module.exports = myVendorModel;