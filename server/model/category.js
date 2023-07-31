
const mongoose = require("mongoose")
const categorySchema = new mongoose.Schema({
 
    category: {
        type: String,
        required: true
    },

    imageUrl:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required:true
        }
    },
    description:{
        type:String,
        required:true
    },
    is_blocked:{
        type: Boolean,
        default: false
    }
})


const category = mongoose.model("category", categorySchema)

module.exports = category ;
