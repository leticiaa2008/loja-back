const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const authMiddleware = require('../middlewares/auth');

router.get('/', produtoController.listarProdutos);
router.get('/destaque', produtoController.produtosDestaque);
router.get('/:id', produtoController.buscarProduto);
router.post('/', authMiddleware, produtoController.criarProduto);
router.put('/:id', authMiddleware, produtoController.atualizarProduto);
router.delete('/:id', authMiddleware, produtoController.deletarProduto);

module.exports = router;