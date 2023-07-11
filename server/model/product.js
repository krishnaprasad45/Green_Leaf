const mongoose = require("mongoose")

var schema = new mongoose.Schema({

    category: {
        type: String,
        require: true
    },
    product_name: {
        type: String,
        require: true,
        unique: true
    },
    product_details: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    quantity: {
        type: String,
        require: true
    },
    product_img: {
        type: String,
        require: true
    },

})
const Usersignup = mongoose.model("userSignUp", schema)
// module.exports.Usersignup= Usersignup

module.exports = {
    Usersignup: Usersignup,
};
