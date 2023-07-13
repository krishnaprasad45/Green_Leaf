const model = require("../model/user_register")
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')


const userData = model.user_register


let saveOtp;
let user_name;
let email;
let phone;
let password;
let forgotPasswordOtp;




const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
};
module.exports = {

    // exports.shop = ((req,res)=>{
    //     res.render('shop')
    // })

    shop: (req, res) => {
        res.render('shop');
    },
    index: (req, res) => {
        res.render('index');
    },
    contact: (req, res) => {
        res.render('contact');
    },
    about: (req, res) => {
        res.render('about');
    },
    checkout: (req, res) => {
        res.render('checkout');
    },
    my_account: (req, res) => {
        res.render('my_account');
    },
    cart: (req, res) => {
        res.render('cart');
    },
    wishlist: (req, res) => {
        res.render('wishlist');
    },
    product_details: (req, res) => {
        res.render('product_details');
    },
    otp_verification: async (req, res) => {
        res.render('otp_verification',{message:""});

    },
    otp_verification_post: async (req, res) => {

        var txt1 = req.body.txt1;
        var txt2 = req.body.txt2
        var txt3 = req.body.txt3
        var txt4 = req.body.txt4
        const EnteredOtp = txt1 + txt2 + txt3 + txt4
        console.log(`entered otp${EnteredOtp}`);
        console.log(`saveotp${saveOtp}`);
        // const categoryData = await Category.find({ is_blocked: false });
        if (EnteredOtp === saveOtp) {

            const securedPassword = await securePassword(password);

            const newUser = new userData({
                user_name: user_name,
                email: email,
                phone: phone,
                address: address,
                password: securedPassword,
                confirm_password: securedPassword,
                is_blocked: false,

            });
            console.log(newUser);


            try {
                await newUser.save();

                res.render("user_login_after_otp", { message: "Successfully registered!", loggedIn: false, blocked: false, categoryData });

            } catch (error) {
                console.log(error);
                res.render("otp_verification", { message: "Error registering new user", loggedIn: false, categoryData });
            }

        } else {
            res.render("otp_verification", { message: "wrong OTP", categoryData });
        }
    }
    ,
    verifyLogin: async (req, res) => {
        try {

            let email = req.body.email;
            console.log(email);
            const password = req.body.password;
            const userData = await userData.findOne({ email: email });
            console.log(userData);
            const categoryData = await Category.find({ is_blocked: false });
            if (userData) {

                const passwordMatch = await bcrypt.compare(password, userData.password);
                if (userData.is_blocked === true) {

                    return res.render("user_login", { message: "Your account is blocked", user: req.session.user, loggedIn: false, categoryData });
                }

                if (passwordMatch) {
                    console.log("verified pass");
                    req.session.user = userData;
                    req.session.logged = true
                    // res.render('home',{user:req.session.user.email,blocked:false,loggedIn:true, 
                    //     bannerData })
                    res.redirect("/index")
                }
                if (!passwordMatch) {
                    res.render("user_login", { message: "Entered password is wrong", blocked: false, loggedIn: false, categoryData });
                }
            } else {
                res.render("user_login", { message: "You are not registered. please register now!!", blocked: false, loggedIn: false, categoryData });
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    user_login: (req, res) => {
        
        res.render("user_login",{message:""})
    },

    user_logout: (req, res) => {
        delete req.session.user;
        res.redirect("user_login",{message:""})
    },

        user_register: (req, res) => {

        res.render('user_register');
        // if (req.session.user) {
        //     res.redirect("my_account")
        // } else {
        //     res.render("user_register", { userSignup: true })
        // }
    },


    user_register_post: async (req, res) => {
        console.log(req.body);
        try {

            let { email, phone } = req.body

            const emailExist = await userData.findOne({ email: email })
            const phoneExist = await userData.findOne({ phone: phone })

            // const valid = validate(req.body)

            if (emailExist) {

                return res.status(401).json({ message: "user with same Email already Exists" })

            } else if (phoneExist) {

                return res.status(409).json({ message: "The user with same Mobile Number already Exist please try another Number" })
            }
            // } else if (!valid.isValid) {  //dbt
            //     return res.status(400).json({ message: valid.errors })
            // }
            else {
                var generatedOtp = generateOTP();
                saveOtp = generatedOtp; //dbt
                user_name = req.body.user_name;
                email = req.body.email;
                phone = req.body.phone;
                address = req.body.address
                password = req.body.password;
                confirm_password = req.body.confirm_password
                sendOtpMail(email, generatedOtp);


                return res.status(200).end();

            }
        } catch (error) {
            console.log(error);
        }
        function generateOTP() {
            let otp = "";
            for (let i = 0; i < 4; i++) {
                otp += Math.floor(Math.random() * 10);
            }
            return otp;
        }
        async function sendOtpMail(email, otp) {
            console.log(otp);
            try {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "secretcodes.developers@gmail.com",
                        pass: "bytgzcfxrmbyovdd",
                    },
                });

                const mailOptions = {
                    from: "secretcodes.developers@gmail.com",
                    to: email,
                    subject: "Your OTP for user verification",
                    text: `Your OTP is ${otp} . Please enter this code to verify your account`,
                };

                const result = await transporter.sendMail(mailOptions);
                console.log(result);
            } catch (error) {
                console.log(error.message);
            }
        };
        const showOtp = async (req, res) => {
            try {
                const categoryData = await Category.find({ is_blocked: false });
                res.render("otp",{loggedIn:false,categoryData});
            } catch (error) {}
        };
    },
    //POST
    user_login_post: async (req, res) => {
        if (req.session.user) {
            res.redirect("index")
        } else {
            const { user_name, password } = req.body
            let email = req.body.user_name
            let exist = await userData.findOne({ email: email })

            if (exist) {
                if (exist.password === password) {
                    req.session.user = email
                    res.redirect("index")
                } else {
                    res.render("user_login", { message: "The password is incorrect" })
                }
            } else {
                res.render("user_login", { message: "User not found please signup" })
            }
        }
    }


}































