import React, { useEffect, useState } from "react";
import CardPost from "./CardPost";

import { Grid, Box, Skeleton } from "@mui/material";

const Cards = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState(null);

  useEffect(() => {
    fetch("http://localhost:1337/api/guitarists/?populate=*", {
      method: "GET",
      headers: {
        Accept: "Application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setCards(response.data);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="posts">
      <h1>Liste des guitaristes</h1>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
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
