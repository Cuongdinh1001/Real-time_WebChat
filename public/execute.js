var socket = io("https://cuongdinh.herokuapp.com");
$(document).ready(function(){
    $("#loginForm").show();
    $("#createRoom").hide();
    $("#chatForm").hide();
    // click Register
    $("#btnRegister").click(function(){
        socket.emit("client-send-username", $("#txtUsername").val());
    });
    // click Log out
    $("#btnLogout").click(function(){
        socket.emit("user-logout");
        $("#loginForm").show(2000);
        $("#chatForm").hide(1000);
    });
    // click join chat room
    $("#btbJoin").click(function(){
        socket.emit("user-send-roomName", $("#txtRoomID").val());
    });
    // click chat
    $("#btnSend").click(function(){
        socket.emit("user-send-message", $("#txtMessage").val());
        $("#txtMessage").val("");
    });
    // is typing...?
    $("#txtMessage").focusin(function(){
        socket.emit("whoIsTyping");
    });
    $("#txtMessage").focusout(function(){
        socket.emit("whoIsEndTyping");
    });

});
socket.on("server-send-reg-failed", function(){
    alert("username has already registered");
});
socket.on("server-send-reg-success", function(data){
    $("#currentUser").html(data);
    $("#loginForm").hide(1000);
    $("#createRoom").show(1000);
});

socket.on("server-send-userArr", function(data){
    $("#boxContent").html("");
    data.forEach(function(i){
        $("#boxContent").append("<div class='user'>" + i + "</div>");
    });
});

socket.on("server-send-join-room-success", function(data){
    $("#currentRoom").data(data);
    $("#createRoom").hide(1000);
    $("#chatForm").show(1000);
});

socket.on("server-send-roomArr", function(data){
    $("#boxListRoom").html("");
    data.forEach(function(i){
        $("#boxListRoom").append("<div class='room'>" + i + "</div>");
    });
});

socket.on("server-send-message", function(data){
    $("#listMessages").append("<div class='ms'>" + data.un + ":" + data.ct + "</div>");
});
socket.on("Typing", function(data){
    $("#whoIsTyping").html(data);
});
socket.on("endTyping", function(){
    $("#whoIsTyping").html("");
});
