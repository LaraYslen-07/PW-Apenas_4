// Carregar Receitas do Feed
async function carregarReceitas(categoria = '') {
    try {
        const url = categoria ? `/api/receitas?categoria=${categoria}` : '/api/receitas';
        const resposta = await fetch(url);
        const receitas = await resposta.json();

        if (resposta.ok) {
            exibirReceitas(receitas);
        } else {
            console.error('Erro ao carregar receitas:', receitas.erro);
        }
    } catch (erro) {
        console.error('Erro de conexão:', erro);
    }
}

// Exibir Receitas no Grid
function exibirReceitas(receitas) {
    const feedGrid = document.getElementById('grid-receitas');

    // Remover o estado vazio se houver
    const estadoVazio = document.querySelector('.ficha-receita-vazia');
    if (estadoVazio) {
        estadoVazio.remove();
    }

    // Limpar cards anteriores
    const cards = feedGrid.querySelectorAll('.card-receita');
    cards.forEach(card => card.remove());

    // Para cada receita, criar um card
    receitas.forEach(receita => {
        const card = document.createElement('div');
        card.className = 'card-receita';

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
                    <button class="btn-like" data-id="${receita._id}">
                        <i class="fa-solid fa-heart"></i> <span class="likes-count">${receita.likes ? receita.likes.length : 0}</span>
                    </button>
                </div>
            </div>
        `;

        // Adicionar evento ao botão de like
        const btnLike = card.querySelector('.btn-like');
        btnLike.addEventListener('click', () => toggleLike(receita._id, btnLike));

        feedGrid.appendChild(card);
    });
}

// Configurar Filtros
function configurarFiltros() {
    const filtros = document.querySelectorAll('.sidebar-filtros a');

    filtros.forEach(filtro => {
        filtro.addEventListener('click', (e) => {
            e.preventDefault();

            // Remover ativo de todos
            filtros.forEach(f => f.classList.remove('ativo'));

            // Adicionar ativo ao clicado
            filtro.classList.add('ativo');

            // Carregar receitas com filtro
            const categoria = filtro.textContent.includes('Tudo') ? '' :
                             filtro.textContent.includes('Salgados') ? 'salgado' :
                             filtro.textContent.includes('Doces') ? 'doce' :
                             filtro.textContent.includes('Saudável') ? 'saudavel' :
                             filtro.textContent.includes('Bebidas') ? 'bebida' : '';

            carregarReceitas(categoria);
        });
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

// Carregar Foto de Perfil na Navbar
function carregarFotoPerfilNav() {
    const usuarioId = localStorage.getItem('usuario_id');
    if (usuarioId) {
        // Buscar dados do usuário para pegar a foto
        fetch(`/api/usuarios/${usuarioId}`)
            .then(res => res.json())
            .then(usuario => {
                const img = document.getElementById('nav-foto-perfil');
                if (img) {
                    img.src = usuario.foto || 'images/default-avatar.png';
                }
            })
            .catch(err => console.error('Erro ao carregar foto do perfil:', err));
    }
}

// Carregar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarReceitas();
    configurarFiltros();
    carregarFotoPerfilNav();
});