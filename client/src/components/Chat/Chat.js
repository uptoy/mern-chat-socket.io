import React, { useState, useEffect } from 'react'
//User判別
import queryString from 'query-string'
import io from 'socket.io-client'
import './Chat.css'
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import TopBar from '../TopBar/TopBar';
import Input from '../Input/Input';

const ENDPOINT = 'localhost:5000'

let socket

const Chat = ({ location }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [users, setUsers] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState('')

    useEffect(() => {
        const { name, room } = queryString.parse(location.search)
        //console.log(location.search) name=input-name&input-room==room
        //console.log{name,room} Object{name:"input-name",room:"input-room"}
        //socketとサーバーを紐
        socket = io(ENDPOINT)

        setName(name)
        setRoom(room)
        //console.log(socket) socketのインスタンス表示

        //clientからserverににオブジェクトを渡す
        socket.emit('join', { name, room }, (error) => {
            if (error) {
                alert(error)
            }
        })
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);


    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    //[ENDPOINT, location.search]の内容が変更したときのみ処理が走る
    return (
        <div className="outerContainer">
            <div className="container">
                <TopBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users} />
        </div>
    )
}

export default Chat