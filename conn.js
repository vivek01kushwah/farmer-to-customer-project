const mongoose = require('mongoose');

mongoose.set('strictQuery',false);
mongoose.connect('mongodb://127.0.0.1:27017/myFirst', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
}).then(() => {
    console.log("database connectivity succesfull");
}).catch((err) => {
    console.log("connection not established", err);
})

