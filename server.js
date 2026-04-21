const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

app.post('/api/beneficio/evaluar', (req, res) => {
  res.json({
    solicitudId: req.body.solicitudId,
    score: 80,
    estado: "Aprobado",
    motivoDecision: "Prueba OK"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});