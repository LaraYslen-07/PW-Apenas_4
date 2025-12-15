require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

// --- A LINHA IMPORTANTE ESTÁ AQUI ---
app.use(express.static('public')); 
// Isso faz o navegador conseguir pegar o CSS na pasta 'public/stylesheets'

app.use(cors());
app.use(express.json());

// ... o resto do seu código de conexão com o banco ...
// ... código anterior ...


app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  // Se tiver a função de conectar no banco, chame ela aqui dentro também
  // connectDB();
});
