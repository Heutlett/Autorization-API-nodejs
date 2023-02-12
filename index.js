const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const SECRET = 'secretkey';
const REFRESH_SECRET = 'refreshsecretkey';
const ACCESS_TOKEN_LIFETIME = '15m';
const REFRESH_TOKEN_LIFETIME = '30d';

const users = [
  {
    username: 'user1',
    password: 'password1',
  },
  {
    username: 'user2',
    password: 'password2',
  },
];

// Endpoint para iniciar sesión y obtener tokens de acceso y refresco
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verificar que el nombre de usuario y la contraseña sean válidos
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Generar token de acceso
  const accessToken = jwt.sign({ username }, SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME });

  // Generar token de refresco
  const refreshToken = jwt.sign({ username }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_LIFETIME });

  // Devolver tokens
  res.json({ accessToken, refreshToken });
});

// Endpoint para actualizar el token de acceso con el token de refresco
app.post('/refresh', (req, res) => {
  const refreshToken = req.headers.refresh;

  // Verificar que el token de refresco sea válido
  try {
    jwt.verify(refreshToken, REFRESH_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Generar un nuevo token de acceso
  const accessToken = jwt.sign({ username: jwt.decode(refreshToken).username }, SECRET, {
    expiresIn: ACCESS_TOKEN_LIFETIME,
  });

  res.json({ accessToken });
});

// Middleware para proteger los endpoints
const protectedRoute = (req, res, next) => {
  const accessToken = req.headers.authorization;

  // Verificar que el token de acceso sea válido
  try {
    jwt.verify(accessToken, SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

// Endpoint protegido
app.get('/protected', protectedRoute, (req, res) => {
    res.json({ message: 'Protected Route' });
  });
  
  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
  