var express = require('express')
var admin_route = express()
admin_route.set('views','./views/admin')

const adminController = require("../controller/adminController")



//ADMIN GET

admin_route.get('/admin_sign_in',adminController.admin_signin)
admin_route.post('/admin_signin_post',adminController.admin_signin_post)

admin_route.get('/admin_dashboard',adminController.admin_dashboard)
admin_route.get('/earnings',adminController.earnings)
admin_route.get('/payments',adminController.payments)
admin_route.get('/customers',adminController.customers)
admin_route.get('/add_product',adminController.add_product)
admin_route.get('/view_products',adminController.view_products)


module.exports = admin_route
