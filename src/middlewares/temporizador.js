function temporizador(req, res, next) {
  const inicio = Date.now();

  next();

  const fim = Date.now();
  const tempo = fim - inicio;

  console.log(`Tempo de processamento: ${tempo} ms`);
}

module.exports = temporizador;