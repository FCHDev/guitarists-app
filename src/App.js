import { Routes, Route } from "react-router-dom";
import Cards from "./components/Cards";
import Card from "./components/Card";

import Container from "@mui/material/Container";

function App() {
  return (
    <Container>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<Cards />} />
          <Route path="card/:id" element={<Card />} />
          <Route path="prout" element={<h1>Prout</h1>} />
        </Routes>
      </div>
    </Container>
  );
}

export default App;
