const nodemailer = require('nodemailer')
const bcrypt = require("bcrypt");



const validateRegister = function (data) {
    const { user_name, email, address, phone, password, confirm_password } = data;
    const errors = {}

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;

    const addressPattern = /^[\w\s\-.,]+(?:\n[\w\s\-.,]+)*$/;


    // /Name validation //
    if (!user_name) {
        errors.nameError = "Please enter your name"
    } else if (user_name.length < 3 || user_name[0] == " ") {
        errors.nameError = "Enter a valid name"
    }


    // email validation //
    if (!email) {
        errors.emailError = "Please enter your email address";
    } else if (email.length < 1 || email.trim() === "" || !emailPattern.test(email)) {
        errors.emailError = "Please enter a valid email";
    }

    // Phone No Validation //
    if (!phone) {
        errors.phoneError = "Please enter your mobile number";
    } else if (!phonePattern.test(phone)) {
        errors.phoneError = "Please check your number and provide a valid one";
    }

    // Address Validation //

    if (!address) {
        errors.addressError = "Please enter your address";
    } else if (!addressPattern.test(address)) {
        errors.addressError = "Please enter a valid address"
    }

    // Password Validation //
    if (!password) {
        errors.passwordError = "Please enter your  password"
    } else if (!passwordPattern.test(password)) {
        errors.passwordError = "Password must be atleast 8 characters with atleast one uppercase, lowercase, digit and special character";
    }

    // Comfirm Password Validation //
    if (password && !confirm_password) {
        errors.confirmPasswordError = "Please enter your password"
    } else if (password && confirm_password && password !== confirm_password) {
        errors.confirmPasswordError = "Passwords doesn't match";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}



const securePassword = async (password) => {
    console.log("secure pass")
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
};
function generateOTP() {
    let otp = "";
    for (let i = 0; i < 4; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};

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

module.exports = {
    validateRegister,
    securePassword,
    generateOTP,
    sendOtpMail

}