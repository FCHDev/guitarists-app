import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import { Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
import { AiFillCaretLeft } from "react-icons/ai";
import { FaCross } from "react-icons/fa";
import { ArrowRight, Pencil } from "lucide-react";
import { fetchGuitaristById } from "../services/guitaristsApi";
import { cloudinaryDetailImage } from "../utils/cloudinaryUrl";

const CardPage = ({ isConnected }) => {
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

  // Bios très longues (plusieurs paragraphes) vs très courtes (David
  // Gilmour, par ex.) : on limite l'affichage initial à peu près à la même
  // hauteur pour toutes les fiches (voir .cardBio--clamped), et on affiche
  // un bouton "Lire la suite" uniquement quand le texte dépasse réellement
  // cette hauteur.
  const [bioExpanded, setBioExpanded] = useState(false);
  const [bioOverflows, setBioOverflows] = useState(false);
  const bioRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setBioExpanded(false);

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

  useLayoutEffect(() => {
    const el = bioRef.current;
    if (!isLoaded || !el) {
      setBioOverflows(false);
      return;
    }
    setBioOverflows(el.scrollHeight > el.clientHeight + 1);
    // On ne mesure qu'à l'état replié (bioExpanded volontairement absent des
    // dépendances) : une fois dépliée, la hauteur naturelle du texte ne
    // "déborde" plus de rien, ça fausserait la mesure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, bio, bio2, bio3, bio4]);

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
          {/* Un seul panneau "carte" (même habillage que les cartes de l'accueil :
              fond, bordure, coins arrondis) plutôt qu'une grille MUI flottant sur
              le fond de page. La vidéo est en pleine largeur SOUS le bloc
              photo+texte (et non plus empilée dans la colonne de texte comme
              avant) : les deux colonnes du haut restent à hauteur égale, plus de
              grand vide sous la photo. */}
          <div className="cardPagePanel">
            {/* Discret mais visible : ne s'affiche que pour un admin connecté,
                emmène directement sur la fiche admin avec ce guitariste déjà
                sélectionné. */}
            {isConnected && isLoaded ? (
              <Link
                to={`/admin?edit=${id}`}
                className="cardPanelEditBtn"
                title="Modifier cette fiche"
                aria-label="Modifier cette fiche"
              >
                <Pencil size={14} aria-hidden="true" />
              </Link>
            ) : null}
            <div className="cardPanelTop">
              <div className="cardPanelPhoto">
                {isLoaded ? (
                  <img
                    src={cloudinaryDetailImage(imgURL)}
                    alt={nom}
                    className={`cardImg${dead ? " cardImg--deceased" : ""}`}
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    sx={{ width: "100%", aspectRatio: "4 / 5", borderRadius: "14px" }}
                  />
                )}
              </div>

              <div className="cardPanelText">
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
                <div
                  ref={bioRef}
                  className={`cardBio${!bioExpanded ? " cardBio--clamped" : ""}`}
                >
                  {isLoaded ? (
                    <>
                      <p>{bio}</p>
                      <p>{bio2}</p>
                      <p>{bio3}</p>
                      <p>{bio4}</p>
                    </>
                  ) : (
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  )}
                </div>
                {isLoaded && bioOverflows ? (
                  <button
                    type="button"
                    className="cardBioToggle"
                    onClick={() => setBioExpanded((previous) => !previous)}
                  >
                    {bioExpanded ? "Réduire" : "Lire la suite"}
                  </button>
                ) : null}

                {wikiURL ? (
                  <a
                    href={wikiURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cardWikiCta"
                  >
                    Voir sur Wikipédia
                    <ArrowRight size={14} aria-hidden="true" />
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>

            {/*INCRUSTE YOUTUBE*/}
            {ytRef ? (
              <div className="cardVideoWrap">
                <h3 className="cardBioH4">Vidéo</h3>
                {/* Conteneur en ratio 16:9 (padding-top en %) plutôt qu'une
                    hauteur fixe en pixels : la vidéo garde ses proportions à
                    n'importe quelle largeur d'écran, y compris mobile. */}
                <div
                  className="cardVideoFrame"
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "56.25%",
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
                      borderRadius: "12px",
                    }}
                  ></iframe>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPage;
