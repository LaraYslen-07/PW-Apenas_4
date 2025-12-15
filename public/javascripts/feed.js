// Carregar Receitas do Feed
async function carregarReceitas() {
    try {
        const resposta = await fetch('/api/receitas');
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
    const feedGrid = document.querySelector('.feed-grid');

    // Remover o estado vazio se houver
    const estadoVazio = document.querySelector('.ficha-receita-vazia');
    if (estadoVazio) {
        estadoVazio.remove();
    }

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

// Carregar quando a página carregar
document.addEventListener('DOMContentLoaded', carregarReceitas);