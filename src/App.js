import {useEffect, useState, lazy, Suspense} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Container from "@mui/material/Container";
import {ThemeProvider} from "@mui/material/styles";

import {supabase} from "./services/supabaseClient";
import {fetchGuitarists, subscribeToGuitarists} from "./services/guitaristsApi";
import getTheme from "./theme";
import ThemeToggle from "./components/ThemeToggle";

const CardsPage = lazy(() => import("./pages/CardsPage"))
const CardPage = lazy(() => import("./pages/CardPage"))
const AdminPage = lazy(() => import("./pages/AdminPage"))
const Login = lazy(() => import("./pages/Login"))

const THEME_STORAGE_KEY = "themeMode";

// Bloque l'accès à une route tant que l'état d'authentification Supabase n'a pas
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

    // Récupération des guitaristes, puis écoute en continu des changements
    // (ajout/modification/suppression depuis l'admin) via Supabase Realtime :
    // la liste se met donc à jour automatiquement partout, sans recharger
    // la page.
    useEffect(() => {
        let isMounted = true;

        const loadGuitarists = async () => {
            try {
                const data = await fetchGuitarists();
                if (!isMounted) return;
                setGuitarists(data);
                setIsLoading(false);
                setTotalGuitarists(data.length);
            } catch (error) {
                console.error("Erreur de chargement des guitaristes :", error);
            }
        };

        loadGuitarists();
        const unsubscribe = subscribeToGuitarists(loadGuitarists);

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    // Suivi de l'état de connexion Supabase : source unique de vérité pour
    // isConnected/connectedUser, utilisée aussi pour protéger la route /admin.
    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setConnectedUser(session?.user ?? null);
            setIsConnected(!!session);
            setAuthChecked(true);
        });

        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            setConnectedUser(session?.user ?? null);
            setIsConnected(!!session);
            setAuthChecked(true);
        });

        return () => subscription.unsubscribe();
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
