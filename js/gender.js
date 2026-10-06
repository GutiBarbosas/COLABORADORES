// Seção "Colaboradores por sexo": contagem de homens e mulheres a partir de SEXO.
// Calculada dinamicamente sobre a base carregada; independe dos filtros.
// Na planilha: H = homem, M = mulher (F também é aceito como feminino).
// Vazio ou qualquer outro valor não entra na contagem de homens nem de mulheres.
const Gender = {
  MASCULINO: ["H"],
  FEMININO: ["M", "F"],

  contar(lista) {
    const total = { homens: 0, mulheres: 0, naoClassificados: 0 };
    lista.forEach(c => {
      const s = String(c.sexo ?? "").trim().toUpperCase();
      if (this.MASCULINO.includes(s)) total.homens++;
      else if (this.FEMININO.includes(s)) total.mulheres++;
      else total.naoClassificados++;
    });
    return total;
  },

  render(lista) {
    const t = this.contar(lista);
    document.getElementById("sexo-homens").textContent = t.homens;
    document.getElementById("sexo-mulheres").textContent = t.mulheres;
    const nota = document.getElementById("sexo-nao-informado");
    nota.textContent = `${t.naoClassificados} sem sexo informado (não contados como homens nem mulheres).`;
    nota.hidden = t.naoClassificados === 0;
  }
};
