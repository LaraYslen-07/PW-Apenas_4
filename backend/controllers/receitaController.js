const Receita = require('../models/receita');

// 1. Criar Receita (POST)
exports.criarReceita = async (req, res) => {
    try {
        console.log("Dados recebidos:", req.body);
        console.log("Arquivo recebido:", req.file); // Aqui vem a foto do Cloudinary

        const { titulo, descricao, ingredientes, instrucoes, categoria } = req.body;

        // Se não veio foto, reclama
        if (!req.file) {
            return res.status(400).json({ erro: 'A foto é obrigatória!' });
        }

        const novaReceita = await Receita.create({
            titulo,
            descricao,
            ingredientes,
            instrucoes,
            categoria,
            foto: req.file.path // URL direta do Cloudinary
        });

        res.status(201).json({
            sucesso: true,
            mensagem: 'Receita criada com sucesso!',
            dados: novaReceita
        });

    } catch (error) {
        console.error("Erro ao criar receita:", error);
        res.status(500).json({ erro: 'Erro no servidor ao salvar receita.' });
    }
};

// 2. Listar Receitas (GET)
exports.listarReceitas = async (req, res) => {
    try {
        const receitas = await Receita.find().sort({ dataCriacao: -1 }); // Mais recentes primeiro
        res.status(200).json(receitas);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar receitas.' });
    }
};
