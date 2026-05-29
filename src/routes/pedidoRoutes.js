const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/', pedidoController.criarPedido);
router.get('/:clienteId', pedidoController.listarPedidosCliente);

module.exports = router;