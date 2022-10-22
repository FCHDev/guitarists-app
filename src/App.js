 import {useEffect, useState} from "react";
import {Routes, Route} from "react-router-dom";
import CardsPage from "./pages/CardsPage";
import CardPage from "./pages/CardPage";
import AdminPage from "./pages/AdminPage";
import Login from "./pages/Login";
import {db} from "./services/firebaseConfig";

import Container from "@mui/material/Container";
import {onValue, ref} from "firebase/database";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [guitarists, setGuitarists] = useState([]);
    const [totalGuitarists, setTotalGuitarists] = useState("");
    const [connectedUser, setConnectedUser] = useState({});
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        onValue(ref(db), (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                // eslint-disable-next-line
                Object.values([data]).map((guitarist) => {
                    setGuitarists(guitarist);
                    setIsLoading(false);
                    setTotalGuitarists(guitarist.length);
                });
            }
        });
    }, []);

    return (
        <Container>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        exact
                        element={
                            <CardsPage
                                guitarists={guitarists}
                                totalGuitarists={totalGuitarists}
                                isLoading={isLoading}
                                connectedUser={connectedUser}
                                setConnectedUser={setConnectedUser}
                                isConnected={isConnected}
                                setIsConnected={setIsConnected}
                            />
                        }
                    />
                    <Route path="card/:id" element={<CardPage/>}/>
                    <Route
                        path="/admin"
                        element={<AdminPage guitarists={guitarists}/>}
                    />
                    <Route
                        path="/login"
                        element={
                            <Login
                                connectedUser={connectedUser}
                                setConnectedUser={setConnectedUser}
                                isConnected={isConnected}
                                setIsConnected={setIsConnected}
                            />
                        }
                    />
                </Routes>
            </div>
        </Container>
    );
}

export default App;
