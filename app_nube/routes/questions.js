// routes/questions.js — versión DynamoDB
const express = require('express');
const router = express.Router();
const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

// En EC2 dentro de la VPC, las credenciales vienen del Instance Profile (IAM Role)
// En local, vienen de ~/.aws/credentials (con session_token del Learner Lab)
const client = new DynamoDBClient({ region: "us-east-1" });

const validMaterias = ['matematicas', 'espanol', 'ciencias'];

router.get('/:materia', async (req, res) => {
  const { materia } = req.params;

  if (!validMaterias.includes(materia)) {
    return res.status(400).json({ error: 'Materia no válida' });
  }

  try {
    const command = new QueryCommand({
      TableName: "exam-questions",
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": { S: `MATERIA#${materia}` }
      }
    });

    const { Items } = await client.send(command);

    if (!Items || Items.length === 0) {
      return res.status(404).json({ error: 'No se encontraron preguntas' });
    }

    // Quita el campo "correcta" antes de mandarlo al frontend
    const preguntas = Items
      .map(item => unmarshall(item))
      .map(({ correcta, PK, SK, ...resto }) => resto);

    res.json({ materia, total: preguntas.length, preguntas });

  } catch (err) {
    console.error('Error DynamoDB:', err.message);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

module.exports = router;