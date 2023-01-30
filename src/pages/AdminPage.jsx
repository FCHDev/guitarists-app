import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AiFillCaretLeft, AiOutlineUserAdd } from "react-icons/ai";
import { set } from "firebase/database";
import { refDb } from "../services/firebaseConfig";
import { db, storage } from "../services/firebaseConfig";
import { MenuItem, Select } from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { Link } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";

const AdminPage = ({ guitarists }) => {
  /// UPLOAD IMAGES
  const [imageUpload, setImageUpload] = useState(null);
  const [picPreview, setPicPreview] = useState();

  const uploadImage = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImgURL(url);
          setPicPreview(
            <div className="photo-preview">
              <img src={url} alt={nom + " " + prenom} />
            </div>
          );
        });
        // alert("Image uploaded");
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
    {
      value: "🇦🇺",
      label: "🇦🇺",
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
  const id = guitarists.length;
  const [imgURL, setImgURL] = useState("");
  const [mort, setMort] = useState(false);
  const [nationalite, setNationalite] = useState("");
  const [nom, setNom] = React.useState("");
  const [prenom, setPrenom] = React.useState("");
  const [ville, setVille] = React.useState("");
  const [wiki, setWiki] = React.useState("");
  const [ytRef, setYtRef] = React.useState("https://www.youtube.com/embed/");

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
  const handleYtChange = (event) => {
    setYtRef(event.target.value);
  };

  // FONCTION POUR CREER NOUVEAU GUITARISTE
  const writeUserData = () => {
    set(refDb(db, `/${id}`), {
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
      ytRef,
    });
    setAnneeMort("");
    setAnneeNaissance("");
    setArea("");
    setBio("");
    setBio2("");
    setBio3("");
    setBio4("");
    setImgURL("");
    setMort(false);
    setNationalite("");
    setNom("");
    setPrenom("");
    setVille("");
    setWiki("");
    setYtRef("https://www.youtube.com/embed/");
    setPicPreview("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    writeUserData();
    // REFRESH PAGE ET SCROLL AU TOP APRES SOUMISSION
    window.scrollTo(0, 0);
    alert(prenom + nom + " a bien été ajouté !");
  };

  return (
    <div className="admin" id="top">
      <nav>
        <Link to="/">
          <Button
            variant="contained"
            className="button-back"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              marginLeft: "1em",
            }}
          >
            <AiFillCaretLeft />
            <span>Accueil</span>
          </Button>
        </Link>
      </nav>
      <h1 style={{ marginTop: "0.5em" }}>Ajouter une photo</h1>
      <div className="upload-section">
        <label htmlFor="inputTag">
          {" "}
          Select Image
          <input
            id="inputTag"
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          />{" "}
        </label>
        <label htmlFor="inputButtonTag">
          {" "}
          Upload Image
          <input id="inputButtonTag" type="button" onClick={uploadImage} />{" "}
        </label>
      </div>
      {picPreview}

      <div className="separation"></div>

      <h1 style={{ marginTop: "0.5em" }}>Ajouter un guitariste</h1>
      <form>
        <TextField
          id="id"
          label="ID"
          disabled={true}
          multiline
          maxRows={1}
          value={id}
          className="search"
          margin="normal"
          type="text"
          fullWidth={true}
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
        <TextField
          id="ytRef"
          label="YouTube URL"
          multiline
          maxRows={4}
          value={ytRef}
          className="search"
          margin="normal"
          type="search"
          fullWidth={true}
          onChange={handleYtChange}
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
      <ScrollToTop smooth={true} />
    </div>
  );
};

export default AdminPage;
