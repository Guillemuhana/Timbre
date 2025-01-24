import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState(""); // Almacena el email
  const [password, setPassword] = useState(""); // Almacena la contraseña
  const [error, setError] = useState(""); // Mensajes de error
  const [loading, setLoading] = useState(false); // Estado de carga

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Realiza la solicitud al backend en http://localhost:8080
      const response = await axios.post("http://localhost:8080/login", {
        email, // Cambiado para coincidir con tu backend
        password,
      });

      if (response.data.success) {
        // Almacena el token en localStorage
        localStorage.setItem("token", response.data.token);
        navigate("/cpanel"); // Redirige al panel
      } else {
        setError(response.data.message || "Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error al conectar con el servidor. Verifica tus datos.");
    } finally {
      setLoading(false);
    }
  };

  // Oculta automáticamente el mensaje de error después de 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: "url(/flogin.jpg)", // Cambia la ruta si es necesario
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container maxWidth="xs">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.9)",
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <img
            src="/logo.png" // Cambia la ruta si es necesario
            alt="Logo"
            style={{
              width: "250px",
              height: "auto",
              marginBottom: "20px",
            }}
          />
          <Typography variant="h5" gutterBottom color="primary">
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            <TextField
              label="Correo Electrónico"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ marginTop: 3 }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Ingresar"}
            </Button>
            {error && (
              <Alert severity="error" sx={{ marginTop: 2 }}>
                {error}
              </Alert>
            )}
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
