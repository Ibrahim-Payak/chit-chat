import React, { useState, useEffect } from "react";
import queryString from "query-string"; //to retrive data from url
import io from "socket.io-client";

import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

let socket;

const Chat = ({}) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]); //to track all messages
  const [message, setMessage] = useState(""); //to track single mesages
  const [users, setUsers] = useState("");
  const endpoint = "localhost:5000";

  useEffect(() => {
    const { name, room } = queryString.parse(window.location.search);

    var connectionOptions = {
      "force new connection": true,
      reconnectionAttempts: "Infinity",
      timeout: 10000,
      transports: ["websocket"],
    };

    //pass end point to server
    socket = io.connect(endpoint, connectionOptions);

    setName(name);
    setRoom(room);

    //to emit event from client side socket
    socket.emit("join", { name, room }, () => {
      // alert(error);
    });

    //unmounting (disconnect)

    return () => {
      socket.emit("disconnect");

      //turn off instance of client socket
      socket.off();
    };

    // it will rerender if value of this array change
  }, [endpoint, window.location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      //push current message to our messages array
      //spread all message from array and add cur message
      setMessages([...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages]);

  //fucn for sending messages
  const sendMessage = (event) => {
    //to prevent from default behavior, when key press
    //to prevent from full page refresh
    event.preventDefault();

    if (message) {
      //once the message has sent, ip field should be empty
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="innerContainer">
        {/* passing room to infobar */}
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
