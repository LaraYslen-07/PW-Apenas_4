// Pega o formulário
const formLogin = document.getElementById('form-login');

// Verifica se o formulário existe na página
if (!formLogin) {
    console.error("ERRO: Não achei o formulário com id 'form-login' no HTML!");
} else {
    // Adiciona o evento de envio
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault(); // Não deixa a página recarregar sozinha
        console.log("1. Botão clicado! Tentando entrar...");

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const botao = document.querySelector('button[type="submit"]');

        console.log("2. Dados pegos:", email, senha);

        try {
            botao.innerText = "Verificando...";
            botao.disabled = true;

            // Faz o pedido pro servidor
            const resposta = await fetch('http://localhost:3000/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            console.log("3. Resposta do servidor chegou:", resposta.status);

            const dados = await resposta.json();

            if (resposta.ok) {
                console.log("4. Sucesso! Redirecionando...");
                
                // Salva que o usuário está logado
                localStorage.setItem('usuario_id', dados.usuario._id);
                localStorage.setItem('usuario_nome', dados.usuario.nome);

                alert('Bem-vindo(a) ' + dados.usuario.nome + '!');
                
                // AQUI É O PULO DO GATO: Manda para o Feed ou Criar Receita
                window.location.href = 'feed.html'; 
            } else {
                console.error("4. Erro no login:", dados.erro);
                alert('Erro: ' + (dados.erro || 'Falha desconhecida'));
            }

        } catch (erro) {
            console.error("ERRO GRAVE:", erro);
            alert('Não consegui conectar no servidor. O backend está rodando?');
        } finally {
            botao.innerText = "Entrar na Cozinha";
            botao.disabled = false;
        }
    });
}
