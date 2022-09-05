import React, { useEffect, useState } from "react";
import CardPost from "../components/CardPost";
import PostAPI from "../services/postAPI";
import CardsContentLoader from "../loaders/CardsContentLoader";
import Header from "../components/Header";
import Search from "../components/Search";
import SwitchAlive from "../components/SwitchAlive";
import SwitchArea from "../components/SwitchArea";

import { Grid } from "@mui/material";
import ScrollToTop from "react-scroll-to-top";

const CardsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("");
  const [selectedAreaRadio, setSelectedAreaRadio] = useState("");
  const [totalGuitarists, setTotalGuitarists] = useState("");

  useEffect(() => {
    fetchAllCards();
  }, []);

  const fetchAllCards = async () => {
    const data = await PostAPI.findAll();
    setCards(data.data);
    setIsLoading(false);
    setTotalGuitarists(data.data.length);
  };

  return (
    <div className="posts">
      <Header cards={cards} totalGuitarists={totalGuitarists} />
      <div className="control">
        <Search cards={cards} setSearchTerm={setSearchTerm} />
        <div className="radioSection">
          <SwitchAlive cards={cards} setSelectedRadio={setSelectedRadio} />
          <SwitchArea
            cards={cards}
            setSelectedAreaRadio={setSelectedAreaRadio}
          />
        </div>
      </div>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh", width: "90vw" }}
      >
        {isLoading ? (
          <CardsContentLoader />
        ) : (
          cards
            .filter((card) => {
              return (card.attributes.nom || card.attributes.prenom)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            })
            .filter((card) => {
              if (selectedRadio === "dead") {
                return card.attributes.mort;
              } else if (selectedRadio === "alive") {
                return !card.attributes.mort;
              } else {
                return card;
              }
            })
            .filter((card) => {
              if (selectedAreaRadio === "Europe") {
                return card.attributes.area === "Europe";
              } else if (selectedAreaRadio === "North America") {
                return card.attributes.area === "North America";
              } else {
                return card;
              }
            })
            .sort(function compare(a, b) {
              if (a.attributes.nom < b.attributes.nom) return -1;
              if (a.attributes.nom > b.attributes.nom) return 1;
              return 0;
            })
            .map((card) => <CardPost card={card} key={card.id} />)
        )}
      </Grid>
      <ScrollToTop smooth={true} />
    </div>
  );
};

export default CardsPage;
