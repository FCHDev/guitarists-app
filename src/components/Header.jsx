import React from "react";

const Header = ({ card }) => {
  const totalGuitarist = () => {
    console.log(card.data.length());
  };

  return (
    <div className="header">
      <h1>guitarists_</h1>
      {/*AJOUTER UN COMPTEUR*/}
      <h4>greatests of all time</h4>
    </div>
  );
};

export default Header;
