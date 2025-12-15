const Receita = require('../models/receita');

// 1. Criar Receita (POST)
exports.criarReceita = async (req, res) => {
    try {
        console.log("Dados recebidos:", req.body);
        console.log("Arquivo recebido:", req.file); // Aqui vem a foto do Cloudinary

        const { titulo, descricao, ingredientes, instrucoes, categoria, usuario } = req.body;

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
            usuario,
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

// 3. Curtir/Descurtir Receita
exports.toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario } = req.body;

        if (!usuario) {
            return res.status(400).json({ erro: 'Usuário não informado.' });
        }

        const receita = await Receita.findById(id);
        if (!receita) {
            return res.status(404).json({ erro: 'Receita não encontrada.' });
        }

        const index = receita.likes.indexOf(usuario);
        if (index > -1) {
            // Já curtiu, remover
            receita.likes.splice(index, 1);
        } else {
            // Não curtiu, adicionar
            receita.likes.push(usuario);
        }

        await receita.save();
        res.status(200).json({ likes: receita.likes.length });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao curtir receita.' });
    }
};
