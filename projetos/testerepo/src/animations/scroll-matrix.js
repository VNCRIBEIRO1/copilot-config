import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export class ScrollMatrixReveal {
  constructor(el) {
    this.el = el;
    this.el._matrixReveal = this; // Expõe a instância para disparos externos
    this.originalText = el.innerText.trim();
    // Se o elemento estiver vazio, aborta
    if(!this.originalText) return;
    
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]█▓▒░ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    
    // Prepara o DOM dividindo as letras. 
    // Colocamos opacity: 0 para proteger o Layout (mantendo o elemento ocupando o tamanho físico real dele)
    let html = '';
    for(let i=0; i < this.originalText.length; i++) {
       const char = this.originalText[i];
       if (char === ' ') {
         html += ' ';
       } else {
         html += `<span class="scroll-char" style="opacity: 0;">${char}</span>`;
       }
    }
    
    this.el.innerHTML = html;
    this.spans = this.el.querySelectorAll('.scroll-char');

    this.initScroll();
  }

  initScroll() {
    // Se estiver dentro do Bento Section, não auto-inicia, pois será orquestrado sequencialmente no gsap-init
    if (this.el.closest('.bento-section')) return;

    ScrollTrigger.create({
      trigger: this.el,
      start: "top 90%", // Dispara quando o elemento atinge 90% da tela (entrando no view)
      onEnter: () => {
        // Delay removido para resposta instantânea ao scroll
        this.decode();
      },
      once: true // Renderiza a decodificação apenas uma vez por elemento
    });
  }

  decode() {
     this.spans.forEach((span, index) => {
        const origChar = span.innerText;
        
        // Define a quantidade de ciclos que a letra vai ficar embaralhada antes de se firmar
        const maxIters = 10 + Math.floor(Math.random() * 10);
        let iterations = 0;
        
        const scramble = () => {
           if (iterations === 0) {
              span.style.opacity = '1';
              span.classList.add('bug-char-light'); // Acende com Ciano Neon / Monospace
           }
           
           if (iterations < maxIters) {
              span.innerText = this.chars[Math.floor(Math.random() * this.chars.length)];
              iterations++;
              setTimeout(scramble, 30); // 30ms por ciclo de embaralhamento
           } else {
              span.classList.remove('bug-char-light');
              span.innerText = origChar;
           }
        };
        
        // Cascata da esquerda para a direita (typewriter wave)
        setTimeout(scramble, index * 15);
     });
  }
}

export function initScrollMatrix() {
  gsap.registerPlugin(ScrollTrigger);
  const elements = document.querySelectorAll('.matrix-reveal');
  elements.forEach(el => new ScrollMatrixReveal(el));
}
