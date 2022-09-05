import { Routes, Route } from "react-router-dom";
import CardsPage from "./pages/CardsPage";
import CardPage from "./pages/CardPage";

import Container from "@mui/material/Container";

function App() {
  return (
    <Container>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<CardsPage />} />
          <Route path="card/:id" element={<CardPage />} />
        </Routes>
      </div>
    </Container>
  );
}

export default App;
