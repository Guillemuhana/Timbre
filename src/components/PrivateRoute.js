import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Verificar si el token existe

  if (!token) {
    return <Navigate to="/login" />; // Si no hay token, redirigir a /login
  }

  return children; // Si hay token, renderizar los hijos (componente protegido)
};

export default PrivateRoute;
