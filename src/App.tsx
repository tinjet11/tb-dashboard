import "./App.css";
import NavBar from "./components/navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/administration";
import NotFound from "./pages/not-found";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Home />} />
        <Route path="/about" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
