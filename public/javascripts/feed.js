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
            </div>
        `;

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

// Carregar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarReceitas();
    configurarFiltros();
});