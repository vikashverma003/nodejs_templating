const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

//mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
//var conn =mongoose.Collection;
var productSchema =new mongoose.Schema({
    name: String,
    desc: String,
    img:String,
    category: { type: Schema.Types.ObjectId, ref: 'password_categories' }, // here we are passing the table name instead of schema name.
    date:{
        type: Date, 
        default: Date.now }
});
productSchema.plugin(mongoosePaginate);
var productModel = mongoose.model('products', productSchema);
module.exports=productModel;