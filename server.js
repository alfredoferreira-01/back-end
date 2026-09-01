const express = require("express");
const tarefasRoutes = require("./src/routes/tarefa.route");
const usuariosRoutes = require("./src/routes/usuarios.route");
const app = express();
const PORTA = 3000;

app.use(express.json());

// Lista usuarios -----------------------------------------

app.use("/usuarios", usuariosRoutes);

// Lista tarefas e faz todo CRUD --------------------------

app.use("/tarefas", tarefasRoutes);

// Rota 404 
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    metodo: req.method,
    caminho: req.url,
  });
});

app.listen(PORTA, () => console.log(`Porta ${PORTA}`));
