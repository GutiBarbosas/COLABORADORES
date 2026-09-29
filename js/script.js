// Ponto de entrada: liga dados, filtros e renderização.
// Os dados originais (window.COLABORADORES_DADOS) nunca são modificados;
// a "visão" abaixo é uma cópia só para exibição e filtro.
(function () {
  const originais = window.COLABORADORES_DADOS || [];

  const visao = originais.map(r => {
    const funcao = String(r["FUNÇÃO"] ?? "").trim().toUpperCase(); // "Gerente" e "GERENTE" contam como uma função
    return {
      nome: String(r["COLABORADOR"] ?? "").trim(),
      funcao: funcao === "0" ? "" : funcao,                      // 0 na planilha = função não preenchida
      loja: String(r["LOJA"] ?? "").trim(),
      municipio: String(r["MUNICIPIO"] ?? "").trim(),
      gerente: String(r["GERENTE"] ?? "").trim(),
      supervisor: String(r["SUPERVISOR"] ?? "").trim(),
      admissao: r["ADMISSÃO"],
      salario: r["SALÁRIO"],
      nascimento: r["DT_NASC"]                                   // usado só pela seção de aniversários
    };
  });

  function atualizar() {
    Render.lista(Filters.aplicar(visao, Filters.estado()), visao.length);
  }

  Filters.montarOpcoes(visao);
  Birthdays.render(visao); // independe dos filtros
  Contracts.render(visao); // independe dos filtros

  let timer;
  document.getElementById("busca").addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(atualizar, 150); });
  Filters.campos.forEach(({ id }) => document.getElementById(id).addEventListener("change", atualizar));
  document.getElementById("limpar").addEventListener("click", () => { Filters.limpar(); atualizar(); });

  atualizar();
})();
