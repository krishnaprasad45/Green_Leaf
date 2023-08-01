const model = require("../model/user_register");

const productmodel = require("../model/product");

const productData = productmodel.products;
const Category = require("../model/category");
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
        req.session.checkout = true
        const userDatas = req.session.user;

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
      
        if (cart.length === 0) {
            res.render("emptyCart", { userDatas, categoryData ,loggedIn:true, walletBalance});
        } else {
            res.render("viewCart", { userDatas, cart, subTotal, categoryData,loggedIn:true ,walletBalance,message:""});
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


module.exports = {
    addToCart,
    viewCart,
    removeCart,
}