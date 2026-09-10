let tarefas = [
  {
    id: 1,
    texto: "Estudar Node",
    prioridade: "alta",
    coluna: "andamento",
    cidade: "",
    usuarioId: 1,
    concluidaEm: null,
  },
  {
    id: 2,
    texto: "Criar API",
    prioridade: "alta",
    coluna: "andamento",
    cidade: "",
    usuarioId: 1,
    concluidaEm: null,
  },
  {
    id: 3,
    texto: "Testar Postman",
    prioridade: "media",
    coluna: "concluido",
    cidade: "",
    usuarioId: 1,
    concluidaEm: "2026-03-01T10:00:00.000Z",
  },
];

let proximoId = 4;

module.exports = {
  listar: ({ coluna, prioridade, usuarioId } = {}) => {
    if (usuarioId !== undefined) {
      const usuarioExiste = usuarioModel.buscar(parseInt(usuarioId));

      if (!usuarioExiste) {
        return [];
      }
    }

    let resultado = tarefas;

    if (usuarioId !== undefined) {
      resultado = resultado.filter((t) => t.usuarioId === parseInt(usuarioId));
    }

    if (coluna) {
      resultado = resultado.filter((t) => (t.coluna || "afazer") === coluna);
    }

    if (prioridade) {
      resultado = resultado.filter((t) => t.prioridade === prioridade);
    }

    return resultado;
  },

  listarPorColuna: (coluna) =>
    tarefas.filter((t) => (t.coluna || "afazer") === coluna),

  listarPorPrioridade: (prioridade) =>
    tarefas.filter((t) => t.prioridade === prioridade),

  buscar: (id) => tarefas.find((t) => t.id === id),

  contarPorUsuario: (usuarioId) =>
    tarefas.filter((t) => t.usuarioId === usuarioId).length,

  contarPorUsuarioEColuna: (usuarioId, coluna) =>
    tarefas.filter(
      (t) => t.usuarioId === usuarioId && (t.coluna || "afazer") === coluna,
    ).length,

  adicionar: ({ texto, prioridade, coluna, cidade, usuarioId }) => {
    const nova = {
      id: proximoId++,
      texto,
      prioridade: prioridade || "media",
      coluna: coluna || "afazer",
      cidade: cidade || "",
      usuarioId,
      concluidaEm: novaColuna === "concluido" ? new Date().toISOString() : null,
    };
    tarefas.push(nova);
    return nova;
  },

  atualizar: (id, dados) => {
    const idx = tarefas.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    let concluidaEm = tarefas[idx].concluidaEm || null;

    if (dados.coluna !== undefined) {
      if (dados.coluna === "concluido") {
        concluidaEm = new Date().toISOString();
      } else {
        concluidaEm = null;
      }
    }

    tarefas[idx] = {
      ...tarefas[idx],
      ...dados,
      id,
      concluidaEm,
    };

    return tarefas[idx];
  },

  remover: (id) => {
    const idx = tarefas.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    return tarefas.splice(idx, 1)[0];
  },

  obterEstatisticas: (coluna) => {
    const base = coluna
      ? tarefas.filter((t) => (t.coluna || "afazer") === coluna)
      : tarefas;

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

    return {
      total,
      porColuna,
      porPrioridade,
      colunaMaisTarefas,
    };
  },
};