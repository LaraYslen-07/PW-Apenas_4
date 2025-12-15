const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// --- ROTAS ---
// Aqui vamos ligar as rotas que criamos nas pastas
app.use((req, res, next) => {
    console.log(`📡 Recebi um pedido em: ${req.method} ${req.url}`);
    next();
});

app.use('/api/usuarios', require('./backend/routes/usuario'));
app.use('/api/receitas', require('./backend/routes/Receita'));
// Rota de saúde
app.get('/api/health', (req, res) => {
    res.json({ status: 'API Apenas 4 está funcionando!' });
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({ mensagem: 'Bem-vindo à API do Apenas 4 Ingredientes 🍳' });
});

// Middleware de erro para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' });
});

// Conectar ao MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB Atlas (Apenas 4)');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
  }
};

// Função para iniciar o servidor
const startServer = async () => {
  await connectDB();

  // Iniciar servidor
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
  });
};

startServer();
