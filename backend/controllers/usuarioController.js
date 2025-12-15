const Usuario = require('../models/usuario');

exports.criarUsuario = async (req, res) => {
    try {
        console.log("Recebi no Backend:", req.body); // ISSO VAI APARECER NO TERMINAL DO VSCODE
        console.log("Arquivo:", req.file);

        const { nome, email, senha, bio } = req.body;

        // Cria no banco
        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha,
            bio,
            fotoPerfil: req.file ? req.file.path : undefined
        });

        res.status(201).json({ mensagem: 'Criado!', usuario: novoUsuario });

    } catch (error) {
        console.error("Erro ao salvar:", error); // Mostra o erro detalhado no terminal
        res.status(400).json({ erro: error.message });
    }
};

// 3. Obter Usuário por ID (GET)
exports.obterUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        res.status(200).json({
            _id: usuario._id,
            nome: usuario.nome,
            email: usuario.email,
            bio: usuario.bio,
            foto: usuario.fotoPerfil
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar usuário.' });
    }
};
// ... (código anterior de criarUsuario) ...

// LOGIN DE USUÁRIO
exports.loginUsuario = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Procura o usuário pelo email
        const usuario = await Usuario.findOne({ email });
        
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        // 2. Verifica a senha (em produção usaria bcrypt.compare)
        if (usuario.senha !== senha) {
            return res.status(401).json({ erro: 'Senha incorreta!' });
        }

        // 3. Devolve os dados (menos a senha)
        res.status(200).json({
            mensagem: 'Login realizado!',
            usuario: {
                _id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                fotoPerfil: usuario.fotoPerfil
            }
        });

    } catch (error) {
        res.status(500).json({ erro: 'Erro no servidor ao fazer login.' });
    }
};
