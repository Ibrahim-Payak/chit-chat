import React, { Component } from "react";
import "./InfoBar.css";

import onlineIcon from "../../icons/onlineIcon.png";
import closeIcon from "../../icons/closeIcon.png";

const InfoBar = ({ room }) => {
  return (
    <div className="infoBar">
      <div className="leftInnerContainer">
        <img className="onlineIcon" src={onlineIcon} alt="Online Image" />
        {/* room name is dynamic */}
        <h3>{room}</h3>
      </div>
      <div className="rightInnerContainer">
        {/*when user click this, user should leave the chat */}
        <a href="/">
          <img src={closeIcon} alt="Close Image" />
        </a>
      </div>
    </div>
  );
};

export default InfoBar;
