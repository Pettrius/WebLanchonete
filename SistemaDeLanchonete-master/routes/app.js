const express = require('express');
const app = express();
const path = require('path');
const indexRouter = require('./index');

// Middleware para processar JSON
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../FrontEnd')));

// Usar o router para registro e login
app.use('/', indexRouter);

// Rota de teste
app.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando!' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
