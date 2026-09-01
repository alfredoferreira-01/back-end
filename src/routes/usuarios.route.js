const express = require("express");
const router = express.Router();

let usuarios = [
  { id: 1, nome: "admin", email: "admin@taskflow.com", senha: "1234" },
];
let proximoIdUsuario = 2;

router.get("/usuarios", (req, res) => {
  // req.query contém os filtros da URL
  const { nome, email } = req.query;
  // Começar com todos os usuarios
  let resultado = usuarios;
  // Filtrar por coluna se informado
  if (nome) {
    resultado = resultado.filter((t) => t.nome === nome);
  }
  // Filtrar por prioridade se informado
  if (email) {
    resultado = resultado.filter((t) => t.email === email);
  }
  res.json(resultado);
});

//---------------------------------------------------------------

router.get("/usuarios/:id", (req, res) => {
  // req.params.id chega como STRING — converter para número
  const id = Number(req.params.id);
  // Buscar a usuario no array
  const usuario = usuarios.find((t) => t.id === id);
  // Se não encontrou — retornar 404
  if (!usuario) {
    return res.status(404).json({ erro: "Usuario não encontrado" });
  }
  // Se encontrou — retornar o usuario
  res.json(usuario);
});

//-----------------------------------------------------------------

router.post("/usuarios", (req, res) => {
  // req.body contém os dados enviados no body da requisição
  const { nome, email, senha } = req.body;
  // Verificar se o email já está cadastrado
  const emailExiste = usuarios.some((usuario) => usuario.email === email);

  if (emailExiste) {
    return res.status(400).json({
      erro: "Este email já está cadastrado",
    });
  }

  // Criar a nova tarefa com ID gerado pelo servidor
  const novoUsuario = {
    id: proximoIdUsuario++, // usa o ID atual e incrementa
    nome: nome || "felipe", // valor padrão se não enviado
    email: email || "admin@taskflow.com",
    senha: senha || "1223",
  };

  // Adicionar ao array em memória
  usuarios.push(novoUsuario);

  // Retornar a tarefa criada com status 201 Created
  res.status(201).json(novoUsuario);
});

//-------------------------------------------------------------

router.put("/usuarios/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;
  // Encontrar o índice da tarefa no array
  const indice = usuarios.findIndex((t) => t.id === id);
  // Se não encontrou — retornar 404
  if (indice === -1) {
    return res.status(404).json({ erro: "Usuario não encontrado" });
  }
  // Substituir a tarefa no array mantendo o mesmo ID
  const usuarioAtualizado = { nome, email, senha };
  usuarios[indice] = usuarioAtualizado;
  // Retornar a tarefa atualizada com status 200
  res.json(usuarioAtualizado);
});

//----------------------------------------------------------------

router.delete("/usuarios/:id", (req, res) => {
  const id = Number(req.params.id);

  // Verificar se a tarefa existe antes de remover
  const usuario = usuarios.find((t) => t.id === id);

  if (!usuario) {
    return res.status(404).json({ erro: "usario não encontrado" });
  }
  // Remover do array com filter
  usuarios = usuarios.filter((t) => t.id !== id);
  // Retornar confirmação da remoção
  res.json({ mensagem: "usuario removido com sucesso", id });
});


module.exports = router;
