// Carregar Perfil do Usuário
async function carregarPerfil() {
    const usuarioId = localStorage.getItem('usuario_id');
    const usuarioNome = localStorage.getItem('usuario_nome');

    if (!usuarioId) {
        alert('Você precisa estar logado.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Carregar dados do usuário
        const respostaUsuario = await fetch(`/api/usuarios/${usuarioId}`);
        const usuario = await respostaUsuario.json();

        if (respostaUsuario.ok) {
            document.getElementById('nome-usuario').textContent = usuario.nome;
            document.getElementById('bio-usuario').textContent = usuario.bio || 'Sem bio';
            document.getElementById('email-usuario').textContent = usuario.email;
            document.getElementById('foto-perfil').src = usuario.foto || 'images/default-avatar.png';
        } else {
            alert('Erro ao carregar perfil: ' + usuario.erro);
        }

        // Carregar receitas do usuário
        carregarMinhasReceitas();
    } catch (erro) {
        console.error('Erro de conexão:', erro);
        alert('Erro ao carregar perfil.');
    }
}

// Carregar Receitas do Usuário
async function carregarMinhasReceitas() {
    const usuarioId = localStorage.getItem('usuario_id');

    try {
        const resposta = await fetch(`/api/receitas?usuario=${usuarioId}`);
        const receitas = await resposta.json();

        if (resposta.ok) {
            exibirReceitas(receitas, true); // true for minhas receitas
        } else {
            console.error('Erro ao carregar receitas:', receitas.erro);
        }
    } catch (erro) {
        console.error('Erro de conexão:', erro);
    }
}

// Carregar Receitas Curtidas
async function carregarReceitasCurtidas() {
    const usuarioId = localStorage.getItem('usuario_id');

    try {
        const resposta = await fetch(`/api/receitas/curtidas/${usuarioId}`);
        const receitas = await resposta.json();

        if (resposta.ok) {
            exibirReceitas(receitas, false); // false for curtidas
        } else {
            console.error('Erro ao carregar receitas curtidas:', receitas.erro);
        }
    } catch (erro) {
        console.error('Erro de conexão:', erro);
    }
}

// Exibir Receitas
function exibirReceitas(receitas, isMinhas = false) {
    const grid = document.getElementById('grid-receitas');

    if (receitas.length === 0) {
        grid.innerHTML = '<p>Você ainda não publicou nenhuma receita.</p>';
        return;
    }

    // Limpar grid
    grid.innerHTML = '';

    receitas.forEach(receita => {
        const card = document.createElement('div');
        card.className = 'card-receita';

        let acoesHTML = `
            <button class="btn-like" data-id="${receita._id}">
                <i class="fa-solid fa-heart"></i> <span class="likes-count">${receita.likes ? receita.likes.length : 0}</span>
            </button>
        `;

        if (isMinhas) {
            acoesHTML += `
                <button class="btn-edit" data-id="${receita._id}">
                    <i class="fa-solid fa-edit"></i>
                </button>
                <button class="btn-delete" data-id="${receita._id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
        }

        card.innerHTML = `
            <img src="${receita.foto || 'images/placeholder.jpg'}" alt="${receita.titulo}" class="foto-receita">
            <div class="info-receita">
                <h3>${receita.titulo}</h3>
                <p>${receita.descricao}</p>
                <div class="ingredientes">
                    <strong>Ingredientes:</strong> ${receita.ingredientes}
                </div>
                <div class="instrucoes">
                    <strong>Instruções:</strong> ${receita.instrucoes}
                </div>
                <div class="acoes-receita">
                    ${acoesHTML}
                </div>
            </div>
        `;

        // Adicionar evento ao botão de like
        const btnLike = card.querySelector('.btn-like');
        btnLike.addEventListener('click', () => toggleLike(receita._id, btnLike));

        if (isMinhas) {
            // Adicionar evento ao botão de edit
            const btnEdit = card.querySelector('.btn-edit');
            btnEdit.addEventListener('click', () => editarReceita(receita._id));

            // Adicionar evento ao botão de delete
            const btnDelete = card.querySelector('.btn-delete');
            btnDelete.addEventListener('click', () => deletarReceita(receita._id));
        }

        grid.appendChild(card);
    });
}

// Configurar Logout
function configurarLogout() {
    const btnLogout = document.getElementById('btn-logout');
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('usuario_id');
        localStorage.removeItem('usuario_nome');
        alert('Você foi desconectado.');
        window.location.href = 'index.html';
    });
}

// Configurar Abas
function configurarAbas() {
    const tabMinhas = document.getElementById('tab-minhas');
    const tabCurtidos = document.getElementById('tab-curtidos');

    tabMinhas.addEventListener('click', () => {
        tabMinhas.classList.add('tab-ativo');
        tabCurtidos.classList.remove('tab-ativo');
        carregarMinhasReceitas();
    });

    tabCurtidos.addEventListener('click', () => {
        tabCurtidos.classList.add('tab-ativo');
        tabMinhas.classList.remove('tab-ativo');
        carregarReceitasCurtidas();
    });
}

// Toggle Like
async function toggleLike(receitaId, btn) {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
        alert('Você precisa estar logado para curtir receitas.');
        return;
    }

    try {
        const resposta = await fetch(`/api/receitas/${receitaId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: usuarioId })
        });

        if (resposta.ok) {
            const data = await resposta.json();
            btn.querySelector('.likes-count').textContent = data.likes;
        } else {
            alert('Erro ao curtir receita.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }
}

// Editar Receita
function editarReceita(receitaId) {
    // Redirecionar para a página de criação de receita com o ID para edição
    window.location.href = `criar-receita.html?edit=${receitaId}`;
}

// Deletar Receita
async function deletarReceita(receitaId) {
    if (!confirm('Tem certeza que deseja deletar esta receita?')) {
        return;
    }

    try {
        const resposta = await fetch(`/api/receitas/${receitaId}`, {
            method: 'DELETE'
        });

        if (resposta.ok) {
            alert('Receita deletada com sucesso!');
            carregarMinhasReceitas(); // Recarregar as receitas
        } else {
            alert('Erro ao deletar receita.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao deletar receita.');
    }
}

// Carregar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarPerfil();
    configurarLogout();
    configurarAbas();
});