// userController.js
const model = require("../model/user_register");
const bcrypt = require("bcrypt");



const helperFunction = require("../../helperFunctions/userHelper");
const productmodel = require("../model/product");
const Category = require("../model/category");
const Address = require("../model/address");
const Order = require("../model/order");

const productData = productmodel.products;

const userData = model.user_register;
let generatedOtp;
let user_name;
let emailId;
let mobile;
let address;
let password;

// Function to render views
const shop = async (req, res) => {
  try {
    const productDatas = await productData.find();
    const logged = req.session.user


    if (req.session.user) {
      const userDatas = req.session.user

      req.session.checkout = true

      const userId = userDatas._id
      // walletBalance=userDatas.wallet.balance
      const categoryData = await Category.find({ is_blocked: false });

      const user = await userData.findOne({ _id: userId }).populate({ path: 'cart' }).populate({ path: 'cart.product', model: 'productCollection' });
      const cart = user.cart;
      let subTotal = 0;

      cart.forEach((val) => {
        val.total = val.product.price * val.quantity;
        subTotal += val.total;
      });

      res.render("shop", { productDatas, userDatas, cart, subTotal, categoryData, message: "true" });
    }
    else {
      res.render("shop", { productDatas, logged, message: "false" });

    }





  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const index = async (req, res) => {
  try {
    const productDatas = await productData.find();
    const logged = req.session.user


    if (req.session.user) {
      const userDatas = req.session.user

      req.session.checkout = true

      const userId = userDatas._id
      // walletBalance=userDatas.wallet.balance
      const categoryData = await Category.find({ is_blocked: false });

      const user = await userData.findOne({ _id: userId }).populate({ path: 'cart' }).populate({ path: 'cart.product', model: 'productCollection' });
      const cart = user.cart;
      let subTotal = 0;
      console.log(user)
      console.log(cart)
      if (cart.length == 0) {
        return res.render("index", { productDatas, logged, message: "false" });
      } else {
        cart.forEach((val) => {
          val.total = val.product.price * val.quantity;
          subTotal += val.total;
        });
        res.render("index", { productDatas, userDatas, cart, subTotal, categoryData, message: "true" });
      }
    } else {
      res.render("index", { productDatas, logged, message: "false" });

    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const contact = async (req, res) => {
  try {
    const productDatas = await productData.find();
    const logged = req.session.user


    if (req.session.user) {
      const userDatas = req.session.user

      req.session.checkout = true

      const userId = userDatas._id
      // walletBalance=userDatas.wallet.balance
      const categoryData = await Category.find({ is_blocked: false });

      const user = await userData.findOne({ _id: userId }).populate({ path: 'cart' }).populate({ path: 'cart.product', model: 'productCollection' });
      const cart = user.cart;
      let subTotal = 0;

      cart.forEach((val) => {
        val.total = val.product.price * val.quantity;
        subTotal += val.total;
      });

      res.render("contact", { productDatas, userDatas, cart, subTotal, categoryData, message: "true" });
    } else {
      res.render("contact", { productDatas, logged, message: "false" });

    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }



};

const about = (req, res) => {
  res.render("about", { message: "" });
};



const my_account = async (req, res) => {


  try {

    if (req.session.user) {
      const userDatas = req.session.user;
      const userId = userDatas._id;
      const categoryData = await Category.find({ is_blocked: false });
      const addressData = await Address.find({ userId: userId });
      const orderData = await Order.find({ userId: userId });
      const productDatas = await productData.find();

      console.log("orderdata")
      console.log(orderData)

      //transactions data here
      req.session.checkout = true
      // walletBalance=userDatas.wallet.balance
      const user = await userData.findOne({ _id: userId }).populate({ path: 'cart' }).populate({ path: 'cart.product', model: 'productCollection' });
      const profilename = userDatas.user_name

      const cart = user.cart;
      let subTotal = 0;

      cart.forEach((val) => {
        val.total = val.product.price * val.quantity;
        subTotal += val.total;
      });
      res.render("my_account", { userDatas, orderData, categoryData, cart, addressData, profilename, message: "true", productDatas, subTotal });
    } else {
      res.render("my_account", { cart, addressData, profilename, message: "false" });

    }
  } catch (error) {
    console.log(error.message);
  }

};

const updateProfile = async (req, res) => {
  try {
    const userId = req.session.user;
    const updatedProfile = await userData.findByIdAndUpdate(
      userId,
      {
        user_name: req.body.user_name,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email,
      },
      { new: true }
    );



  } catch (error) {
    console.log(error);

  }
};







const wishlist = (req, res) => {
  res.render("wishlist");
};
const productDetails = async (req, res) => {
  const productId = req.query.id;

  try {
    const product = await productData.findById(productId);
    const image = product.imageUrl
    res.render("productDetails", { product, image, message: "" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// OTP Verification
const otp_verification = async (req, res) => {
  res.render("otp_verification", { message: "" });
};

const otp_verification_post = async (req, res) => {
  try {
    var txt1 = req.body.txt1;
    var txt2 = req.body.txt2;
    var txt3 = req.body.txt3;
    var txt4 = req.body.txt4;
    const EnteredOtp = txt1 + txt2 + txt3 + txt4;

    if (EnteredOtp === generatedOtp) {
      const securedPassword = await helperFunction.securePassword(password);

      const newUser = new userData({
        user_name: user_name,
        email: emailId,
        phone: mobile,
        address: address,
        password: securedPassword,

        is_blocked: false,
      });



      await newUser.save();
      console.log("-user data saved in the database-");
      res.render("user_login", {
        message: "Successfully registered!",
        loggedIn: false,
        blocked: false,
      });
    } else {
      res.render("otp_verification", { message: "wrong OTP" });
    }
  } catch (error) {
    console.log(error);
    res.render("otp_verification", {
      message: "Error registering new user",
      loggedIn: false,
    });
  }
};

const resendOtp = (req, res) => {
  try {
    const newOtp = helperFunction.generateOTP();
    generatedOtp = newOtp;
    helperFunction.sendOtpMail(emailId, newOtp);
    console.log(`+ new_otp ${newOtp}`);
  } catch (error) {
    console.log(error);
  }
};

// User Login and Logout
const user_login = (req, res) => {
  if (req.session.user) {
    res.redirect("/my_account");
  } else {
    res.render("user_login", { message: "" });
  }
};

const user_logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log("Error destroying session:", err);
      } else {
        res.redirect("/user_login"); // Redirect to the login page after logout
      }
    });
  } catch (error) {
    console.log(error);
  }
};


// User Registration
const user_register = (req, res) => {
  try {
    res.render("user_register", { message: "" });
    if (req.session.user) {
      res.redirect("my_account");
    } else {
      res.render("user_register", { userSignup: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const user_register_post = async (req, res) => {
  try {
    let { email, phone } = req.body;
    const emailExist = await userData.findOne({ email: email });
    const phoneExist = await userData.findOne({ phone: phone });


    const valid = helperFunction.validateRegister(req.body);

    if (emailExist) {
      return res.status(401).json({
        error:
          "user with same email Id already exists please try another email",
      });
    } else if (phoneExist) {
      return res.status(405).json({
        error:
          "The user with same mobile number already exist please try another number",
      });
    } else if (!valid.isValid) {
      return res.status(400).json({ error: valid.errors });
    } else {
      generatedOtp = helperFunction.generateOTP();
      user_name = req.body.user_name;
      emailId = req.body.email;
      mobile = req.body.phone;
      address = req.body.address;
      password = req.body.password;
      confirm_password = req.body.confirm_password;
      helperFunction.sendOtpMail(email, generatedOtp);
      return res.status(200).end();
    }
  } catch (error) {
    console.log(error);
  }
};

// User Login Post
const user_login_post = async (req, res) => {
  try {
    const { user_name, password } = req.body;
    if (!user_name || !password) {
      res.render("user_login", {
        message: "Username and Password can't be empty",
      });
    }
    let email = user_name;
    let exist = await userData.findOne({ email: email });

    if (exist) {
      if (exist.is_blocked) {
        res.render("user_login", { message: "You account is blocked !!" });

      }


      const decodedPassword = await bcrypt.compare(password, exist.password);
      const userStatus = exist.is_blocked;

      if (decodedPassword && userStatus == false) {
        req.session.user = exist;
        res.redirect("index");
      } else {
        res.render("user_login", { message: "The password is incorrect" });
      }
    } else {
      res.render("user_login", { message: "User not found please signup" });
    }
  } catch (error) {
    console.log(error);
  }
};


const addNewAddress = async (req, res) => {
  try {
    const userData = req.session.user;
    const userId = userData._id;

    const address = new Address({
      userId: userId,
      name: req.body.name,
      mobile: req.body.mobile,
      addressLine: req.body.addressLine,
      city: req.body.city,
      email: req.body.email,
      state: req.body.state,
      pincode: req.body.pincode,
      is_default: false,
    });
    console.log(`ship adrs..${address}`);

    await address.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
    console.log(error.message);
  }
};

const updateAddress = async (req, res) => {
  try {
    const addressId = req.query.addressId;

    console.log(addressId);

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      {
        name: req.body.name,
        mobile: req.body.mobile,
        addressLine: req.body.addressLine,
        email: req.body.email,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
      },
      { new: true }
    );

    if (updatedAddress) {
      res.status(200).send();
    } else {
      res.status(500).send();
    }
  } catch (error) {
    console.log(error.message);
  }
};



// Exporting the functions
module.exports = {
  shop,
  index,
  contact,
  about,
  my_account,
  wishlist,
  otp_verification,
  otp_verification_post,
  resendOtp,
  user_login,
  user_logout,
  user_register,
  user_register_post,
  user_login_post,
  productDetails,
  addNewAddress,
  updateAddress,
  updateProfile,

};
