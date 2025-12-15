const express = require('express');
const router = express.Router();
const receitaController = require('../controllers/receitaController');

// Importa a configuração de upload que fizemos (Multer + Cloudinary)
const upload = require('../config/cloudinary'); 

// Rota: POST /api/receitas (Cria receita com foto)
// 'foto' é o nome do campo no formulário do HTML
router.post('/', upload.single('foto'), receitaController.criarReceita);

// Rota: GET /api/receitas (Lista todas)
router.get('/', receitaController.listarReceitas);

// Rota: GET /api/receitas/curtidas/:id (Lista receitas curtidas por usuário)
router.get('/curtidas/:id', receitaController.listarReceitasCurtidas);

// Rota: POST /api/receitas/:id/like (Curtir/Descurtir)
router.post('/:id/like', receitaController.toggleLike);

module.exports = router;
