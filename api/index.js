const express = require('express');
const cors = require('cors');

// Importação das rotas modularizadas
const produtoRoutes = require('../src/routes/produtoRoutes');
const clienteRoutes = require('../src/routes/clienteRoutes');
const pedidoRoutes = require('../src/routes/pedidoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Endpoints principais da API
app.use('/api/produtos', produtoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Rota de teste base
app.get('/api', (req, res) => {
    res.json({ message: "API B7Store a funcionar perfeitamente!" });
});

module.exports = app;