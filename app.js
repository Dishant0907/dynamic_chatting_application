const mongoose=require('mongoose');
const User=require('./models/userModels');
const Chat=require('./models/chatModel');
const DB="mongodb+srv://trydishant2002:dishant07@cluster0.vakiaia.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(DB,{
    useNewUrlParser: true,
  useUnifiedTopology: true
//   useCreateIndex:true,   
//   useFindAndModify:false
}).then(()=>{
    console.log('connection successful');
}).catch((err)=> console.log(err)); 
const app = require('express')();   
const http =require('http').Server(app);
const   userRoute= require('./routes/userRoute');
const { captureRejectionSymbol } = require('stream');

app.use('/',userRoute);
const io = require('socket.io')(http);

var usp=io.of('/user-namespace');
usp.on('connection',async function(socket){
    console.log('user connected');
    
    var userId = socket.handshake.auth.token;

    await User.findByIdAndUpdate({_id:userId},{$set:{is_online:'1'}});

    socket.broadcast.emit('getOnlineUser',{user_id:userId});

    socket.on('disconnect',async function(){
        console.log('user disconnected');

        var userId = socket.handshake.auth.token;

    await User.findByIdAndUpdate({_id:userId},{$set:{is_online:'0'}});
    socket.broadcast.emit('getOfflineUser',{user_id:userId});
    });
    

// chatting implementation
socket.on('newChat',function(data){
    socket.broadcast.emit('loadNewChat',data);
    
})

// load old chats

socket.on('existsChat',async function(data){
    var chats= await Chat.find({$or:[
        {sender_id:data.sender_id,receiver_id:data.receiver_id},
        {sender_id:data.receiver_id,receiver_id:data.sender_id}
    ]});

    socket.emit('loadChats',{chats:chats});
});



});





http.listen(8000, () =>{
    console.log('server is running');
});