// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const questionsRoute = require('./routes/questions');
const explainRoute = require('./routes/explain');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/questions', questionsRoute);
app.use('/api/explain', explainRoute);

// Fallback a index.html para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 http://localhost:${PORT}`);
});

module.exports = app;
