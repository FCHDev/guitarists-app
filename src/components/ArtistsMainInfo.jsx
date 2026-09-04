import React from "react";
import {Cross} from "lucide-react";

// Nom + informations essentielles affichés sur la carte de la page
// d'accueil. Un seul <h3> par carte plutôt qu'un <h1> : la page n'a qu'un
// seul vrai titre de premier niveau (le "guitarists_" du header), pas une
// centaine. Lieu de naissance et âge sur deux lignes distinctes plutôt que
// séparés par un point, à la demande de François.
const ArtistsMainInfo = ({ guitarist }) => {
  const age = guitarist.anneeMort
    ? guitarist.anneeMort - guitarist.anneeNaissance
    : new Date().getFullYear() - guitarist.anneeNaissance;

  return (
    <>
      <h3 className="card-name">
        {guitarist.prenom ? `${guitarist.prenom} ${guitarist.nom}` : guitarist.nom}
      </h3>
      <p className="card-meta">
        <span className="card-flag">{guitarist.nationalite}</span>
        Né à {guitarist.ville}
      </p>
      <p className="card-meta card-meta-age">
        {age} ans
        {guitarist.mort ? <Cross size={11} className="card-meta-icon" /> : null}
      </p>
    </>
  );
};

export default ArtistsMainInfo;
