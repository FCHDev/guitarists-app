import { Routes, Route } from "react-router-dom";
import CardsPage from "./pages/CardsPage";
import CardPage from "./pages/CardPage";
import AdminPage from "./pages/AdminPage";
import Login from "./pages/Login";

import Container from "@mui/material/Container";

function App() {
  return (
    <Container>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<CardsPage />} />
          <Route path="card/:id" element={<CardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Container>
  );
}

export default App;
