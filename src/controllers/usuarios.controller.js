const usuarioModel = require("../models/usuario.model");

const usuariosController = {
 
  listar(req, res) {
    const { nome, email } = req.query;
    let resultado = usuarioModel.listar();

    if (nome) {
      resultado = resultado.filter((u) => u.nome === nome);
    }
    if (email) {
      resultado = resultado.filter((u) => u.email === email);
    }

    res.json(resultado);
  },


  buscarPorId(req, res) {
    const usuario = usuarioModel.buscar(parseInt (req.params.id));

    if (!usuario) {
      return res.status(404).json({ erro: "Usuario não encontrado" });
    }

    res.json(usuario);
  },

  criar(req, res) {
    const { email } = req.body;

    if (email && usuarioModel.buscarPorEmail(email)) {
      return res.status(400).json({
        erro: "Este email já está cadastrado",
      });
    }

    const novoUsuario = usuarioModel.adicionar(req.body);
    res.status(201).json(novoUsuario);
  },

  atualizar(req, res) {
    const id = parseInt(req.params.id);
    const usuarioAtualizado = usuarioModel.atualizar(id, req.body);

    if (!usuarioAtualizado) {
      return res.status(404).json({ erro: "Usuario não encontrado" });
    }

    res.json(usuarioAtualizado);
  },

  remover(req, res) {
    const id = parseInt(req.params.id);
    const removido = usuarioModel.remover(id);

    if (!removido) {
      return res.status(404).json({ erro: "Usuario não encontrado" });
    }

    res.json({ mensagem: "usuario removido com sucesso", id });
  },
};

module.exports = usuariosController;