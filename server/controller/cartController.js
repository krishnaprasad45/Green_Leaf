const model = require("../model/user_register");

const productmodel = require("../model/product");
const Razorpay = require("razorpay");

const productData = productmodel.products;
const Category = require("../model/category");
const Coupon = require("../model/couponModel");
const userData = model.user_register;

const addToCart = async (req, res) => {
    
    try {
        const userDatas = req.session.user;
        
        const productId = req.query.id;

        const quantity = req.query.quantity;

        const userId = userDatas._id;


        const product = await productData.findById(productId);
        const existed = await userData.findOne({ _id: userId, "cart.product": productId });
        // const filter={_id:productId}
        if (existed) {
            await userData.findOneAndUpdate(
                { _id: userId, "cart.product": productId },
                { $inc: { "cart.$.quantity": quantity ? quantity : 1 } },
                { new: true }
            );

            return res.json({ message: "Item already in cart!!" });
        } else {
            // await productData.findOneAndUpdate(filter, { isOnCart: true });
            await userData.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        cart: {
                            product: product._id,
                            quantity: quantity ? quantity : 1,
                        },
                    },
                },
                { new: true }
            );

            return res.json({ message: "Item added to cart" });
        }
    } catch (error) {
        console.log(error.message);
        const userData = req.session.user;
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

var  walletBalance=0
const viewCart = async (req, res) => {
    try {
        if(req.session.user){
        req.session.checkout = true
        const userDatas = req.session.user;

        const userId = userDatas._id
        const  userMeta = await userData.findById(userId);
        const wishlistLength = userMeta.wishlist.length;
        const categoryData = await Category.find({ is_blocked: false });

        const user = await userData.findOne({ _id: userId }).populate({path: 'cart'}).populate({path: 'cart.product', model: 'productCollection'});
        const cart = user.cart;
        let subTotal = 0;

        cart.forEach((val) => {
            val.total = val.product.price * val.quantity;
            subTotal += val.total;
        });
       
        if (cart.length === 0) {
            res.render("emptyCart", { userDatas, categoryData ,loggedIn:true, walletBalance});
        } else {
            res.render("viewCart", { userDatas, cart, subTotal, categoryData,loggedIn:true ,wishlistLength,walletBalance,message:"true"});
        }
    }else{
        res.render("viewCart", { userDatas, cart, subTotal, categoryData,loggedIn:true ,walletBalance,message:"false"});

    }

    } catch (error) {
        console.log(error.message);
        const userDatas = req.session.user;
        const categoryData = await Category.find({ is_blocked: false });
        res.render("404", { userDatas, categoryData ,loggedIn:true,walletBalance});
    }
};

const removeCart = async (req, res) => {
    try {
        const userDatas = req.session.user;
        const userId = userDatas._id;
        const productId = req.query.productId;
        const cartId = req.query.cartId;

        await productData.findOneAndUpdate({ _id: productId }, { $set: { isOnCart: false } }, { new: true });

        await userData.updateOne({ _id: userId }, { $pull: { cart: { _id: cartId } } });

        res.status(200).send();
    } catch (error) {
        console.log(error.message);
    }
};

const updateCart = async (req, res) => {
    try {
        const userDatas = req.session.user;
        const data = await userData.find({ _id: userDatas._id }, { _id: 0, cart: 1 }).lean();

        data[0].cart.forEach((val, i) => {
            val.quantity = req.body.datas[i].quantity;
        });

        await userData.updateOne({ _id: userDatas._id }, { $set: { cart: data[0].cart } });
        res.status(200).send();
    } catch (error) {
        console.log(error.message);
    }
};





const checkStock = async (req, res) => {
    try {
        const userData = req.session.user;
        const userId = userData._id;
        

        const userCart = await User.findOne({ _id: userId }).populate("cart.product").lean();
        const cart = userCart.cart;

        let stock = [];

        cart.forEach((element) => {
            if (element.product.stock - element.quantity <= 0) {
                stock.push(element.product);
            }
        });

        if (stock.length > 0) {
            res.json(stock);
        } else {
            res.json({ message: "In stock" });
        }
    } catch (error) {
        console.log(error.message);
    }
};


module.exports = {
    addToCart,
    viewCart,
    removeCart,
    updateCart,
    checkStock,
}