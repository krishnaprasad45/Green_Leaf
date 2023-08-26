const model = require("../model/user_register");
const helperFunction = require("../../helperFunctions/userHelper");
const productmodel = require("../model/product");
const Category = require("../model/category");
const User = model.user_register;

var walletBalance=0
let generatedOtp;
let emailId;



const loadForgotPassword = async (req, res) => {
    try {
        const categoryData = await Category.find({ is_blocked: false });
    
        if (req.session.forgotEmailNotExist) {
           
            res.render("verifyEmail", {categoryData,walletBalance, emailNotExist: "Sorry, email does not exist! Please register now!" ,loggedIn:false,walletBalance,subTotal:0,cart:{}});
            req.session.forgotEmailNotExist = false;
        } else {
            res.render("verifyEmail",{loggedIn:false,categoryData,walletBalance,subTotal:0,cart:{}});
        }
    } catch (error) {
        console.log(error.message);
    }
};

const verifyForgotEmail = async (req, res) => {
    try {
        const verifyEmail = req.body.email;
        const ExistingEmail = await User.findOne({ email: verifyEmail });

        if (ExistingEmail) {
            if (!generatedOtp) {
                generatedOtp = helperFunction.generateOTP();
                console.log("forgotpass" + generatedOtp);
                emailId = verifyEmail;
                helperFunction.sendOtpMail(emailId, generatedOtp);
                res.redirect("/forgotOtpEnter");
                setTimeout(() => {
                    generatedOtp = null;
                }, 60 * 1000);
            } else {
                res.redirect("/forgotOtpEnter");
            }
        } else {
            req.session.forgotEmailNotExist = true;
            res.redirect("/forgotPassword");
        }
    } catch (error) {
        console.log(error.message);
    }
};



const resendForgotOtp = async (req, res) => {
    try {
        const generatedOtp = helperFunction.generateOTP();

        helperFunction.sendOtpMail(emailId, generatedOtp);
        res.redirect("/forgotOtpEnter");
        setTimeout(() => {
            generatedOtp = null;
        }, 60 * 1000);
    } catch (error) {
        console.log(error.message);
    }
};

const showForgotOtp = async (req, res) => {
    try {
        const categoryData = await Category.find({ is_blocked: false });
        if (req.session.wrongOtp) {
            res.render("forgotOtpEnter", { invalidOtp: "Otp does not match" ,loggedIn:false,categoryData,walletBalance,subTotal:0,cart:{}});
            req.session.wrongOtp = false;
        } else {
            res.render("forgotOtpEnter", { countdown: true ,loggedIn:false, invalidOtp:"" ,categoryData,walletBalance,subTotal:0,cart:{}});
        }
    } catch (error) {
        console.log(error.message);
    }
};

const verifyForgotOtp = async (req, res) => {
    try {
        const categoryData = await Category.find({ is_blocked: false });
        var txt1 = req.body.txt1;
        var txt2 = req.body.txt2;
        var txt3 = req.body.txt3;
        var txt4 = req.body.txt4;
        const EnteredOtp = txt1 + txt2 + txt3 + txt4;
     
        if (EnteredOtp === generatedOtp) {
            res.render("passwordReset",{loggedIn:false,invalidOtp:"",categoryData,walletBalance,subTotal:0,cart:{}});
        } else {
            req.session.wrongOtp = true;
            res.redirect("/forgotOtpEnter");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const updatePassword = async (req, res) => {
    try {
        const categoryData = await Category.find({ is_blocked: false });
        const newPassword = req.body.password;
        const securedPassword = await helperFunction.securePassword(newPassword);

        const userData = await User.findOneAndUpdate({ email: emailId }, { $set: { password: securedPassword } });
        if (userData) {
            req.session.passwordUpdated = true;
            res.render("user_login",{blocked:false,loggedIn:false,categoryData,walletBalance,subTotal:0,cart:{}});
        } else {
            console.log("Something error happened");
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    loadForgotPassword,
    verifyForgotEmail,
    verifyForgotOtp,
    showForgotOtp,
    updatePassword,
    resendForgotOtp,
}