import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
// import Form from "../components/Form";

import Grid from "@mui/material/Grid";
import { Box, Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import Divider from "@mui/material/Divider";
// import ListItemText from "@mui/material/ListItemText";
// import ListItemAvatar from "@mui/material/ListItemAvatar";
// import Avatar from "@mui/material/Avatar";
// import Typography from "@mui/material/Typography";
import { AiFillCaretLeft } from "react-icons/ai";
import { BsBoxArrowInRight } from "react-icons/bs";
import { FaCross } from "react-icons/fa";
import { onValue, ref } from "firebase/database";
import { db } from "../services/firebaseConfig";

const CardPage = () => {
  const { id } = useParams();
  // eslint-disable-next-line
  const [guitarist, setGuitarist] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [wikiURL, setWikiURL] = useState(null);
  const [imgURL, setImgURL] = useState("");
  const [bio, setBio] = useState("");
  const [bio2, setBio2] = useState("");
  const [bio3, setBio3] = useState("");
  const [bio4, setBio4] = useState("");
  const [city, setCity] = useState(null);
  const [born, setBorn] = useState(null);
  const [dead, setDead] = useState(null);

  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        // eslint-disable-next-line
        Object.values([data]).map((guitarist) => {
          setGuitarist(data[id]);
          setIsLoading(true);
          setNom(guitarist[id].nom);
          setPrenom(guitarist[id].prenom);
          setWikiURL(guitarist[id].wiki);
          setImgURL(guitarist[id].imgURL);
          setBio(guitarist[id].bio);
          setBio2(guitarist[id].bio2);
          setBio3(guitarist[id].bio3);
          setBio4(guitarist[id].bio4);
          setCity(guitarist[id].ville);
          setBorn(guitarist[id].anneeNaissance);
          setDead(guitarist[id].anneeMort);

          // console.log(guitarist[id]);
        });
      }
    });
  }, [id]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      <nav>
        <Link to="/">
          <Button variant="contained" className="button-back">
            <AiFillCaretLeft />
            <span>Back</span>
          </Button>
        </Link>
      </nav>

      {/*GUITARIST DETAILS PART*/}
      <Grid container spacing={2} height="auto">
        <Grid item sm={4}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="start"
            className="cardPageImg"
          >
            {isLoading ? (
              <img src={imgURL} alt={nom} className="cardImg" />
            ) : (
              <Skeleton variant="rect" width="100%" height={400} />
            )}
          </Box>
        </Grid>
        <Grid item sm={8} alignItems="center" justifyContent="center">
          {isLoading ? (
            <h1 className="cardBioH1">
              {prenom} {nom}
            </h1>
          ) : (
            "Loading..."
          )}
          <h4 className="cardBioInfoH4">
            Né à {city} en {born}
          </h4>
          <h4 className="cardBioInfoH4">
            {dead ? dead - born : (new Date().getFullYear() - born).toString()}{" "}
            ans
            {dead ? (
              <FaCross style={{ marginLeft: "3px", paddingTop: "3px" }} />
            ) : (
              ""
            )}
          </h4>
          <h3 className="cardBioH4">Biographie</h3>
          <div className="cardBio">
            {isLoading ? (
              <div>
                <p>{bio}</p>
                <p>{bio2}</p>
                <p>{bio3}</p>
                <p>{bio4}</p>
              </div>
            ) : (
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            )}
          </div>

          <p className="go-wiki">
            <a href={wikiURL} target="_blank" rel="noopener noreferrer">
              <BsBoxArrowInRight
                style={{ paddingTop: "3px", color: "#ffb703" }}
              />
              <span>Go to Wiki</span>
            </a>
          </p>
        </Grid>
      </Grid>

      {/*COMMENTS PART*/}
      {/*<Grid container spacing={2} mt={2}>*/}
      {/*  /!*FORMULAIRE*!/*/}
      {/*  <Grid item md={4}>*/}
      {/*    <Form />*/}
      {/*  </Grid>*/}
      {/*  /!*COMMENTS*!/*/}
      {/*  <Grid item md={8}>*/}
      {/*    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "#EEEEEE" }}>*/}
      {/*      <ListItem alignItems="flex-start">*/}
      {/*        <ListItemAvatar>*/}
      {/*          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />*/}
      {/*        </ListItemAvatar>*/}
      {/*        <ListItemText*/}
      {/*          primary="Au top"*/}
      {/*          secondary={*/}
      {/*            <React.Fragment>*/}
      {/*              <Typography*/}
      {/*                sx={{ display: "inline" }}*/}
      {/*                component="span"*/}
      {/*                variant="body2"*/}
      {/*                color="text.primary"*/}
      {/*              >*/}
      {/*                Sylvain Rubillort*/}
      {/*              </Typography>*/}
      {/*              {" — Pour moi, c'est le meilleur !"}*/}
      {/*            </React.Fragment>*/}
      {/*          }*/}
      {/*        />*/}
      {/*      </ListItem>*/}
      {/*      <Divider variant="inset" component="li" />*/}
      {/*      <ListItem alignItems="flex-start">*/}
      {/*        <ListItemAvatar>*/}
      {/*          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />*/}
      {/*        </ListItemAvatar>*/}
      {/*        <ListItemText*/}
      {/*          primary="L'émotion avant tout"*/}
      {/*          secondary={*/}
      {/*            <React.Fragment>*/}
      {/*              <Typography*/}
      {/*                sx={{ display: "inline" }}*/}
      {/*                component="span"*/}
      {/*                variant="body2"*/}
      {/*                color="text.primary"*/}
      {/*              >*/}
      {/*                to Damien, Alex, Amélie*/}
      {/*              </Typography>*/}
      {/*              {" — Gros coup de ❤️ ! Vous en pensez quoi ?"}*/}
      {/*            </React.Fragment>*/}
      {/*          }*/}
      {/*        />*/}
      {/*      </ListItem>*/}
      {/*      <Divider variant="inset" component="li" />*/}
      {/*    </List>*/}
      {/*  </Grid>*/}
      {/*</Grid>*/}
    </div>
  );
};

export default CardPage;
