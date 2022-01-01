const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

//mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
//var conn =mongoose.Collection;
var imageSchema =new mongoose.Schema({
    name: String,
    desc: String,
    img:String,
    icon:String,
    date:{
        type: Date, 
        default: Date.now }
});
imageSchema.plugin(mongoosePaginate);
var imageModel = mongoose.model('image_upload', imageSchema);
module.exports=imageModel;