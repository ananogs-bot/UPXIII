// Parâmetros de Conexão com o Banco de Dados
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());


const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'facens@123',
    database: 'ReStyle'
});

conexao.connect(err => {
    if (err) {
        console.error('Erro ao conectar no banco:', err);
    } else {
        console.log('Conectado ao banco de dados MySQL');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


//Página Index
// app.get('/api/dados', (req, res) => {
//     const sql = `
//         SELECT 
//             COUNT(*) AS total_alugueis,
//             COUNT(*) * 10 AS energia_economizada_kwh,
//             COUNT(*) * 2700 AS agua_economizada_litros
//         FROM ALUGUEL
//     `;

//     conexao.query(sql, (err, resultados) => {
//         if (err) {
//             res.status(500).json({ erro: 'Erro ao calcular estatísticas' });
//         } else {
//             res.json(resultados[0]);
//         }
//     });
// });
app.get('/api/dados-por-dia', (req, res) => {
  const sql = `
    SELECT data_inicio, COUNT(*) AS qtd_alugueis
    FROM ALUGUEL
    GROUP BY data_inicio
    ORDER BY data_inicio ASC
  `;

  conexao.query(sql, (err, resultados) => {
    if (err) {
      res.status(500).json({ erro: 'Erro ao buscar dados por dia' });
      return;
    }

    const datas = [];
    const energia = [];
    const agua = [];

    let acumuladoEnergia = 0;
    let acumuladoAgua = 0;

    resultados.forEach(row => {
      const d = new Date(row.data_inicio);
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      datas.push(`${dia}/${mes}`);

      const energiaDia = row.qtd_alugueis * 10;    // Ajuste seus cálculos aqui
      const aguaDia = row.qtd_alugueis * 2700;     // Ajuste seus cálculos aqui

      acumuladoEnergia += energiaDia;
      acumuladoAgua += aguaDia;

      energia.push(acumuladoEnergia);
      agua.push(acumuladoAgua);
    });

    console.log('Datas:', datas);
    console.log('Energia:', energia);
    console.log('Água:', agua);

    res.json({ datas, energia, agua });
  });
});


//Página Cadastro
app.post('/api/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  const query = 'INSERT INTO USUARIO (cod_usuario, nome_usuario, email_usuario, senha_usuario) VALUES (UUID(), ?, ?, ?)';
  conexao.query(query, [nome, email, senha], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar:', err);
      return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  });
});


//Página Login
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  const sql = 'SELECT * FROM USUARIO WHERE email_usuario = ?';
  conexao.query(sql, [email], (err, resultados) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }

    if (resultados.length === 0) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const usuario = resultados[0];

    if (senha === usuario.senha_usuario) {
      const resposta = {
        cod_usuario: usuario.cod_usuario
      };
      return res.status(200).json(resposta);
    } else {
      return res.status(401).json({ message: 'Senha incorreta' });
    }
  });
});

// Página Catálogo
app.get('/api/produtos', (req, res) => {
    conexao.query('SELECT * FROM VESTUARIO', (err, resultados) => {
        if (err) {
            res.status(500).json({ erro: 'Erro na consulta ao banco de dados' });
        } else {
            res.json(resultados);
        }
    });
});

//Página Detalhes
app.get('/api/produtos/:uuid', (req, res) => {
  const uuid = req.params.uuid;
  const query = 'SELECT * FROM VESTUARIO WHERE cod_vestuario = ?';
  conexao.query(query, [uuid], (err, resultados) => {
    if (err) {
      res.status(500).json({ erro: 'Erro na consulta ao banco de dados' });
    } else if (resultados.length === 0) {
      res.status(404).json({ erro: 'Produto não encontrado' });
    } else {
      res.json(resultados[0]);
    }
  });
});

app.post('/api/alugar', (req, res) => {
    const { alugueis } = req.body;

    if (!alugueis || !Array.isArray(alugueis)) {
        return res.status(400).json({ erro: 'Dados inválidos' });
    }

    // Para este exemplo, estou assumindo que só terá um aluguel por vez,
    // mas você pode adaptar para múltiplos.

    const aluguel = alugueis[0];
    const { cod_vestuario, data_inicio, data_fim } = aluguel;

    const sqlCheck = `
        SELECT COUNT(*) AS total FROM ALUGUEL
        WHERE cod_vestuario = ?
          AND (
            (data_inicio <= ? AND data_fim >= ?)
            OR
            (data_inicio <= ? AND data_fim >= ?)
            OR
            (data_inicio >= ? AND data_fim <= ?)
          )
    `;

    conexao.query(sqlCheck, [
        cod_vestuario,
        data_fim, data_fim,
        data_inicio, data_inicio,
        data_inicio, data_fim
    ], (err, results) => {
        if (err) {
            console.error('Erro na consulta de disponibilidade:', err);
            return res.status(500).json({ erro: 'Erro interno' });
        }

        if (results[0].total > 0) {
            return res.status(409).json({ erro: 'Este período já está reservado para essa peça.' });
        }

        // Se passou na verificação, insere o aluguel

        const sqlInsert = `
            INSERT INTO ALUGUEL 
            (cod_aluguel, cod_usuario, cod_vestuario, data_inicio, data_fim, cod_pagamento)
            VALUES (UUID(), ?, ?, ?, ?, ?)
        `;

        const { cod_usuario, cod_pagamento } = aluguel;

        conexao.query(sqlInsert, [cod_usuario, cod_vestuario, data_inicio, data_fim, cod_pagamento], (err2, result2) => {
            if (err2) {
                console.error('Erro ao registrar aluguel:', err2);
                return res.status(500).json({ erro: 'Erro ao registrar aluguel' });
            }

            return res.status(201).json({ mensagem: 'Aluguel registrado com sucesso' });
        });
    });
});
