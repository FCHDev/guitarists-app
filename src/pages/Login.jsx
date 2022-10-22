import React, {useState} from "react";
import {auth} from "../services/firebaseConfig";

import {signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {AiOutlineUserAdd} from "react-icons/ai";
import {Link} from "react-router-dom";

const Login = ({connectedUser, setConnectedUser, setIsConnected}) => {
    const [credentials, setCredentials] = useState({
        login: "",
        password: "",
    });
    const [homeLink, setHomeLink] = useState("/");

    // Fonction qui permet d'enregistrer l'utilisateur authentifié en cours
    onAuthStateChanged(auth, (currentUser) => {
        setConnectedUser(currentUser);
    });

    const login = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                credentials.login,
                credentials.password
            );
            console.log(user);
        } catch (error) {
            console.log(error.message);
        }
    };


    const handleSubmit = () => {
        login();
        setIsConnected(true)
        connectedUser ? setHomeLink("/") : setHomeLink("");
    };

    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({
            ...credentials,
            [name]: value,
        });
    };

    // console.log(credentials);

    return (
        <div className="admin-login-container">
            <div className="admin-login">
                <h1>Connexion</h1>
                <form>
                    <TextField
                        required
                        id="login"
                        name="login"
                        label="Email"
                        maxRows={1}
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
                        className="search"
                        margin="normal"
                        type="password"
                        fullWidth={true}
                        onChange={handleChange}
                    />

                    <div style={{marginTop: "20px"}}>
                        <Link to={homeLink}>
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<AiOutlineUserAdd/>}
                                onClick={handleSubmit}
                            >
                                Login
                            </Button>
                        </Link>
                    </div>
                    <p>{connectedUser ? connectedUser.email : ""}</p>
                </form>
            </div>
        </div>
    );
};

export default Login;
