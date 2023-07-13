

const nodemailer = require("nodemailer");
const User = require('../server/model/user_register')// Assuming User is exported from another file
// const Category = require("./Category"); // Assuming Category is exported from another file

let saveOtp;
let firstName;
let email;
let mobile;
let password;
let forgotPasswordOtp;

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
                user: "itsprabanchcv@gmail.com",
                pass: "efhzfchvjqstvmkb",
            },
        });

        const mailOptions = {
            from: "itsprabanchcv@gmail.com",
            to: email,
            subject: "Your OTP for user verification",
            text: `Your OTP is ${otp}. Please enter this code to verify your account.`,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(result);
    } catch (error) {
        console.log(error.message);
    }
}

async function sendOtp(req, res) {
    console.log(req.body);
    try {
        const { emailvalid, phonenumber } = req.body;

        const emailExist = await User.findOne({ email: emailvalid });
        const phoneExist = await User.findOne({ phone: phonenumber });

        const valid = validate(req.body);

        if (emailExist) {
            return res.status(401).json({ error: "User with the same email already exists." });
        } else if (phoneExist) {
            return res
                .status(409)
                .json({ error: "The user with the same mobile number already exists. Please try another number." });
        } else if (!valid.isValid) {
            return res.status(400).json({ error: valid.errors });
        } else {
            const generatedOtp = generateOTP();
            saveOtp = generatedOtp;
            firstName = req.body.firstname;
            lastName = req.body.lastname;
            email = req.body.email;
            mobile = req.body.phonenumber;
            password = req.body.password;
            repassword = req.body.repassword;
            sendOtpMail(email, generatedOtp);

            return res.status(200).end();
        }
    } catch (error) {
        console.log(error);
    }
}

async function verifyOtp(req, res) {
    var txt1 = req.body.txt1;
    var txt2 = req.body.txt2;
    var txt3 = req.body.txt3;
    var txt4 = req.body.txt4;
    const enteredOtp = txt1 + txt2 + txt3 + txt4;
    console.log(`Entered OTP: ${enteredOtp}`);
    console.log(`Saved OTP: ${saveOtp}`);
    const categoryData = await Category.find({ is_blocked: false });

    if (enteredOtp === saveOtp) {
        const securedPassword = await securePassword(password);

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: mobile,
            password: securedPassword,
            is_blocked: false,
        });

        console.log(newUser);

        try {
            await newUser.save();
            res.render("login", { success: "Successfully registered!", loggedIn: false, blocked: false, categoryData });
        } catch (error) {
            console.log(error);
            res.render("otp", { invalidOtp: "Error registering new user", loggedIn: false, categoryData });
        }
    } else {
        res.render("otp", { invalidOtp: "Wrong OTP", categoryData });
    }
}

module.exports = { sendOtp, verifyOtp };
