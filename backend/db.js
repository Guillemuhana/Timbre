const mysql = require("mysql2/promise");

// Configuración de la conexión a la base de datos
const db = mysql.createPool({
  host: "localhost", // Cambia esto si tu base de datos está en otro servidor
  user: "root", // Usuario de tu base de datos
  password: "Gmuhana6", // Contraseña de tu base de datos
  database: "digital_timbre", // Nombre de tu base de datos
});

module.exports = db;
