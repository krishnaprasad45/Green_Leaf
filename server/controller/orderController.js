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

        const categoryData = await Category.find({ is_blocked: false });
    
        const user = await userData.findOne({ _id: userId }).populate({path: 'cart'}).populate({path: 'cart.product', model: 'productCollection'});
        const cart = user.cart;
        let subTotal = 0;
    
        cart.forEach((val) => {
            val.total = val.product.price * val.quantity;
            subTotal += val.total;
        });
    
        //

        const now = new Date();
        const availableCoupons = await Coupon.find({
            expiryDate: { $gte: now },
            usedBy: { $nin: [userId] },
            status: true,
        });

          res.render("checkout", { addressData,productDatas,userDatas, cart,availableCoupons, subTotal, categoryData,loggedIn:true , message: "true" });
        }
       
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    };


    const updateCart = async (req, res) => {
      try {
        
       

          
      } catch (error) {
          console.log(error);
         
      }
  };

    ////////////////////ORDER CONTROLLERS/////////////////////////////
var  walletBalance=0

const placeOrder = async (req, res) => {
    try {
    //   console.log("placorder middleware..")
        const userDatas = req.session.user;
        // walletBalance=userDatas.wallet.balance
        const userId = userDatas._id;
        // console.log(userId)
        const addressId = req.body.selectedAddress;
        const amount = req.body.amount;
        const paymentMethod = req.body.selectedPayment;
        const couponData = req.body.couponData;

        const user = await userData.findOne({ _id: userId }).populate("cart.product");
        // const user = await userData.findOne({ _id: userId }).populate({path: 'cart'}).populate({path: 'cart.product', model: 'productCollection'});
    //   console.log(user)
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

        let productDatas = userCart.map((item) => {
            return {
                id: item.product._id,
                name: item.product.product_name,
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
                    product: productDatas,
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
                    product: productDatas,
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
                // const stock = product.stock;
                const stock = 100;
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

const orderSuccess = async (req, res) => {
  try {
      const userData = req.session.user;
      const categoryData = await Category.find({ is_blocked: false });
      var useremail=req.session.user.email
      res.render("orderSuccess", { userData, categoryData ,loggedIn:true,useremail,});
  } catch (error) {
      console.log(error.message);
  }
};


const validateCoupon = async (req, res) => {
  try {
      const { coupon, subTotal } = req.body;
      const couponData = await Coupon.findOne({ code: coupon });

      if (!couponData) {
          res.json("invalid");
      } else if (couponData.expiryDate < new Date()) {
          res.json("expired");
      } else {
          const couponId = couponData._id;
          const discount = couponData.discount;
          const minDiscount = couponData.minDiscount
          const maxDiscount = couponData.maxDiscount
          const userId = req.session.user._id;

          const couponUsed = await Coupon.findOne({ _id: couponId, usedBy: { $in: [userId] } });

          if (couponUsed) {
              res.json("already used");
          } else {

              let discountAmount
              let maximum

              const discountValue = Number(discount);
              const couponDiscount = (subTotal * discountValue) / 100;

              if(couponDiscount < minDiscount){

                  res.json("minimum value not met")

              }else{
                  if(couponDiscount > maxDiscount){
                      discountAmount = maxDiscount
                      maximum = "maximum"
                  }else{
                      discountAmount = couponDiscount
                  }
                  
                  const newTotal = subTotal - discountAmount;
                  const couponName = coupon;
  
                  res.json({
                      couponName,
                      discountAmount,
                      newTotal,
                      maximum
                  });
              }
              
              
          }
      }
  } catch (error) {
      console.log(error.message);
  }
};






  
    
  

  module.exports = {
    checkout,
    placeOrder,
    orderSuccess,
    updateCart,
    validateCoupon,

  }