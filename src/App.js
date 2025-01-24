import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";  // Ruta de login
import CreateUser from "./components/CreateUser";  // Ruta de creación de usuario

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta principal que redirige al login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Ruta para el login */}
        <Route path="/login" element={<Login />} />

      </Routes>
    </Router>
  );
};

export default App;
