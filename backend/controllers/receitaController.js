const Receita = require('../models/receita');

// 1. Criar Receita (POST)
exports.criarReceita = async (req, res) => {
    try {
        console.log("Dados recebidos:", req.body);
        console.log("Arquivo recebido:", req.file); // Aqui vem a foto do Cloudinary

        const { titulo, descricao, ingredientes, instrucoes, categoria, usuario, etapas } = req.body;

        // Validações básicas
        if (!titulo || !ingredientes || !categoria || !usuario) {
            return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos!' });
        }

        const novaReceita = await Receita.create({
            titulo,
            descricao,
            ingredientes,
            instrucoes,
            etapas: etapas ? JSON.parse(etapas) : [],
            categoria,
            usuario,
            foto: req.file ? req.file.path : 'images/placeholder.jpg' // URL direta do Cloudinary ou placeholder
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
        const { usuario, categoria } = req.query;
        const filtro = {};
        if (usuario) filtro.usuario = usuario;
        if (categoria) filtro.categoria = categoria;
        const receitas = await Receita.find(filtro).populate('usuario', 'nome').sort({ dataCriacao: -1 }); // Mais recentes primeiro
        res.status(200).json(receitas);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar receitas.' });
    }
};

// 2.1. Listar Receitas Curtidas por Usuário
exports.listarReceitasCurtidas = async (req, res) => {
    try {
        const { id } = req.params;
        const receitas = await Receita.find({ likes: id }).populate('usuario', 'nome').sort({ dataCriacao: -1 });
        res.status(200).json(receitas);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar receitas curtidas.' });
    }
};

// 3. Buscar Receita por ID
exports.buscarReceitaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const receita = await Receita.findById(id);
        if (!receita) {
            return res.status(404).json({ erro: 'Receita não encontrada.' });
        }
        res.status(200).json(receita);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar receita.' });
    }
};

// 4. Listar Receitas Curtidas por Usuário
exports.listarReceitasCurtidas = async (req, res) => {
    try {
        const { id } = req.params;
        const receitas = await Receita.find({ likes: id }).sort({ dataCriacao: -1 });
        res.status(200).json(receitas);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar receitas curtidas.' });
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

// 5. Deletar Receita
exports.deletarReceita = async (req, res) => {
    try {
        const { id } = req.params;
        const receita = await Receita.findByIdAndDelete(id);
        if (!receita) {
            return res.status(404).json({ erro: 'Receita não encontrada.' });
        }
        res.status(200).json({ mensagem: 'Receita deletada com sucesso.' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar receita.' });
    }
};

// 6. Atualizar Receita
exports.atualizarReceita = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, ingredientes, instrucoes, categoria, etapas } = req.body;

        const updateData = { titulo, descricao, ingredientes, instrucoes, categoria };
        if (etapas) updateData.etapas = JSON.parse(etapas);
        if (req.file) {
            updateData.foto = req.file.path; // Nova foto se enviada
        }

        const receita = await Receita.findByIdAndUpdate(id, updateData, { new: true });
        if (!receita) {
            return res.status(404).json({ erro: 'Receita não encontrada.' });
        }
        res.status(200).json({ mensagem: 'Receita atualizada com sucesso.', dados: receita });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar receita.' });
    }
};
