// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os links de navegação do menu
  const links = document.querySelectorAll(".nav a");

  // Seleciona o elemento <main> onde o conteúdo será carregado dinamicamente
  const main = document.getElementById("main-content");

  // Função que carrega o conteúdo HTML de uma página específica
  function loadPage(page) {
    fetch(`templates/${page}.html`)
      .then(response => {
        if (!response.ok) throw new Error("Página não encontrada");
        return response.text();
      })
      .then(html => {
        main.innerHTML = html;
        applyDynamicEvents(); // reaplica eventos dinâmicos
      })
      .catch(error => {
        main.innerHTML = `
          <section class="section">
            <h2>Erro</h2>
            <p>${error.message}</p>
          </section>`;
      });
  }

  // Adiciona um evento de clique para cada link do menu
  links.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const page = link.getAttribute("href").replace("#", "");
      loadPage(page);
    });
  });

  // Carrega a página inicial ao abrir o site
  loadPage("turma");

  // Carrossel automático (se existir)
  let currentIndex = 1;
  const totalSlides = 3;

  setInterval(() => {
    const slide = document.getElementById(`slide${currentIndex}`);
    if (slide) {
      slide.checked = true;
      currentIndex = currentIndex % totalSlides + 1;
    }
  }, 2500);
});

// ======================================
// Função que aplica eventos adicionais
// ======================================
function applyDynamicEvents() {
  const highlightButtons = document.querySelectorAll(".btn-highlight");
  highlightButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".section").classList.toggle("highlighted");
    });
  });

  // Ativa o mini quiz se existir na página carregada
  if (document.getElementById("mini-quiz")) {
    iniciarMiniQuiz();
  }
}

// ===============================
// MINI QUIZ (somente para brincar)
// ===============================
function iniciarMiniQuiz() {
  const perguntas = [
    {
      texto: "Quantas turmas de Defesa Civil existem atualmente?",
      opcoes: ["1 Turma", "2 Turmas", "3 Turmas"],
      correta: "1 Turma"
    },
    {
      texto: "Qual é a única ETEC que possui o curso de Defesa Civil?",
      opcoes: ["ETEC Prof. Aprígio Gonzaga", "ETEC Zona Leste", "ETEC Tatuapé"],
      correta: "ETEC Prof. Aprígio Gonzaga"
    },
    {
      texto: "Em qual feira você pode conhecer mais sobre o curso?",
      opcoes: ["Campus Party", "EXPO Aprígio Gonzaga", "Feira do Livro"],
      correta: "EXPO Aprígio Gonzaga"
    }
  ];

  let indice = 0;
  let pontos = 0;

  const perguntaEl = document.getElementById("quiz-pergunta");
  const opcoesEl = document.getElementById("quiz-opcoes");
  const feedbackEl = document.getElementById("quiz-feedback");

  function mostrarPergunta() {
    if (indice >= perguntas.length) {
      perguntaEl.textContent = `✅ Fim do mini quiz! Você acertou ${pontos} de ${perguntas.length}.`;
      opcoesEl.innerHTML = "";
      return;
    }

    const pergunta = perguntas[indice];
    perguntaEl.textContent = pergunta.texto;
    opcoesEl.innerHTML = "";

    pergunta.opcoes.forEach(opcao => {
      const btn = document.createElement("button");
      btn.textContent = opcao;
      btn.classList.add("btn-quiz");
      btn.onclick = () => verificarResposta(opcao);
      opcoesEl.appendChild(btn);
    });
  }

  function verificarResposta(resposta) {
    const pergunta = perguntas[indice];
    if (resposta === pergunta.correta) {
      feedbackEl.textContent = "🎉 Correto!";
      feedbackEl.style.color = "green";
      pontos++;
    } else {
      feedbackEl.textContent = "❌ Errado!";
      feedbackEl.style.color = "red";
    }
    indice++;
    setTimeout(() => {
      feedbackEl.textContent = "";
      mostrarPergunta();
    }, 1200);
  }

  mostrarPergunta();
}
