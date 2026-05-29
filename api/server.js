require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('../src/routes/authRoutes');
const produtoRoutes = require('../src/routes/produtoRoutes');
const pedidoRoutes = require('../src/routes/pedidoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);

app.get('/', (req, res) => {
    res.json({
        funcionando: true
    });
});

module.exports = app;