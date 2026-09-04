import { createTheme } from "@mui/material/styles";

// Thème MUI global, basé sur la palette "Ocean Breeze" choisie par François :
// un fond sombre façon SaaS, avec l'ambre comme couleur d'accent principale
// et le rouge-orangé comme accent secondaire (survols, mises en avant).
// Centraliser ces couleurs ici évite de les répéter dans chaque composant.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#f5a427" },
    secondary: { main: "#f05918" },
    background: {
      default: "#101a22",
      paper: "#293f4e",
    },
    text: {
      primary: "#f4f7f9",
      secondary: "#7ab3d2",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#182530",
        },
        notchedOutline: {
          borderColor: "rgba(122, 179, 210, 0.35)",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#7ab3d2",
        },
      },
    },
  },
});

export default theme;
