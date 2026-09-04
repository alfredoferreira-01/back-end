const tarefaModel = require("../models/tarefa.model");

const tarefasController = {

  listar(req, res) {
    const { coluna, prioridade } = req.query;

    let resultado = tarefaModel.listar();

    if (coluna) {
      resultado = resultado.filter((t) => (t.coluna || "afazer") === coluna);
    }
    if (prioridade) {
      resultado = resultado.filter((t) => t.prioridade === prioridade);
    }

    res.json(resultado);
  },


  buscarPorId(req, res) {
    const tarefa = tarefaModel.buscar(parseInt(req.params.id));

    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

    res.json(tarefa);
  },

 
  criar(req, res) {
    const { texto } = req.body;

    if (!texto) return res.status(400).json({ erro: "Texto obrigatório" });

    res.status(201).json(tarefaModel.adicionar(req.body));
  },


  atualizar(req, res) {
    const atualizada = tarefaModel.atualizar(parseInt(req.params.id), req.body);

    if (!atualizada)
      return res.status(404).json({ erro: "Tarefa não encontrada" });

    res.json(atualizada);
  },

 
  remover(req, res) {
    const removida = tarefaModel.remover(parseInt(req.params.id));

    if (!removida)
      return res.status(404).json({ erro: "Tarefa não encontrada" });

    res.json({ mensagem: "Tarefa removida", tarefa: removida });
  },

  // GET /tarefas/estatisticas
  estatisticas(req, res) {
    const { coluna } = req.query;

    const base = coluna
      ? tarefaModel.listarPorColuna(coluna)
      : tarefaModel.listar();

    const total = base.length;

    const porColuna = {
      afazer: base.filter((t) => (t.coluna || "afazer") === "afazer").length,
      andamento: base.filter((t) => t.coluna === "andamento").length,
      concluido: base.filter((t) => t.coluna === "concluido").length,
    };

    const porPrioridade = {
      alta: base.filter((t) => t.prioridade === "alta").length,
      media: base.filter((t) => t.prioridade === "media").length,
      baixa: base.filter((t) => t.prioridade === "baixa").length,
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
  },
};

module.exports = tarefasController;