const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware); // Todas as rotas de pedido precisam de autenticação

router.post('/', pedidoController.criarPedido);
router.get('/', pedidoController.listarPedidos);
router.get('/:id', pedidoController.buscarPedido);
router.put('/:id/status', pedidoController.atualizarStatus);

module.exports = router;