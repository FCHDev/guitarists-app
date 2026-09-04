import React, {useState} from "react";
import {auth} from "../services/firebaseConfig";
import {signInWithEmailAndPassword} from "firebase/auth";
import {useNavigate} from "react-router-dom";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {AiOutlineUserAdd} from "react-icons/ai";

// L'état de connexion (isConnected/connectedUser) est désormais géré une seule
// fois, dans App.js, via onAuthStateChanged. Ce composant se contente de
// soumettre les identifiants et d'attendre la réponse de Firebase avant de
// considérer que la connexion a réussi.
const Login = () => {
    const [credentials, setCredentials] = useState({
        login: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({
            ...credentials,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);
        try {
            await signInWithEmailAndPassword(auth, credentials.login, credentials.password);
            // Connexion réussie : App.js met isConnected à jour via onAuthStateChanged.
            navigate("/");
        } catch (error) {
            setErrorMessage("Email ou mot de passe incorrect.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login">
                <h1>Connexion</h1>
                <form onSubmit={handleSubmit}>
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
                        required
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

                    {errorMessage && (
                        <p style={{color: "#d32f2f", marginTop: "10px"}}>{errorMessage}</p>
                    )}

                    <div style={{marginTop: "20px"}}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            endIcon={<AiOutlineUserAdd/>}
                            disabled={isSubmitting}
                        >
                            Login
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
