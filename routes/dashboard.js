var express = require('express');
var dashboard = express.Router();
var userModule=require('../modules/user');
var passCateModel=require('../modules/password_category');
var passModel=require('../modules/add_password');
var umuserModel=require('../modules/musers');
var carModel=require('../modules/cars');
var imageModel=require('../modules/image_upload');
var productModel=require('../modules/product');


const mongoose = require('mongoose');
//const paginate = require('express-paginate');
//const app = express();
//app.use(paginate.middleware(10, 50));

var multer = require('multer');
var fs = require('fs');
//var path = require('path');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {

    if (file.fieldname === 'image') {
      cb(null, './public/uploads')

    } 
    else if (file.fieldname === 'product_image') {
      cb(null, './public/product')

    }
    else {
      cb(null, './public/uploads/icon')
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, Date.now()+file.originalname)

    }
    else if (file.fieldname === 'product_image') {
      cb(null, Date.now()+file.originalname)
    }
    else {
      cb(null, Date.now()+file.originalname)
    }

  }
});
var upload = multer({ storage: storage });
// middleware for the access control or checking the loggin user.
function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/login');
  }
  next();
}
/* GET home page. */
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

// middleware for checking the duplicate name
function checkUsername(req,res,next){
  var uname=req.body.uname;
  var checkexitemail=userModule.findOne({username:uname});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Password Management System', msg:'Username Already Exit' });

 }
 next();
  });
}
// middleware for checking the duplicate email


function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail=userModule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Password Management System', msg:'Email Already Exit' });

 }
 next();
  });
}

/************* LTE DASHBOARD ROUTES **************/

dashboard.get('/', function(req, res, next) {
  
  res.render('index',{ title: 'Signup Form'});

});

dashboard.get('/about_us', function(req, res, next) {
  
  res.render('about');

});

dashboard.get('/dashboard', checkLoginUser,function(req, res, next) {
  //console.log("0000");
  res.render('pages/dashboard');

});

dashboard.get('/login', function(req, res, next) {
  
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser==null)
  {

 res.render('pages/login', { title: 'Login Form',msg:'',loginUser:''});

  }
  else{
    res.redirect('/dashboard');

  }



});

dashboard.post('/login', function(req, res, next) {
  console.log(req.body);
  var username=req.body.uname;
  var password=req.body.password;
 
  var check_module=userModule.findOne({username:username});
  console.log(check_module);
  check_module.exec((err,data)=>{
    if(data==null){
     res.render('pages/login', { title: 'Login Form',msg:'Invalid data',loginUser:''});
    }
    else{
      
     var getId=data._id;
     var getPassword=data.password;
     console.log("bef_working");
     if(bcrypt.compareSync(password,getPassword)){
      console.log("working");
       var token = jwt.sign({ userID: getId }, 'loginToken',{expiresIn: "10h"});
       console.log(token);
       localStorage.setItem('userToken', token);
       localStorage.setItem('loginUser', username);
       res.redirect('/dashboard');
 
     }else{
       res.render('pages/login', { title: 'Password Management System', msg:"Invalid Username and Password.",loginUser:'' });
     
     }
     res.render('pages/login', { title: 'Login Form',msg:'passed data',loginUser:''});
 
    }
  });
  //console.log(check_module);
  //console.log(req.body);
  
   // res.render('index', { title: 'Login Form',msg:''});
 });
  

dashboard.get('/signup', function(req, res, next) {
  //console.log("0000");
  res.render('pages/register', { title: 'Signup Form',msg:'',loginUser:'' });

});

dashboard.post('/signup', function(req, res, next) {
  console.log(req);
  console.log(req.body);
  //res.render('pages/register', { title: 'Signup Form',msg:'',loginUser:'' });
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var confpassword=req.body.confpassword;
  if(password !=confpassword){
    res.render('pages/register', { title: 'Signup Form',msg:'Password and confirm password does not match',loginUser:'' });
  }
  else{

    var hash = bcrypt.hashSync(password, 10);
    var userDetails= new userModule({
      _id:mongoose.Types.ObjectId(),
      username:username,
      email:email,
      password:hash
    });
    userDetails.save((err,doc)=>{
      if(err) throw err;
     
     // res.redirect('/signup');
     res.render('pages/register',{title:'Signup form',msg:'registration has been completed',loginUser:''});
    });
  }

});

dashboard.get('/add_category',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');

 res.render('pages/add_category',{title:'Add New Category',msg:'',loginUser:loginUser,success:'',errors:''});

});

dashboard.post('/add_category',checkLoginUser,function(req,res,next){
  var loginUser=localStorage.getItem('loginUser');

console.log(req.body);
var category=req.body.passwordCategory;
var category_details=new passCateModel({
  passord_category:category
});

category_details.save((err,data)=>{
  if(err) throw err;
  res.redirect('/all_category');
 //res.render('pages/add_category',{title:'Add New Category',msg:'Category has been added',loginUser:loginUser,success:'',errors:''});
});

});

// category listing

dashboard.get('/all_category',checkLoginUser,function(req,res,next){
  var loginUser=localStorage.getItem('loginUser');
  var all=passCateModel.find({});
  var get=all.exec((err,data)=>{
    if(err) throw err;
    res.render('pages/category_listing',{title:'Category Listing',msg:'Category Listing',records:data,loginUser:loginUser,success:'',errors:''});

  });
 // console.log(all);

});


dashboard.get('/add_password', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');

  var all_Cate=passCateModel.find({});
  all_Cate.exec((err,data)=>{
    if(err) throw err;
  res.render('pages/add_password',{title:'Add New password for category',msg:'',records:data,loginUser:loginUser,success:'',errors:''});
  });

  //res.render('pages/add_password',{title:'Add New password for category',msg:'',records:data,loginUser:loginUser,success:'',errors:''});

});


dashboard.post('/add_password',checkLoginUser,function(req,res,next){
  var loginUser=localStorage.getItem('loginUser');

  var pass_cat=req.body.pass_cat;
  var project_name=req.body.project_name;
  var pass_details=req.body.pass_details;
  var all_Cate=passCateModel.find({});

 var pass_instance= new passModel({
  password_category:pass_cat,
  project_name:project_name,
  password_detail:pass_details,
 });

 pass_instance.save((err,doc)=>{
   if(err) throw err;

   all_Cate.exec((err,data)=>{
    if(err) throw err;
    res.render('pages/add_password',{title:'Add New password for category',msg:'Password has been added',records:data,loginUser:loginUser,success:'',errors:''});
  });

 });


});


dashboard.get('/add_products', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');

  var all_Cate=passCateModel.find({});
  all_Cate.exec((err,data)=>{
    if(err) throw err;
    console.log(data);
  res.render('pages/add_product',{title:'Add New Products for category',msg:'',records:data,loginUser:loginUser,success:'',errors:''});
  });


});

dashboard.post('/add_products', upload.single('product_image'),function(req,res,next){
  var loginUser=localStorage.getItem('loginUser');
  //productModel
  console.log(req.body);
  var product_image=req.file.filename;

  console.log(product_image);
  var product_instance= new productModel({
    name:req.body.product_name,
    img:product_image,
    category:req.body.pass_cat,
   });
  
   product_instance.save((err,doc)=>{
     if(err) throw err;
  
     res.render('pages/add_product',{title:'Product has been addeed successfully',msg:'Product has been added',records:'',loginUser:loginUser,success:'',errors:''});
  
   });
  
});


dashboard.get('/get_all_products', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  console.log(232);

   var get_product=productModel.find().populate('category');
   get_product.exec(function(err,data){
     if(err) throw err;
   //  let person = {firstName:"John", lastName:"Doe", age:50, eyeColor:data};
   let person = {eyeColor:data};

     res.send(person);
     console.log(data);
   });

});




dashboard.get('/get_pass_data',function(req,res,next){
  var dd= passModel.find({});
  console.log(dd);

});


dashboard.get('/category_edit/:id', checkLoginUser,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcat_id=req.params.id;
  var getpassCategory=passCateModel.findById(passcat_id);
  getpassCategory.exec(function(err,data){
    if(err) throw err;
 
    res.render('pages/edit_pass_category', { title: 'Password Management System',loginUser: loginUser,errors:'',success:'',records:data,id:passcat_id});

  });
});

dashboard.post('/category_edit/', checkLoginUser,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcat_id=req.body.id;
    console.log(passcat_id);
  var passwordCategory=req.body.passwordCategory;
    console.log(passwordCategory);
  //res.send(passwordCategory);
  //console.log(passwordCategory);
 var update_passCat= passCateModel.findByIdAndUpdate(passcat_id,{passord_category:passwordCategory});
 update_passCat.exec(function(err,doc){
    if(err) throw err;
 
res.redirect('/all_category');
  });
});

dashboard.get('/category_delete/:id', checkLoginUser,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcat_id=req.params.id;
  var passdelete=passCateModel.findByIdAndDelete(passcat_id);
  passdelete.exec(function(err){
    if(err) throw err;
    res.redirect('/all_category');
  });
});

dashboard.get('/image_upload', (req, res) => {
  res.render('pages/imagesPage');
  // imageModel.find({}, (err, items) => {
  //     if (err) {
  //         console.log(err);
  //         res.status(500).send('An error occurred', err);
  //     }
  //     else {
  //         res.render('pages/imagesPage', { items: items });
  //     }
  // });
});


/* when we have multiple file to send then use this use multiple in the view and follow the below points */
// upload.array('blogimage', 5)
//   var fileinfo = req.files;
// use multiple in the views

//  upload.single('image') pass this as a middleware
// use req.file.filname  for storing in the db.

dashboard.post('/image_upload', upload.any(), (req, res, next) => {

  // console.log(req);
  //console.log("hitt");
  //res.send(req.files);
   var array_images=req.files;
   var photoArray= new Array();
   var iconArray= new Array();
 
   for(var i=0;i<array_images.length;i++){
    
     if(array_images[i].fieldname==='image'){
       var image=array_images[i].filename;
       photoArray.push(image);
     }
     else{
       var image=array_images[i].filename;
       iconArray.push(image);
     }
     
   }
   var obj = {
       name: req.body.name,
       desc: req.body.desc,
       img: JSON.stringify(photoArray),
       icon:JSON.stringify(iconArray),
   }
   console.log("obj "+obj);
   imageModel.create(obj, (err, item) => {
       if (err) {
           console.log(err);
       }
       else {
       // console.log("objjjjjjjjj "+obj);
          res.redirect('/fetch_image_upload');
       }
   });
 });

 dashboard.get('/fetch_image_upload',function(req,res,next){
  var get_all_image=imageModel.find({});
  console.log("get_all_image "+get_all_image);

  get_all_image.exec((err,data)=>{
    if(err) throw err;
   // console.log(data);
   console.log("objjjjjjjjj "+data);

    res.render('pages/get_image_pages',{records:data});
  });

});

dashboard.get('/fetch_image_upload/:page', function(req, res, next) {
  var perPage = 3;
    var page = req.params.page || 1;

    imageModel.find({})
           .skip((perPage * page) - perPage)
           .limit(perPage).exec(function(err,data){
                if(err) throw err;
                imageModel.countDocuments({}).exec((err,count)=>{
                  console.log(777);
                  console.log(data);
                           
  res.render('pages/get_image_pages', { records: data,
  current: page,
  pages: Math.ceil(count / perPage) });
  
});
  });
  
});

dashboard.get('/delete_image_pages/:id',function(req,res,next){
  var get_id=req.params.id;
  var del_images_data=imageModel.findByIdAndDelete(get_id);
  del_images_data.exec((err)=>{
    if(err) throw err;
    res.redirect('/fetch_image_upload');
  });

});

dashboard.get('/edit_image_pages/:id',checkLoginUser,function(req,res,next){

  var get_id=req.params.id;
  var get_info_by_id=imageModel.findById(get_id);
  get_info_by_id.exec((err,data)=>{
    if(err) throw err;
    console.log(data);
    res.render('pages/edit_image_data',{records:data,id:get_id});
  });
  //console.log(get_info_by_id);
});

dashboard.post('/edit_image_update/',checkLoginUser,function(req,res,next){

  console.log(req);
  console.log("update data");
  var passcat_id=req.body.id;
  console.log("passid"+passcat_id);
  // console.log(req.body);

//   var name=req.body.name;
  var desc=req.body.desc;
  console.log(desc);
  
//  var update_passCat= imageModel.findByIdAndUpdate(passcat_id,{name:name,desc:desc});
//  update_passCat.exec(function(err,doc){
//     if(err) throw err;
 
// res.redirect('/fetch_image_upload');
//   });

});

dashboard.get('/invoice', function(req, res, next) {
  //console.log("0000");
  res.render('pages/invoice');

});

dashboard.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/login');
});


/*********************/


module.exports = dashboard;
