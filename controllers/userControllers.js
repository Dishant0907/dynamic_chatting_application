const User=require('../models/userModels');
const Chat = require('../models/chatModel')
const registerLoad = async (req,res)=>{

    try {
        
        res.render('register');

        
    } catch (err) {
        console.log(err);
    }
}

const register = async (req,res)=>{
    try {
        const user= new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            image:'images/'+req.file.filename
        });
         await user.save()
        




        res.render('login');
        
        
    } catch (err) {
        console.log(err);
    }
}


const loginLoad = async (req,res)=>{

    try {
        res.render('login');

        
    } catch (err) {
        console.log(err);
    }
}
const login = async (req,res)=>{

    try {
        const email = req.body.email;
        const password =req.body.password;

        const userData = await User.findOne({ email:email});
        const userPassword = await User.findOne({password:password});
        if(userData){
            if(userPassword){
                req.session.user = userData;
                res.redirect('/ dashboard');
            }
            else{
                res.send('password is wrong');
            }

        }
        else{
            res.render('register');
        }

        
    } catch (err) {
        console.log(err);
    }
}
const logout = async (req,res)=>{

    try {
        req.session.destroy();
        res.redirect('/');

        
    } catch (err) {
        console.log(err);
    }
}
const dashboardLoad = async (req,res)=>{

    try {
        var users = await User.find({_id: { $nin:[req.session.user._id]}});
        res.render('dashboard',{user:req.session.user,users:users});

        
    } catch (err) {
        console.log(err);
    }
}

const saveChat = async(req,res) =>{
    try {
         var chat=new Chat({
            sender_id:req.body.sender_id,
            receiver_id:req.body.receiver_id,
            message:req.body.message
            
        });
        var newChat = await chat.save();    

        res.status(200).send({success:true,msg:'Chat inserted',data:newChat});
    } catch (error) {
        console.log('error');
        res.status(400).send({success:false,msg:error.message})
    }
}


module.exports ={ registerLoad,register,dashboardLoad,login,loginLoad,logout,saveChat};