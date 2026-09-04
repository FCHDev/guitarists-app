import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import { AiFillCaretLeft, AiOutlineUserAdd, AiOutlineEdit } from "react-icons/ai";
import { set, push } from "firebase/database";
import { refDb } from "../services/firebaseConfig";
import { db } from "../services/firebaseConfig";
import { MenuItem, Select } from "@mui/material";
import { Link } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";

// Hébergement des photos : Cloudinary (compte gratuit, upload "unsigned"),
// à la place de Firebase Storage qui demande depuis peu un forfait payant.
const CLOUDINARY_CLOUD_NAME = "gho9ewh4";
const CLOUDINARY_UPLOAD_PRESET = "guitaristes";

const AdminPage = ({ guitarists = [] }) => {
  /// UPLOAD IMAGES
  const [imageUpload, setImageUpload] = useState(null);
  const [picPreview, setPicPreview] = useState();
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async () => {
    if (imageUpload == null) return;

    const formData = new FormData();
    formData.append("file", imageUpload);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    setIsUploading(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Échec de l'upload");
      }
      setImgURL(data.secure_url);
      setPicPreview(
        <div className="photo-preview">
          <img src={data.secure_url} alt={nom + " " + prenom} />
        </div>
      );
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'upload de l'image : " + error.message);
    } finally {
      setIsUploading(false);
    }
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
    {
      value: "🇵🇱",
      label: "🇵🇱",
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
  const [imgURL, setImgURL] = useState("");
  const [mort, setMort] = useState(false);
  const [nationalite, setNationalite] = useState("");
  const [nom, setNom] = React.useState("");
  const [prenom, setPrenom] = React.useState("");
  const [ville, setVille] = React.useState("");
  const [wiki, setWiki] = React.useState("");
  const [ytRef, setYtRef] = React.useState("https://www.youtube.com/embed/");

  // Identifiant (= clé Firebase) du guitariste en cours de modification.
  // null quand on est en mode "ajout d'un nouveau guitariste".
  const [editingId, setEditingId] = useState(null);

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

  // Vide le formulaire et repasse en mode "ajout".
  const resetForm = () => {
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
    setImageUpload(null);
    setEditingId(null);
  };

  // Remplit le formulaire avec les données d'un guitariste existant
  // (sélectionné via le champ "Modifier un guitariste existant"), ou vide
  // le formulaire si on désélectionne / annule.
  const loadGuitaristIntoForm = (guitarist) => {
    if (!guitarist) {
      resetForm();
      return;
    }
    setEditingId(guitarist.id);
    setNom(guitarist.nom || "");
    setPrenom(guitarist.prenom || "");
    setAnneeNaissance(guitarist.anneeNaissance || "");
    setAnneeMort(guitarist.anneeMort || "");
    setArea(guitarist.area || "");
    setNationalite(guitarist.nationalite || "");
    setMort(guitarist.mort || false);
    setVille(guitarist.ville || "");
    setWiki(guitarist.wiki || "");
    setBio(guitarist.bio || "");
    setBio2(guitarist.bio2 || "");
    setBio3(guitarist.bio3 || "");
    setBio4(guitarist.bio4 || "");
    setImgURL(guitarist.imgURL || "");
    setYtRef(guitarist.ytRef || "https://www.youtube.com/embed/");
    setImageUpload(null);
    setPicPreview(
      guitarist.imgURL ? (
        <div className="photo-preview">
          <img src={guitarist.imgURL} alt={`${guitarist.prenom || ""} ${guitarist.nom || ""}`} />
        </div>
      ) : (
        ""
      )
    );
  };

  // FONCTION POUR CREER OU METTRE A JOUR UN GUITARISTE
  const writeUserData = () => {
    const fields = {
      anneeMort,
      anneeNaissance,
      area,
      bio,
      bio2,
      bio3,
      bio4,
      imgURL,
      mort,
      nationalite,
      nom,
      prenom,
      ville,
      wiki,
      ytRef,
    };

    if (editingId) {
      // Modification d'un guitariste existant : on réécrit le même nœud,
      // sous la même clé.
      set(refDb(db, String(editingId)), { ...fields, id: editingId });
    } else {
      // Nouveau guitariste : clé unique générée par Firebase plutôt que
      // guitarists.length, qui pouvait créer des collisions (deux ajouts
      // simultanés, ou ajout après suppression).
      const newGuitaristRef = push(refDb(db));
      set(newGuitaristRef, { ...fields, id: newGuitaristRef.key });
    }

    resetForm();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const wasEditing = Boolean(editingId);
    const label = `${prenom} ${nom}`.trim();
    writeUserData();
    // REFRESH PAGE ET SCROLL AU TOP APRES SOUMISSION
    window.scrollTo(0, 0);
    alert(`${label} a bien été ${wasEditing ? "modifié" : "ajouté"} !`);
  };

  const selectedGuitarist =
    guitarists.find((guitarist) => guitarist.id === editingId) || null;

  const sortedGuitarists = [...guitarists].sort((a, b) =>
    `${a.nom || ""} ${a.prenom || ""}`.localeCompare(`${b.nom || ""} ${b.prenom || ""}`)
  );

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

      <h1 style={{ marginTop: "0.5em" }}>Modifier un guitariste existant</h1>
      <Autocomplete
        options={sortedGuitarists}
        getOptionLabel={(option) => `${option.prenom || ""} ${option.nom || ""}`.trim()}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={selectedGuitarist}
        onChange={(event, newValue) => loadGuitaristIntoForm(newValue)}
        className="search"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Rechercher un guitariste à modifier"
            margin="normal"
            fullWidth
          />
        )}
      />

      <div className="separation"></div>

      <h1 style={{ marginTop: "0.5em" }}>
        {editingId ? "Modifier la photo" : "Ajouter une photo"}
      </h1>
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
          {isUploading ? "Envoi en cours..." : "Upload Image"}
          <input
            id="inputButtonTag"
            type="button"
            onClick={uploadImage}
            disabled={isUploading}
          />{" "}
        </label>
      </div>
      {picPreview}

      <div className="separation"></div>

      <h1 style={{ marginTop: "0.5em" }}>
        {editingId
          ? `Modifier ${prenom} ${nom}`.trim()
          : "Ajouter un guitariste"}
      </h1>
      <form>
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
        <div style={{ marginTop: "20px", display: "flex", gap: "1em" }}>
          <Button
            variant="contained"
            size="large"
            endIcon={editingId ? <AiOutlineEdit /> : <AiOutlineUserAdd />}
            onClick={handleSubmit}
          >
            {editingId ? "Modifier" : "Ajouter"}
          </Button>
          {editingId && (
            <Button
              variant="outlined"
              size="large"
              onClick={() => loadGuitaristIntoForm(null)}
            >
              Annuler la modification
            </Button>
          )}
        </div>
      </form>
      <ScrollToTop smooth={true} />
    </div>
  );
};

export default AdminPage;
