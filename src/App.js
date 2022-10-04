import { Routes, Route } from "react-router-dom";
import CardsPage from "./pages/CardsPage";
import CardPage from "./pages/CardPage";
import AdminPage from "./pages/AdminPage";
import Login from "./pages/Login";

import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "./services/firebaseConfig";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [guitarists, setGuitarists] = useState([]);
  const [totalGuitarists, setTotalGuitarists] = useState("");

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
              />
            }
          />
          <Route path="card/:id" element={<CardPage />} />
          <Route
            path="/admin"
            element={<AdminPage guitarists={guitarists} />}
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Container>
  );
}

export default App;
