import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Container, Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useHistory } from "react-router-dom"; // Para redirigir

const Cpanel = () => {
  const [data, setData] = useState({
    familyName: "",
    address: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const history = useHistory();

  const token = localStorage.getItem("token");

  // Verificar si el usuario está logueado
  useEffect(() => {
    if (!token) {
      history.push("/"); // Redirigir al login si no está autenticado
    }
  }, [history, token]);

  // Manejo de la actualización de los datos
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/updateProfile", // La ruta para guardar los datos
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en el header
          },
        }
      );

      if (response.data.success) {
        setSuccess("Datos actualizados con éxito");
      } else {
        setError(response.data.message || "Error al actualizar los datos");
      }
    } catch (err) {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 4 }}>
        <Typography variant="h5" gutterBottom>
          Completa tus Datos
        </Typography>
        <form onSubmit={handleUpdate} style={{ width: "100%" }}>
          <TextField
            label="Nombre de la familia"
            variant="outlined"
            fullWidth
            margin="normal"
            name="familyName"
            value={data.familyName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Dirección"
            variant="outlined"
            fullWidth
            margin="normal"
            name="address"
            value={data.address}
            onChange={handleChange}
            required
          />
          <TextField
            label="Teléfono"
            variant="outlined"
            fullWidth
            margin="normal"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            required
          />
          <TextField
            label="Correo electrónico"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={data.email}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Actualizar Datos"}
          </Button>
          {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ marginTop: 2 }}>{success}</Alert>}
        </form>
      </Box>
    </Container>
  );
};

export default Cpanel;
cdb