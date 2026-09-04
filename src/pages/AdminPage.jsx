import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { AiFillCaretLeft } from "react-icons/ai";
import {
  createGuitarist,
  updateGuitarist,
  deleteGuitarist as removeGuitarist,
} from "../services/guitaristsApi";
import { Link, useSearchParams } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import AdminSearchBar from "../components/admin/AdminSearchBar";
import PhotoUploadField from "../components/admin/PhotoUploadField";
import GuitaristFormFields from "../components/admin/GuitaristFormFields";

// Hébergement des photos : Cloudinary (compte gratuit, upload "unsigned"),
// à la place de Firebase Storage qui demande depuis peu un forfait payant.
const CLOUDINARY_CLOUD_NAME = "gho9ewh4";
const CLOUDINARY_UPLOAD_PRESET = "guitaristes";

// État initial du formulaire, réutilisé à la fois pour l'état React et pour
// vider le formulaire (resetForm) après un ajout/une modification.
const emptyFormData = {
  nom: "",
  prenom: "",
  anneeNaissance: "",
  anneeMort: "",
  area: "",
  nationalite: "",
  mort: false,
  ville: "",
  wiki: "",
  bio: "",
  bio2: "",
  bio3: "",
  bio4: "",
  imgURL: "",
  ytRef: "https://www.youtube.com/embed/",
};

const AdminPage = ({ guitarists = [] }) => {
  /// PHOTO
  // imageUpload : fichier choisi mais pas encore envoyé à Cloudinary (l'envoi
  // se fait automatiquement au moment d'enregistrer le guitariste, plus besoin
  // d'un bouton "Upload Image" séparé).
  const [imageUpload, setImageUpload] = useState(null);
  const [picPreview, setPicPreview] = useState();
  const [isSaving, setIsSaving] = useState(false);

  // Tous les champs du formulaire (nom, bio, ville...) regroupés dans un
  // seul objet plutôt qu'un useState par champ : un seul handler générique
  // (handleFieldChange) suffit pour les mettre à jour, au lieu d'une
  // quinzaine de handlers quasi identiques.
  const [formData, setFormData] = useState(emptyFormData);

  // Copie de formData au moment où une fiche existante a été chargée dans
  // le formulaire (null en mode "ajout"). Comparée à formData pour savoir
  // si quelque chose a été modifié depuis (voir hasUnsavedChanges plus bas).
  const [originalFormData, setOriginalFormData] = useState(null);

  // Identifiant (bigint auto-incrémenté par Postgres) du guitariste en cours de modification.
  // null quand on est en mode "ajout d'un nouveau guitariste".
  const [editingId, setEditingId] = useState(null);

  // Arrivée depuis le bouton "Modifier" d'une vignette ou d'une fiche
  // détaillée (lien /admin?edit=<id>) : présélectionne ce guitariste dans le
  // formulaire une fois la liste chargée. hasAppliedEditParam ne s'applique
  // qu'une fois pour ne pas ré-écraser le formulaire à chaque rafraîchissement
  // temps réel de la liste des guitaristes pendant que l'admin travaille.
  const [searchParams] = useSearchParams();
  const [hasAppliedEditParam, setHasAppliedEditParam] = useState(false);

  const handleFieldChange = (name) => (event) => {
    setFormData((previous) => ({ ...previous, [name]: event.target.value }));
  };

  // Envoie le fichier choisi vers Cloudinary si un nouveau a été sélectionné,
  // et renvoie l'URL à enregistrer. Si aucun nouveau fichier n'a été
  // sélectionné, renvoie simplement l'URL déjà en place.
  const resolveImgURL = async () => {
    if (imageUpload == null) {
      return formData.imgURL;
    }
    const uploadData = new FormData();
    uploadData.append("file", imageUpload);
    uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: uploadData }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Échec de l'upload de l'image");
    }
    return data.secure_url;
  };

  // Un fichier a été choisi dans la zone d'envoi de photo : on le mémorise
  // (l'envoi réel a lieu à l'enregistrement) et on génère l'aperçu.
  const handleFileSelected = (file) => {
    setImageUpload(file);
    if (file) {
      setPicPreview(
        <div className="photo-preview">
          <img
            src={URL.createObjectURL(file)}
            alt={`${formData.prenom} ${formData.nom}`}
          />
        </div>
      );
    }
  };

  // Vide le formulaire et repasse en mode "ajout".
  const resetForm = () => {
    setFormData(emptyFormData);
    setOriginalFormData(null);
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
    const loadedData = {
      nom: guitarist.nom || "",
      prenom: guitarist.prenom || "",
      anneeNaissance: guitarist.anneeNaissance || "",
      anneeMort: guitarist.anneeMort || "",
      area: guitarist.area || "",
      nationalite: guitarist.nationalite || "",
      mort: guitarist.mort || false,
      ville: guitarist.ville || "",
      wiki: guitarist.wiki || "",
      bio: guitarist.bio || "",
      bio2: guitarist.bio2 || "",
      bio3: guitarist.bio3 || "",
      bio4: guitarist.bio4 || "",
      imgURL: guitarist.imgURL || "",
      ytRef: guitarist.ytRef || "https://www.youtube.com/embed/",
    };
    setFormData(loadedData);
    setOriginalFormData(loadedData);
    setImageUpload(null);
    setPicPreview(
      guitarist.imgURL ? (
        <div className="photo-preview">
          <img
            src={guitarist.imgURL}
            alt={`${guitarist.prenom || ""} ${guitarist.nom || ""}`}
          />
        </div>
      ) : (
        ""
      )
    );
  };

  useEffect(() => {
    if (hasAppliedEditParam) return;
    const editId = searchParams.get("edit");
    if (!editId || guitarists.length === 0) return;
    const target = guitarists.find(
      (guitarist) => String(guitarist.id) === editId
    );
    if (target) {
      loadGuitaristIntoForm(target);
      setHasAppliedEditParam(true);
    }
    // guitarists est bien nécessaire dans les dépendances : au premier rendu
    // la liste n'est pas encore chargée (fetch async), il faut réessayer une
    // fois qu'elle arrive. Le garde-fou hasAppliedEditParam évite ensuite
    // d'écraser le formulaire à chaque rafraîchissement temps réel suivant,
    // pendant que l'admin travaille dessus. loadGuitaristIntoForm est stable
    // en pratique (recréée à chaque rendu mais son comportement ne dépend que
    // de son argument) : l'omettre évite de relancer l'effet à chaque rendu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, hasAppliedEditParam, guitarists]);

  // FONCTION POUR CREER OU METTRE A JOUR UN GUITARISTE
  const writeUserData = async (resolvedImgURL) => {
    const fields = { ...formData, imgURL: resolvedImgURL };

    if (editingId) {
      // Modification d'un guitariste existant : on réécrit la même ligne.
      await updateGuitarist(editingId, fields);
    } else {
      // Nouveau guitariste : id généré automatiquement par Postgres
      // (identity), plus besoin de le calculer nous-mêmes.
      await createGuitarist(fields);
    }

    resetForm();
  };

  // Logique de sauvegarde partagée entre le bouton du formulaire (en bas de
  // page) et le bouton rapide à côté du champ de recherche (pratique pour ne
  // pas avoir à redescendre jusqu'en bas à chaque modification). Envoie
  // d'abord la photo sur Cloudinary si besoin, puis écrit la fiche.
  const saveGuitarist = async () => {
    const wasEditing = Boolean(editingId);
    const label = `${formData.prenom} ${formData.nom}`.trim();
    setIsSaving(true);
    try {
      const resolvedImgURL = await resolveImgURL();
      await writeUserData(resolvedImgURL);
      // REFRESH PAGE ET SCROLL AU TOP APRES SOUMISSION
      window.scrollTo(0, 0);
      alert(`${label} a bien été ${wasEditing ? "modifié" : "ajouté"} !`);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement : " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveGuitarist();
  };

  // Supprime définitivement le guitariste actuellement chargé dans le
  // formulaire. Demande une confirmation avant, l'action est irréversible.
  const deleteGuitarist = async () => {
    if (!editingId) return;
    const label = `${formData.prenom} ${formData.nom}`.trim();
    const confirmed = window.confirm(
      `Supprimer définitivement ${label} ? Cette action est irréversible.`
    );
    if (!confirmed) return;
    setIsSaving(true);
    try {
      await removeGuitarist(editingId);
      resetForm();
      window.scrollTo(0, 0);
      alert(`${label} a bien été supprimé.`);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression : " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedGuitarist =
    guitarists.find((guitarist) => guitarist.id === editingId) || null;

  const sortedGuitarists = [...guitarists].sort((a, b) =>
    `${a.nom || ""} ${a.prenom || ""}`.localeCompare(`${b.nom || ""} ${b.prenom || ""}`)
  );

  const cancelEditing = () => loadGuitaristIntoForm(null);

  // Le bouton passe de "Modifier" à "Enregistrer" dès qu'une photo a été
  // choisie ou qu'un champ a changé depuis le chargement de la fiche : tant
  // que rien n'a bougé, "Modifier" ; dès que quelque chose est en attente
  // d'enregistrement, "Enregistrer".
  const hasUnsavedChanges =
    Boolean(editingId) &&
    (imageUpload != null ||
      (originalFormData != null &&
        JSON.stringify(formData) !== JSON.stringify(originalFormData)));

  const saveLabel = isSaving
    ? "Enregistrement..."
    : !editingId
    ? "Ajouter"
    : hasUnsavedChanges
    ? "Enregistrer"
    : "Modifier";

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
      <AdminSearchBar
        guitarists={sortedGuitarists}
        selectedGuitarist={selectedGuitarist}
        onSelect={loadGuitaristIntoForm}
        editingId={editingId}
        isSaving={isSaving}
        saveLabel={saveLabel}
        onSave={saveGuitarist}
        onDelete={deleteGuitarist}
        onCancel={cancelEditing}
      />

      <div className="separation"></div>

      <h1 style={{ marginTop: "0.5em" }}>Photo</h1>
      <PhotoUploadField onFileSelected={handleFileSelected} preview={picPreview} />

      <div className="separation"></div>

      <h1 style={{ marginTop: "0.5em" }}>
        {editingId
          ? `Modifier ${formData.prenom} ${formData.nom}`.trim()
          : "Ajouter un guitariste"}
      </h1>
      <GuitaristFormFields
        formData={formData}
        onFieldChange={handleFieldChange}
        editingId={editingId}
        isSaving={isSaving}
        saveLabel={saveLabel}
        onSubmit={handleSubmit}
        onCancel={cancelEditing}
      />
      <ScrollToTop smooth={true} />
    </div>
  );
};

export default AdminPage;
