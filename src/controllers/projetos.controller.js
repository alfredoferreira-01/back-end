const projetoModel = require("../models/projeto.model");

const projetosController = {
  listar(req, res) {
    const { descricao } = req.query;
    let resposta = projetoModel.listar();

    if (descricao) {
      resposta = resposta.filter((p) => p.descricao === descricao);
    }

    res.json(resposta);
  },

  buscarPorId(req, res) {
    const projeto = projetoModel.buscar(parseInt(req.params.id));

    if (!projeto) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    res.json(projeto);
  },

  criar(req, res) {
    const novoProjeto = projetoModel.adicionar(req.body);
    res.status(201).json(novoProjeto);
  },

  atualizar(req, res) {
    const id = parseInt(req.params.id);
    const projetoAtualizado = projetoModel.atualizar(id, req.body);

    if (!projetoAtualizado) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    res.json(projetoAtualizado);
  },

  remover(req, res) {
    const id = parseInt(req.params.id);
    const removido = projetoModel.remover(id);

    if (!removido) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    res.json({ mensagem: "Projeto removido com sucesso", id });
  },
};

module.exports = projetosController;