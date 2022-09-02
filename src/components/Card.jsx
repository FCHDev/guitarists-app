import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { Skeleton } from "@mui/material";
import Button from "@mui/material/Button";

const Card = () => {
  const { id } = useParams();
  const [cardState, setCardState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // console.log(id);
    fetch(`${API_URL}/api/guitarists/${id}?populate=*`)
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        setCardState(res);
        setIsLoading(true);
      });
  }, [id]);

  return (
    <div>
      <nav>
        <Link to="/">
          <Button style={{ margin: "10px 0" }} variant="contained">
            Back
          </Button>
        </Link>
      </nav>
      <Grid
        container
        spacing={2}
        // direction="column"
        alignItems="center"
        justifyContent="center"
        // style={{ minHeight: "100vh" }}
      >
        <Grid
          item
          sm="4"
          spacing={0}
          alignItems="center"
          justifyContent="center"
        >
          {isLoading ? (
            <img
              src={API_URL + cardState.data.attributes.pic.data.attributes.url}
              alt={cardState.data.attributes.pic.data.attributes.name}
              className="cardImg"
            />
          ) : (
            <Skeleton variant="rect" width="100%" height={400} />
          )}
        </Grid>
        <Grid item sm="8" alignItems="center" justifyContent="center">
          {isLoading ? (
            <h1 className="cardBioH1">
              {cardState.data.attributes.prenom} {cardState.data.attributes.nom}
            </h1>
          ) : (
            "Loading..."
          )}
          <p className="cardBio">
            {isLoading ? (
              `${cardState.data.attributes.bio}`
            ) : (
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            )}
          </p>
        </Grid>
      </Grid>
    </div>
  );
};

export default Card;
