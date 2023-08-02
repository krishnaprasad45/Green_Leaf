const Usermodel = require("../model/user_register");
const customerData = Usermodel.user_register;
//
const model = require("../model/user_register");

const productmodel = require("../model/product");
const Category = require("../model/category");
const Address =  require("../model/address");
const Order = require("../model/order");

const productData = productmodel.products;

const userData = model.user_register;

//


const adminSignin = (req, res) => {
    if (req.session.admin) {
        res.redirect("/admin_dashboard");
    } else {
        res.render("sign_in", { message: "" });
    }
};

const adminSigninPost = (req, res) => {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        req.session.admin = email;
        res.redirect("admin_dashboard");
    } else {
        res.render("sign_in", { message: "Invalid username or password", admin: true });
    }
};

const adminLogout = (req, res) => {
    delete req.session.admin;
    res.redirect("/admin_sign_in"); // Redirect to the login page after logout
};

const adminDashboard = (req, res) => {
    res.render('admin_dashboard');
};

const earnings = (req, res) => {
    res.render('earnings');
};

const payments = async(req, res) => {
    
    try {
        const productDatas = await productData.find();
        
    
        const orderData = await Order.find()
        
          const userDatas = await userData.findOne()
       
        const userID = orderData[0].userId
        const userInfo = await userData.findById(userID)

        const customerName = userInfo.user_name
        console.log(customerName)
        const userId = userDatas._id
        // walletBalance=userDatas.wallet.balance
        const categoryData = await Category.find({ is_blocked: false });
    
        const user = await userData.findOne({ _id: userId }).populate({path: 'cart'}).populate({path: 'cart.product', model: 'productCollection'});
        const cart = user.cart;
        let subTotal = 0;
    
        cart.forEach((val) => {
            val.total = val.product.price * val.quantity;
            subTotal += val.total;
        });
    
          res.render("payments", { productDatas,userDatas,orderData,customerName, cart, subTotal, categoryData , message: "true"});
       
       
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

module.exports = {
    adminSignin,
    adminSigninPost,
    adminLogout,
    adminDashboard,
    earnings,
    payments,
    customers,
    viewCustomers,
    blockUser,
};
