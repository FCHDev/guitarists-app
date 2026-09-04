import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

// Barre de recherche en haut de l'admin : recherche d'un guitariste
// existant à modifier, avec les boutons rapides Modifier/Supprimer/Annuler
// une fois une fiche chargée dans le formulaire (pratique pour ne pas avoir
// à redescendre jusqu'au bouton du formulaire, tout en bas de la page).
// `saveLabel` vient d'AdminPage : "Modifier" tant que rien n'a changé sur la
// fiche chargée, "Enregistrer" dès qu'un champ est modifié ou qu'une photo
// est chargée.
const AdminSearchBar = ({
  guitarists,
  selectedGuitarist,
  onSelect,
  editingId,
  isSaving,
  saveLabel,
  onSave,
  onDelete,
  onCancel,
}) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "1em", width: "100%" }}>
    <Autocomplete
      options={guitarists}
      getOptionLabel={(option) => `${option.prenom || ""} ${option.nom || ""}`.trim()}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={selectedGuitarist}
      onChange={(event, newValue) => onSelect(newValue)}
      style={{ flex: 1 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Rechercher un guitariste à modifier"
          margin="normal"
          fullWidth
        />
      )}
    />
    {editingId && (
      <div style={{ display: "flex", gap: "0.5em", marginTop: "1em" }}>
        <Button
          variant="contained"
          size="large"
          endIcon={<AiOutlineEdit />}
          onClick={onSave}
          disabled={isSaving}
        >
          {saveLabel}
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="large"
          endIcon={<AiOutlineDelete />}
          onClick={onDelete}
          disabled={isSaving}
        >
          {isSaving ? "..." : "Supprimer"}
        </Button>
        <Button variant="outlined" size="large" onClick={onCancel} disabled={isSaving}>
          Annuler
        </Button>
      </div>
    )}
  </div>
);

export default AdminSearchBar;
