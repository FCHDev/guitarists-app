import { Chip } from "@mui/material";

const Header = ({ totalGuitarists }) => {
  return (
    <div className="header">
      <h1>guitarists_</h1>
      <h4>
        the <Chip label={totalGuitarists} variant="outlined" /> G.O.A.T.
      </h4>

      {/*<h6>Total = {totalGuitarists}</h6>*/}
    </div>
  );
};

export default Header;
