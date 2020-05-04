var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

var userArr = [];
var roomArr = [];

io.on("connection", function(socket){
    console.log("Someone connected: " + socket.id);
    socket.on("client-send-username", function(data){
        if (userArr.indexOf(data)>=0) {
            // fail
            socket.emit("server-send-reg-failed");
        } else {
            // success
            userArr.push(data);
            socket.emit("server-send-reg-success", data);
            socket.username = data;
            io.sockets.emit("server-send-userArr", userArr);
            io.sockets.emit("server-send-roomArr", roomArr);
        }
    });

    socket.on("user-logout", function(){
        // remove user from list
        userArr.splice(userArr.indexOf(socket.username), 1);
        socket.broadcast.emit("server-send-userArr", userArr)  ;
    });

    socket.on("user-send-roomName", function(data){
        if (roomArr.indexOf(data) < 0) {
            roomArr.push(data);
            socket.join(data);
            socket.room = data;
            socket.emit("server-send-join-room-success", data);
            
        }
    });

    socket.on("user-send-message", function(data){
        io.sockets.emit("server-send-message", {un: socket.username, ct: data});
    });

    socket.on("whoIsTyping", function(){
        var s = socket.username + " is typing...";
        socket.broadcast.emit("Typing", s);
    });
    socket.on("whoIsEndTyping", function(){
        socket.broadcast.emit("endTyping");
    });
});

app.get("/", function(req, res){
    res.render("homepage")
});