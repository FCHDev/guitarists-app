import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer">
      © {currentYear} François Chevalier | Tous droits réservés
    </div>
  );
};

export default Footer;
