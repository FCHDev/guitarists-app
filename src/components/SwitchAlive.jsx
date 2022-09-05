import React from "react";
import {
  FormControl,
  FormControlLabel,
  // FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

const SwitchAlive = ({ setSelectedRadio }) => {
  const handleChange = (event) => {
    setSelectedRadio(event.target.value);
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
          <FormControlLabel value="all" control={<Radio />} label="Tous 🎸" />
          <FormControlLabel
            value="alive"
            control={<Radio />}
            label="Sur Terre 🤘"
          />
          <FormControlLabel
            value="dead"
            control={<Radio />}
            label="Au Paradis †"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default SwitchAlive;
