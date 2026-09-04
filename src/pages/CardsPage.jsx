import React, {useState} from "react";
import CardPost from "../components/CardPost";
import CardsContentLoader from "../loaders/CardsContentLoader";
import Header from "../components/Header";
import Search from "../components/Search";
import FilterChips from "../components/FilterChips";

import {Grid} from "@mui/material";
import ScrollToTop from "react-scroll-to-top";

const CardsPage = ({
                       guitarists,
                       totalGuitarists,
                       isLoading,
                       connectedUser,
                       setConnectedUser,
                       isConnected,
                       setIsConnected,
                   }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRadio, setSelectedRadio] = useState("all");
    const [selectedAreaRadio, setSelectedAreaRadio] = useState("all");
    const [selectedSort, setSelectedSort] = useState("random");

    return (
        <div className="posts">
            <Header
                guitarists={guitarists}
                totalGuitarists={totalGuitarists}
                connectedUser={connectedUser}
                setConnectedUser={setConnectedUser}
                isConnected={isConnected}
                setIsConnected={setIsConnected}
            />
            <Search guitarists={guitarists} setSearchTerm={setSearchTerm}/>
            <div className="filters">
                <FilterChips
                    label="Statut"
                    value={selectedRadio}
                    onChange={setSelectedRadio}
                    options={[
                        {value: "all", label: "Tous"},
                        {value: "alive", label: "Terre"},
                        {value: "dead", label: "Paradis"},
                    ]}
                />
                <FilterChips
                    label="Zone"
                    value={selectedAreaRadio}
                    onChange={setSelectedAreaRadio}
                    options={[
                        {value: "all", label: "Tous"},
                        {value: "Europe", label: "Europe"},
                        {value: "North America", label: "US"},
                    ]}
                />
                <FilterChips
                    label="Tri"
                    value={selectedSort}
                    onChange={setSelectedSort}
                    options={[
                        {value: "random", label: "Aléatoire"},
                        {value: "alphabetical", label: "A → Z"},
                    ]}
                />
            </div>
            <Grid
                container
                spacing={0}
                alignItems="center"
                justifyContent="center"
                style={{minHeight: "100vh", width: "90vw"}}
            >
                {isLoading ? (
                    <CardsContentLoader/>
                ) : (
                    guitarists
                        .filter((guitarist) => {
                            return (guitarist.nom + " " + guitarist.prenom)
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
                        .sort((a, b) => {
                            if (selectedSort === "alphabetical") {
                                return (a.nom || "").localeCompare(b.nom || "");
                            }
                            // Aléatoire : mélange stable tant que la liste ne change pas,
                            // grâce à une "graine" dérivée de l'id (sinon l'ordre changerait
                            // à chaque rendu, y compris pendant une même visite).
                            const seedA = String(a.id).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
                            const seedB = String(b.id).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
                            return seedA - seedB;
                        })
                        .map((guitarist) => (
                            <CardPost guitarist={guitarist} key={guitarist.id}/>
                        ))
                )}
            </Grid>

            <ScrollToTop smooth={true}/>
        </div>
    );
};

export default CardsPage;
