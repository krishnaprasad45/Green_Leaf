const nodemailer = require('nodemailer')


const validateRegister = function (data) {
    const { user_name, email, address, phone, password, confirm_password } = data;
    const errors = {}

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;

    const addressPattern = /^[\w\s\-.,]+(?:\n[\w\s\-.,]+)*$/;


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

    if (!address) {
        errors.addressError = "please Enter your address";
    } else if (!addressPattern.test(address)) {
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