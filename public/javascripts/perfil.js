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
        const respostaReceitas = await fetch(`/api/receitas?usuario=${usuarioId}`);
        const receitas = await respostaReceitas.json();

        if (respostaReceitas.ok) {
            exibirReceitas(receitas);
        } else {
            console.error('Erro ao carregar receitas:', receitas.erro);
        }
    } catch (erro) {
        console.error('Erro de conexão:', erro);
        alert('Erro ao carregar perfil.');
    }
}

// Exibir Receitas
function exibirReceitas(receitas) {
    const grid = document.getElementById('grid-receitas');

    if (receitas.length === 0) {
        grid.innerHTML = '<p>Você ainda não publicou nenhuma receita.</p>';
        return;
    }

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
            </div>
        `;

        grid.appendChild(card);
    });
}

// Carregar quando a página carregar
document.addEventListener('DOMContentLoaded', carregarPerfil);