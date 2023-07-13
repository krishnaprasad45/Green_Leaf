const model = require("../model/user_register")
const userData = model.user_register

// exports.shop = ((req,res)=>{
//     res.render('shop')
// })

module.exports = {

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
    otp_verification: (req, res) => {
        res.render('otp_verification');
    },
    user_login: (req, res) => {
        if (req.session.user) {
            res.redirect('my_account')
        } else {
            res.render("user_login",{err_message:""})
        }
    },

    user_logout: (req, res) => {
        delete req.session.user;
        res.redirect("user_login")
    },
 
    user_register: (req, res) => {
        res.render('user_register');
        // if (req.session.user) {
        //     res.redirect("index")
        // } else {
        //     res.render("user_register", { userSignup: true })
        // }
    },
    user_register_post: async (req, res) => {
        console.log(".........................................*****")
        
        const { phone, email } = req.body
        console.log(req.body)

        const exist = await userData.findOne({ $or: [{ email: email }, { phone: phone }] })
        console.log(`exist value : ${exist}`)
        if (exist) {
        console.log(`inside if`)

            if (exist.phone == phone) {
                res.render("user_login", { err_message: "The user with same Mobile Number already Exists", user_register: true })
            } else {
                res.render("user_login", { err_message: "The user already Exist please Login", user_register: true })
            }
        } else {
            console.log("else part")
            const user = new userData({
                user_name: req.body.user_name,
                address: req.body.address,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                confirm_password:req.body.confirm_password
            })
    
            try {
                await user.save()
                console.log("try section")
                res.render("user_login",{err_message:""})
            } catch (error) {
                res.send(error)
            }
        }
    },
  
    //POST
    user_login_post : async (req, res) => {
        if (req.session.user) {
            res.redirect("index")
        } else {
            const { user_name, password } = req.body
            console.log(`**********************${req.body.user_name}`)
            const email=req.body.user_name
            const exist = await userData.findOne({ email: email })
            
            console.log("######################### ")
            console.log(exist)
            if (exist) {
                if (exist.password === password) {
                    req.session.user = email
                    res.redirect("index")
                } else {
                    res.render("user_login", { err_message: "The password is incorrect" })
                }
            } else {
                res.render("user_login", { err_message: "User not found please signUP" })
            }
        }
    },

    

    


};


