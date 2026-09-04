import {Chip} from "@mui/material";
import {Link} from "react-router-dom";
import {supabase} from "../services/supabaseClient";


const Header = ({totalGuitarists, setConnectedUser, isConnected, setIsConnected}) => {
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
        await supabase.auth.signOut();
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
        <Link to="/admin">
            <button className="adm-btn">Admin</button>
        </Link>
    );

    // console.log(connectedUser)

    return (
        <div className="header">
            {isConnected === true ? adminButton : ""}
            {isConnected === true ? logoutButton : ""}
            {isConnected === false ? loginButton : ""}
            <h1>guitarists_</h1>
            <h4 style={{fontSize:"1rem", fontWeight: "bold"}}>
                the database contains{" "}
                <Chip
                    label={totalGuitarists}
                    variant="outlined"
                    sx={{borderColor: "#f5a427", color: "#f5a427", fontWeight: "bold"}}
                />{" "}
                <p style={{fontSize: "0.7em"}}>(on {dateDuJour})</p>
            </h4>
        </div>
    );
};

export default Header;
