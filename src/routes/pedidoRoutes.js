const express = require('express');

const router = express.Router();

const {
    criarPedido
} = require('../controllers/pedidoController');

router.post('/', criarPedido);

module.exports = router;