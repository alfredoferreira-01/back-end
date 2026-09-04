let projetos = [{ id: 1, descricao: "Projetos para fazer logo", ativo: true }];

let proximoId = 2;

module.exports = {
  listar: () => projetos,

  buscar: (id) => projetos.find((p) => p.id === id),

  adicionar: ({ descricao, ativo }) => {
    const novo = {
      id: proximoId++,
      descricao: descricao || "teste esse projeto",
      ativo: ativo !== undefined ? ativo : true,
    };
    projetos.push(novo);
    return novo;
  },

  atualizar: (id, dados) => {
    const idx = projetos.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    projetos[idx] = { id, ...dados };
    return projetos[idx];
  },

  remover: (id) => {
    const idx = projetos.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    return projetos.splice(idx, 1)[0];
  },
};