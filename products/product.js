
const mongoose= require("mongoose");

const productSchema= new mongoose.Schema({

name:{
    type:String,
    required:true,
    min:2,
    max:100

},
like:{
    type:Number,
    default:0
},
description:{
    type:String,
    required:true,
    min:20,
    max:200

}
})
const product= new mongoose.model("product", productSchema);
module.exports = product;
