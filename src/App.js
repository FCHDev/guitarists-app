import {useEffect, useState, lazy, Suspense} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Container from "@mui/material/Container";
import {ThemeProvider} from "@mui/material/styles";

import {onValue, ref} from "firebase/database";
import {onAuthStateChanged} from "firebase/auth";
import {db, auth} from "./services/firebaseConfig";
import getTheme from "./theme";
import ThemeToggle from "./components/ThemeToggle";

const CardsPage = lazy(() => import("./pages/CardsPage"))
const CardPage = lazy(() => import("./pages/CardPage"))
const AdminPage = lazy(() => import("./pages/AdminPage"))
const Login = lazy(() => import("./pages/Login"))

const THEME_STORAGE_KEY = "themeMode";

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

    // Thème sombre/clair, mémorisé d'une visite à l'autre (localStorage).
    // Sombre par défaut si rien n'est enregistré.
    const [themeMode, setThemeMode] = useState(() => {
        try {
            return localStorage.getItem(THEME_STORAGE_KEY) || "dark";
        } catch {
            return "dark";
        }
    });

    // L'attribut data-theme sur <html> pilote les variables CSS (index.scss)
    // utilisées par les classes "maison" ; le thème MUI (ci-dessous) pilote
    // les composants Material UI. Les deux doivent rester synchronisés.
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", themeMode);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, themeMode);
        } catch {
            // localStorage indisponible (navigation privée...) : pas grave,
            // le thème reviendra juste à sa valeur par défaut au rechargement.
        }
    }, [themeMode]);

    const toggleTheme = () => {
        setThemeMode((previousMode) => (previousMode === "dark" ? "light" : "dark"));
    };

    // Récupération des guitaristes, en écoute continue (pas seulement au
    // chargement) : la liste se met donc à jour automatiquement après un
    // ajout, une modification ou une suppression depuis l'admin, sans avoir
    // besoin de recharger la page.
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
        });
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
        <ThemeProvider theme={getTheme(themeMode)}>
            <Container>
                <div className="App">
                    <ThemeToggle mode={themeMode} onToggle={toggleTheme}/>
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
        </ThemeProvider>
    );
}

export default App;
