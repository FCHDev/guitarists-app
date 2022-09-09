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

const SwitchAlive = ({ setSelectedRadio }) => {
  const handleChange = (event) => {
    setSelectedRadio(event.target.value);
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
            <FormControlLabel value="all" control={<Radio />} label="Tous" />
            <FormControlLabel value="alive" control={<Radio />} label="Terre" />
            <FormControlLabel
              value="dead"
              control={<Radio />}
              label="Paradis"
            />
          </RadioGroup>
        </ThemeProvider>
      </FormControl>
    </div>
  );
};

export default SwitchAlive;
