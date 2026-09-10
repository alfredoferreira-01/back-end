function validar(schema) {
  return function (req, res, next) {
    const erros = [];

    for (const campo in schema) {
      const regras = schema[campo];
      const valor = req.body[campo];
      const ausente = valor === undefined || valor === null || valor === "";

      // 1 — Campo obrigatório ausente
      if (regras.obrigatorio && ausente) {
        erros.push(`O campo '${campo}' é obrigatório`);
        continue; 
      }

      // 2 — Validação de tipo
      if (!ausente && regras.tipo && typeof valor !== regras.tipo) {
        erros.push(`O campo '${campo}' deve ser do tipo ${regras.tipo}`);
      }
      

      // 3 — Valor fora dos permitidos (enum)
      if (regras.enum && !regras.enum.includes(valor)) {
        erros.push(
          `O campo '${campo}' deve ser um de: ${regras.enum.join(", ")}`,
        );
      }

      // 4 — Formato de email
      if (regras.formato === "email") {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(valor))
          erros.push(`O campo '${campo}' deve ser um email válido`);
      }

      // 5 — Tamanho mínimo de texto
      if (regras.minLength && valor.length < regras.minLength)
        erros.push(
          `O campo '${campo}' deve ter ao menos ${regras.minLength} caracteres`,
        );

      // 6 — Tamanho máximo de texto
      if (regras.maxLength && valor.length > regras.maxLength)
        erros.push(
          `O campo '${campo}' deve ter no máximo ${regras.maxLength} caracteres`,
        );
    }

    if (erros.length > 0) return res.status(400).json({ erros });

    next();
  };
}

module.exports = validar;