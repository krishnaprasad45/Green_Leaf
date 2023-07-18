const model = require("../model/product")
const Usermodel = require("../model/user_register")

const customerData = Usermodel.user_register

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
        if (email === "admin@gmail.com" && password === "admin123") {
            req.session.admin = email
           
            res.redirect("admin_dashboard")
        } else {
            res.render("sign_in", { message: "Invalid username or password", admin: true })

        }
    },
    admin_logout: (req, res) => {
 
        delete req.session.admin;
        
        res.redirect("/admin_sign_in"); // Redirect to the login page after logout
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
    delete_product: async (req, res) => {
        try {
            const deleteId = req.params.id;
            await productData.findByIdAndDelete(deleteId);

        } catch (error) {
            console.log(error.message);
        }
    },
    update_product: async (req, res) => {
        const productId  = req.params.id; // Assuming the product_id is passed as a route parameter
         console.log(`..........  ${productId}`)
        try {
            const product = await productData.findById(productId);
         console.log(`.......... product ${product}`)

            if (!product) {
                return res.render("update_product", { message: "Product not found" });
            }

            // Render the update_product form with the existing product data
            res.render("update_product", { product });
        } catch (error) {
            res.send(error.message);
        }
    },
    update_product_post: async (req, res) => {
        const { product_name, product_details, category, price } = req.body;
        console.log(`///////// ${req.body}`)
        const id = req.params.id
        console.log(`///////// ${id}`)

        try {
            const product = await productData.findById(id);
            if (!product) {
                return res.render("update_product", { message: "Product not found" });
            }

            product.product_name = product_name;
            product.product_details = product_details;
            product.category = category;
            product.price = price;

            await product.save();

            res.redirect("/view_products"); // Redirect to the product list or some other appropriate page
        } catch (error) {
            res.send(error.message);
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
            res.render('view_products', { data });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }


    },
    
    view_customers: async (req, res) => {
        try {

            const data = await customerData.find();
            res.render('customers', { data });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }


    },
}