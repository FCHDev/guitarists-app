import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { Box, Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
import { AiFillCaretLeft } from "react-icons/ai";
import { BsBoxArrowInRight } from "react-icons/bs";
import { FaCross } from "react-icons/fa";
import { fetchGuitaristById } from "../services/guitaristsApi";
import { cloudinaryDetailImage } from "../utils/cloudinaryUrl";

const CardPage = () => {
  const { id } = useParams();
  // isLoaded ne passe à true qu'une fois la fiche récupérée avec succès :
  // sert à la fois à afficher les Skeleton pendant le chargement et à
  // savoir si on peut afficher le contenu.
  const [isLoaded, setIsLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [wikiURL, setWikiURL] = useState(null);
  const [imgURL, setImgURL] = useState("");
  const [ytRef, setYtRef] = useState("");
  const [bio, setBio] = useState("");
  const [bio2, setBio2] = useState("");
  const [bio3, setBio3] = useState("");
  const [bio4, setBio4] = useState("");
  const [city, setCity] = useState(null);
  const [born, setBorn] = useState(null);
  const [dead, setDead] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchGuitaristById(id)
      .then((guitarist) => {
        if (!isMounted) return;
        setNom(guitarist.nom);
        setPrenom(guitarist.prenom);
        setWikiURL(guitarist.wiki);
        setImgURL(guitarist.imgURL);
        setYtRef(guitarist.ytRef);
        setBio(guitarist.bio);
        setBio2(guitarist.bio2);
        setBio3(guitarist.bio3);
        setBio4(guitarist.bio4);
        setCity(guitarist.ville);
        setBorn(guitarist.anneeNaissance);
        setDead(guitarist.anneeMort);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Erreur de chargement du guitariste :", error);
        if (isMounted) setNotFound(true);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="cardPageWrapper">
      <nav>
        <Link to="/">
          <Button
            variant="contained"
            className="button-back"
            style={{ position: "absolute", top: 0, left: 0, marginLeft: "1em" }}
          >
            <AiFillCaretLeft />
            <span>Back</span>
          </Button>
        </Link>
      </nav>

      {notFound ? (
        <div className="cardPageNotFound">
          <h1 className="cardBioH1">Guitariste introuvable</h1>
          <p>Cette fiche n'existe pas ou plus.</p>
          <Link to="/">
            <Button variant="contained" className="button-back">
              <AiFillCaretLeft />
              <span>Retour à l'accueil</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="cardPageContent">
          {/*GUITARIST DETAILS PART*/}
          <Grid container spacing={2} height="auto">
            <Grid item xs={12} sm={4}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="start"
                className="cardPageImg"
              >
                {isLoaded ? (
                  <img
                    src={cloudinaryDetailImage(imgURL)}
                    alt={nom}
                    className={`cardImg${dead ? " cardImg--deceased" : ""}`}
                  />
                ) : (
                  <Skeleton variant="rect" width="100%" height={400} />
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} alignItems="center" justifyContent="center">
              {isLoaded ? (
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
                {isLoaded ? (
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
                    style={{ paddingTop: "3px", color: "#f5a427" }}
                  />
                  <span>Go to Wiki</span>
                </a>
              </p>

              {/*INCRUSTE YOUTUBE*/}
              {ytRef ? (
                // Conteneur en ratio 16:9 (padding-top en %) plutôt qu'une
                // hauteur fixe en pixels : la vidéo garde ses proportions à
                // n'importe quelle largeur d'écran, y compris mobile.
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "56.25%",
                    marginTop: "1rem",
                  }}
                >
                  <iframe
                    src={ytRef}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  ></iframe>
                </div>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default CardPage;
