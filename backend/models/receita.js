const mongoose = require('mongoose');

const ReceitaSchema = new mongoose.Schema({
    titulo: { 
        type: String, 
        required: [true, 'O título é obrigatório'] 
    },
    foto: { 
        type: String, // Vai guardar a URL do Cloudinary
        required: [true, 'A foto é obrigatória']
    },
    ingredientes: {
        type: [String], // Um array de textos (4 itens)
        validate: [arrayLimit, 'A receita precisa ter exatamente 4 ingredientes']
    },
    modoPreparo: { 
        type: String, 
        required: true 
    },
    categoria: {
        type: String,
        enum: ['salgado', 'doce', 'saudavel', 'bebida'],
        default: 'salgado'
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

// Funçãozinha pra validar se tem 4 ingredientes mesmo
function arrayLimit(val) {
    return val.length <= 4;
}

module.exports = mongoose.model('Receita', ReceitaSchema);
