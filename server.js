require("dotenv").config();

// Caminhos corrigidos (middlewares e middleware no singular/plural correto)
const logger = require("./src/middlewares/logger");
const validarContentType = require("./src/middlewares/validarContentType");
const temporizador = require("./src/middlewares/temporizador");
const autenticar = require("./src/middlewares/autenticar");
const tratarErros = require('./src/middlewares/erro.middleawere');
const criarErro = require("./src/utils/criarErro");
const pool = require('./src/database/db');
const express = require("express");
const cors = require("cors");

const tarefasRoutes = require("./src/routes/tarefas.routes");
const usuariosRoutes = require("./src/routes/usuarios.routes");
const projetosRoutes = require("./src/routes/projetos.routes");
const authRoutes = require("./src/routes/auth.routes");
const prioridadeRoutes = require("./src/routes/prioridades.routes");

const app = express();
const PORTA = process.env.PORTA || 3000;

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Erro ao conectar ao banco:', err.message);
  else console.log('Banco conectado:', res.rows[0].now);
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

app.use(express.json());
app.use(validarContentType);
app.use(logger);
app.use(temporizador);

app.use("/auth", authRoutes);
app.use("/usuarios", autenticar, usuariosRoutes);
app.use("/tarefas", autenticar, tarefasRoutes);
app.use("/projetos", autenticar, projetosRoutes);
app.use("/prioridades", autenticar, prioridadeRoutes);

// Rota 404
app.use((req, res) => {
  const rota = `${req.method} ${req.url}`;
  throw criarErro(404, `Rota ${rota} não encontrada`);
});

app.use(tratarErros);

app.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));