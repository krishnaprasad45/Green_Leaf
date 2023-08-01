const model = require("../model/user_register");

const productmodel = require("../model/product");

const productData = productmodel.products;
const Category = require("../model/category");
const userData = model.user_register;


const checkout = async (req, res) => {

    try {
        const productDatas = await productData.find();
      
    
        if(req.session.user){
          const userDatas = req.session.user
          //PASSING MINI CART DETAILS
        req.session.checkout = true
    
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
    
        //
          res.render("checkout", { productDatas,userDatas, cart, subTotal, categoryData,loggedIn:true , message: "true" });
        }
       
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    };







  
    
  

  module.exports = {
    checkout,
  }