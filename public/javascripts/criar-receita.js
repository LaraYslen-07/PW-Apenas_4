// Preview da Foto da Receita
const inputFoto = document.getElementById('foto-receita');
const imgPreview = document.getElementById('preview-receita');
const textoUpload = document.querySelector('.area-upload span');
const iconeUpload = document.querySelector('.area-upload i');

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

// Envio do formulário (Conectado ao Backend)
document.getElementById('form-receita').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Criar FormData para enviar texto + arquivo
    const formData = new FormData();
    
    // Pegar os valores dos campos
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const ingredientes = document.getElementById('ingredientes').value;
    const instrucoes = document.getElementById('instrucoes').value;
    const foto = document.getElementById('foto-receita').files[0];

    // Colocar tudo no pacote
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('ingredientes', ingredientes);
    formData.append('instrucoes', instrucoes);
    
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
        const resposta = await fetch('/api/receitas', {
            method: 'POST',
            body: formData
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert('Receita criada com sucesso!');
            window.location.href = 'feed.html'; // Redireciona para o Feed
        } else {
            alert('Erro ao criar receita: ' + (resultado.erro || 'Erro desconhecido'));
        }

    } catch (erro) {
        console.error('Erro de conexão:', erro);
        alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
        // Volta o botão ao normal
        const botao = document.querySelector('button[type="submit"]');
        botao.innerText = "Criar Receita";
        botao.disabled = false;
    }
});
