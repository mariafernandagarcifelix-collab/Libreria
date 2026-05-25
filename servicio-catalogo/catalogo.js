const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Arreglo en memoria con 8 libros (incluyendo el reto extra de stock)
const libros = [
  { id: 1, titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', precio: 300, stock: 10 },
  { id: 2, titulo: '1984', autor: 'George Orwell', precio: 250, stock: 5 },
  { id: 3, titulo: 'El Principito', autor: 'Antoine de Saint-Exupéry', precio: 150, stock: 20 },
  { id: 4, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', precio: 400, stock: 3 },
  { id: 5, titulo: 'La Guerra de los Mundos', autor: 'H.G. Wells', precio: 220, stock: 8 },
  { id: 6, titulo: 'Matar a un Ruiseñor', autor: 'Harper Lee', precio: 280, stock: 0 },
  { id: 7, titulo: 'El Gran Gatsby', autor: 'F. Scott Fitzgerald', precio: 260, stock: 15 },
  { id: 8, titulo: 'Orgullo y Prejuicio', autor: 'Jane Austen', precio: 210, stock: 7 },
  { id: 9, titulo: 'Los ojos de mi princesa', autor: 'Carlos Cuauhtémoc Sánchez', precio: 180, stock: 12 }
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

app.listen(PORT, () => {
  console.log(`[Servicio de Catálogo] Corriendo en http://localhost:${PORT}`);
});
