// Seção "Próximos aniversários": colaboradores que fazem aniversário nos próximos dias.
// Usa apenas dia e mês de DT_NASC (o ano de nascimento é ignorado).
const Birthdays = {
  DIAS_A_FRENTE: 7, // hoje + 7 dias seguintes

  // Dias entre hoje e a próxima ocorrência do aniversário (0 = hoje).
  // Usa Date.UTC nos dois lados para o horário de verão não distorcer a contagem.
  diasAte(iso, hoje = new Date()) {
    const [, m, d] = String(iso).slice(0, 10).split("-").map(Number);
    const ano = hoje.getFullYear();
    const base = Date.UTC(ano, hoje.getMonth(), hoje.getDate());
    const proximo = a => {
      // 29/02 em ano não bissexto é comemorado em 28/02
      const dia = (m === 2 && d === 29 && new Date(a, 1, 29).getMonth() !== 1) ? 28 : d;
      return Date.UTC(a, m - 1, dia);
    };
    let alvo = proximo(ano);
    if (alvo < base) alvo = proximo(ano + 1);
    return Math.round((alvo - base) / 86400000);
  },

  proximos(lista) {
    return lista
      .filter(c => c.nascimento)
      .map(c => ({ ...c, dias: this.diasAte(c.nascimento) }))
      .filter(c => c.dias <= this.DIAS_A_FRENTE)
      .sort((a, b) => a.dias - b.dias || a.nome.localeCompare(b.nome, "pt-BR"));
  },

  item(c) {
    const e = Utils.escapar;
    const [, m, d] = c.nascimento.slice(0, 10).split("-");
    return `
      <li class="aniv${c.dias === 0 ? " aniv--hoje" : ""}">
        <div class="aniv__data">${d}/${m}${c.dias === 0 ? '<span class="aniv__hoje">Hoje</span>' : ""}</div>
        <div class="aniv__info">
          <strong>${e(c.nome)}</strong>
          <span>Loja ${e(c.loja)} · ${c.funcao ? e(c.funcao) : "Função não informada"}</span>
        </div>
      </li>`;
  },

  render(lista) {
    const proximos = this.proximos(lista);
    document.getElementById("aniversarios-lista").innerHTML = proximos.map(c => this.item(c)).join("");
    document.getElementById("aniversarios-vazio").hidden = proximos.length > 0;
  }
};
