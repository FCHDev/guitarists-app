import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

// Champ à choix du formulaire admin (zone, nationalité, décès...) : même
// TextField "select" que AdminTextField, mais avec une liste d'options
// passée en props plutôt qu'une saisie libre.
const AdminSelectField = ({ id, label, value, onChange, options, helperText }) => (
  <TextField
    id={id}
    select
    label={label}
    value={value}
    onChange={onChange}
    className="search"
    margin="normal"
    helperText={helperText}
    fullWidth
  >
    {options.map((option) => (
      <MenuItem key={String(option.value)} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);

export default AdminSelectField;
