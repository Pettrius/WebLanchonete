const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Pasta onde as fotos serão armazenadas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Nome único para o arquivo
    }
});
const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));  // Servir imagens da pasta 'uploads'

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./banco_local.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criar tabelas no banco de dados
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            photo TEXT  -- Coluna para armazenar o caminho da foto
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            itens TEXT,
            total REAL,
            entrega TEXT,
            pagamento TEXT,
            endereco TEXT,
            FOREIGN KEY(user_id) REFERENCES usuarios(id)
        );
    `);
});

// Rota para registrar um novo usuário com foto
app.post('/register', upload.single('photo'), (req, res) => {
    const { username, password } = req.body;
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username e password são obrigatórios.' });
    }

    const query = `INSERT INTO usuarios (username, password, photo) VALUES (?, ?, ?)`;
    db.run(query, [username, password, photoPath], function (err) {
        if (err) {
            return res.status(400).json({ error: 'Erro ao registrar usuário. Nome de usuário já existe.' });
        }
        res.status(200).json({ success: true, message: 'Usuário registrado com sucesso.', userId: this.lastID });
    });
});

// Rota para login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM usuarios WHERE username = ? AND password = ?`;
    db.get(query, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erro no servidor.' });
        }
        if (!row) {
            return res.status(400).json({ error: 'Usuário ou senha incorretos.' });
        }
        res.status(200).json({ 
            success: true, 
            message: 'Login realizado com sucesso.',
            user: row, // Retorna todos os dados do usuário, incluindo a foto
        });
    });
});


// Rota para salvar pedidos
app.post('/completeOrder', (req, res) => {
    const { user_id, items, total, entrega, pagamento, endereco } = req.body;

    const query = `
        INSERT INTO pedidos (user_id, itens, total, entrega, pagamento, endereco)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [user_id, items, total, entrega, pagamento, endereco], function (err) {
        if (err) {
            console.error('Erro ao salvar pedido:', err);
            return res.status(500).json({ error: 'Erro ao salvar pedido.' });
        }
        res.status(200).json({ success: true, message: 'Pedido salvo com sucesso.', pedidoId: this.lastID });
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
