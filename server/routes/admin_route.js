var express = require('express')
var admin_route = express()
admin_route.set('views','./views/admin')
const auth = require("../../middleware/adminAuth.js")
const adminController = require("../controller/adminController")
const productController = require("../controller/productController")

const {isLogin,isLogout} = auth


admin_route.get('/admin_sign_in',isLogout, adminController.adminSignin)
admin_route.post('/admin_signin_post',isLogout, adminController.adminSigninPost)

admin_route.get('/admin_dashboard',isLogin, adminController.adminDashboard)
admin_route.get('/add_product',isLogin,productController.addProduct)
admin_route.post('/add_product_post',isLogin,productController.addProductPost)


admin_route.get('/earnings',isLogin,adminController.earnings)
admin_route.get('/payments',isLogin,adminController.payments)
admin_route.get('/customers',isLogin,adminController.viewCustomers)
admin_route.get('/add_product',isLogin,productController.addProduct)
admin_route.get('/view_products',isLogin,productController.viewProducts)
admin_route.get('/delete_product/:id',isLogin,productController.deleteProduct)
admin_route.get('/update_product/:id',isLogin,productController.updateProduct)
admin_route.post('/update_product_post/:id',isLogin,productController.updateProductPost)


admin_route.get('/admin_logout',isLogin,adminController.adminLogout)



module.exports = admin_route
