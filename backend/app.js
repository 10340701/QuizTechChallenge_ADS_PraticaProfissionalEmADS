const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Variável global para armazenar os dados dos usuários
let users = {};

// Gera um ID aleatório para o usuário
function generateRandomId() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Gera um número de 6 dígitos como string
}

// Rota para verificar ou criar usuário
app.post('/validar_users', (req, res) => {
    const { id_user } = req.body;

    if (id_user) {
        // Verifica se o usuário já existe
        if (users[id_user]) {
            return res.status(200).json({ message: 'Usuário já existe.', user: { id_user, nivel: users[id_user] } });
        } else {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    }

    // Se o ID do usuário não foi fornecido, cria um novo usuário
    const newId = generateRandomId();
    users[newId] = 1; // Define o nível inicial como 1
    res.status(201).json({ message: 'Usuário criado com sucesso.', user: { id_user: newId, nivel: 1 } });
});

// Rota para atualizar o nível de um usuário
app.put('/user/nivel', (req, res) => {
    const { id_user, nivel } = req.body;

    if (!id_user || !nivel) {
        return res.status(400).json({ message: 'ID do usuário e nível são obrigatórios.' });
    }

    if (!users[id_user]) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualiza o nível do usuário
    users[id_user] = nivel;
    res.status(200).json({ message: 'Nível do usuário atualizado com sucesso.', user: { id_user, nivel } });
});

// obter o nível de um usuário
app.get('/user/nivel', (req, res) => {
    const { id_user } = req.query;

    if (!id_user) {
        return res.status(400).json({ message: 'ID do usuário é obrigatório.' });
    }

    if (!users[id_user]) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Retorna o nível do usuário
    res.status(200).json({ message: 'Nível do usuário obtido com sucesso.', user: { id_user, nivel: users[id_user] } });
});

// Rota para listar todos os usuários (opcional, para depuração)
app.get('/users', (req, res) => {
    res.status(200).json({ users });
});

app.get('/questoes', async (req, res) => {
    const { unidade } = await req.query;
    const filePath = path.join(__dirname, 'unidades', 'unidade' + unidade + '.json');
   
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).json({ message: 'Erro ao ler o arquivo JSON.' });
        }

        try {
            const jsonData = JSON.parse(data);
            res.status(200).json({ message: 'Conteúdo do arquivo JSON obtido com sucesso.', questoes: jsonData });
        } catch (parseError) {
            console.error('Erro ao analisar o JSON:', parseError);
            res.status(500).json({ message: 'Erro ao analisar o arquivo JSON.' });
        }
    });
});

// setInterval(() => {
//     console.log(users)
// }, 1000);

// Inicializa o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}.`);
});
