var mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/myFirst")
  .then(() => {
    console.log("database connectivity successfull");
  })
  .catch((err) => {
    console.log("something error came to connect database", err);
  });

var productSchema = new mongoose.Schema({
  vendorName: String,
  productName: String,
  gender: String,
  productQuantity: Number,
  productCost: Number,
  productDesc: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model("CollectionOfProduct", productSchema);
