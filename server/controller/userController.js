const model = require("../model/user_register")
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')


const userData = model.user_register


let generatedOtp;

let user_name;
let emailId;
let mobile;
let address;
let password;
let confirm_password;


function validateRegister(data) {
    const { user_name, email,address, phone, password, confirm_password } = data;
    const errors = {}

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;

    const addressPattern  = /^[\w\s\-.,]+(?:\n[\w\s\-.,]+)*$/;


    // /Name validation //
    if (!user_name) {
        errors.nameError = "Please Enter Your first Name"
    } else if (user_name.length < 3 || user_name[0] == " ") {
        errors.nameError = "Enter a Valid Name"
    }
   

    // email validation //
    if (!email) {
        errors.emailError = "please enter your email address";
    } else if (email.length < 1 || email.trim() === "" || !emailPattern.test(email)) {
        errors.emailError = "please Enter a Valid email";
    }

    // Phone No Validation //
    if (!phone) {
        errors.phoneError = "please Enter your mobile number";
    } else if (!phonePattern.test(phone)) {
        errors.phoneError = "please check your number and provide a valid one";
    }

    // Address Validation //

    if(!address){
        errors.addressError = "please Enter your address";
    }else if(!addressPattern.test(address)){
        errors.addressError = "please enter a valid address"
    }

    // Password Validation //
    if (!password) {
        errors.passwordError = "please Enter Your  password"
    } else if (!passwordPattern.test(password)) {
        errors.passwordError = "password must be atleast 8 characters with atleast one uppercase, lowercase, digit and special character";
    }

    // Comfirm Password Validation //
    if (password && !confirm_password) {
        errors.confirmPasswordError = "please Enter Your password"
    } else if (password && confirm_password && password !== confirm_password) {
        errors.confirmPasswordError = "passwords doesn't match";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}




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
        console.log(`**********entered otp${EnteredOtp}`);
        console.log(`generated_otp${generatedOtp}`);

        if (EnteredOtp === generatedOtp) {

            const securedPassword = await securePassword(password);

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


            try {
                await newUser.save();
                console.log("............user data saved in the database")
                res.render("user_login", { message: "Successfully registered!", loggedIn: false, blocked: false });

            } catch (error) {
                console.log(error);
                res.render("otp_verification", { message: "Error registering new user", loggedIn: false});
            }

        } else {
            res.render("otp_verification", { message: "wrong OTP"});
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

        res.render('user_register',{message:""});
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

            const valid = validateRegister(req.body)
            if (emailExist) {

                return res.status(401).json({ error: "user with same Email already Exists" })
    
            } else if (phoneExist) {
    
                return res.status(405).json({ error: "The user with same Mobile Number already Exist please try another Number" })
    
            } else if (!valid.isValid) {
                return res.status(400).json({ error: valid.errors })
            }
          
            else {
                generatedOtp = generateOTP();
            
                user_name = req.body.user_name;
                emailId = req.body.email;
                mobile = req.body.phone;
                
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
            console.log(`...otp is ${otp}...`);
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
                console.log(`nodemailer result ${result}`);
            } catch (error) {
                console.log(error.message);
            }
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































