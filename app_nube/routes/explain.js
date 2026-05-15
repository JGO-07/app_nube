// routes/explain.js
// En producción: este endpoint llama a tu Lambda en AWS
// Lambda a su vez llama a la API de ChatGPT y regresa las explicaciones
// En prototipo: llama directo a OpenAI si tienes la key, o usa respuestas mock

const express = require('express');
const router = express.Router();
const axios = require('axios');
const allQuestions = require('../data/questions');

// POST /api/explain
// Body: { materia: "matematicas", respuestas: { "mat-001": 0, "mat-002": 2, ... } }

router.post('/', async (req, res) => {
  const { materia, respuestas } = req.body;

  if (!materia || !respuestas) {
    return res.status(400).json({ error: 'Faltan parámetros: materia y respuestas son requeridos' });
  }

  const preguntas = allQuestions[materia];
  if (!preguntas) {
    return res.status(404).json({ error: 'Materia no encontrada' });
  }

  // Calcula resultados con la respuesta correcta real
  const resultados = preguntas.map((pregunta) => {
    const respuestaUsuario = respuestas[pregunta.id];
    const esCorrecta = respuestaUsuario === pregunta.correcta;
    return {
      id: pregunta.id,
      pregunta: pregunta.pregunta,
      opciones: pregunta.opciones,
      respuestaUsuario,
      respuestaCorrecta: pregunta.correcta,
      opcionUsuario: pregunta.opciones[respuestaUsuario] ?? 'Sin respuesta',
      opcionCorrecta: pregunta.opciones[pregunta.correcta],
      esCorrecta
    };
  });

  const correctas = resultados.filter(r => r.esCorrecta).length;
  const puntaje = Math.round((correctas / preguntas.length) * 100);

  // --- MODO LAMBDA (producción) ---
  // Descomenta esto y comenta el bloque MOCK cuando tengas Lambda desplegado:
  /*
  const LAMBDA_URL = process.env.LAMBDA_URL; // Seteada como env var en EC2
  try {
    const lambdaResponse = await axios.post(LAMBDA_URL, {
      resultados,
      materia
    });
    return res.json({
      puntaje,
      correctas,
      total: preguntas.length,
      resultados: lambdaResponse.data.resultados
    });
  } catch (err) {
    console.error('Error llamando a Lambda:', err.message);
    // Fallback sin explicaciones si Lambda falla
  }
  */

  // --- MODO MOCK (prototipo) ---
  // Simula el delay de una llamada real a Lambda/OpenAI
  await new Promise(resolve => setTimeout(resolve, 1200));

  const explicacionesMock = {
    "mat-001": "La ecuación 2x² - 8 = 0 se resuelve despejando x²: dividimos entre 2 para obtener x² = 4, luego sacamos raíz cuadrada: x = ±2. Es importante recordar los dos signos al aplicar la raíz.",
    "mat-002": "log₂(x) = 5 significa que 2 elevado a la 5 es igual a x. 2⁵ = 2×2×2×2×2 = 32. La base del logaritmo es la que se eleva.",
    "mat-003": "La derivada de 3x³ es 9x² (regla de la potencia: bajamos el exponente y multiplicamos). La derivada de -2x es -2. La constante 7 desaparece.",
    "mat-004": "Teorema de Pitágoras: c² = a² + b² = 6² + 8² = 36 + 64 = 100. Raíz de 100 = 10.",
    "mat-005": "sen(45°) = √2/2 ≈ 0.707. Esto se obtiene del triángulo isósceles rectángulo con lados 1,1,√2.",
    "esp-001": "El punto y coma se usa para separar elementos de una enumeración cuando alguno ya contiene comas internas. En la opción correcta, separa dos grupos de items con comas.",
    "esp-002": "La metáfora establece una identidad directa entre dos cosas ('A es B') sin usar 'como'. El símil usaría 'el tiempo es como el oro'.",
    "esp-003": "El sujeto es el grupo nominal completo que realiza la acción: 'Los estudiantes de la universidad', incluyendo su complemento preposicional.",
    "esp-004": "'Haber' es verbo auxiliar (haber comido) o impersonal (hay personas). 'A ver' es la preposición 'a' + infinitivo 'ver', indica percepción.",
    "esp-005": "El acento diacrítico diferencia palabras que se escriben igual pero tienen distinto significado. 'Tú' (pronombre) se diferencia de 'tu' (posesivo).",
    "cien-001": "Las mitocondrias son los organelos donde ocurre la respiración celular aeróbica, produciendo ATP (adenosín trifosfato), la molécula energética principal de la célula.",
    "cien-002": "El enlace covalente ocurre cuando dos átomos comparten un par de electrones para completar su capa de valencia. Diferente al iónico donde hay transferencia.",
    "cien-003": "F = ma es la Segunda Ley de Newton. La fuerza neta sobre un objeto es igual a su masa multiplicada por la aceleración que adquiere.",
    "cien-004": "La fotosíntesis usa luz solar, CO₂ y agua para producir glucosa y oxígeno. Es la base de casi todas las cadenas alimentarias en la Tierra.",
    "cien-005": "El electrón tiene carga negativa (-1). El protón tiene carga positiva (+1) y el neutrón es neutro (0). Ambos están en el núcleo atómico."
  };

  const resultadosConExplicacion = resultados.map(r => ({
    ...r,
    explicacion: explicacionesMock[r.id] || "Explicación no disponible para esta pregunta."
  }));

  res.json({
    puntaje,
    correctas,
    total: preguntas.length,
    resultados: resultadosConExplicacion
  });
});

module.exports = router;
