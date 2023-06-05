import React, { Component } from "react";
import ScrollToDown from "react-scroll-to-bottom";

import Message from "../Message/Message";
import "./Messages.css";

//scroll messages, when height of msg is higher than container
const Messages = ({ messages, name }) => (
  <ScrollToDown className="messages">
    {messages.map((message, i) => (
      <div key={i}>
        <Message message={message} name={name} />
      </div>
    ))}
  </ScrollToDown>
);

export default Messages;
