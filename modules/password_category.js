const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
//var conn =mongoose.Collection;
var passcatSchema =new mongoose.Schema({
    //_id:mongoose.Schema.Types.ObjectId,
    passord_category: {type:String, 
        required: true,
        index: {
            unique: true,        
        }},

    date:{
        type: Date, 
        default: Date.now }
});

var passCateModel = mongoose.model('password_categories', passcatSchema);
module.exports=passCateModel;