const mongoose = require('mongoose');

const ReceitaSchema = new mongoose.Schema({
    titulo: { 
        type: String, 
        required: [true, 'O título é obrigatório'] 
    },
    descricao: {
        type: String,
        required: [true, 'A descrição é obrigatória']
    },
    foto: { 
        type: String, // Vai guardar a URL do Cloudinary
        required: [true, 'A foto é obrigatória']
    },
    ingredientes: {
        type: String, // Texto com os ingredientes
        required: [true, 'Os ingredientes são obrigatórios']
    },
    instrucoes: { 
        type: String, 
        required: [true, 'As instruções são obrigatórias']
    },
    categoria: {
        type: String,
        enum: ['salgado', 'doce', 'saudavel', 'bebida'],
        default: 'salgado'
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Receita', ReceitaSchema);
