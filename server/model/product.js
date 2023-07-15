const mongoose = require("mongoose")

var schema = new mongoose.Schema({

   
    product_name: {
        type: String,
        require: true,
        
    },
    product_details: {
        type: String,
        require: true
    },
    category: {
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
const Usersignup = mongoose.model("productCollection", schema)
// module.exports.Usersignup= Usersignup

module.exports = {
    Usersignup: Usersignup,
};
