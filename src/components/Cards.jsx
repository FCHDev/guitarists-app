import React, { useEffect, useState } from "react";
import CardPost from "./CardPost";
import PostAPI from "../services/postAPI";

import { Grid, Box, Skeleton } from "@mui/material";

const Cards = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState(null);

  useEffect(() => {
    fetchAllCards();
  }, []);

  const fetchAllCards = async () => {
    const data = await PostAPI.findAll();
    setCards(data.data);
    setIsLoading(false);
    // console.log(data.data);
  };

  return (
    <div className="posts">
      <h1>Guitarists Book</h1>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh", width: "80vw" }}
      >
        {isLoading ? (
          <Box>
            <Skeleton variant="rectangular" width={410} height={68} />
            <Skeleton width="60%" />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Box>
        ) : (
          cards.map((card) => <CardPost card={card} key={card.id} />)
        )}
      </Grid>
    </div>
  );
};

export default Cards;
