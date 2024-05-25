import React from "react";
import Logo from "../img/logo1.jpg";

const Footer = () => {
  return (
    <footer>
      <div className="logo">
        <img src={Logo} alt="image" />
        <h2>Community Quill</h2>
      </div>
    </footer>
  );
};

export default Footer;
