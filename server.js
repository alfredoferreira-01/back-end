require("dotenv").config();

const logger = require("./src/middlewares/logger");
const validarContentType = require("./src/middlewares/validarContentType");
const temporizador = require("./src/middlewares/temporizador");
// const cors = require("./src/middlewares/cors");
const express = require("express");

const tarefasRoutes = require("./src/routes/tarefas.routes");
const usuariosRoutes = require("./src/routes/usuarios.routes");
const projetosRoutes = require("./src/routes/projetos.routes");

const app = express();
const cors = require("cors");
const PORTA = process.env.PORTA || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://www.google.com/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

app.use(express.json());
app.use(validarContentType);
app.use(logger);
app.use(temporizador);
// app.use(cors);

// Lista usuarios -----------------------------------------
app.use("/usuarios", usuariosRoutes);

// Lista tarefas e faz todo CRUD --------------------------
app.use("/tarefas", tarefasRoutes);

// Lista projetos e faz todo CRUD --------------------------
app.use("/projetos", projetosRoutes);

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
  });
});

app.listen(PORTA, () => console.log(`Porta ${PORTA}`));