import React, { useEffect, useState } from "react";
import CardPost from "../components/CardPost";
import PostAPI from "../services/postAPI";
import CardsContentLoader from "../loaders/CardsContentLoader";

import { Grid } from "@mui/material";
import Header from "../components/Header";

const CardsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState(null);

  useEffect(() => {
    fetchAllCards();
  }, []);

  const fetchAllCards = async () => {
    const data = await PostAPI.findAll();
    setCards(data.data);
    setIsLoading(false);
    // console.log(data);
  };

  return (
    <div className="posts">
      <Header />
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
          cards.map((card) => <CardPost card={card} key={card.id} />)
        )}
      </Grid>
    </div>
  );
};

export default CardsPage;
