const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db"); // Asegúrate de que la ruta sea correcta

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // Configura el origen según tus necesidades
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SECRET_KEY = "your_secret_key"; // Cambia esto por una clave secreta segura

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la aplicación." });
});

app.post("/add-user", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Todos los campos son obligatorios." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO usuarios (email, username, password) VALUES (?, ?, ?)",
      [email, username, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente.",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    return res.status(500).json({
      success: false,
      message: "Error al agregar usuario. Intenta nuevamente.",
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Todos los campos son obligatorios." });
  }

  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    const user = rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

      return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso.",
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Usuario o contraseña incorrectos.",
      });
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({
      success: false,
      message: "Error al iniciar sesión. Intenta nuevamente.",
    });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: "Acceso denegado" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token no válido" });
    req.user = user;
    next();
  });
};

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Contenido protegido" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`El servidor está ejecutándose en el puerto ${PORT}.`);
});
