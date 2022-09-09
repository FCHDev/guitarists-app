import { Chip, createTheme, ThemeProvider } from "@mui/material";

const Header = ({ totalGuitarists }) => {
  const guitaristsTheme = createTheme({
    typography: {
      fontFamily: ["JetBrains Mono"].join(","),
      fontSize: 15,
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
        <h1>guitarists_</h1>
        <h4>
          the database contains{" "}
          <Chip label={totalGuitarists} variant="outlined" />{" "}
          <p style={{ fontSize: "0.7em" }}>(on {dateDuJour})</p>
        </h4>
      </div>
    </ThemeProvider>
  );
};

export default Header;
