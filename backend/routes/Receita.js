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

module.exports = router;
