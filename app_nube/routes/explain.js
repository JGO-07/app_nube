// routes/explain.js
const express = require('express');
const router = express.Router();
const allQuestions = require('../data/questions');
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const lambda = new LambdaClient({ region: "us-east-1" });

// ← Tu función que pegaste
async function getExplanation(question, studentAnswer, correctAnswer) {
  const response = await lambda.send(new InvokeCommand({
    FunctionName: "examprep-explanation",
    Payload: JSON.stringify({ question, studentAnswer, correctAnswer })
  }));
  const result = JSON.parse(Buffer.from(response.Payload).toString());
  return result.explanation;
}

router.post('/', async (req, res) => {
  const { materia, respuestas } = req.body;

  if (!materia || !respuestas) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  const preguntas = allQuestions[materia];
  if (!preguntas) return res.status(404).json({ error: 'Materia no encontrada' });

  // Calcula correctas igual que antes
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

  // ← MODO LAMBDA: llama a getExplanation por cada pregunta
  try {
    const resultadosConExplicacion = await Promise.all(
      resultados.map(async (r) => {
        const explicacion = await getExplanation(
          r.pregunta,
          r.opcionUsuario,
          r.opcionCorrecta
        );
        return { ...r, explicacion };
      })
    );

    res.json({ puntaje, correctas, total: preguntas.length, resultados: resultadosConExplicacion });

  } catch (err) {
    console.error('Error invocando Lambda:', err.message);
    res.status(500).json({ error: 'Error al obtener explicaciones de Lambda' });
  }
});

module.exports = router;