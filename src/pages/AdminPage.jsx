import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AiOutlineUserAdd } from "react-icons/ai";
import { ref, set } from "firebase/database";
import { db } from "../services/firebaseConfig";
import { MenuItem, Select } from "@mui/material";

const AdminPage = () => {
  /// CONST
  const optionArea = [
    {
      value: "North America",
      label: "USA",
    },
    {
      value: "Europe",
      label: "Europe",
    },
  ];
  const optionNationalite = [
    {
      value: "🇺🇸",
      label: "🇺🇸",
    },
    {
      value: "🇬🇧",
      label: "🇬🇧",
    },
    {
      value: "🇫🇷",
      label: "🇫🇷",
    },
    {
      value: "🇨🇦",
      label: "🇨🇦",
    },
    {
      value: "🇮🇪",
      label: "🇮🇪",
    },
  ];
  // STATES
  const [anneeMort, setAnneeMort] = useState("");
  const [anneeNaissance, setAnneeNaissance] = useState("");
  const [area, setArea] = useState("");
  const [bio, setBio] = useState("");
  const [bio2, setBio2] = useState("");
  const [bio3, setBio3] = useState("");
  const [bio4, setBio4] = useState("");
  const [id, setId] = useState("");
  const [imgURL, setImgURL] = useState("/uploads/");
  const [mort, setMort] = useState(false);
  const [nationalite, setNationalite] = useState("");
  const [nom, setNom] = React.useState("");
  const [prenom, setPrenom] = React.useState("");
  const [ville, setVille] = React.useState("");
  const [wiki, setWiki] = React.useState("");

  // HANDLES
  const handleAnneeMort = (event) => {
    setAnneeMort(event.target.value);
  };
  const handleAnneeNaissance = (event) => {
    setAnneeNaissance(event.target.value);
  };
  const handleArea = (event) => {
    setArea(event.target.value);
  };
  const handleBio = (event) => {
    setBio(event.target.value);
  };
  const handleBio2 = (event) => {
    setBio2(event.target.value);
  };
  const handleBio3 = (event) => {
    setBio3(event.target.value);
  };
  const handleBio4 = (event) => {
    setBio4(event.target.value);
  };
  const handleIDChange = (event) => {
    setId(event.target.value);
  };
  const handleImgURLChange = (event) => {
    setImgURL(event.target.value);
  };
  const handleMortChange = (event) => {
    setMort(event.target.value);
  };
  const handleNationaliteChange = (event) => {
    setNationalite(event.target.value);
  };
  const handleNameChange = (event) => {
    setNom(event.target.value);
  };
  const handlePrenomChange = (event) => {
    setPrenom(event.target.value);
  };
  const handleVilleChange = (event) => {
    setVille(event.target.value);
  };
  const handleWikiChange = (event) => {
    setWiki(event.target.value);
  };

  // FONCTION POUR CREER NOUVEAU GUITARISTE
  const writeUserData = () => {
    set(ref(db, `/${id}`), {
      anneeMort,
      anneeNaissance,
      area,
      bio,
      bio2,
      bio3,
      bio4,
      id,
      imgURL,
      mort,
      nationalite,
      nom,
      prenom,
      ville,
      wiki,
    });
    setAnneeMort("");
    setAnneeNaissance("");
    setArea("");
    setBio("");
    setBio2("");
    setBio3("");
    setBio4("");
    setId("");
    setImgURL("/uploads");
    setMort(false);
    setNationalite("");
    setNom("");
    setPrenom("");
    setVille("");
    setWiki("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    writeUserData();
  };

  return (
    <div className="admin">
      <h1>Ajouter un guitariste</h1>
      <form>
        <TextField
          required
          id="id"
          label="ID"
          multiline
          maxRows={4}
          value={id}
          className="search"
          margin="normal"
          type="search"
          fullWidth={true}
          onChange={handleIDChange}
        />
        <TextField
          id="nom"
          label="Nom"
          multiline
          maxRows={1}
          value={nom}
          className="search"
          margin="normal"
          type="search"
          fullWidth={true}
          onChange={handleNameChange}
        />
        <TextField
          id="prenom"
          label="Prénom"
          multiline
          maxRows={1}
          value={prenom}
          className="search"
          margin="normal"
          type="search"
          fullWidth={true}
          onChange={handlePrenomChange}
        />
        <TextField
          id="anneeNaissance"
          label="Annee Naissance"
          multiline
          maxRows={4}
          value={anneeNaissance}
          onChange={handleAnneeNaissance}
          className="search"
          margin="normal"
          type="search"
          fullWidth={true}
        />
        <TextField
          id="anneeMort"
          label="Annee Mort"
          multiline
          maxRows={4}
          value={anneeMort}
          onChange={handleAnneeMort}
          className="search"
          margin="normal"
          type="search"
          fullWidth={true}
        />
        <TextField
          id="area"
          select
          label="Area"
          value={area}
          onChange={handleArea}
          className="search"
          margin="normal"
          helperText="Sélectionnez la zone"
          fullWidth={true}
        >
          {optionArea.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="nationalite"
          select
          label="Nationalité"
          value={nationalite}
          onChange={handleNationaliteChange}
          className="search"
          margin="normal"
          helperText="Sélectionnez la nationalité"
          fullWidth={true}
        >
          {optionNationalite.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Select
          labelId="Décédé(e)"
          id="mort"
          value={mort}
          label="Décédé(e)"
          onChange={handleMortChange}
          className="search"
          margin="dense"
          fullWidth={true}
        >
          <MenuItem value={true}>Oui</MenuItem>
          <MenuItem value={false}>Non</MenuItem>
        </Select>

        <TextField
          id="ville"
          label="Ville"
          multiline
          maxRows={4}
          value={ville}
          onChange={handleVilleChange}
          className="search"
          margin="normal"
          type="search"
          fullWidth={true}
        />
        <TextField
          id="wiki"
          label="Wiki URL"
          multiline
          maxRows={4}
          value={wiki}
          onChange={handleWikiChange}
          className="search"
          margin="normal"
          type="search"
          fullWidth={true}
        />
        <TextField
          id="bio"
          label="Bio"
          multiline
          maxRows={20}
          value={bio}
          onChange={handleBio}
          className="search"
          margin="normal"
          type="search"
          fullWidth={true}
        />
        <TextField
          id="bio2"
          label="Bio 2"
          multiline
          maxRows={20}
          value={bio2}
          onChange={handleBio2}
          className="search"
          margin="normal"
          type="search"
          fullWidth={true}
        />
        <TextField
          id="bio3"
          label="Bio 3"
          multiline
          maxRows={20}
          value={bio3}
          onChange={handleBio3}
          className="search"
          margin="normal"
          type="search"
          fullWidth={true}
        />
        <TextField
          id="bio4"
          label="Bio 4"
          multiline
          maxRows={20}
          value={bio4}
          onChange={handleBio4}
          className="search"
          margin="normal"
          type="search"
          fullWidth={true}
        />
        <TextField
          id="imgURL"
          label="Image URL"
          multiline
          maxRows={4}
          value={imgURL}
          className="search"
          margin="normal"
          type="search"
          fullWidth={true}
          onChange={handleImgURLChange}
        />
        <div style={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<AiOutlineUserAdd />}
            onClick={handleSubmit}
          >
            Ajouter
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminPage;
