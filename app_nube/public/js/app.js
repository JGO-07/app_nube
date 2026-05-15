// === app.js ===
// Estado global
const state = {
  materia: null,
  preguntas: [],
  respuestas: {},   // { "id": indiceOpcion }
  currentIndex: 0,
  total: 0
};

const LETRAS = ['A', 'B', 'C', 'D'];

// --- NAVEGACIÓN ENTRE PANTALLAS ---
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
    s.style.opacity = '0';
  });
  const target = document.getElementById(id);
  target.style.display = 'flex';
  requestAnimationFrame(() => {
    target.classList.add('active');
    target.style.opacity = '1';
  });
}

function goHome() {
  state.materia = null;
  state.preguntas = [];
  state.respuestas = {};
  state.currentIndex = 0;
  showScreen('screen-home');
}

// --- INICIO DEL EXAMEN ---
async function startExam(materia) {
  state.materia = materia;
  state.respuestas = {};
  state.currentIndex = 0;

  const labels = { matematicas: 'Matemáticas', espanol: 'Español', ciencias: 'Ciencias' };

  try {
    const res = await fetch(`/api/questions/${materia}`);
    if (!res.ok) throw new Error('Error al cargar preguntas');
    const data = await res.json();

    state.preguntas = data.preguntas;
    state.total = data.total;

    document.getElementById('exam-materia-label').textContent = labels[materia] || materia;
    document.getElementById('q-total').textContent = state.total;

    showScreen('screen-exam');
    renderQuestion();
  } catch (err) {
    alert('No se pudieron cargar las preguntas. Verifica que el servidor esté corriendo.');
    console.error(err);
  }
}

// --- RENDER PREGUNTA ---
function renderQuestion() {
  const pregunta = state.preguntas[state.currentIndex];
  const total = state.total;
  const idx = state.currentIndex;

  // Barra de progreso
  const pct = ((idx) / total) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('q-current').textContent = idx + 1;
  document.getElementById('question-num').textContent = `Pregunta ${idx + 1}`;
  document.getElementById('question-text').textContent = pregunta.pregunta;

  // Opciones
  const container = document.getElementById('options-list');
  container.innerHTML = '';
  pregunta.opciones.forEach((opcion, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn' + (state.respuestas[pregunta.id] === i ? ' selected' : '');
    btn.innerHTML = `
      <span class="option-letter">${LETRAS[i]}</span>
      <span class="option-text">${opcion}</span>
    `;
    btn.addEventListener('click', () => selectOption(pregunta.id, i));
    container.appendChild(btn);
  });

  // Botones nav
  document.getElementById('btn-prev').disabled = idx === 0;

  const btnNext = document.getElementById('btn-next');
  const esUltima = idx === total - 1;
  const todasRespondidas = state.preguntas.every(p => state.respuestas[p.id] !== undefined);

  if (esUltima) {
    btnNext.textContent = 'Ver resultados →';
    btnNext.disabled = !todasRespondidas;
    btnNext.title = !todasRespondidas ? 'Responde todas las preguntas para continuar' : '';
  } else {
    btnNext.textContent = 'Siguiente →';
    btnNext.disabled = false;
  }
}

// --- SELECCIÓN DE OPCIÓN ---
function selectOption(preguntaId, indiceOpcion) {
  state.respuestas[preguntaId] = indiceOpcion;

  // Re-render opciones con el nuevo estado
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === indiceOpcion);
  });

  // Actualiza botón siguiente si es la última
  const esUltima = state.currentIndex === state.total - 1;
  if (esUltima) {
    const todasRespondidas = state.preguntas.every(p => state.respuestas[p.id] !== undefined);
    document.getElementById('btn-next').disabled = !todasRespondidas;
  }
}

// --- NAVEGACIÓN ---
function nextQuestion() {
  if (state.currentIndex < state.total - 1) {
    state.currentIndex++;
    renderQuestion();
  } else {
    submitExam();
  }
}

function prevQuestion() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    renderQuestion();
  }
}

// --- ENVÍO Y RESULTADOS ---
async function submitExam() {
  showScreen('screen-loading');

  try {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        materia: state.materia,
        respuestas: state.respuestas
      })
    });

    if (!res.ok) throw new Error('Error al obtener explicaciones');
    const data = await res.json();
    renderResults(data);
  } catch (err) {
    alert('Error al procesar resultados. Intenta de nuevo.');
    console.error(err);
    showScreen('screen-exam');
  }
}

// --- RENDER RESULTADOS ---
function renderResults(data) {
  const { puntaje, correctas, total, resultados } = data;

  // Score hero
  document.getElementById('score-num').textContent = puntaje;

  let label, detail;
  if (puntaje >= 80) {
    label = '¡Excelente resultado!';
    detail = `${correctas} de ${total} correctas — Dominas el tema`;
  } else if (puntaje >= 60) {
    label = 'Buen trabajo';
    detail = `${correctas} de ${total} correctas — Sigue practicando`;
  } else if (puntaje >= 40) {
    label = 'En progreso';
    detail = `${correctas} de ${total} correctas — Revisa las explicaciones`;
  } else {
    label = 'Necesita refuerzo';
    detail = `${correctas} de ${total} correctas — Lee bien las explicaciones`;
  }

  // Color del círculo según puntaje
  const circle = document.getElementById('score-circle');
  if (puntaje < 50) {
    circle.style.borderColor = 'var(--wrong)';
    circle.style.background = 'var(--wrong-dim)';
    document.querySelector('.score-num').style.color = 'var(--wrong)';
    document.querySelector('.score-pct').style.color = 'var(--wrong)';
  }

  document.getElementById('score-label').textContent = label;
  document.getElementById('score-detail').textContent = detail;

  // Lista de respuestas
  const list = document.getElementById('results-list');
  list.innerHTML = '';

  resultados.forEach((r, idx) => {
    const card = document.createElement('div');
    card.className = `result-card ${r.esCorrecta ? 'correct' : 'wrong'}`;

    const userAnswerHtml = !r.esCorrecta
      ? `<div class="result-answer is-wrong"><span class="label">Tu respuesta:</span>${r.opcionUsuario ?? 'Sin respuesta'}</div>`
      : '';

    card.innerHTML = `
      <div class="result-header">
        <div class="result-indicator">${r.esCorrecta ? '✓' : '✗'}</div>
        <div class="result-content">
          <p class="result-question">${idx + 1}. ${r.pregunta}</p>
          <div class="result-answers">
            ${userAnswerHtml}
            <div class="result-answer is-correct"><span class="label">Respuesta correcta:</span>${r.opcionCorrecta}</div>
          </div>
        </div>
      </div>
      <div class="result-explanation">
        <span class="explain-icon">💡</span>
        <p class="explain-text">${r.explicacion}</p>
      </div>
    `;
    list.appendChild(card);
  });

  showScreen('screen-results');

  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
