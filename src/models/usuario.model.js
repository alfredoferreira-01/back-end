let usuarios = [
  { id: 1, 
    nome: "admin", 
    email: "admin@taskflow.com",
     senha: "1234" },
];

let proximoId = 2;

module.exports = {
  listar: ({ nome, email } = {}) => {
    let resultado = usuarios;

    if (nome) {
      resultado = resultado.filter((u) => u.nome === nome);
    }
    if (email) {
      resultado = resultado.filter((u) => u.email === email);
    }

    return resultado;
  },

  buscar: (id) => usuarios.find((u) => u.id === id),

  buscarPorEmail: (email) => usuarios.find((u) => u.email === email),

  adicionar: ({ nome, email, senha }) => {
    const novo = {
      id: proximoId++,
      nome: nome || "fefe",
      email: email || "admin@taskflow.com",
      senha: senha || "1223",
    };
    usuarios.push(novo);
    return novo;
  },

  atualizar: (id, dados) => {
    const idx = usuarios.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    usuarios[idx] = { id, ...dados };
    return usuarios[idx];
  },

  remover: (id) => {
    const idx = usuarios.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    return usuarios.splice(idx, 1)[0];
  },
};