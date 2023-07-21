const express = require('express');
const user_route = express();
const bodyParser = require('body-parser')
const path =require('path');
const multer =require('multer');
const session = require('express-session');
const template_path=path.join(__dirname,'../templates/views');
const static_path=path.join(__dirname,"../public");
const auth = require('../middlewares/auth');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
user_route.use(express.json());
user_route.use(express.urlencoded({ extended: true }));

user_route.set('view engine','ejs');
user_route.set('views',template_path);

user_route.use(express.static(static_path));
user_route.use(session({secret:'keyboard cat'}));


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/images'));
    },
    filename:function(req,file,cb){
        const name= Date.now()+'-'+file.originalname;
        cb(null,name);

    }
});

const upload = multer({storage:storage});

const userController = require('../controllers/userControllers');

user_route.get('/register',auth.isLogout, userController.registerLoad);
user_route.post('/register', upload.single('image'),userController.register);


user_route.get('/',auth.isLogout ,userController.loginLoad);
user_route.post('/login',userController.login);
user_route.get('/logout',auth.isLogin,userController.logout);

user_route.get('/dashboard',auth.isLogin,userController.dashboardLoad);
user_route.post('/save-chat',userController.saveChat);

user_route.get('*',function(req,res){
    res.redirect('/');  
})
module.exports =user_route;