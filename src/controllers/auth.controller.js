const jwt = require("jsonwebtoken");

const usuarioModel = require("../models/usuario.model");

const authController = {
  login(req, res) {
    const { email, senha } = req.body;


    // Validação básica

    if (!email || !senha)
      return res.status(400).json({ erro: "Email e senha são obrigatórios" });

    // 1. Verificar se o usuário existe

    const usuario = usuarioModel.buscarPorEmail(email);

    if (!usuario)
      return res.status(401).json({ erro: "Credenciais inválidas" });

    // 2. Verificar a senha

    // Por enquanto comparação direta — Dia 4 usa hash

    if (usuario.senha !== senha)
      return res
        .status(401)

        .json({ erro: "Credenciais inválidas" }); // 3. Gerar o token JWT

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome },

      process.env.JWT_SECRET,

      { expiresIn: "8h" },
    );

    // 4. Retornar token e dados públicos

    // Nunca retornar a senha na resposta

    res.json({
      token,

      usuario: { id: usuario.id, nome: usuario.nome },
    });
  },
};

module.exports = authController;
