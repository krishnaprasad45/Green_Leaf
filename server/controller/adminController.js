const Usermodel = require("../model/user_register");
const customerData = Usermodel.user_register;
const model = require("../model/user_register");
const productmodel = require("../model/product");
const Category = require("../model/category");
const Order = require("../model/order");
const Address = require("../model/address");
const productData = productmodel.products;
const userData = model.user_register;
const cloudinary = require("../../config/cloudinary")



const adminSignin = (req, res) => {
    req.session.admin ? res.redirect("/admin_dashboard") : res.render("sign_in", { message: "" });
};


const adminSigninPost = (req, res) => {
    const { email, password } = req.body;
    const isAdminCredentialsValid = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
    
    isAdminCredentialsValid
        ? (req.session.admin = email, res.redirect("admin_dashboard"))
        : res.render("sign_in", { message: "Invalid username or password", admin: true });
};


const adminLogout = (req, res) => {
    delete req.session.admin;
    res.redirect("/admin_sign_in"); 
};


const adminDashboard = (req, res) => {
    res.render('admin_dashboard');
};

const earnings = (req, res) => {
    res.render('earnings');
};

const viewOrders = async (req, res) => {
    try {
        const [productDatas, orderData, userDatas, categoryData] = await Promise.all([
            productData.find(),
            Order.find(),
            userData.findOne(),
            Category.find({ is_blocked: false })
        ]);

       
        const userId = userDatas._id;

        const user = await userData.findOne({ _id: userId }).populate({ path: 'cart' }).populate({ path: 'cart.product', model: 'productCollection' });
        const customerName = user.email;
        
        const cart = user.cart;
        
        let subTotal = 0;
        cart.forEach((val) => {
            val.total = val.product.price * val.quantity;
            subTotal += val.total;
        });

        res.render("viewOrders", { productDatas,user, userDatas, orderData, cart, subTotal, categoryData, message: "true" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


const customers = (req, res) => {
    res.render('customers');
};

const viewCustomers = async (req, res) => {
    try {
        const data = await customerData.find();
        res.render('customers', { data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

//user block

const blockUser = async (req, res) => {

    try {
        const id = req.params.id;

        const blockUser = await customerData.findById(id);

        await customerData.findByIdAndUpdate(id, { $set: { is_blocked: !blockUser.is_blocked } }, { new: true });

        res.redirect("/customers");
    } catch (error) {
        console.log(error);
    }
};
const deleteProductImage = async (req, res) => {
    console.log("delete img mdlware")
    try {
        const { id, image } = req.query;
        console.log("id,image")
        console.log(id, image);
        const product = await productData.findById(id);
        const imageUrl = product.imageUrl[image];

        await cloudinary.uploader.destroy(imageUrl.public_id);

        product.imageUrl.splice(image, 1);

        await product.save();
        res.status(200).send({ message: "Image deleted successfully" });
    } catch (error) {
        console.log(error.message);
    }
};



module.exports = {
    adminSignin,
    adminSigninPost,
    adminLogout,
    adminDashboard,
    earnings,
    viewOrders,
    customers,
    viewCustomers,
    blockUser,
    deleteProductImage,
   
};
