const express = require("express");
const router = express.Router();

let tarefas = [
  { id: 1, texto: "Estudar Node", prioridade: "alta" },
  { id: 2, texto: "Criar API", prioridade: "alta", coluna: "andamento" },
  { id: 3, texto: "Testar Postman", prioridade: "media", coluna: "concluido" },
];
let proximoId = 4; 

//  router.get("/", (req, res) => {
//    res.json({ status: "ok" });
//  });

//-----------------------------------------------------------------

router.get("/tarefas", (req, res) => {
  const { coluna, prioridade } = req.query;

  let resultado = tarefas;

  if (coluna) {
    resultado = resultado.filter((t) => t.coluna === coluna);
  }
  if (prioridade) {
    resultado = resultado.filter((t) => t.prioridade === prioridade);
  }
  res.json(resultado);
});

//-------------------------------------------------------------------

router.get("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);

  const tarefa = tarefas.find((t) => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  res.json(tarefa);
});

//-------------------------------------------------------------------

router.post("/tarefas", (req, res) => {
  const { texto, prioridade, coluna, cidade } = req.body;
  const novaTarefa = {
    id: proximoId++,
    texto: texto,
    prioridade: prioridade || "media",
    coluna: coluna || "afazer",
    cidade: cidade || "",
  };

  tarefas.push(novaTarefa);

  res.status(201).json(novaTarefa);
});

//--------------------------------------------------------------

router.put("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const { texto, prioridade, coluna, cidade } = req.body;

  const indice = tarefas.findIndex((t) => t.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  const tarefaAtualizada = { id, texto, prioridade, coluna, cidade };
  tarefas[indice] = tarefaAtualizada;

  res.json(tarefaAtualizada);
});

//----------------------------------------------------------------

router.delete("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);

  const tarefa = tarefas.find((t) => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  tarefas = tarefas.filter((t) => t.id !== id);

  res.json({ mensagem: "Tarefa removida com sucesso", id });
});

// DESAFIO STATISTICAS  --------------------------------

router.get("/estatisticas", (req, res) => {
  const coluna = req.query.coluna;

  const tarefasFiltradas = coluna
    ? tarefas.filter((tarefa) => (tarefa.coluna || "afazer") === coluna)
    : tarefas;

  const total = tarefasFiltradas.length;

  const porColuna = {
    afazer: tarefasFiltradas.filter(
      (tarefa) => (tarefa.coluna || "afazer") === "afazer",
    ).length,

    andamento: tarefasFiltradas.filter(
      (tarefa) => tarefa.coluna === "andamento",
    ).length,

    concluido: tarefasFiltradas.filter(
      (tarefa) => tarefa.coluna === "concluido",
    ).length,
  };

  const porPrioridade = {
    alta: tarefasFiltradas.filter((tarefa) => tarefa.prioridade === "alta")
      .length,

    media: tarefasFiltradas.filter((tarefa) => tarefa.prioridade === "media")
      .length,

    baixa: tarefasFiltradas.filter((tarefa) => tarefa.prioridade === "baixa")
      .length,
  };

  const colunaMaisTarefas = Object.entries(porColuna).sort(
    (a, b) => b[1] - a[1],
  )[0][0];

  res.json({
    total,
    porColuna,
    porPrioridade,
    colunaMaisTarefas,
  });
});

module.exports = router;
