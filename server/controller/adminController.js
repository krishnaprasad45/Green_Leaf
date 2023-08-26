const Usermodel = require("../model/user_register");
const customerData = Usermodel.user_register;
const model = require("../model/user_register");
const productmodel = require("../model/product");
const Category = require("../model/category");
const Order = require("../model/order");
const xvfb = require("xvfb");

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




const earnings = async(req, res) => {
    try {
        const sales = await Sale.find({});
        const signups = await userData.find().count()
        
    
        const salesByMonth = {};
    
        sales.forEach((sale) => {
          const monthYear = moment(sale.date).format('MMMM YYYY');
          if (!salesByMonth[monthYear]) {
            salesByMonth[monthYear] = {
              totalOrders: 0,
              totalRevenue: 0
            };
          }
          salesByMonth[monthYear].totalOrders += 1;
          salesByMonth[monthYear].totalRevenue += sale.total;
        });
    
        const chartData = [];
    
        Object.keys(salesByMonth).forEach((monthYear) => {
          const { totalOrders, totalRevenue } = salesByMonth[monthYear];
          chartData.push({
            month: monthYear.split(' ')[0],
            totalOrders: totalOrders || 0,
            totalRevenue: totalRevenue || 0
          });
        });
    
          months = [];
          ordersByMonth = [];
          revenueByMonth = [];
          totalRevenue = 0;
          totalSales = 0;
    
        chartData.forEach((data) => {
          months.push(data.month);
          ordersByMonth.push(data.totalOrders);
          revenueByMonth.push(data.totalRevenue);
          totalRevenue += Number(data.totalRevenue);
          totalSales += Number(data.totalOrders);
        });
    
        const thisMonthOrder = ordersByMonth[ordersByMonth.length - 1];
        const thisMonthSales = revenueByMonth[revenueByMonth.length - 1];
       
    
        res.render("earnings", {
          user: req.session.admin,
          revenueByMonth,
          months,
          signups,
          ordersByMonth,
          totalRevenue,
          totalSales,
          thisMonthOrder,
          thisMonthSales,
          productUpdated:""
        });
      } catch (error) {
        console.log(error.message);
      }
  };


const viewOrders = async (req, res) => {
    try {
        const productDatas = await productData.find();

          // Search codes here

    let orderData;

    const search = req.query.search;

    if (search) {
        orderData = await Order.find({
        $or: [
          { paymentMethod: { $regex: ".*" + search + ".*", $options: "i" } },
          { status: { $regex: ".*" + search + ".*", $options: "i" } },
          { orderId: { $regex: ".*" + search + ".*", $options: "i" } },
      
        ]
      });
    }
     else {
        orderData = await Order.find()

    }
    // Search Function ends




        const userDatas = await userData.findOne();
        const categoryData = await Category.find({ is_blocked: false });
       
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
       
     
          // Search codes here

    let data;

    const search = req.query.search;

    if (search) {
      data = await customerData.find({
        $or: [
          { user_name: { $regex: ".*" + search + ".*", $options: "i" } },
          { email: { $regex: ".*" + search + ".*", $options: "i" } },
          { phone: { $regex: ".*" + search + ".*", $options: "i" } },
        ]
      });
    }
     else {
        data = await customerData.find()

    }
    // Search Function ends


    


        res.render('customers', { data ,search });
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
    try {
        const { id, image } = req.query;
     
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
    
    earnings,
    viewOrders,
    customers,
    viewCustomers,
    blockUser,
    deleteProductImage,
   
};
