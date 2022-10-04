import React, { useState } from "react";
import CardPost from "../components/CardPost";
import CardsContentLoader from "../loaders/CardsContentLoader";
import Header from "../components/Header";
import Search from "../components/Search";
import SwitchAlive from "../components/SwitchAlive";
import SwitchArea from "../components/SwitchArea";

import { Grid } from "@mui/material";
import ScrollToTop from "react-scroll-to-top";

const CardsPage = ({ guitarists, totalGuitarists, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("");
  const [selectedAreaRadio, setSelectedAreaRadio] = useState("");

  return (
    <div className="posts">
      <Header guitarists={guitarists} totalGuitarists={totalGuitarists} />
      <Search guitarists={guitarists} setSearchTerm={setSearchTerm} />
      <div className="control">
        <div className="radioSection">
          <SwitchAlive
            guitarists={guitarists}
            setSelectedRadio={setSelectedRadio}
          />
          <SwitchArea
            guitarists={guitarists}
            setSelectedAreaRadio={setSelectedAreaRadio}
          />
        </div>
      </div>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh", width: "90vw" }}
      >
        {isLoading ? (
          <CardsContentLoader />
        ) : (
          guitarists
            .filter((guitarist) => {
              return (guitarist.nom || guitarist.prenom)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            })
            .filter((guitarist) => {
              if (selectedRadio === "dead") {
                return guitarist.mort;
              } else if (selectedRadio === "alive") {
                return !guitarist.mort;
              } else {
                return guitarist;
              }
            })
            .filter((guitarist) => {
              if (selectedAreaRadio === "Europe") {
                return guitarist.area === "Europe";
              } else if (selectedAreaRadio === "North America") {
                return guitarist.area === "North America";
              } else {
                return guitarist;
              }
            })
            .sort(function compare(a, b) {
              if (a.nom < b.nom) return -1;
              if (a.nom > b.nom) return 1;
              return 0;
            })
            .map((guitarist) => (
              <CardPost guitarist={guitarist} key={guitarist.id} />
            ))
        )}
      </Grid>

      <ScrollToTop smooth={true} />
    </div>
  );
};

export default CardsPage;
