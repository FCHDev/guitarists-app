import React from "react";
import Typography from "@mui/material/Typography";
import { FaCross } from "react-icons/fa";

const ArtistsMainInfo = ({ guitarist }) => {
  return (
    <div>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        style={{ fontFamily: "'JetBrains Mono', sans-serif" }}
      >
        <span style={{ paddingRight: "6px" }}>{guitarist.nationalite}</span>
        {guitarist.prenom
          ? `${guitarist.nom}, ${guitarist.prenom}`
          : `${guitarist.nom}`}
      </Typography>
      <Typography variant="body1" color="text.primary" pb={1}>
        Né à <strong>{guitarist.ville}</strong> en {guitarist.anneeNaissance}
      </Typography>
      <Typography variant="body1" color="text.primary" pb={1}>
        {guitarist.anneeMort
          ? guitarist.anneeMort - guitarist.anneeNaissance
          : (
              new Date().getFullYear() - guitarist.anneeNaissance
            ).toString()}{" "}
        ans
        <span>
          {guitarist.mort === true ? (
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
