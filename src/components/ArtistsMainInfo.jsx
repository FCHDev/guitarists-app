import React from "react";
import Typography from "@mui/material/Typography";
import { FaCross } from "react-icons/fa";

const ArtistsMainInfo = ({ card }) => {
  return (
    <div>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        style={{ fontFamily: "'JetBrains Mono', sans-serif" }}
      >
        <span style={{ paddingRight: "6px" }}>
          {card.attributes.nationalite}
        </span>
        {card.attributes.prenom
          ? `${card.attributes.nom}, ${card.attributes.prenom}`
          : `${card.attributes.nom}`}
      </Typography>
      <Typography variant="body1" color="text.primary" pb={1}>
        Né à <strong>{card.attributes.ville}</strong> en{" "}
        {card.attributes.anneeNaissance}
      </Typography>
      <Typography variant="body1" color="text.primary" pb={1}>
        {card.attributes.anneeMort
          ? card.attributes.anneeMort - card.attributes.anneeNaissance
          : (
              new Date().getFullYear() - card.attributes.anneeNaissance
            ).toString()}{" "}
        ans
        <span>
          {card.attributes.mort === true ? (
            <FaCross style={{ marginLeft: "3px", paddingTop: "3px" }} />
          ) : (
            ""
          )}
        </span>
      </Typography>
    </div>
  );
};

export default ArtistsMainInfo;
