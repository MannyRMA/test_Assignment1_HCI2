const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let button_list = [];



let times_button_been_pressed = 1;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    button_list.push(socket);
    socket.username = (button_list.length).toString();
    console.log("Connected a socket: %s sockets connected", button_list.length);

    socket.on('disconnect', () => {
        let index = button_list.indexOf(socket.username);
        button_list.splice(index, 1);
        console.log('user disconnected: %s sockets connected', button_list.length);
    });

    socket.on('click', function (data) {

        if(socket.username === "1" && times_button_been_pressed % 2 === 1) {
            times_button_been_pressed++;
            console.log("button 1 pressed correctly");
            socket.emit('is_correctly_pressed', true);
        }
        // THIS IS A CASE WHERE WE NEED THE BEEP SOUND
        else if(socket.username === "1" && times_button_been_pressed % 2 != 1) {
            console.log("BEEEEEEEP");
            socket.emit('is_correctly_pressed', false);
        }
        else if(socket.username === "2" && times_button_been_pressed % 2 === 0) {
            console.log("button 2 pressed correctly now its time for button 1");
            times_button_been_pressed++;
            socket.emit('is_correctly_pressed', true);
        }
        // OTHER CASE WHERE WE NEED THE BEEP
        else if(socket.username === "2" && times_button_been_pressed % 2 != 0) {
            console.log("BEEEEEEEP");
            socket.emit('is_correctly_pressed', false);
        }
        // SOME OTHER CASE THAT CAN BREAK THE PROGRAM?
        else {
            console.log("BEEEEEEEP");
            socket.emit('is_correctly_pressed', false);
        }
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});