// routes/questions.js
const express = require('express');
const router = express.Router();
const allQuestions = require('../data/questions');

// GET /api/questions/:materia
// Cuando conectes DynamoDB, reemplaza allQuestions[materia] con:
// const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
// query PK = "MATERIA#" + materia

router.get('/:materia', (req, res) => {
  const { materia } = req.params;

  const validMaterias = ['matematicas', 'espanol', 'ciencias'];
  if (!validMaterias.includes(materia)) {
    return res.status(400).json({ error: 'Materia no válida' });
  }

  const preguntas = allQuestions[materia];
  if (!preguntas) {
    return res.status(404).json({ error: 'No se encontraron preguntas' });
  }

  // Devuelve preguntas sin revelar cuál es la correcta al frontend
  const preguntasSanitizadas = preguntas.map(({ correcta, ...resto }) => resto);

  res.json({
    materia,
    total: preguntasSanitizadas.length,
    preguntas: preguntasSanitizadas
  });
});

module.exports = router;
