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

// Envio do formulário (Simulação)
document.getElementById('form-receita').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Receita enviada para o forno! 🍳 (Em breve conectaremos ao backend)');
    window.location.href = 'feed.html'; // Volta pro feed
});
