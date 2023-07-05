const express = require('express');
const app = express();
const { v4: uuidv4 } = require("uuid");

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const {ExpressPeerServer} = require("peer");
const peerServer = ExpressPeerServer(server,{
    debug:true,
});

const port = 4030;
app.set('view engine','ejs');
app.use("/peerjs",peerServer);
app.use(express.static('public'));

app.get('/',async(req,res)=>{
    // res.render('room')
    res.redirect(`/${uuidv4()}`);
})
// app.get('/home',async(req,res)=>{
//     res.sendfile('index.html')
// })

// app.get("/:boat", (req, res) => {
//     res.send(`/${uuidv4()}`);
// });

app.get("/:room", (req, res) => {
    res.render("room", { roomId: req.params.room });
});

// io.on("connection",(socket)=>{
//    // socket.emit("connect",{message: "we are on"})
// console.log('connected')
//     socket.on('disconnect', function () {
//         console.log('user disconnected');
//       });
// })

io.on("connection",(socket)=>{
    socket.on("join-room", (roomId, userId) =>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected",userId)
    })
})



server.listen(port,()=>{
console.log(port);
})