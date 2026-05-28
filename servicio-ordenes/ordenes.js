const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3002;
const CATALOGO_URL = process.env.CATALOGO_URL || 'http://localhost:3001';

// Configurar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Arreglo en memoria para guardar las órdenes
const ordenes = [];
let idOrdenContador = 1;

// Endpoint POST /api/ordenes
app.post('/api/ordenes', async (req, res) => {
  const { libroId, cantidad, cliente } = req.body;

  // Validación básica del payload
  if (!libroId || !cantidad || !cliente) {
    return res.status(400).json({ error: 'Faltan datos en la petición. Se requiere libroId, cantidad y cliente.' });
  }

  try {
    // 1. Solicitar la información del libro al Servicio de Catálogo
    const catalogoUrl = `${CATALOGO_URL}/api/libros/${libroId}`;
    const respuestaCatalogo = await axios.get(catalogoUrl);
    const libro = respuestaCatalogo.data;

    // 2. Verificar el stock (Reto extra)
    if (libro.stock < cantidad) {
      return res.status(400).json({ 
        error: 'Stock insuficiente', 
        stockDisponible: libro.stock, 
        cantidadSolicitada: cantidad 
      });
    }

    // 3. Calcular el total a pagar y registrar la orden
    const totalAPagar = libro.precio * cantidad;
    
    // Reducir el stock en el catálogo
    const reducirStockUrl = `${CATALOGO_URL}/api/libros/${libroId}/reducir-stock`;
    await axios.patch(reducirStockUrl, { cantidad });
    
    const nuevaOrden = {
      idOrden: idOrdenContador++,
      cliente,
      libroId: libro.id,
      tituloLibro: libro.titulo,
      cantidad,
      totalAPagar,
      fecha: new Date().toISOString()
    };

    ordenes.push(nuevaOrden);

    // 4. Retornar 201 Created con el resumen
    return res.status(201).json({
      mensaje: 'Orden creada con éxito',
      orden: nuevaOrden
    });

  } catch (error) {
    // Manejo de errores en la comunicación con el Servicio de Catálogo
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'El libro solicitado no existe en el catálogo.' });
    }
    
    console.error('Error al comunicarse con el Catálogo:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor en el Servicio de Órdenes.' });
  }
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: `La ruta ${req.originalUrl} no existe en este servicio` });
});

// Middleware para manejar errores internos (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor en el Servicio de Órdenes' });
});

app.listen(PORT, () => {
  console.log(`[Servicio de Órdenes] Corriendo en http://localhost:${PORT}`);
});
