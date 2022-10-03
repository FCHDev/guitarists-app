import React, { useState } from "react";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AiOutlineUserAdd } from "react-icons/ai";
import { appFirebase } from "../services/firebaseConfig";

const Login = () => {
  // const [connectedUser, setConnectedUser] = useState("");
  const [credentials, setCredentials] = useState({
    login: "",
    password: "",
  });

  // onAuthStateChanged(auth, (currentUser) => {
  //   setConnectedUser(currentUser);
  // });

  const login = () => {
    const auth = getAuth(appFirebase);
    signInWithEmailAndPassword(auth, credentials.login, credentials.password)
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login();
  };

  return (
    <div className="admin">
      <h1>Connexion</h1>
      <form>
        <TextField
          required
          id="login"
          name="login"
          label="Email"
          maxRows={1}
          // value={loginEmail}
          className="search"
          margin="normal"
          type="email"
          fullWidth={true}
          onChange={handleChange}
        />
        <TextField
          id="password"
          label="Password"
          name="password"
          maxRows={1}
          // value={loginPassword}
          className="search"
          margin="normal"
          type="password"
          fullWidth={true}
          onChange={handleChange}
        />

        <div style={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<AiOutlineUserAdd />}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </div>
        <p>{credentials?.login}</p>
      </form>
    </div>
  );
};

export default Login;
