// Preview da Foto da Receita
const inputFoto = document.getElementById('foto-receita');
const imgPreview = document.getElementById('preview-receita');
const textoUpload = document.querySelector('.area-upload span');
const iconeUpload = document.querySelector('.area-upload i');

// Verificar se é edição
const urlParams = new URLSearchParams(window.location.search);
const isEdit = urlParams.has('edit');
const editId = urlParams.get('edit');

// Gerenciamento de Etapas
let etapas = [];

// Função para criar HTML de uma etapa
function criarEtapaHTML(etapa, index) {
    return `
        <div class="etapa-item" data-index="${index}">
            <div class="etapa-header">
                <span class="etapa-numero">Etapa ${index + 1}</span>
                <button type="button" class="btn-remover-etapa" onclick="removerEtapa(${index})">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="etapa-grid">
                <input type="text" placeholder="Equipamento" value="${etapa.equipamento || ''}" onchange="atualizarEtapa(${index}, 'equipamento', this.value)">
                <input type="text" placeholder="Temperatura (opcional)" value="${etapa.temperatura || ''}" onchange="atualizarEtapa(${index}, 'temperatura', this.value)">
                <div class="etapa-descricao">
                    <textarea placeholder="Descrição do passo" onchange="atualizarEtapa(${index}, 'descricao', this.value)">${etapa.descricao || ''}</textarea>
                </div>
            </div>
        </div>
    `;
}

// Função para adicionar etapa
function adicionarEtapa() {
    etapas.push({ equipamento: '', temperatura: '', descricao: '' });
    atualizarEtapasHTML();
}

// Função para remover etapa
function removerEtapa(index) {
    etapas.splice(index, 1);
    atualizarEtapasHTML();
}

// Função para atualizar etapa
function atualizarEtapa(index, campo, valor) {
    etapas[index][campo] = valor;
}

// Função para atualizar HTML das etapas
function atualizarEtapasHTML() {
    const container = document.getElementById('etapas-container');
    container.innerHTML = etapas.map((etapa, index) => criarEtapaHTML(etapa, index)).join('');
}

// Event listener para o botão adicionar etapa
document.getElementById('adicionar-etapa').addEventListener('click', adicionarEtapa);

inputFoto.addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imgPreview.src = e.target.result;
            imgPreview.style.display = 'block';
            
            // Esconde o texto e ícone pra foto brilhar
            textoUpload.style.display = 'none';
            iconeUpload.style.display = 'none';
        }
        
        reader.readAsDataURL(file);
    }
});

// Carregar dados da receita para edição
async function carregarReceitaParaEdicao() {
    if (!isEdit || !editId) return;

    try {
        const resposta = await fetch(`/api/receitas/${editId}`);
        const receita = await resposta.json();

        if (resposta.ok) {
            // Preencher os campos
            document.getElementById('titulo').value = receita.titulo;
            document.getElementById('descricao').value = receita.descricao;
            document.getElementById('instrucoes').value = receita.instrucoes;

            // Preencher ingredientes (assumindo que são separados por vírgula)
            const ingredientes = receita.ingredientes.split(', ');
            if (ingredientes.length > 0) document.getElementById('ingrediente1').value = ingredientes[0];
            if (ingredientes.length > 1) document.getElementById('ingrediente2').value = ingredientes[1];
            if (ingredientes.length > 2) document.getElementById('ingrediente3').value = ingredientes[2];
            if (ingredientes.length > 3) document.getElementById('ingrediente4').value = ingredientes[3];

            // Preencher etapas
            if (receita.etapas && receita.etapas.length > 0) {
                etapas = receita.etapas;
                atualizarEtapasHTML();
            }

            // Selecionar categoria
            const categoriaRadio = document.querySelector(`input[name="categoria"][value="${receita.categoria}"]`);
            if (categoriaRadio) categoriaRadio.checked = true;

            // Mostrar foto atual
            if (receita.foto) {
                imgPreview.src = receita.foto;
                imgPreview.style.display = 'block';
                textoUpload.style.display = 'none';
                iconeUpload.style.display = 'none';
            }

            // Mudar título da página
            document.querySelector('h1').textContent = 'Editar Receita';
            document.querySelector('button[type="submit"]').textContent = 'Atualizar Receita';
        } else {
            alert('Erro ao carregar receita para edição.');
            window.location.href = 'perfil.html';
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao carregar receita.');
    }
}

// Envio do formulário (Conectado ao Backend)
document.getElementById('form-receita').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Verificar se todos os elementos existem
    const tituloElement = document.getElementById('titulo');
    const descricaoElement = document.getElementById('descricao');
    const ingrediente1Element = document.getElementById('ingrediente1');
    const ingrediente2Element = document.getElementById('ingrediente2');
    const ingrediente3Element = document.getElementById('ingrediente3');
    const ingrediente4Element = document.getElementById('ingrediente4');
    const instrucoesElement = document.getElementById('instrucoes');

    if (!tituloElement || !descricaoElement || !ingrediente1Element || !ingrediente2Element || !ingrediente3Element || !ingrediente4Element || !instrucoesElement) {
        alert('Erro: Elementos do formulário não encontrados!');
        console.error('Elementos não encontrados:', {
            tituloElement, descricaoElement, ingrediente1Element, ingrediente2Element, 
            ingrediente3Element, ingrediente4Element, instrucoesElement
        });
        return;
    }

    // Pegar os valores dos campos
    const titulo = tituloElement.value;
    const descricao = descricaoElement.value;
    const ingrediente1 = ingrediente1Element.value;
    const ingrediente2 = ingrediente2Element.value;
    const ingrediente3 = ingrediente3Element.value;
    const ingrediente4 = ingrediente4Element.value;
    const instrucoes = instrucoesElement.value;
    const categoriaElement = document.querySelector('input[name="categoria"]:checked');
    const categoria = categoriaElement ? categoriaElement.value : null;
    const usuario = localStorage.getItem('usuario_id');
    const fotoInput = document.getElementById('foto-receita');
    const foto = fotoInput && fotoInput.files ? fotoInput.files[0] : null;

    // Validações básicas
    if (!titulo.trim()) {
        alert('O título é obrigatório!');
        return;
    }
    
    if (!ingrediente1.trim() || !ingrediente2.trim() || !ingrediente3.trim() || !ingrediente4.trim()) {
        alert('Todos os 4 ingredientes são obrigatórios!');
        return;
    }
    
    if (!categoriaElement) {
        alert('Selecione uma categoria!');
        return;
    }
    
    if (!usuario) {
        alert('Você precisa estar logado para criar uma receita.');
        window.location.href = 'login.html';
        return;
    }

    // Verificar se pelo menos uma etapa foi preenchida
    const etapasValidas = etapas.filter(etapa => etapa.equipamento.trim() || etapa.descricao.trim());
    if (etapasValidas.length === 0) {
        alert('Adicione pelo menos uma etapa de preparo!');
        return;
    }

    // Criar FormData para envio
    const formData = new FormData();

    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('ingredientes', `${ingrediente1}, ${ingrediente2}, ${ingrediente3}, ${ingrediente4}`);
    formData.append('instrucoes', instrucoes);
    formData.append('etapas', JSON.stringify(etapasValidas));
    formData.append('categoria', categoria);
    formData.append('usuario', usuario);
    
    if (foto) {
        formData.append('foto', foto);
    }

    try {
        // Mostra que está carregando
        const botao = document.querySelector('button[type="submit"]');
        const textoOriginal = botao.innerText;
        botao.innerText = "Salvando...";
        botao.disabled = true;

        // Enviar para o servidor
        const resposta = await fetch(isEdit ? `/api/receitas/${editId}` : '/api/receitas', {
            method: isEdit ? 'PUT' : 'POST',
            body: formData
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert(isEdit ? 'Receita atualizada com sucesso!' : 'Receita criada com sucesso!');
            window.location.href = 'perfil.html'; // Redireciona para o Perfil
        } else {
            alert('Erro ao criar receita: ' + (resultado.erro || 'Erro desconhecido'));
        }

    } catch (erro) {
        console.error('Erro de conexão:', erro);
        alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
        // Volta o botão ao normal
        const botao = document.querySelector('button[type="submit"]');
        botao.innerText = isEdit ? "Atualizar Receita" : "Criar Receita";
        botao.disabled = false;
    }
});

// Carregar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarReceitaParaEdicao();
});
