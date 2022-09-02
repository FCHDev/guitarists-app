import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { AiFillCaretLeft } from "react-icons/ai";
import Form from "./Form";

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
      {/*GUITARIST DETAILS PART*/}

      <nav>
        <Link to="/">
          <Button style={{ margin: "10px 0" }} variant="contained">
            <AiFillCaretLeft />
            <span>Back</span>
          </Button>
        </Link>
      </nav>
      <Grid container spacing={2}>
        <Grid item sm="4" alignItems="center" justifyContent="center">
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

      {/*COMMENTS PART*/}

      <Grid container spacing={2}>
        {/*FORMULAIRE*/}
        <Grid item md={4} mt={2}>
          <Form />
        </Grid>
        {/*COMMENTS*/}
        <Grid item md={8}>
          <List sx={{ width: "100%", maxWidth: 360, bgcolor: "#EEEEEE" }}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Au top"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Sylvain Rubillort
                    </Typography>
                    {" — Pour moi, c'est le meilleur !"}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="L'émotion avant tout"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      to Damien, Alex, Amélie
                    </Typography>
                    {" — Gros coup de ❤️ ! Vous en pensez quoi ?"}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default Card;
