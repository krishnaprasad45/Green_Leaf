const model = require("../model/user_register");
const bcrypt = require("bcrypt");

const helperFunction = require("../../helperFunctions/userHelper");
const productmodel = require("../model/product");

const productData = productmodel.products;

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

const viewCart = (req, res) => {
    res.render("Viewcart",{message:""});
};

module.exports = {
    addToCart,
    viewCart,
}