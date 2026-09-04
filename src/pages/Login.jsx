import React, {useState} from "react";
import {supabase} from "../services/supabaseClient";
import {useNavigate} from "react-router-dom";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {AiOutlineUserAdd} from "react-icons/ai";

// L'état de connexion (isConnected/connectedUser) est désormais géré une seule
// fois, dans App.js, via supabase.auth.onAuthStateChange. Ce composant se
// contente de soumettre les identifiants et d'attendre la réponse de
// Supabase avant de considérer que la connexion a réussi.
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
            const {error} = await supabase.auth.signInWithPassword({
                email: credentials.login,
                password: credentials.password,
            });
            if (error) throw error;
            // Connexion réussie : App.js met isConnected à jour via onAuthStateChange.
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
