const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
//var conn =mongoose.Collection;
var muserSchema =new mongoose.Schema({
    name:String,
    age:String,
    cars:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"cars"
    }]

    
});

var muserModel = mongoose.model('musers', muserSchema);
module.exports=muserModel;