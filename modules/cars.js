const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
//var conn =mongoose.Collection;
var carsSchema =new mongoose.Schema({
    make:String,
    model:String,
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"musers"
    }

    
});

var carModel = mongoose.model('cars', carsSchema);
module.exports=carModel;