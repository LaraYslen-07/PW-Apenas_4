// Preview da Imagem de Perfil
const inputFoto = document.getElementById('foto-perfil');
const imgPreview = document.getElementById('foto-preview');
const iconCamera = document.getElementById('icon-camera');
const previewContainer = document.getElementById('preview-container');

// Quando clicar na bolinha cinza, abre o seletor de arquivo
previewContainer.addEventListener('click', () => {
    inputFoto.click();
});

// Quando o usuário escolhe um arquivo
inputFoto.addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imgPreview.src = e.target.result; // Coloca a imagem na tag img
            imgPreview.style.display = 'block'; // Mostra a imagem
            iconCamera.style.display = 'none';  // Esconde o ícone da câmera
        }
        
        reader.readAsDataURL(file);
    }
});

/// Lógica de Envio REAL (Conectado ao Backend)
document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Criar um FormData (pacote especial pra enviar arquivos + texto)
    const formData = new FormData();
    
    // Pegar os valores dos campos
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const bio = document.getElementById('bio').value;
    const foto = document.getElementById('foto-perfil').files[0]; // Pega o arquivo real

    // Colocar tudo no pacote
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('senha', senha);
    formData.append('bio', bio);
    
    if (foto) {
        formData.append('foto', foto); // Só adiciona se tiver foto
    }

    try {
        // Mostra que está carregando
        const botao = document.querySelector('button[type="submit"]');
        const textoOriginal = botao.innerText;
        botao.innerText = "Salvando...";
        botao.disabled = true;

        // Enviar para o servidor
        const resposta = await fetch('/api/usuarios', {
            method: 'POST',
            body: formData
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert('Conta criada com sucesso! Bem-vindo(a) Chef ' + nome);
            window.location.href = 'feed.html'; // Redireciona para o Feed
        } else {
            alert('Erro ao criar conta: ' + (resultado.erro || 'Erro desconhecido'));
        }

    } catch (erro) {
        console.error('Erro de conexão:', erro);
        alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
        // Volta o botão ao normal
        const botao = document.querySelector('button[type="submit"]');
        botao.innerText = "Salvar Perfil";
        botao.disabled = false;
    }
});
