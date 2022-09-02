import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Form = () => {
  return (
    <div>
      <form>
        <TextField
          id="outlined-read-only-input"
          label="Pseudo"
          defaultValue="🎸 GuitarFan_013 🎸"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="outlined-multiline-static"
          label="Message"
          multiline
          rows={4}
          defaultValue="Saisissez ici"
          style={{ marginTop: "10px" }}
        />
        <Button variant="outlined" style={{ marginTop: "10px" }}>
          Envoyer
        </Button>
      </form>
    </div>
  );
};

export default Form;
