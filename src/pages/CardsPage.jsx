import React, {useState} from "react";
import CardPost from "../components/CardPost";
import CardsContentLoader from "../loaders/CardsContentLoader";
import Header from "../components/Header";
import Search from "../components/Search";
import SwitchAlive from "../components/SwitchAlive";
import SwitchArea from "../components/SwitchArea";
import SwitchSort from "../components/SwitchSort";

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
    const [selectedRadio, setSelectedRadio] = useState("");
    const [selectedAreaRadio, setSelectedAreaRadio] = useState("");
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
                    <SwitchSort setSelectedSort={setSelectedSort}/>
                </div>
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
