import React from "react";
import {
  createTheme,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  ThemeProvider,
} from "@mui/material";

// Choix de l'ordre d'affichage des guitaristes : aléatoire (comportement
// d'origine) ou alphabétique.
const SwitchSort = ({ setSelectedSort }) => {
  const handleChange = (event) => {
    setSelectedSort(event.target.value);
  };

  const guitaristsTheme = createTheme({
    typography: {
      fontFamily: ["JetBrains Mono"].join(","),
      fontSize: 15,
    },
    palette: {
      primary: {
        main: "#FFB703",
      },
      text: {
        primary: "#FFB703",
      },
    },
  });

  return (
    <div className="radio">
      <FormControl>
        <ThemeProvider theme={guitaristsTheme}>
          <RadioGroup
            row
            aria-labelledby="sort-radio-buttons-group-label"
            name="sort-radio-buttons-group"
            defaultValue="random"
            onChange={handleChange}
          >
            <FormControlLabel
              value="random"
              control={<Radio />}
              label="Aléatoire"
            />
            <FormControlLabel
              value="alphabetical"
              control={<Radio />}
              label="A → Z"
            />
          </RadioGroup>
        </ThemeProvider>
      </FormControl>
    </div>
  );
};

export default SwitchSort;
