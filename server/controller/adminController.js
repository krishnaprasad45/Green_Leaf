module.exports = {

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