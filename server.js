const express = require("express");
const app = express();
const PORTA = 3000;

let tarefas = [
  { id: 1, texto: "Estudar Node", prioridade: "alta", coluna: "afazer" },
  { id: 2, texto: "Criar API", prioridade: "alta", coluna: "andamento" },
  { id: 3, texto: "Testar Postman", prioridade: "media", coluna: "concluido" },
];

const express = require('express');

// Middleware para processar requisições em formato JSON
app.use(express.json());

// Estado inicial do banco de dados (memória)
let usuarios = [{ id: 1, nome: 'admin', email: 'admin@taskflow.com', senha: '1234' }];
let proximoIdUsuario = 2;

// ROTA 1 — Listar todos os usuários
app.get('/usuarios', (req, res) => {
  return res.status(200).json(usuarios);
});

// ROTA 2 — Buscar usuário por ID
app.get('/usuarios/:id', (req, res) => {
  const id = Number(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  return res.status(200).json(usuario);
});

// ROTA 3 — Criar usuário (com validação do DESAFIO)
app.post('/usuarios', (req, res) => {
  const { nome, email, senha } = req.body;

  // DESAFIO: Verificar se o email já está cadastrado
  const emailExiste = usuarios.some((u) => u.email === email);
  if (emailExiste) {
    return res.status(400).json({ erro: 'Email já cadastrado' });
  }

  const novoUsuario = {
    id: proximoIdUsuario++,
    nome,
    email,
    senha
  };

  usuarios.push(novoUsuario);
  return res.status(201).json(novoUsuario);
});

// ROTA 4 — Atualizar usuário por ID
app.put('/usuarios/:id', (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;

  const index = usuarios.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  // Opcional: Impedir atualização para um email que já pertence a outro usuário
  const emailEmUso = usuarios.some((u) => u.email === email && u.id !== id);
  if (emailEmUso) {
    return res.status(400).json({ erro: 'Email já cadastrado' });
  }

  usuarios[index] = {
    ...usuarios[index],
    nome: nome ?? usuarios[index].nome,
    email: email ?? usuarios[index].email,
    senha: senha ?? usuarios[index].senha
  };

  return res.status(200).json(usuarios[index]);
});

// ROTA 5 — Deletar usuário por ID
app.delete('/usuarios/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = usuarios.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  usuarios.splice(index, 1);

  return res.status(200).json({ mensagem: 'Usuário removido', id });
});

// Inicialização do servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});




app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/tarefas", (req, res) => {
  // req.query contém os filtros da URL
  const { coluna, prioridade } = req.query;
  // Começar com todas as tarefas
  let resultado = tarefas;
  // Filtrar por coluna se informado
  if (coluna) {
    resultado = resultado.filter((t) => t.coluna === coluna);
  }
  // Filtrar por prioridade se informado
  if (prioridade) {
    resultado = resultado.filter((t) => t.prioridade === prioridade);
  }
  res.json(resultado);
});

app.get("/tarefas/:id", (req, res) => {
  // req.params.id chega como STRING — converter para número
  const id = Number(req.params.id);
  // Buscar a tarefa no array
  const tarefa = tarefas.find((t) => t.id === id);
  // Se não encontrou — retornar 404
  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  // Se encontrou — retornar a tarefa
  res.json(tarefa);
});

// Rota 404 — DEVE SER A ÚLTIMA
// app.use() captura QUALQUER método e QUALQUER caminho
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    metodo: req.method,
    caminho: req.url,
  });
});

app.listen(PORTA, () => console.log(`Porta ${PORTA}`));
//--------------------------------------------------------------------------------

// app.get("/tarefas/:id", (req, res) => {
//   // req.params.id chega como STRING — converter para número
//   const id = Number(req.params.id);

//   // Buscar a tarefa no array
//   const tarefa = tarefas.find((t) => t.id === id);

//   // Se não encontrou — retornar 404
//   if (!tarefa) {
//     return res.status(404).json({ erro: "Tarefa não encontrada" });
//   }

//   // Se encontrou — retornar a tarefa
//   res.json(tarefa);
// });

// app.listen(PORTA, () => console.log(`Porta ${PORTA}`));

// ---------------------------------------------------------------------------------------------------

// app.get("/", (req, res) => {
//   res.json({ mensagem: "TaskFlow API funcionando!" });
// });

// app.get("/tarefas", (req, res) => {
//     if (req.headers["tokenapi"] === "5ea87093-dba6-49ae-8ffe-80c790a417b5"){
//         res.json(tarefas);
//     } else {
//         res.status(400).json({erro: "acesso negado"})
//     }
//       res.json({ tarefas });
// });

// app.get("/ok", (req, res) => {
//   res.json({ status: "ok", dados: [1, 2, 3] });
// });

// app.get("/criado", (req, res) => {
//   res.status(201).json({ mensagem: "Criado com sucesso" });
// });

// app.get("/erro", (req, res) => {
//   res.status(400).json({ erro: "Dados inválidos" });
// });

// app.get("/texto", (req, res) => {
//   res.send("Resposta em texto simples");
// });

// // Iniciar o servidor
// app.listen(PORTA, () => {
//   console.log(`Servidor rodando em http://localhost:${PORTA}`);
// });
