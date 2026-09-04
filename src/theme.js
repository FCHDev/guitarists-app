import { createTheme } from "@mui/material/styles";

// Thème MUI, basé sur la palette "Ocean Breeze" : l'ambre reste la couleur
// d'accent principale et le rouge-orangé l'accent secondaire dans les deux
// modes ; seuls le fond, le texte et les champs changent entre sombre et
// clair. Les mêmes valeurs vivent aussi en variables CSS dans index.scss
// (pour les classes "maison" comme .card ou .filter-chip) : les deux se
// pilotent ensemble via l'attribut data-theme posé sur <html> (voir App.js).
const ACCENT = "#f5a427";
const ACCENT_HOVER = "#f05918";

const MODE_CONFIG = {
  dark: {
    background: { default: "#101a22", paper: "#293f4e" },
    text: { primary: "#f4f7f9", secondary: "#7ab3d2" },
    inputBg: "#182530",
    inputBorder: "rgba(122, 179, 210, 0.35)",
    inputLabel: "#7ab3d2",
  },
  light: {
    background: { default: "#eef3f7", paper: "#ffffff" },
    text: { primary: "#1c2b35", secondary: "#2d5b7f" },
    inputBg: "#ffffff",
    inputBorder: "rgba(45, 91, 127, 0.25)",
    inputLabel: "#2d5b7f",
  },
};

const getTheme = (mode = "dark") => {
  const cfg = MODE_CONFIG[mode] || MODE_CONFIG.dark;
  return createTheme({
    palette: {
      mode,
      primary: { main: ACCENT },
      secondary: { main: ACCENT_HOVER },
      background: cfg.background,
      text: cfg.text,
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
            backgroundColor: cfg.inputBg,
          },
          notchedOutline: {
            borderColor: cfg.inputBorder,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: cfg.inputLabel,
          },
        },
      },
    },
  });
};

export default getTheme;
