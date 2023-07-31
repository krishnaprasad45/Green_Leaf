const model = require("../model/user_register");
const bcrypt = require("bcrypt");

const helperFunction = require("../../helperFunctions/userHelper");
const productmodel = require("../model/product");

const productData = productmodel.products;
const Category = require("../model/category");
const userData = model.user_register;

const addToCart = async (req, res) => {
    try {
        console.log("addToCart middleware")
        const userDatas = req.session.user;
        console.log(`userdata:${userDatas}`)
        
        const productId = req.query.id;
        console.log(`productid:${productId}`)

        const quantity = req.query.quantity;
        console.log(`quantity>>>>>>>>>:${quantity}`)

        const userId = userDatas._id;
        console.log(`userid:${userId}`)


        const product = await productData.findById(productId);
        const existed = await userData.findOne({ _id: userId, "cart.product": productId });
        // const filter={_id:productId}
        if (existed) {
            await userData.findOneAndUpdate(
                { _id: userId, "cart.product": productId },
                { $inc: { "cart.$.quantity": quantity ? quantity : 1 } },
                { new: true }
            );

            console.log("existed to response : already in cart")
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
            console.log("not existed so ,data inserted to cart")

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
        console.log(" viewcart-try ")
        req.session.checkout = true
        const userDatas = req.session.user;
        console.log(`userDatas: ${userDatas}`)

        const userId = userDatas._id
        console.log(`userid>>>>>>>: ${userId}`)
        // walletBalance=userDatas.wallet.balance
        const categoryData = await Category.find({ is_blocked: false });
        console.log(`categoryData: ${categoryData}`)


        const user = await userData.findOne({ userId }).populate("cart.product").lean();
       console.log(`user..${user}`);
        const cart = user.cart;
        console.log(`cart: ${cart}`)
        
        let subTotal = 0;

        cart.forEach((val) => {
            val.total = val.product.price * val.quantity;
            subTotal += val.total;
        });
      
        if (cart.length === 0) {
            res.render("emptyCart", { userDatas, categoryData ,loggedIn:true, walletBalance});
        } else {
            res.render("cart", { userDatas, cart, subTotal, categoryData,loggedIn:true ,walletBalance});
        }
    } catch (error) {
        console.log(error.message);
        const userDatas = req.session.user;
        const categoryData = await Category.find({ is_blocked: false });
        res.render("404", { userDatas, categoryData ,loggedIn:true,walletBalance});
    }
};

module.exports = {
    addToCart,
    viewCart,
}