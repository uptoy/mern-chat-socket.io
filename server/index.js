const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
//socket.ioを渡すことで新しいインスタンスは初期化される
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());//client,serverAPI許可
app.user(router)

//user接続時(connectイベント・データを受信する)
io.on('connect', (socket) => {
    //client→server:'join'イベントデータを受信する
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);
        //user.roomの初期化
        socket.join(user.room);
        //room内にいる特定のuserに通知
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
        //room内にいる送信者を含む全員に通知
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
        //server→client:'roomData'イベントデータを送信する
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });


        callback();
    });
    //client→server:'sendMessage'イベントデータを受信する
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        //server→client:'message'イベントデータを送信する
        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();
    });
    //user切断時(disconnectionイベント・データを受信する)
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            //server→client:'message'イベントデータを送信する
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            //server→client:'roomData'イベントデータを送信する
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));