// Preview da Foto da Receita
const inputFoto = document.getElementById('foto-receita');
const imgPreview = document.getElementById('preview-receita');
const textoUpload = document.querySelector('.area-upload span');
const iconeUpload = document.querySelector('.area-upload i');

// Verificar se é edição
const urlParams = new URLSearchParams(window.location.search);
const isEdit = urlParams.has('edit');
const editId = urlParams.get('edit');

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

    // Criar FormData para enviar texto + arquivo
    const formData = new FormData();
    
    // Pegar os valores dos campos
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const ingrediente1 = document.getElementById('ingrediente1').value;
    const ingrediente2 = document.getElementById('ingrediente2').value;
    const ingrediente3 = document.getElementById('ingrediente3').value;
    const ingrediente4 = document.getElementById('ingrediente4').value;
    const instrucoes = document.getElementById('instrucoes').value;
    const categoria = document.querySelector('input[name="categoria"]:checked').value;
    const usuario = localStorage.getItem('usuario_id');
    const foto = document.getElementById('foto-receita').files[0];

    if (!usuario) {
        alert('Você precisa estar logado para criar uma receita.');
        window.location.href = 'login.html';
        return;
    }

    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('ingredientes', `${ingrediente1}, ${ingrediente2}, ${ingrediente3}, ${ingrediente4}`);
    formData.append('instrucoes', instrucoes);
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
