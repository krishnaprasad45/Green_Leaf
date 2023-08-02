const model = require("../model/user_register");

const productmodel = require("../model/product");

const productData = productmodel.products;
const Category = require("../model/category");
const Address = require("../model/address");

const userData = model.user_register;
const Order = require("../model/order");

const checkout = async (req, res) => {

    try {
        const productDatas = await productData.find();
        
    
        if(req.session.user){
          const userDatas = req.session.user
        req.session.checkout = true
    
        const userId = userDatas._id
        const addressData = await Address.find({ userId: userId });

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
          res.render("checkout", { addressData,productDatas,userDatas, cart, subTotal, categoryData,loggedIn:true , message: "true" });
        }
       
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    };

    ////////////////////ORDER CONTROLLERS/////////////////////////////
var  walletBalance=0

const placeOrder = async (req, res) => {
    try {
      console.log("placorder middleware..")
        const userDatas = req.session.user;
        // walletBalance=userDatas.wallet.balance
        const userId = userDatas._id;
        console.log(userId)
        const addressId = req.body.selectedAddress;
        const amount = req.body.amount;
        const paymentMethod = req.body.selectedPayment;
        const couponData = req.body.couponData;

        const user = await userData.findOne({ _id: userId }).populate("cart.product");
        // const user = await userData.findOne({ _id: userId }).populate({path: 'cart'}).populate({path: 'cart.product', model: 'productCollection'});
      console.log(user)
        const userCart = user.cart;

        let subTotal = 0;
        let offerDiscount = 0

        userCart.forEach((item) => {
            item.total = item.product.price * item.quantity;
            subTotal += item.total;
        });

        userCart.forEach((item) => {
            if(item.product.oldPrice > 0){
            item.offerDiscount = (item.product.oldPrice - item.product.price) * item.quantity
            offerDiscount += item.offerDiscount;
            }
        });

        let productData = userCart.map((item) => {
            return {
                id: item.product._id,
                name: item.product.name,
                category: item.product.category,
                price: item.product.price,
                quantity: item.quantity,
                image: item.product.imageUrl[0].url,
            };
        });

        const result = Math.random().toString(36).substring(2, 7);
        const id = Math.floor(100000 + Math.random() * 900000);
        const orderId = result + id;

        let saveOrder = async () => {

            const ExpectedDeliveryDate = new Date()
            ExpectedDeliveryDate.setDate(ExpectedDeliveryDate.getDate() + 3 )

            if (couponData) {
                const order = new Order({
                    userId: userId,
                    product: productData,
                    address: addressId,
                    orderId: orderId,
                    total: amount,
                    ExpectedDeliveryDate: ExpectedDeliveryDate,
                    offerDiscount: offerDiscount,
                    paymentMethod: paymentMethod,
                    discountAmount: couponData.discountAmount,
                    amountAfterDiscount: couponData.newTotal,
                    couponName: couponData.couponName,
                });

                await order.save();

                const couponCode = couponData.couponName
                await Coupon.updateOne({ code: couponCode }, { $push: { usedBy: userId } })

                
            }
             else {
                const order = new Order({
                    userId: userId,
                    product: productData,
                    address: addressId,
                    orderId: orderId,
                    total: subTotal,
                    ExpectedDeliveryDate: ExpectedDeliveryDate,
                    offerDiscount: offerDiscount,
                    paymentMethod: paymentMethod,
                });

                const orderSuccess = await order.save();
            }

            let userDetails = await userData.findById(userId);
            let userCartDetails = userDetails.cart;

            userCartDetails.forEach(async (item) => {
                const productId = item.product;
                const quantity = item.quantity;

                const product = await productData.findById(productId);
                const stock = product.stock;
                const updatedStock = stock - quantity;

                await productData.findByIdAndUpdate(
                    productId,
                    { $set: { stock: updatedStock, isOnCart: false } },
                    { new: true }
                );
            });

            userDetails.cart = [];
            await userDetails.save();
        };

        if (addressId) {
            if (paymentMethod === "Cash On Delivery") {

                saveOrder();               
                req.session.checkout =false
                
                res.json({
                    order: "Success",
                });
                
            } else if (paymentMethod === "Razorpay") {
             
              // code here
                console.log("razor pay code empty")
            } else if (paymentMethod === "Wallet") {
              
              //code here
              console.log("wallet code empty")

            }
        }
    } catch (error) {
        console.log(error.message);
    }
};







  
    
  

  module.exports = {
    checkout,
    placeOrder,

  }