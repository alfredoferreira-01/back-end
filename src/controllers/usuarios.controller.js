const usuarioModel = require("../models/usuario.model");
const tarefaModel = require("../models/tarefa.model");

const usuariosController = {
  listar(req, res) {
    // Repassa os filtros de req.query diretamente para o Model
    const resultado = usuarioModel.listar(req.query);
    res.json(resultado);
  },

  buscarPorId(req, res) {
    const usuario = usuarioModel.buscar(parseInt(req.params.id));

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

    const usuario = usuarioModel.buscar(id);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuario não encontrado" });
    }

    // O Model calcula se existem tarefas do usuário
    const qtdTarefas = tarefaModel.contarPorUsuario(id);

    if (qtdTarefas > 0) {
      return res.status(400).json({
        erro: "Usuário possui tarefas. Remova as tarefas antes.",
      });
    }

    usuarioModel.remover(id);

    res.json({ mensagem: "usuario removido com sucesso", id });
  },
};

module.exports = usuariosController;