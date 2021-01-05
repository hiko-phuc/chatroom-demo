"use strict"

var express = require('express');

var app = express();

var http = require('http').Server(app);
var socketio = require('socket.io')(http);

var port = process.env.port || 3456;

app.use(express.static(__dirname + "/../Client"));
app.use(express.static(__dirname + "/../node_modules"));

var users = [];
var messages = [];

socketio.on('connection', function(socket){
    console.log("A user connected.");

    socket.on('join', function(userName){
        console.log('user change name to : ' + userName);
        if (userName) {
            socket.userName = userName;
            users.push(userName);
        }

        //notice it is not socket.emit('refreshUserList', users)
        socketio.sockets.emit('refreshUserList', {users, messages});
    });

    socket.on('message', function(message){
        console.log(socket.userName + ' says: ' + message);

        var data = {
            userName: socket.userName,
            message: message
        };
        messages.push(data);

        socketio.emit('message', data);
    });

    socket.on('disconnect', function(){

        //when user log off, the name should be removed from the user list
        var removedUserIndex = users.indexOf(socket.userName);
        if(removedUserIndex >= 0){
            users.splice(removedUserIndex, 1);
        }

        //notice it is not socket.emit('refreshUserList', users)
        socketio.sockets.emit('refreshUserList', users);

        console.log('user ' + socket.userName + ' disconnected');
    });
});

http.listen(port, function(){
    console.log("Running on PORT: " + port);
});