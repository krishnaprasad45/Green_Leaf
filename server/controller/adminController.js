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
    add_product: (req, res) => {
        res.render('add_product');
    },
    view_products: (req, res) => {
        res.render('view_products');
    },
}