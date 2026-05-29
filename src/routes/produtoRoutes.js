const express = require('express');

const router = express.Router();

const {
    listarProdutos,
    criarProduto
} = require('../controllers/produtoController');

router.get('/', listarProdutos);
router.post('/', criarProduto);

module.exports = router;