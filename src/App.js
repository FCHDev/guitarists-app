import {useEffect, useState, lazy, Suspense} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Container from "@mui/material/Container";

import {onValue, ref} from "firebase/database";
import {onAuthStateChanged} from "firebase/auth";
import {db, auth} from "./services/firebaseConfig";

const CardsPage = lazy(() => import("./pages/CardsPage"))
const CardPage = lazy(() => import("./pages/CardPage"))
const AdminPage = lazy(() => import("./pages/AdminPage"))
const Login = lazy(() => import("./pages/Login"))

// Bloque l'accès à une route tant que l'état d'authentification Firebase n'a pas
// encore été vérifié, puis redirige vers /login si l'utilisateur n'est pas connecté.
const RequireAuth = ({authChecked, isConnected, children}) => {
    if (!authChecked) {
        return null;
    }
    if (!isConnected) {
        return <Navigate to="/login" replace/>;
    }
    return children;
};

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [guitarists, setGuitarists] = useState([]);
    const [totalGuitarists, setTotalGuitarists] = useState("");
    const [connectedUser, setConnectedUser] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    // Récupération des guitaristes (une seule fois au chargement)
    useEffect(() => {
        return onValue(ref(db), (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                // On force la conversion en tableau : selon les clés présentes
                // (index numériques suivis ou non, clés générées par push...),
                // Firebase peut renvoyer un objet ou un tableau.
                const guitaristsArray = Object.values(data);
                setGuitarists(guitaristsArray);
                setIsLoading(false);
                setTotalGuitarists(guitaristsArray.length);
            }
        }, {onlyOnce: true});
    }, []);

    // Suivi de l'état de connexion Firebase : source unique de vérité pour
    // isConnected/connectedUser, utilisée aussi pour protéger la route /admin.
    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setConnectedUser(user);
            setIsConnected(!!user);
            setAuthChecked(true);
        });
    }, []);

    return (
        <Container>
            <div className="App">
                <Suspense>
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
                            element={
                                <RequireAuth authChecked={authChecked} isConnected={isConnected}>
                                    <AdminPage guitarists={guitarists}/>
                                </RequireAuth>
                            }
                        />
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </Suspense>
            </div>
        </Container>
    );
}

export default App;
