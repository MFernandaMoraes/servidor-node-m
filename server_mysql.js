const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');


const app = express();
const port = 3000;

// Use o cors
app.use(cors());

// Middleware para o Express enternder JSON no corpo da requisição (req.body)
app.use(express.json());


// 1. Configura a conexão com o MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
    password: '',
    database: 'supernovast'
});

// Conecta ao banco de dados
connection.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao MySQL: ', err.stack );
      return;
    }
    console.log('Conectado ao MySQL com sucesso!');

    // Cria a tabela 'alunos'  caso ela não exista
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS alunos(
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL
      )`;
      connection.query( createTableQuery, (err) => {
        if (err) {
          console.error('Erro ao criar tabela: ', err.stack );
          return;
        }
      } );

    const createTableRoupasQuery = `
        CREATE TABLE IF NOT EXISTS roupas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        preco DECIMAL(10, 2) NOT NULL,
        tamanho VARCHAR(50) NOT NULL,
        estilo VARCHAR(100) NOT NULL,
        colecao VARCHAR(100) NOT NULL
        )`;

    connection.query(createTableRoupasQuery, (err) => {
    if (err) {
        console.error('Erro ao criar tabela: ', err.stack);
        return; 
    }
});
});

app.get('/alunos', (req, res) => {
  connection.query('SELECT * FROM alunos', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar alunos'});
    }
    res.json(results);
  });
});

app.post('/roupas', (req, res) => {
  const { nome, preco, tamanho, estilo, colecao } = req.body;

  const query = 'INSERT INTO roupas (nome, preco, tamanho, estilo, colecao) VALUES (?, ?, ?, ?, ?)';
  
  connection.query(query, [nome, preco, tamanho, estilo, colecao], (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao cadastrar roupa' });
    }
    res.status(201).json({ mensagem: 'Roupa cadastrada com sucesso', id: results.insertId });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/`);
});

