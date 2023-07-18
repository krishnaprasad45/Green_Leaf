var express = require('express')
var admin_route = express()
admin_route.set('views','./views/admin')
const auth = require("../../middleware/adminAuth.js")
const adminController = require("../controller/adminController")
const {isLogin,isLogout} = auth


admin_route.get('/admin_sign_in',isLogout, adminController.admin_signin)
admin_route.post('/admin_signin_post',isLogout, adminController.admin_signin_post)

admin_route.get('/admin_dashboard',isLogin, adminController.admin_dashboard)
admin_route.get('/add_product',isLogin,adminController.add_product)
admin_route.post('/add_product_post',isLogin,adminController.add_product_post)


admin_route.get('/earnings',isLogin,adminController.earnings)
admin_route.get('/payments',isLogin,adminController.payments)
admin_route.get('/customers',isLogin,adminController.view_customers)
admin_route.get('/add_product',isLogin,adminController.add_product)
admin_route.get('/view_products',isLogin,adminController.view_products)
admin_route.get('/delete_product/:id',isLogin,adminController.delete_product)
admin_route.get('/update_product/:id',isLogin,adminController.update_product)
admin_route.post('/update_product_post/:id',isLogin,adminController.update_product_post)


admin_route.get('/admin_logout',isLogin,adminController.admin_logout)



module.exports = admin_route
