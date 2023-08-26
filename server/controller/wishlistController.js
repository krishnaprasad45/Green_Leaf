const model = require("../model/user_register");

const productmodel = require("../model/product");
const Razorpay = require("razorpay");

const productData = productmodel.products;
const Category = require("../model/category");
const Coupon = require("../model/couponModel");
const userData = model.user_register;


const loadWishlist = async (req, res) => {
    try {
        const productDatas = await productData.find();
        const logged = req.session.user;
    
        if (req.session.user) {
        const userDatas = req.session.user;
      req.session.checkout = true;

        
      const userId = userDatas._id;
      walletBalance=userDatas.wallet.balance
      const categoryData = await Category.find({ is_blocked: false });

      const userMeta = await userData
        .findOne({ _id: userId })
        .populate({ path: "cart" })
        .populate({ path: "cart.product", model: "productCollection" });
      const cart = userMeta.cart;
      let subTotal = 0;

      cart.forEach((val) => {
        val.total = val.product.price * val.quantity;
        subTotal += val.total;
      });
     

        const user = await userData.findById(userId).populate("wishlist");
        const wishlistItems = user.wishlist;

        const userCart = await userData.findOne({ _id: userId }).populate("cart.product").lean();
       
            res.render("wishlist", { 
                productDatas,
                userDatas,
                userMeta,
                cart,
                subTotal,
                categoryData,
                wishlistItems,
                message: "true",
            });
        
    
        }

         else {
            res.render("wishlist", { userDatas:{}, productDatas:{},categoryData:{}, logged,cart, message: "false", wishlistItems });
        }
    
}catch (error) {
        console.log(error.message);
    }
};

const addToWishlist = async (req, res) => {
    try {
        const userDatas = req.session.user;
        const userId = userDatas._id;
        const productId = req.query.productId;
        const cartId = req.query.id;
        console.log(`cartid = ${cartId}`)

        const existItem = await userData.findOne({ _id: userId, wishlist: { $in: [productId] } });
        if (!existItem) {
            await userData.updateOne({ _id: userId }, { $push: { wishlist: productId } });
            await productData.updateOne({ _id: productId }, { isWishlisted: true });
           
            await productData.findOneAndUpdate({ _id: productId }, { $set: { isOnCart: false } }, { new: true });
            await userData.findOneAndUpdate({ _id: userId }, { $pull: { cart: { _id: cartId } } },{new:true} );

            res.json({
                message: "Added to wishlist",
            });
        } else {
            res.json({
                message: "Already Exists in the wishlist",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const addToCartFromWishlist = async (req, res) => {
    try {
        const userDatas = req.session.user;
        const userId = userDatas._id;
        const productId = req.query.productId;

        const user = await userData.findById(userId);
        const product = await productData.findById(productId);
        const existed = await userData.findOne({ _id: userId, "cart.product": productId });

        if (existed) {
            res.json({ message: "Product is already in cart!!" });
        } else {
            await productData.findOneAndUpdate(
                { _id: productId },
                { $set: { isOnCart: true } }
            );

            await userData.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        cart: {
                            product: product._id,
                            quantity: 1,
                        },
                    },
                },
                { new: true }
            );
            const itemIndex = user.wishlist.indexOf(productId);

            if (itemIndex >= 0) {
                await userData.updateOne({ _id: userId }, { $pull: { wishlist: productId } });
                await productData.updateOne({ _id: productId }, { isWishlisted: false });
            } else {
                res.json({
                    message: "Error Occured!",
                });
            }

            res.json({ message: "Moved to cart from wishlist" });
        }
    } catch (error) {
        console.log(error.message);
    }
};

const removeWishlist = async (req, res) => {
    try {
        const userDatas = req.session.user;
        const userId = userDatas._id;
        const productId = req.query.productId;

        const user = await userData.findById(userId);
        
        const itemIndex = user.wishlist.indexOf(productId);

        if (itemIndex >= 0) {
            await userData.updateOne({ _id: userId }, { $pull: { wishlist: productId } });
            await productData.updateOne({ _id: productId }, { isWishlisted: false });

            res.status(200).send();
        } else {
            res.json({
                message: "Error Occured!",
            });
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {

    loadWishlist,
    addToWishlist,
    addToCartFromWishlist,
    removeWishlist,
}