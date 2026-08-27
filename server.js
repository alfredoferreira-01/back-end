const express = require("express");
const app = express();
const PORTA = 3000;

const tarefas = [
  { id: 1, texto: "Estudar Node", prioridade: "alta", coluna: "afazer" },
  { id: 2, texto: "Criar API", prioridade: "alta", coluna: "andamento" },
  { id: 3, texto: "Testar Postman", prioridade: "media", coluna: "concluido" },
];

let proximoId = 4; // começa em 4 pois já temos 3 tarefas
app.use(express.json());
app.post('/tarefas', (req, res) => {

// req.body contém os dados enviados no body da requisição

const { texto, prioridade, coluna, cidade } = req.body;

// Criar a nova tarefa com ID gerado pelo servidor

const novaTarefa = {

id: proximoId++, // usa o ID atual e incrementa

texto: texto,

prioridade:prioridade || 'media', // valor padrão se não enviado

coluna: coluna || 'afazer',

cidade: cidade || '',

};

// Adicionar ao array em memória

tarefas.push(novaTarefa);

// Retornar a tarefa criada com status 201 Created

res.status(201).json(novaTarefa);

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
