const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.put('/perfil', usuarioController.atualizarPerfil);
router.get('/favoritos', usuarioController.listarFavoritos);
router.post('/favoritos', usuarioController.adicionarFavorito);
router.delete('/favoritos/:produto_id', usuarioController.removerFavorito);

module.exports = router;