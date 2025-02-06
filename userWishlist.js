var mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/myFirst').then(()=>{
    console.log("database connectivity successfull");
}).catch((err)=>{
    console.log("something error came to connect database",err);
})

  
var wishlist = new mongoose.Schema({
    wishlist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollectionOfProduct'
    }]
});
 

 
module.exports = new mongoose.model('users', wishlist);
