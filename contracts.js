// Seção "Contratos de experiência": vencimentos próximos (30 + 60 dias = 90 dias no total).
// Usa apenas ADMISSÃO. Marcos: admissão + 30 dias (1º período) e admissão + 90 dias (término total).
const Contracts = {
  DIAS_A_FRENTE: 15, // janela: vencimentos de hoje até 15 dias à frente
  DIAS_ATRAS: 7,     // e vencidos recentemente (até 7 dias atrás), para não perder um vencimento que acabou de passar
  PRAZOS: [
    { dias: 30, tipo: "primeiro",    rotulo: "1º período — 30 dias" },
    { dias: 90, tipo: "prorrogacao", rotulo: "Prorrogação — 90 dias" }
  ],

  // "2026-09-02" + 30 dias -> "2026-10-02". Date.UTC evita erro de fuso/horário de verão
  // e resolve sozinho a virada de mês e de ano.
  somarDias(iso, dias) {
    const [a, m, d] = String(iso).slice(0, 10).split("-").map(Number);
    return new Date(Date.UTC(a, m - 1, d + dias)).toISOString().slice(0, 10);
  },

  // Dias entre hoje e a data (0 = hoje, negativo = já venceu).
  diasAte(iso, hoje = new Date()) {
    const [a, m, d] = iso.split("-").map(Number);
    const base = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    return Math.round((Date.UTC(a, m - 1, d) - base) / 86400000);
  },

  proximos(lista, hoje = new Date()) {
    const saida = [];
    lista.forEach(c => {
      if (!c.admissao || !/^\d{4}-\d{2}-\d{2}/.test(String(c.admissao))) return;
      this.PRAZOS.forEach(p => {
        const vencimento = this.somarDias(c.admissao, p.dias);
        const dias = this.diasAte(vencimento, hoje);
        if (dias >= -this.DIAS_ATRAS && dias <= this.DIAS_A_FRENTE) saida.push({ ...c, prazo: p, vencimento, dias });
      });
    });
    // vencimento mais próximo primeiro (os já vencidos recentemente vêm antes)
    return saida.sort((a, b) => a.dias - b.dias || a.nome.localeCompare(b.nome, "pt-BR"));
  },

  plural(n, s, p) { return n === 1 ? s : p; },

  item(c) {
    const e = Utils.escapar;
    const n = Math.abs(c.dias);
    let destaque, legenda;
    if (c.dias === 0)     { destaque = "Vence hoje"; legenda = ""; }
    else if (c.dias > 0)  { destaque = n; legenda = `${this.plural(n, "dia", "dias")} para vencer`; }
    else                  { destaque = n; legenda = `${this.plural(n, "dia", "dias")} desde o vencimento`; }
    const situacao = c.dias === 0 ? " contr--hoje" : c.dias < 0 ? " contr--vencido" : "";
    return `
      <li class="contr contr--${c.prazo.tipo}${situacao}">
        <div class="contr__dias">
          <strong>${destaque}</strong>
          ${legenda ? `<span>${legenda}</span>` : ""}
        </div>
        <div class="contr__info">
          <strong>${e(c.nome)}</strong>
          <span>Loja ${e(c.loja)} · ${c.funcao ? e(c.funcao) : "Função não informada"}</span>
          <span>Admissão ${Utils.formatarData(c.admissao)} · Vencimento ${Utils.formatarData(c.vencimento)}</span>
          <span class="contr__etiquetas">
            <span class="contr__tipo">${c.prazo.rotulo}</span>
            ${c.dias < 0 ? '<span class="contr__situacao">Vencido</span>' : ""}
          </span>
        </div>
      </li>`;
  },

  render(lista) {
    const proximos = this.proximos(lista);
    document.getElementById("contratos-legenda").textContent =
      `Vencimentos do 1º período (30 dias) e do término total (90 dias): de ${this.DIAS_ATRAS} dias atrás até ${this.DIAS_A_FRENTE} dias à frente.`;
    document.getElementById("contratos-lista").innerHTML = proximos.map(c => this.item(c)).join("");
    const vazio = document.getElementById("contratos-vazio");
    vazio.textContent = `Nenhum contrato de experiência vencendo nos próximos ${this.DIAS_A_FRENTE} dias.`;
    vazio.hidden = proximos.length > 0;
  }
};
