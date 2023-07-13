var express = require('express')
var user_route = express();
user_route.set('views', './views/user')


const userController = require("../controller/userController")

//USER GET
user_route.get('/', userController.index)
user_route.get('/user_register', userController.user_register)
user_route.post("/user_register", userController.user_register_post)

user_route.get('/otp_verification', userController.otp_verification)
user_route.post('/otp_verification', userController.otp_verification_post)
user_route.get('/show_otp', userController.showOtp)


user_route.get('/user_login', userController.user_login)


user_route.get('/user_login_after_otp', userController.verifyLogin)
user_route.get('/index', userController.index)




user_route.get('/shop', userController.shop)
user_route.get('/contact', userController.contact)
user_route.get('/about', userController.about)
user_route.get('/checkout', userController.checkout)
user_route.get('/my_account', userController.my_account)
user_route.get('/cart', userController.cart)
user_route.get('/wishlist', userController.wishlist)
user_route.get('/product_details', userController.product_details)
user_route.get('/user_logout', userController.user_logout)





// USER POST


user_route.post("/user_login_post", userController.user_login_post)



user_route.post('/index', userController.index)
user_route.post('/otp_verification', userController.otp_verification)
















module.exports = user_route

