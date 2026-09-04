import TextField from "@mui/material/TextField";

// Champ texte du formulaire admin : regroupe les props communes à la
// quinzaine de champs du formulaire (style "search", pleine largeur,
// multiline...) pour ne pas les répéter à chaque TextField.
const AdminTextField = ({ id, label, value, onChange, rows = 4 }) => (
  <TextField
    id={id}
    label={label}
    multiline
    maxRows={rows}
    value={value}
    onChange={onChange}
    className="search"
    margin="normal"
    type="search"
    fullWidth
  />
);

export default AdminTextField;
