// userController.js
const model = require("../model/user_register");
const bcrypt = require('bcrypt');
const helperFunction = require('../../helperFunctions/userHelper');
const productmodel = require("../model/product");

const productData = productmodel.products;


const userData = model.user_register;
let generatedOtp;
let user_name;
let emailId;
let mobile;
let address;
let password;

// Function to render views
const shop = async(req, res) => {
    try {
        const data = await productData.find();
        res.render("shop", { data });
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
};

const index = async (req, res) => {

    try {
        const data = await productData.find();
        res.render("index", { data });
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
};

const contact = (req, res) => {
    res.render('contact');
};

const about = (req, res) => {
    res.render('about');
};

const checkout = (req, res) => {
    res.render('checkout');
};

const my_account = (req, res) => {
    res.render('my_account');
};

const cart = (req, res) => {
    res.render('cart');
};

const wishlist = (req, res) => {
    res.render('wishlist');
};

const product_details = async (req, res) => {
    const productId = req.params.id;
    try{
        const product = await productData.findById(productId)
    res.render('product_details', {product});
    } catch(error){
        res.status(500).send(error.message);
    }
};

const productMore = async (req,res) => {
    const productId = req.params.id;
    try{
        const product = await productData.findById(productId)
        console.log(product)
        res.render('productM',{product})
    }catch(error){

        res.status(500).send(error.message);
       
    }
}

// OTP Verification
const otp_verification = async (req, res) => {
    res.render('otp_verification', { message: "" });
};

const otp_verification_post = async (req, res) => {
    try {
        var txt1 = req.body.txt1;
        var txt2 = req.body.txt2
        var txt3 = req.body.txt3
        var txt4 = req.body.txt4
        const EnteredOtp = txt1 + txt2 + txt3 + txt4;
        console.log(`**********entered otp${EnteredOtp}`);
        console.log(`generated_otp${generatedOtp}`);

        if (EnteredOtp === generatedOtp) {
            const securedPassword = await helperFunction.securePassword(password);

            const newUser = new userData({
                user_name: user_name,
                email: emailId,
                phone: mobile,
                address: address,
                password: securedPassword,
                confirm_password: securedPassword,
            });
            console.log(newUser.user_name)
            console.log(newUser.email)
            console.log(newUser.phone)
            console.log(newUser.address)
            console.log(`###### newuser:${newUser}`);

            await newUser.save();
            console.log("............user data saved in the database")
            res.render("user_login", { message: "Successfully registered!", loggedIn: false, blocked: false });
        } else {
            res.render("otp_verification", { message: "wrong OTP" });
        }
    } catch (error) {
        console.log(error);
        res.render("otp_verification", { message: "Error registering new user", loggedIn: false });
    }
};

const resendOtp = (req, res) => {
    console.log("hello")
    try {
        const newOtp = helperFunction.generateOTP();
        generatedOtp = newOtp;
        helperFunction.sendOtpMail(emailId, newOtp);
        console.log(`++++++ new_otp ${newOtp}`);
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
        delete req.session.user;
        res.redirect("/user_login"); // Redirect to the login page after logout
    } catch (error) {
        console.log(error);
    }
};

// User Registration
const user_register = (req, res) => {
    try {
        res.render('user_register', { message: "" });
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
    console.log(req.body);
    try {
        let { email, phone } = req.body;
        const emailExist = await userData.findOne({ email: email });
        const phoneExist = await userData.findOne({ phone: phone });

        const valid = helperFunction.validateRegister(req.body);
        if (emailExist) {
            return res.status(401).json({ error: "user with same email Id already exists please try another email" });
        } else if (phoneExist) {
            return res.status(405).json({ error: "The user with same mobile number already exist please try another number" });
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
        if (req.session.user) {
            res.redirect("index");
        } else {
            const { user_name, password } = req.body;
            
            let email = user_name;
            let exist = await userData.findOne({ email: email });
            if (exist) {
            const decodedPassword = await bcrypt.compare(password, exist.password);

                if (decodedPassword) {
                    req.session.user = email;
                    res.redirect("index");
                } else {
                    res.render("user_login", { message: "The password is incorrect" });
                }
            } else {
                res.render("user_login", { message: "User not found please signup" });
            }
        }
    } catch (error) {
        console.log(error);
    }
};

// Exporting the functions
module.exports = {
    shop,
    index,
    contact,
    about,
    checkout,
    my_account,
    cart,
    wishlist,
    product_details,
    otp_verification,
    otp_verification_post,
    resendOtp,
    user_login,
    user_logout,
    user_register,
    user_register_post,
    user_login_post,
    productMore,
};
