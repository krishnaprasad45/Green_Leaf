var express = require('express')
var user_route = express();
user_route.set('views', './views/user')
const auth = require("../../middleware/userAuth.js")


const {isLogin,isLogout} = auth

const userController = require("../controller/userController")


user_route.get('/', userController.index)
user_route.get('/user_register',isLogout, userController.user_register)
user_route.post("/user_register",isLogout, userController.user_register_post)

user_route.get('/otp_verification',isLogout, userController.otp_verification)
user_route.post('/otp_verification_post',isLogout, userController.otp_verification_post)
user_route.get("/resentOtp",isLogout,userController.resendOtp )



user_route.get('/user_login',isLogout, userController.user_login)
user_route.post("/user_login_post",isLogout, userController.user_login_post)

user_route.get('/index', userController.index)
user_route.get('/shop', userController.shop)
user_route.get('/contact', userController.contact)
user_route.get('/about', userController.about)
user_route.get('/checkout',isLogin, userController.checkout)
user_route.get('/my_account',isLogin, userController.my_account)
user_route.get('/cart',isLogin, userController.cart)
user_route.get('/wishlist',isLogin, userController.wishlist)
user_route.get('/productDetails', userController.productDetails)
user_route.get('/user_logout',isLogin, userController.user_logout)


user_route.post('/index', userController.index)
user_route.post('/otp_verification', userController.otp_verification)

module.exports = user_route

