const model = require("../model/product")


const productData = model.products

module.exports = {

    admin_signin: (req, res) => {
        if (req.session.admin) {
            res.redirect("/admin_dashboard")
        } else {
            res.render("sign_in", { message: "" })
        }
    },
    admin_signin_post: (req, res) => {

        const { email, password } = req.body
        if (email === "admin@gmail.com" && password === "123") {
            req.session.admin = email
            res.redirect("admin_dashboard")
        } else {
            res.render("sign_in", { message: "Invalid username or password", admin: true })

        }
    },
    add_product: (req, res) => {
        res.render('add_product');
    },
    add_product_post:
        async (req, res) => {
            console.log(req.body)
            const { product_name } = req.body

            const exist = await productData.findOne({ product_name: product_name })
            if (exist) {

                res.render("add_product", { message: "The product already exist" })

            } else {
                const product = new productData({
                    product_name: req.body.product_name,
                    product_details: req.body.product_details,
                    category: req.body.category,
                    price: req.body.price,
                    // product_img : req.body.product_img
                })

                try {
                    await product.save()
                    res.redirect("/view_products")
                } catch (error) {
                    res.send(error)
                }
            }


        },


    admin_dashboard: (req, res) => {
        res.render('admin_dashboard');
    },

    earnings: (req, res) => {
        res.render('earnings');
    },
    payments: (req, res) => {
        res.render('payments');
    },
    customers: (req, res) => {
        res.render('customers');
    },

    view_products: async (req, res) => {
        try {
           
            const data = await productData.find();
            console.log(`**********${data}`)
            res.render('view_products', { data });
          } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
          }
        
        
    },
}