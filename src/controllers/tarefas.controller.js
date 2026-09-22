const tarefaModel = require("../models/tarefa.model");
const usuarioModel = require("../models/usuario.model");

const PRIORIDADES_VALIDAS = ["alta", "media", "baixa"];
const COLUNAS_VALIDAS = ["afazer", "andamento", "concluido"];

const tarefasController = {
  listar(req, res) {
    try {
      const resultado = tarefaModel.listar(req.query);
      res.json(resultado);
    } catch (error) {
      console.error("Erro no GET /tarefas:", error);
      res.status(500).json({ erro: "Erro interno ao listar tarefas." });
    }
  },

  buscarPorId(req, res) {
    try {
      const tarefa = tarefaModel.buscar(parseInt(req.params.id));
      if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

      res.json(tarefa);
    } catch (error) {
      console.error("Erro no GET /tarefas/:id:", error);
      res.status(500).json({ erro: "Erro interno ao buscar tarefa." });
    }
  },

  criar(req, res) {
    try {
      const { texto, prioridade, coluna, usuarioId } = req.body;

      // 1. Validação de campo obrigatório
      if (!texto) {
        return res.status(400).json({ erro: "O campo 'texto' da tarefa é obrigatório." });
      }

      // 2. Validação da Prioridade (opcional ou padrão "baixa")
      if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
        return res.status(400).json({
          erro: `Prioridade inválida. Use uma destas: ${PRIORIDADES_VALIDAS.join(", ")}`,
        });
      }

      // 3. Validação da Coluna (opcional ou padrão "afazer")
      if (coluna && !COLUNAS_VALIDAS.includes(coluna)) {
        return res.status(400).json({
          erro: `Coluna inválida. Use uma destas: ${COLUNAS_VALIDAS.join(", ")}`,
        });
      }

      // 4. Validação de Usuário e Limite de Tarefas
      if (usuarioId) {
        const usuarioExiste = usuarioModel.buscar(parseInt(usuarioId));
        if (!usuarioExiste) {
          return res.status(400).json({ erro: "Usuário não encontrado" });
        }

        if (coluna === "andamento") {
          const totalAndamento = tarefaModel.contarPorUsuarioEColuna(
            parseInt(usuarioId),
            "andamento"
          );

          if (totalAndamento >= 2) {
            return res.status(400).json({
              erro: "Limite de 2 tarefas em andamento por usuário atingido",
            });
          }
        }

        req.body.usuarioId = parseInt(usuarioId);
      }

      // Define valores padrão se não forem informados pelo React
      const novaTarefa = {
        texto,
        prioridade: prioridade || "media",
        coluna: coluna || "afazer",
        ...req.body
      };

      const resultado = tarefaModel.adicionar(novaTarefa);
      return res.status(201).json(resultado);
    } catch (error) {
      // Captura o erro no terminal do backend para você ver o detalhe exato
      console.error("ERRO NO POST /tarefas:", error);
      return res.status(500).json({
        erro: "Erro interno no servidor ao criar tarefa.",
        detalhes: error.message,
      });
    }
  },

  atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { prioridade, coluna, usuarioId } = req.body;

      if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
        return res.status(400).json({
          erro: `Prioridade inválida. Use: ${PRIORIDADES_VALIDAS.join(", ")}`,
        });
      }

      if (coluna && !COLUNAS_VALIDAS.includes(coluna)) {
        return res.status(400).json({
          erro: `Coluna inválida. Use: ${COLUNAS_VALIDAS.join(", ")}`,
        });
      }

      const tarefaAtual = tarefaModel.buscar(id);
      if (!tarefaAtual) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      }

      const idUsuarioEfetivo = usuarioId
        ? parseInt(usuarioId)
        : tarefaAtual.usuarioId;

      if (
        idUsuarioEfetivo &&
        coluna === "andamento" &&
        tarefaAtual.coluna !== "andamento"
      ) {
        const totalAndamento = tarefaModel.contarPorUsuarioEColuna(
          idUsuarioEfetivo,
          "andamento"
        );

        if (totalAndamento >= 2) {
          return res.status(400).json({
            erro: "Limite de 2 tarefas em andamento por usuário atingido",
          });
        }
      }

      const atualizada = tarefaModel.atualizar(id, req.body);
      return res.json(atualizada);
    } catch (error) {
      console.error(`Erro no PUT /tarefas/${req.params.id}:`, error);
      return res.status(500).json({ erro: "Erro interno ao atualizar tarefa." });
    }
  },

  remover(req, res) {
    try {
      const removida = tarefaModel.remover(parseInt(req.params.id));

      if (!removida)
        return res.status(404).json({ erro: "Tarefa não encontrada" });

      return res.json({ mensagem: "Tarefa removida", tarefa: removida });
    } catch (error) {
      console.error(`Erro no DELETE /tarefas/${req.params.id}:`, error);
      return res.status(500).json({ erro: "Erro interno ao remover tarefa." });
    }
  },

  estatisticas(req, res) {
    try {
      const dadosEstatistcos = tarefaModel.obterEstatisticas(req.query.coluna);
      return res.json(dadosEstatistcos);
    } catch (error) {
      console.error("Erro no GET /tarefas/estatisticas:", error);
      return res.status(500).json({ erro: "Erro ao gerar estatísticas." });
    }
  },
};

module.exports = tarefasController;