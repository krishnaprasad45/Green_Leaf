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
    imageUrl:[{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required:true
        }
    }],
    stock:{
        type:Number,
        required:true
    },

    isOnCart:{
        type:Boolean,
        default:false
    },

    isWishlisted:{
        type:Boolean,
        default:false
    },

})
const products = mongoose.model("productCollection", schema)

module.exports = {
    products: products
};
