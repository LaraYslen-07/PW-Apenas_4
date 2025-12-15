// 1. Animação da Navbar (Entrar e Sair)
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Evita comportamento estranho no topo (efeito bounce do Mac/Mobile)
    if (scrollTop < 0) return;

    if (scrollTop > lastScrollTop) {
        // Rolando pra BAIXO -> Esconde
        navbar.style.transform = 'translateY(-100%)'; 
    } else {
        // Rolando pra CIMA -> Mostra
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
    
    // CHAMA A ANIMAÇÃO DA TIMELINE AQUI DENTRO TAMBÉM
    animarTimeline();
});

// 2. Animação da Timeline (Bolinhas e Linha)
function animarTimeline() {
    const timeline = document.querySelector('.timeline');
    const linha = document.querySelector('.linha-progresso');
    const itens = document.querySelectorAll('.timeline-item');
    
    if (!timeline) return; // Se não tiver timeline na página, para aqui

    const rect = timeline.getBoundingClientRect();
    const alturaJanela = window.innerHeight;
    
    // Só calcula se a timeline estiver visível na tela
    if (rect.top < alturaJanela && rect.bottom > 0) {
        
        // Ajuste Fino: Começa a pintar quando a timeline entra 20% na tela
        const inicioAnimacao = alturaJanela * 0.8; 
        const fimAnimacao = rect.height + 100; // Um pouco mais que a altura total
        
        // Quanto já rolamos desde o topo da timeline
        const distanciaPercorrida = inicioAnimacao - rect.top;
        
        // Transforma em porcentagem (0 a 100)
        let porcentagem = (distanciaPercorrida / fimAnimacao) * 100;
        porcentagem = Math.min(100, Math.max(0, porcentagem));
        
        // Aplica a altura na linha laranja
        linha.style.height = `${porcentagem}%`;
        
        // Verifica cada bolinha
        itens.forEach(item => {
            const bolinha = item.querySelector('.bolinha');
            
            // A posição da bolinha relativa ao topo da timeline
            // Ajuste: +10px para a linha passar um pouquinho da bolinha antes de acender
            const posicaoBolinha = item.offsetTop + 10; 
            
            // Altura atual da linha laranja em pixels
            const alturaLinhaPx = (porcentagem / 100) * timeline.offsetHeight;
            
            if (alturaLinhaPx > posicaoBolinha) {
                bolinha.classList.add('ativo');
            } else {
                bolinha.classList.remove('ativo');
            }
        });
    }
}

// Roda uma vez ao carregar para garantir que o estado inicial esteja certo
document.addEventListener('DOMContentLoaded', animarTimeline);
