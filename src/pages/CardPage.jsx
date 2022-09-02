import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { Box, Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { AiFillCaretLeft } from "react-icons/ai";
import Form from "../components/Form";
import PostAPI from "../services/postAPI";
import { BsBoxArrowInRight } from "react-icons/bs";
import { FaCross } from "react-icons/fa";
import Header from "../components/Header";

const CardPage = () => {
  const { id } = useParams();
  const [cardState, setCardState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [wikiURL, setWikiURL] = useState(null);
  const [city, setCity] = useState(null);
  const [born, setBorn] = useState(null);
  const [dead, setDead] = useState(null);

  const fetchCard = async () => {
    const data = await PostAPI.findOne(id);
    setCardState(data);
    setIsLoading(true);
    setWikiURL(data.data.attributes.wiki);
    setCity(data.data.attributes.ville);
    setBorn(data.data.attributes.anneeNaissance);
    setDead(data.data.attributes.anneeMort);
    // console.log(data);
    // console.log(data.data.attributes.ville);
  };

  useEffect(() => {
    fetchCard();
  }, []);

  return (
    <div>
      <nav>
        <Link to="/">
          <Button style={{ margin: "10px 0" }} variant="contained">
            <AiFillCaretLeft />
            <span>Back</span>
          </Button>
        </Link>
      </nav>

      {/*GUITARIST DETAILS PART*/}
      <Grid container spacing={2} height="auto">
        <Grid item sm="4">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="start"
            className="cardPageImg"
          >
            {isLoading ? (
              <img
                src={
                  API_URL + cardState.data.attributes.pic.data.attributes.url
                }
                alt={cardState.data.attributes.pic.data.attributes.name}
                className="cardImg"
              />
            ) : (
              <Skeleton variant="rect" width="100%" height={400} />
            )}
          </Box>
        </Grid>
        <Grid item sm="8" alignItems="center" justifyContent="center">
          {isLoading ? (
            <h1 className="cardBioH1">
              {cardState.data.attributes.prenom} {cardState.data.attributes.nom}
            </h1>
          ) : (
            "Loading..."
          )}
          <h4 className="cardBioH4">
            Né à {city} en {born}
          </h4>
          <h4 className="cardBioH4">
            {dead ? dead - born : (new Date().getFullYear() - born).toString()}{" "}
            ans
            {dead ? (
              <FaCross style={{ marginLeft: "3px", paddingTop: "3px" }} />
            ) : (
              ""
            )}
          </h4>
          <h4>Biographie</h4>
          <p className="cardBio">
            {isLoading ? (
              `${cardState.data.attributes.bio}`
            ) : (
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            )}
          </p>

          <p className="savoir-plus">
            <a href={wikiURL} target="_blank" rel="noopener noreferrer">
              <BsBoxArrowInRight style={{ paddingTop: "3px" }} />
              <span>Go to Wiki</span>
            </a>
          </p>
        </Grid>
      </Grid>

      {/*COMMENTS PART*/}
      <Grid container spacing={2} mt={2}>
        {/*FORMULAIRE*/}
        <Grid item md={4}>
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

export default CardPage;
