const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

const libros = [
  { id: 1, titulo: 'Neuromante', autor: 'William Gibson', precio: 350, stock: 12 },
  { id: 2, titulo: 'Snow Crash', autor: 'Neal Stephenson', precio: 380, stock: 8 },
  { id: 3, titulo: 'Ready Player One', autor: 'Ernest Cline', precio: 320, stock: 25 },
  { id: 4, titulo: 'El problema de los tres cuerpos', autor: 'Cixin Liu', precio: 450, stock: 5 },
  { id: 5, titulo: '¿Sueñan los androides con ovejas eléctricas?', autor: 'Philip K. Dick', precio: 290, stock: 0 }
];

// Endpoint GET /api/libros/:id
app.get('/api/libros/:id', (req, res) => {
  const libroId = parseInt(req.params.id, 10);
  const libro = libros.find(l => l.id === libroId);

  if (libro) {
    res.status(200).json(libro);
  } else {
    res.status(404).json({ error: 'Libro no encontrado en el catálogo' });
  }
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: `La ruta ${req.originalUrl} no existe en este servicio` });
});

// Middleware para manejar errores internos (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor en el Servicio de Catálogo' });
});

app.listen(PORT, () => {
  console.log(`[Servicio de Catálogo] Corriendo en http://localhost:${PORT}`);
});
