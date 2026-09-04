import Button from "@mui/material/Button";
import { AiOutlineEdit, AiOutlineUserAdd } from "react-icons/ai";
import AdminTextField from "./AdminTextField";
import AdminSelectField from "./AdminSelectField";

const AREA_OPTIONS = [
  { value: "North America", label: "USA" },
  { value: "Europe", label: "Europe" },
];

const NATIONALITE_OPTIONS = [
  { value: "🇺🇸", label: "🇺🇸" },
  { value: "🇬🇧", label: "🇬🇧" },
  { value: "🇫🇷", label: "🇫🇷" },
  { value: "🇨🇦", label: "🇨🇦" },
  { value: "🇮🇪", label: "🇮🇪" },
  { value: "🇦🇺", label: "🇦🇺" },
  { value: "🇵🇱", label: "🇵🇱" },
];

const MORT_OPTIONS = [
  { value: true, label: "Oui" },
  { value: false, label: "Non" },
];

// Décrit chaque champ du formulaire, dans l'ordre d'affichage : permet de
// remplacer la quinzaine de <TextField> quasi identiques du fichier
// d'origine par un seul .map(), au lieu de les répéter un par un.
const FORM_FIELDS = [
  { type: "text", name: "nom", label: "Nom", rows: 1 },
  { type: "text", name: "prenom", label: "Prénom", rows: 1 },
  { type: "text", name: "anneeNaissance", label: "Annee Naissance", rows: 4 },
  { type: "text", name: "anneeMort", label: "Annee Mort", rows: 4 },
  {
    type: "select",
    name: "area",
    label: "Area",
    helperText: "Sélectionnez la zone",
    options: AREA_OPTIONS,
  },
  {
    type: "select",
    name: "nationalite",
    label: "Nationalité",
    helperText: "Sélectionnez la nationalité",
    options: NATIONALITE_OPTIONS,
  },
  { type: "select", name: "mort", label: "Décédé(e)", options: MORT_OPTIONS },
  { type: "text", name: "ville", label: "Ville", rows: 4 },
  { type: "text", name: "wiki", label: "Wiki URL", rows: 4 },
  { type: "text", name: "bio", label: "Bio", rows: 20 },
  { type: "text", name: "bio2", label: "Bio 2", rows: 20 },
  { type: "text", name: "bio3", label: "Bio 3", rows: 20 },
  { type: "text", name: "bio4", label: "Bio 4", rows: 20 },
  { type: "text", name: "imgURL", label: "Image URL", rows: 4 },
  { type: "text", name: "ytRef", label: "YouTube URL", rows: 4 },
];

// Formulaire d'ajout/modification d'un guitariste. `formData` et
// `onFieldChange` viennent d'AdminPage (qui garde la main sur l'état et la
// sauvegarde) : ce composant ne fait que l'affichage des champs.
const GuitaristFormFields = ({
  formData,
  onFieldChange,
  editingId,
  isSaving,
  saveLabel,
  onSubmit,
  onCancel,
}) => (
  <form>
    {FORM_FIELDS.map((field) =>
      field.type === "select" ? (
        <AdminSelectField
          key={field.name}
          id={field.name}
          label={field.label}
          value={formData[field.name]}
          onChange={onFieldChange(field.name)}
          options={field.options}
          helperText={field.helperText}
        />
      ) : (
        <AdminTextField
          key={field.name}
          id={field.name}
          label={field.label}
          value={formData[field.name]}
          onChange={onFieldChange(field.name)}
          rows={field.rows}
        />
      )
    )}
    <div style={{ marginTop: "20px", display: "flex", gap: "1em" }}>
      <Button
        variant="contained"
        size="large"
        endIcon={editingId ? <AiOutlineEdit /> : <AiOutlineUserAdd />}
        onClick={onSubmit}
        disabled={isSaving}
      >
        {saveLabel}
      </Button>
      {editingId && (
        <Button variant="outlined" size="large" onClick={onCancel} disabled={isSaving}>
          Annuler la modification
        </Button>
      )}
    </div>
  </form>
);

export default GuitaristFormFields;
