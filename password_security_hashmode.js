const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

// Crea una nueva cuenta de usuario
router.post("/signup", async (req, res) => {
  try {
    // Recupera la contraseña proporcionada por el usuario
    const password = req.body.password;
    // Genera una sal aleatoria
    const salt = await bcrypt.genSalt(10);
    // Crea un hash a partir de la contraseña y la sal
    const hash = await bcrypt.hash(password, salt);
    // Guarda el hash en la base de datos
    // ...
    // Envía una respuesta de éxito
    res.send("Contraseña almacenada con éxito");
  } catch (error) {
    // Envía una respuesta de error
    res.status(500).send(error);
  }
});

// Valida la autenticación de un usuario existente
router.post("/login", async (req, res) => {
  try {
    // Recupera la contraseña proporcionada por el usuario
    const password = req.body.password;
    // Recupera el hash almacenado en la base de datos
    // ...
    // Compara la contraseña proporcionada con el hash almacenado
    const isMatch = await bcrypt.compare(password, hash);
    if (isMatch) {
      // Envía una respuesta de éxito si las contraseñas coinciden
      res.send("Autenticación exitosa");
    } else {
      // Envía una respuesta de error si las contraseñas no coinciden
      res.status(401).send("Contraseña incorrecta");
    }
  } catch (error) {
    // Envía una respuesta de error
    res.status(500).send(error);
  }
});

module.exports = router;
