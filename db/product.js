let mongoose=require('mongoose');

let productSchema=new mongoose.Schema({
    name:String,
    img:String,
    price:{
        type:Number,
        min:0,
    },
    qty:Number,
    rating:Number,
    desc:String
});
let P1=mongoose.model('P1',productSchema);
module.exports=P1;