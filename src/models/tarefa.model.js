
 let tarefas = [
  {
    id: 1,
    texto: "Estudar Node",
    prioridade: "alta",
    coluna: "andamento",
    cidade: "",
  },
  {
    id: 2,
    texto: "Criar API",
    prioridade: "alta",
    coluna: "andamento",
    cidade: "",
  },
  {
    id: 3,
    texto: "Testar Postman",
    prioridade: "media",
    coluna: "concluido",
    cidade: "",
  },
];

let proximoId = 4;

module.exports = {
  listar: () => tarefas,

  listarPorColuna: (coluna) => tarefas.filter((t) => t.coluna === coluna),

  listarPorPrioridade: (prioridade) =>
    tarefas.filter((t) => t.prioridade === prioridade),

  buscar: (id) => tarefas.find((t) => t.id === id),

  adicionar: ({ texto, prioridade, coluna }) => {
    const nova = {
      id: proximoId++,
      texto,
      prioridade: prioridade || "media",
      coluna: coluna || "afazer",
      cidade: cidade || "",
    };
    tarefas.push(nova);
    return nova;
  },

  atualizar: (id, dados) => {
    const idx = tarefas.findIndex((t) => t.id === id);

    if (idx === -1) return null;

    tarefas[idx] = { ...tarefas[idx], ...dados, id };

    return tarefas[idx];
  },

  remover: (id) => {
    const idx = tarefas.findIndex((t) => t.id === id);

    if (idx === -1) return null;

    return tarefas.splice(idx, 1)[0];
  },
};