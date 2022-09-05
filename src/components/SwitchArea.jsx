import React from "react";
import {
  FormControl,
  FormControlLabel,
  // FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

const SwitchArea = ({ setSelectedAreaRadio }) => {
  const handleChange = (event) => {
    setSelectedAreaRadio(event.target.value);
    console.log(event.target.value);
  };

  return (
    <div className="radio">
      <FormControl>
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
            label="Tous 🌍"
          />
          <FormControlLabel
            value="Europe"
            control={<Radio />}
            label="Europe 🇪🇺"
          />
          <FormControlLabel
            value="North America"
            control={<Radio />}
            label="US 🇺🇸"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default SwitchArea;
