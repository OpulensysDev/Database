import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Configuração do Multer para armazenar arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Servir arquivos estáticos
app.use(express.static(__dirname));
app.use('/files', express.static('uploads'));

// Rota para upload de arquivos
app.post('/upload', upload.array('files'), (req, res) => {
    res.json({ message: 'Arquivos enviados com sucesso' });
});

// Rota para listar arquivos
app.get('/files', async (req, res) => {
    try {
        const files = await fs.readdir('uploads');
        res.json(files);
    } catch (error) {
        console.error('Erro ao listar arquivos:', error);
        res.status(500).json({ error: 'Erro ao listar arquivos' });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Criar pasta de uploads se não existir
fs.mkdir('uploads', { recursive: true }).catch(console.error);
