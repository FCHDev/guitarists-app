import React from "react";
import {
  createTheme,
  FormControl,
  FormControlLabel,
  // FormLabel,
  Radio,
  RadioGroup,
  ThemeProvider,
} from "@mui/material";

const SwitchArea = ({ setSelectedAreaRadio }) => {
  const handleChange = (event) => {
    setSelectedAreaRadio(event.target.value);
    // console.log(event.target.value);
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
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={handleChange}
          >
            <FormControlLabel
              className="flag"
              value="all"
              control={<Radio />}
              label="Tous"
            />
            <FormControlLabel
              value="Europe"
              control={<Radio />}
              label="Europe"
            />
            <FormControlLabel
              value="North America"
              control={<Radio />}
              label="US"
            />
          </RadioGroup>
        </ThemeProvider>
      </FormControl>
    </div>
  );
};

export default SwitchArea;
