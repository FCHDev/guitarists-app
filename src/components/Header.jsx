import {Chip, createTheme, ThemeProvider} from "@mui/material";
import {Link} from "react-router-dom";
import {signOut} from "firebase/auth";
import {auth} from "../services/firebaseConfig";


const Header = ({totalGuitarists, setConnectedUser, isConnected, setIsConnected}) => {
    const guitaristsTheme = createTheme({
        typography: {
            fontFamily: ["JetBrains Mono"].join(","),
            fontSize: 15,
            textDecoration: "none",
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
    const date = new Date();
    const options = {
        // weekday: "short",
        year: "numeric",
        month: "long",
        day: "2-digit",
    };
    const dateDuJour = date.toLocaleDateString("en-EN", options);


    // Logout function
    const logout = async () => {
        await signOut(auth);
    };
    const handleLogout = () => {
        logout()
        setConnectedUser(null)
        setIsConnected(false)
        localStorage.clear();
        alert("Logout OK !")
    }
    // Buttons
    const loginButton = (
        <Link to="/login">
            <button className="login-btn">Login</button>
        </Link>
    );
    const logoutButton = (
        <Link to="/">
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </Link>
    );
    const adminButton = (
        <Link to="/admin" target="_blank" rel="noopener noreferrer">
            <button className="adm-btn">Admin</button>
        </Link>
    );

    // console.log(connectedUser)

    return (
        <ThemeProvider theme={guitaristsTheme}>
            <div className="header">
                {isConnected === true ? adminButton : ""}
                {isConnected === true ? logoutButton : ""}
                {isConnected === false ? loginButton : ""}
                <h1>guitarists_</h1>
                <h4 style={{fontSize:"1rem", fontWeight: "bold"}}>
                    the database contains{" "}
                    <Chip label={totalGuitarists} variant="outlined"/>{" "}
                    <p style={{fontSize: "0.7em"}}>(on {dateDuJour})</p>
                </h4>
            </div>
        </ThemeProvider>
    );
};

export default Header;
