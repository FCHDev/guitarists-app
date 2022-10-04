import { Chip, createTheme, ThemeProvider } from "@mui/material";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";

const Header = ({ totalGuitarists }) => {
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

  return (
    <ThemeProvider theme={guitaristsTheme}>
      <div className="header">
        <Link to="/admin">
          <button className="adm-btn">Admin</button>
        </Link>
        <h1>guitarists_</h1>
        <h4>
          the database contains{" "}
          <Chip label={totalGuitarists} variant="outlined" />{" "}
          <p style={{ fontSize: "0.7em" }}>(on {dateDuJour})</p>
        </h4>
        {/*<Link to="/login">Login</Link>*/}
      </div>
    </ThemeProvider>
  );
};

export default Header;
