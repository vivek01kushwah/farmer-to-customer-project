require("dotenv").config();
require("./conn");
const express = require("express");
let alert = require("alert");
const multer = require("multer");
const app = express();
const path = require("path");
const ejs = require("ejs");
const passport = require('passport')
const bodyParser = require("body-parser");
const modelmerahai = require("./schema");
const modelVendor = require("./schemaVendor");
const productModel = require("./productModel");
const mymodelOrder = require("./productOrders");
const UserVerification= require('./UserVerification');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const cors= require('cors');
require('./passport-setup');
app.use(cors());
const session = require('express-session');
const {v4:uuidv4}= require('uuid');
const nodemailer= require('nodemailer');
const fs = require("fs");
// var url = require("url");
// const braintree = require("braintree");
const User= require("./users")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(require('express-session')({ 
  secret: 'Enter your secret key',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    secret:"my secret key",
    saveUninitialized:true,
    resave:false,
  })
);

app.use((req,res,next)=>{
  res.locals.message;
  delete  req.session.message;
  next();
})

const port = 5000;
 
 
// this is to print the typed data that comes from signup page
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//to add static file as css,images,javascript etcetera
app.use(express.static(path.join(__dirname, "views")));
const paymentController = require("./controllers/paymentController");

//this is to get the page into server
app.get('/review/:productId',async (req,res)=>{
  // res.send("HOME PAGE");
  
  const id= req.params.productId;
  const data = await productModel.findOne({ _id:id });

  res.render('index',{id:id,records:data.productName});
    // this is used for render views page(user interface page like ejs page): index - file name of the ejs file
                          // and in the second bracker we pass value of the ejs variable "title" which is used in index page in title portion.
})
app.get("/", (req, res) => {
  
  productModel.find({}, (err, records) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      
      res.render("ecom.ejs", { records: records }); //ecommerce  ejs file hai
      
    }
  });
});
app.get("/male",(req,res)=>{
  productModel.find({gender:"male"}, (err, records) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      
      res.render("male.ejs", { records: records }); //ecommerce  ejs file hai
      
    }
  });
});
app.get("/female",(req,res)=>{
  productModel.find({gender:"female"}, (err, records) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      
      res.render("female.ejs", { records: records }); //ecommerce  ejs file hai
      
    }
  });
});


app.get("/signUpUser", (req, res) => {
  
  res.render("signUpUser");
});
app.get("/loginUser", (req, res) => {
  res.render("loginUser");
});
app.get("/loginVendor", (req, res) => {
  res.render("loginVendor");
});
app.get("/signUpVendor", (req, res) => {
  res.render("signUpVendor");
});
app.get("/payment", (req, res) => {
  res.render("payment");
});
app.get("/searchPageResult", (req, res) => {
  res.render("searchPageResult");
});
// this is to post the login form
app.post("/loginUser", async (req, resp) => {
  try {
    const data = await modelmerahai.findOne({ email: req.body.email });
    // console.log (data);
    number=data.addToCart.length;
    const validated = await bcrypt.compare(req.body.password, data.password);
    if (validated==true) {
      console.log("USER VERIFIED  succesfully");

      productModel.find({}, (err, records) => {
        if (err) {
          console.log(err);
          resp.status(500).send("An error occurred", err);
        } else {
          resp.render("ecom", { records: records,number }); //ecommerce ejs file hai
        }
      });
    } else if (!validated) {
      alert("password doesn't matched");
      resp.render("loginUser");
    } else {
      console.log("email is not correct ");
      message= "email is not correct"
      alert(message);
      resp.render("loginUser");
    }
  } catch (err) {
    console.log(err);
    resp.render("loginUser");
    alert("Entered Email is Not Correct");
  }
});

//this is to post the signup form
app.post("/signUpUser", async (req, resp) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const data = {
      email: req.body.email,
      name: req.body.name,
      password: hashedPass,
      
      gender: req.body.gender,
    };

    if (req.body.password === req.body.confirmpassword) {
      const modelling = new modelmerahai(data);
      
      const result = await modelling.save();
      resp.status(201).render("loginUser");
    } else {
      console.log("both the password doesn't matched");
      alert("both the password doesn't matched");
    }
  } catch (err) {
    console.log(err);
    resp.status(400).send("something error goes on");
  }
});
// get the cart page
app.get("/productAddress/:userEmail", async (req, res) => {
  const userEmail = req.params.userEmail;

  try {
    const myObjectId = await modelmerahai.findOne({ email: userEmail });

    if (myObjectId) {
      productModel.find({ _id: myObjectId.addToCart }, (err, records) => {
        if (err) console.log(err);
        else {
          res.render("cart", { records: records });
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// Post vendor login form
app.post("/loginVendor", async (req, resp) => {
  try {
    const vendorData = await modelVendor.findOne({ email: req.body.email });
    const validated = await bcrypt.compare(req.body.password, vendorData.password);
    if (
      validated==true &&
      vendorData.mobile == req.body.mobile
    ) {
      console.log("FARMER VERIFIED  succesfully");
      productModel.find({ vendorName: req.body.email }, (err, records) => {
        if (err) {
          console.log(err);
          resp.status(500).send("An error occurred", err);
        } else {
          resp.render("vendor", { records: records, vendor: vendorData }); //vendorSection ejs file hai
        }
      });
    } else if (!validated) {
      alert("password doesn't matched");
      resp.render("loginVendor");
    } else if (req.body.mobile != vendorData.mobile) {
      console.log("mobile no. is not correct ");
      alert("mobile is not correct");
      resp.render("loginVendor");
    }
  } catch (err) {
    console.log(err);
    resp.render("loginVendor");
    alert("Entered Email is Not Correct");
  }
});

//this is to post the signup Vendor form
app.post("/signupVendor", async (req, resp) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const vendorData = {
      email: req.body.email,
      name: req.body.name,
      aadhar: req.body.aadhar,
      city: req.body.city,
      mobile: req.body.mobile,
      password: hashedPass,
      
    };

    if (req.body.password === req.body.confirmpassword) {
      const modelling = new modelVendor(vendorData);
      const result = await modelling.save();
      resp.status(201).render("loginVendor");
    } else {
      console.log("both the password doesn't matched");
      alert("both the password doesn't matched");
      resp.status(201).render("signUpVendor");
    }
  } catch (err) {
    console.log(err);
    resp.status(400).send("something error goes on");
  }
});
// --------razorpay---------------
app.post(
  "/productAddress/userEmail/createOrder",
  paymentController.createOrder
);
// The PRODUCT  upload karna hai yahan se

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now());
  },
});
const upload = multer({ storage: storage });

//VENDOR SECTION or upload product

app.post("/vendorSection", upload.single("avatar"), async (req, res, next) => {
  var obj = {
    vendorName: req.body.email,
    productName: req.body.productName,
    gender: req.body.gender,
    productQuantity: req.body.productQuantity,
    productCost: req.body.productCost,
    productDesc:req.body.productDesc,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: req.file.filename,
    },
  };
  try {
    const item = await productModel.create(obj);
    // The alert will only execute when the productModel.create operation is complete
    res.json({ message: "Product added to wishlist" });
    alert("Product added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding product to wishlist" });
  }
  // productModel.create(obj, (err, item) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     //productModel.obj.save();
  //     res.json({ message: "Product added to wishlist" });
  //     alert("product added successfully");
  //     // res.redirect("/loginVendor"); // vendorSection is HTML/ejs FILE HAI
  //   }
  // });
});
//buy product
app.post("/buyProduct", async (req, resp) => {
  try {
    const productInDB = await productModel.findOne({});
    console.log(productInDB.productQuantity);
    console.log(req.body.buyQuantity);
    var remainderQuantity = productInDB.productQuantity - req.body.buyQuantity;
    var q = url.parse(req.url, true);
    console.log("buy now id " + req.query.id);
    var update = await productModel.updateOne(
      { _id: req.query.id },
      {
        $set: { productQuantity: remainderQuantity },
      }
    );
    resp.render("addressPizza");
  } catch (err) {
    console.log("this is not true" + err);
  }
});

//DELETE PRODUCT FROM VENDOR (ONLY VENDOR CAN DELETE PRODUCT)

app.post("/deleteProduct", async (req, resp) => {
  const id = req.body.productId;
  console.log(id);
  console.log(req.body.vendorDeleteEmail)
  
  const res = await productModel.deleteOne({ _id: id });
  if (res) {
    console.log(req.body.vendorDeleteEmail);
    productModel.find(
      { vendorName: req.body.vendorDeleteEmail },
      (err, records) => {
        if (err) {
          console.log(err);
          resp.status(500).send("An error occurred", err);
        } else {
          console.log("no error");
          
          resp.render("vendor", { records: records }); //vendorSection ejs file hai
        }
      }
    );
  }
});

//ADD TO CART
// app.post("/productAddress", async (req, res) => {
//   console.log(req.body);
//   const selectedProductId = req.body.selectedProductId;
//   const selectedProduct = req.body.selectedProduct;
  
//   const userNameForAddToCart = req.body.userNameForAddToCart;
//   console.log(selectedProduct);
//   console.log("userAddToCart name is:" + userNameForAddToCart);

  
//   const resu = await modelmerahai.findOneAndUpdate(
//     { email: userNameForAddToCart },
//     { $addToSet: { addToCart: selectedProductId } }
//   );

//   if (resu) {
//     res.redirect("/");
//   }
// });
app.post("/productAddress/:productId", async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.body;

  try {
    const user = await modelmerahai.findOne({ email: userId });
    const product = await productModel.findById(productId);
    console.log("userwishlist name is:" + userId);
    if (!user || !product) {
      return res.status(404).json({ error: "User or product not found" });
    }

    // Check if the product is already in the wishlist

    const resu = await modelmerahai.findOneAndUpdate(
      { email: userId },
      { $addToSet: { addToCart: productId } }
    );

    if (resu) {
      res.json({ message: "Product added to wishlist" });
      console.log("product added succesfully");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// delete from add to cart
app.post("/deleteFromAddToCart", async (req, resp) => {
  const username = req.body.usernameForAddToCart;
  const productIdForAddToCart = req.body.productIdForAddToCart;
  const myRes = await modelmerahai.updateOne(
    { email: username },
    { $pull: { addToCart: productIdForAddToCart } }
  );
  if (myRes) {
    const myObjectIdWhenDelete = await modelmerahai.findOne({
      email: username,
    });
    console.log(myRes.addToCart);
    if (myObjectIdWhenDelete) {
      productModel.find(
        { _id: myObjectIdWhenDelete.addToCart },
        (err, records) => {
          if (err) console.log(err);
          else {
            resp.render("cart", { records: records });
          }
        }
      );
    }
  }
});
app.post("/addtocartPayment", async (req, resp) => {
  var orderUsername = req.body.orderUsername;
  console.log(orderUsername);

  const data = {
    username: req.body.orderUsername,
    address: {
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
    },
  };
  const orderModel = new mymodelOrder(data);
  const orderModelResult = await orderModel.save();
  resp.render("payment");
});

// app.post("/searchBar", async (req, resp) => {
//   var countOfMatched = req.body.countOfMatched;
//   var productNameOnSearch = req.body.myname;
//   console.log(productNameOnSearch);
//   console.log(productNameOnSearch[0]);
//   let arr = new Array(countOfMatched);
//   for (var i = 0; i < countOfMatched; i++) {
//     arr[i] = await productModel.find({
//       productName: { $in: productNameOnSearch[i] },
//     });
//   }
//   resp.render("searchPageResult", { records: arr });
// });

// ----------wishlist Feature--------------------------------------------------

// get product page
app.get("/wishlist/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const myObjectId = await modelmerahai.findOne({ email: userId });

    if (myObjectId) {
      productModel.find({ _id: myObjectId.addToWishlist }, (err, records) => {
        if (err) console.log(err);
        else {
          res.render("wishlist", { records: records });
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// Add product to wishlist
app.post("/add-to-wishlist/:productId", async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.body;

  try {
    const user = await modelmerahai.findOne({ email: userId });
    const product = await productModel.findById(productId);
    console.log("userwishlist name is:" + userId);
    if (!user || !product) {
      return res.status(404).json({ error: "User or product not found" });
    }

    // Check if the product is already in the wishlist

    const resu = await modelmerahai.findOneAndUpdate(
      { email: userId },
      { $addToSet: { addToWishlist: productId } }
    );

    if (resu) {
      res.json({ message: "Product added to wishlist" });
      console.log("product added succesfully");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Delete product to wishlist
app.post("/deleteFromAddToWishlist", async (req, resp) => {
  const username = req.body.usernameForAddToWishlist;
  const productIdForAddToWishlist = req.body.productIdForAddToWishlist;
  const myRes = await modelmerahai.updateOne(
    { email: username },
    { $pull: { addToWishlist: productIdForAddToWishlist } }
  );
  if (myRes) {
    const myObjectIdWhenDelete = await modelmerahai.findOne({
      email: username,
    });
    console.log(myRes.addToWishlist);
    if (myObjectIdWhenDelete) {
      productModel.find(
        { _id: myObjectIdWhenDelete.addToWishlist },
        (err, records) => {
          if (err) console.log(err);
          else {
            resp.render("wishlist", { records: records });
          }
        }
      );
    }
  }
});
// ----------search------------
app.post('/search', async (req, res) => {
  const searchTerm = req.body.searchTerm.toLowerCase();
  const filteredProducts = await productModel.find({ productName: { $regex: searchTerm, $options: 'i' } });

  // Render the searchResults.ejs template
  res.render('ind.ejs', { records: filteredProducts, searchTerm });
});
// -----------------google auth----------------
app.get('/done',(req,res)=>{
  productModel.find({}, (err, records) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.render("ecom", { records: records, name:req.user.displayName,email:req.user.emails[0].value }); //ecommerce ejs file hai
    }
  });
})
app.get('/google',passport.authenticate('google',{scope:['profile','email'] }));

app.get('/google/callback',passport.authenticate('google',{failureRedirect:'/failed'})
,function(req,res){
    res.redirect('/done');
});
// -------------------------email authentication
let transporter= nodemailer.createTransport({
  service: "gmail",
  auth:{
      user:process.env.AUTH_EMAIL,
      pass:process.env.AUTH_PASS,
  }
})

transporter.verify((error,success)=>{
  if(error){
      console.log(error);
  } else{
      console.log("ready for msg");
      console.log(success);
  }
})
app.post('/signup', (req,res)=>{
  let{name,email,password,gender}=req.body;
 

  modelmerahai.find({email}).then(result =>{
          if(result.length){
            message= "user with provided mail exists"
            alert(message);
              // res.json({
              //     status: "failed",
              //     message: "user with provided mail exists"
              // })
          }
          else{
              const saltRounds=10;
              bcrypt.hash(password,saltRounds).then(hashedPassword=>{
                  const newUser= new modelmerahai({
                      name,
                      email,
                      password:hashedPassword,
                      gender,
                      verified:false,
                  });

                  newUser.save().then(result=>{

                    sendVerificationEmail(result,res);
                    console.log("verification mail send");

                    alert("verification mail sent")
                    // res.redirect('/loginUser')

                  }).catch(err=>{
                      console.error(err);
                      message= "user account saving failure"
                      alert(message);
                      // res.json({
                      //     status: "failed",
                      //     message: "user account saving failure",
                      // });
                  })
              }).catch(err=>{
                  res.json({
                      status: "failed",
                      message: "error for hashing password"
                  })
              })
          }
      }).catch(err =>{
          console.log(err);
          res.json({
              status: "failed",
              message: "error for existing user check"
          })
      })
  
})
const sendVerificationEmail=({_id,email},res)=>{
  const currentUrl= "http://localhost:5000/";

  const uniqueString= uuidv4()+ _id;

  const mailOptions={
      from:process.env.AUTH_EMAIL,
      to:email,
      subject: "Verify Your Account",
      html: `<p> Verify your email address to complete the signup and login into your account</p> <p>this link <b>expires in 6 hours</b>.</p> <p>Press <a href=${currentUrl +"user/verify/"+_id+"/"+uniqueString}>here</a> to proceed and login.</p>`,
  };
  //hash uniquestring
  const saltRounds=10;
  bcrypt.hash(uniqueString,saltRounds)
  .then((hashedUniqueString)=>{
      const newVerification= new UserVerification({
          userId:_id,
          uniqueString:hashedUniqueString,
          createdAt:Date.now(),
          expiresAt:Date.now()+21600000,
      });
      newVerification.save()
      .then(()=>{
          transporter
          .sendMail(mailOptions)
          .then(()=>{
            res.render("loginUser");
              // res.json({
              //     status:"pending",
              //     message:"verification email sent",
              // });
          })
          .catch((error)=>{
              console.log(error);
              res.json({
                  status:"Failed",
                  message:"verification email failed",
              });
          })
      })
      .catch((error)=>{
          console.log(error);
          res.json({
              status:"Failed",
              message:"couldnot save verification mail data",
          });
      })
  })
  .catch(()=>{
      res.json({
          status:"Failed",
          message:"error hashin email",
      });
  })
};
app.get("/user/verify/:userId/:uniqueString",(req,res)=>{
  console.log("USER VERIFIED 01");
    let{userId,uniqueString}= req.params;
    UserVerification
    .find({userId})//CHANGEEEEEEEEEEEEEEEEEEEEEEEEEEE 
    .then((result)=>{
        if(result.length>0){

            const{expiresAt} = result[0];
            const hashedUniqueString= result[0].uniqueString;
            if(expiresAt<Date.now()){
                UserVerification
                .deleteOne({userId})
                .then(result=>{
                    modelmerahai.deleteOne({_id: userId})
                    .then(()=>{
                        let message = "link has expired please sign in again";
                        res.redirect(`/user/verified?error=true&message=${message}`);
                    })
                    .catch(error =>{
                        let message = "Clearing user with expired unique string faILED";
                        res.redirect(`/user/verified?error=true&message=${message}`);
                    })
                })
                .catch((error)=>{
                    consolele.log(error);
                    let message = "error occurred while clearing expired user verification";
                    res.redirect(`/user/verified?error=true&message=${message}`);

                })
            } else{
                bcrypt.compare(uniqueString,hashedUniqueString)
                .then(result=>{
                    if(result){
                        modelmerahai.updateOne({_id: userId},{verified:true})
                        .then(()=>{
                            UserVerification.deleteOne({userId})
                            .then(()=>{
                                // res.sendFile(path.join(__dirname,"./../views/verified.html"));
                                res.redirect('/loginUser');
                            })
                            .catch(error=>{
                                let message = "error occurred while finalizing succesful verification";
                                res.redirect(`/user/verified?error=true&message=${message}`);
                            })
                        })
                        .catch(error=>{
                            console.log(error);
                            let message = "error occurred while updating user record";
                            res.redirect(`/user/verified?error=true&message=${message}`);
                        })
                    } else{
                        let message = "Invalid verification details,check inbox";
                        res.redirect(`/user/verified?error=true&message=${message}`);
                    }
                })
                .catch(error=>{
                    let message = "error occurred while comparing strings";
                    res.redirect(`/user/verified?error=true&message=${message}`);
                })
            }
        }else{
            let message = "Account record doesn't exists or has been verified earlier, please sign up or log in";
            res.redirect(`/user/verified?error=true&message=${message}`);

        }
    })
    .catch((error)=>{
        console.log(error);
        let message = "error occurred while checking for existing user verification";
        res.redirect(`/user/verified?error=true&message=${message}`);
        
    })

});
app.get('/verified',(req,res)=>{
  productModel.find({}, (err, records) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.render("ecom", { records: records}); //ecommerce ejs file hai
    }
  });
})
app.post('/signin', (req,res)=>{
  let{email,password}=req.body;
     modelmerahai.find({email})
      .then(data=>{
          if (data.length){
              if(!data[0].verified){
                message="email has not verified yet, check your inbox"
                window.alert(message);
                res.render("loginUser");
                  
              } else{
                  const hashedPassword= data[0].password;
                  bcrypt.compare(password,hashedPassword).then(result=>{
                      if(result){
                        
                        productModel.find({}, (err, records) => {
                          if (err) {
                            console.log(err);
                            res.status(500).send("An error occurred", err);
                          } else {
                            res.render("ecom", { records: records }); //ecommerce ejs file hai
                          }
                        });
                      }else{
                        message="invalid password enetered"
                        window.alert(message)
                        // alert(message)
                        res.render("loginUser");
                          // res.json({
                          //     status: "failed",
                             
                          // })
                      }
                  }).catch(err=>{
                    message= "error comparing passwords"
                    window.alert(message)
                    // alert(message)
                    res.render("loginUser");
                      // res.json({
                      //     status:"failed",
                      // message: "error comparing passwords"
                      // })
                  })
              }

          }else{
            message="invalid credentials"
            window.alert(message)
            // alert(message);
            res.redirect("/loginUser");
              // res.json({
              //     status:"failed",
              //     message:"invalid credentials"
              // })
          }
      }).catch(err=>{
        message="an error occured while checking for existing user"
        // window.alert(message)
      alert(message)
      res.render("loginUser");
          // res.json({
          //     status:"failed",
          //     message:"an error occured while checking for existing user"
          // })
      })
  
})
// ------------------review----------------------
app.post('/submit_rating', async (req, res) => {
  try {
      const { rating_data, user_name, user_review, product_id } = req.body;

      const newUser = new User({
          rating_data: rating_data,
          user_name: user_name,
          user_review: user_review,
          product_id: product_id, // Set the product ID
      });

      await newUser.save();

      res.status(201).send('Review submitted successfully.');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});
app.get('/fetch_ratings/:product_id', async (req, res) => {
  try {
      const { product_id } = req.params;

      // Query the database to retrieve reviews for the specified product ID
      const reviews = await User.find({ product_id: product_id }, 'user_name user_review rating_data created')
          .sort({ created: 'desc' });

      let average_rating = 0;
      let total_review = 0;
      let five_star_review = 0;
      let four_star_review = 0;
      let three_star_review = 0;
      let two_star_review = 0;
      let one_star_review = 0;
      let total_user_rating = 0;

      const review_content = [];

      reviews.forEach((review) => {
          review_content.push({
              user_name: review.user_name,
              user_review: review.user_review,
              rating: review.rating_data,
              datetime: review.created,
          });

          switch (review.rating_data) {
              case 5:
                  five_star_review++;
                  break;
              case 4:
                  four_star_review++;
                  break;
              case 3:
                  three_star_review++;
                  break;
              case 2:
                  two_star_review++;
                  break;
              case 1:
                  one_star_review++;
                  break;
          }

          total_review++;
          total_user_rating += review.rating_data;
      });

      if (total_review > 0) {
          average_rating = total_user_rating / total_review;
      }

      const output = {
          average_rating: parseFloat(average_rating.toFixed(1)),
          total_review,
          five_star_review,
          four_star_review,
          three_star_review,
          two_star_review,
          one_star_review,
          review_data: review_content,
      };

      res.status(200).json(output);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});
// app.post("/actualAddress", (req, resp) => {
//   const myPrice = req.body.price;
//   resp.render("payment", { price: myPrice });
// });
// const gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox,
//   merchantId: "xf36tm9bj6sv4h4j",
//   publicKey: "qv7hycqjs2twytt9",
//   privateKey: "b9bdb1ada8f0cb29764e973767e6851b",
// });
// app.get("/client_token", (req, res) => {
//   gateway.clientToken.generate({}, (err, response) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.send(response.clientToken);
//     }
//   });
// });
// app.post("/checkout", (req, res) => {
//   const nonceFromTheClient = req.body.payment_method_nonce;
//   gateway.transaction.sale(
//     {
//       amount: "10.00",
//       paymentMethodNonce: nonceFromTheClient,
//       options: {
//         submitForSettlement: false,
//       },
//     },
//     (err, result) => {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.send(result);
//         console.log(result);
//       }
//     }
//   );
// });