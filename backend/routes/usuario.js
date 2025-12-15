const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const upload = require('../config/cloudinary');

// Rota POST com upload de foto
router.post('/', upload.single('foto'), usuarioController.criarUsuario);
// Adicione essa linha:
router.post('/login', usuarioController.loginUsuario);

// Rota GET para obter usuario por ID
router.get('/:id', usuarioController.obterUsuario);

// Rota GET para listar usuarios
router.get('/', usuarioController.listarUsuarios);

module.exports = router;
