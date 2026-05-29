const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/cadastro', clienteController.cadastrarCliente);
router.post('/login', clienteController.loginCliente);

module.exports = router;