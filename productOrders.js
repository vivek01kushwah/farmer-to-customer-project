const mongoose = require('mongoose');
const myschemaOrder = new mongoose.Schema({
   username: {
      type: String,
      required : true      
   },
  address:{
    type: Object,
    required : true
  }
})
const mymodelOrder = new mongoose.model("orders", myschemaOrder);   //mymodel naam ka table ban jaayega wahan
module.exports = mymodelOrder;