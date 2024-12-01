const express = require('express');
const router = express.Router();
const connection = require('./database.config');
const bcrypt = require('bcrypt'); // Adicionar esta dependência

// Rota para registrar usuário
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: 400,
            message: 'Preencha todos os campos para registrar.'
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        connection.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: 'Erro no servidor.'
                });
            }
            
            if (results.length > 0) {
                return res.status(400).json({
                    status: 400,
                    message: 'Usuário já existe. Escolha outro nome.'
                });
            }

            connection.query('INSERT INTO usuarios (username, password) VALUES (?, ?)', 
                [username, hashedPassword], (err) => {
                if (err) {
                    return res.status(500).json({
                        status: 500,
                        message: 'Erro ao registrar usuário.'
                    });
                }
                res.status(201).json({
                    status: 201,
                    message: 'Conta criada com sucesso!'
                });
            });
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Erro ao processar senha.'
        });
    }
});

// Rota para login de usuário
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: 400,
            message: 'Preencha todos os campos para fazer login.'
        });
    }

    connection.query('SELECT * FROM usuarios WHERE username = ?', [username], async (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Erro no servidor.'
            });
        }
        
        if (results.length === 0) {
            return res.status(400).json({
                status: 400,
                message: 'Usuário ou senha incorretos.'
            });
        }

        try {
            const match = await bcrypt.compare(password, results[0].password);
            if (match) {
                res.status(200).json({
                    status: 200,
                    message: `Bem-vindo, ${username}!`
                });
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'Usuário ou senha incorretos.'
                });
            }
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Erro ao verificar senha.'
            });
        }
    });
});

module.exports = router;
