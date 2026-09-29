// Montagem do HTML dos cartões
const Render = {
  cartao(c) {
    const e = Utils.escapar;
    return `
      <article class="cartao">
        <div class="cartao__topo">
          <div class="avatar" aria-hidden="true">${e(Utils.iniciais(c.nome))}</div>
          <div>
            <h2>${e(c.nome)}</h2>
            <span class="tag">${c.funcao ? e(c.funcao) : "Função não informada"}</span>
          </div>
        </div>
        <dl class="dados">
          <dt>Loja</dt><dd>${e(c.loja)}</dd>
          <dt>Município/LOC</dt><dd>${e(c.municipio)}</dd>
          <dt>Gerente</dt><dd>${e(c.gerente)}</dd>
          <dt>Supervisor</dt><dd>${e(c.supervisor)}</dd>
          <dt>Admissão</dt><dd>${Utils.formatarData(c.admissao)}</dd>
        </dl>
      </article>`;
  },

  lista(colaboradores, total) {
    document.getElementById("lista").innerHTML = colaboradores.map(c => this.cartao(c)).join("");
    document.getElementById("vazio").hidden = colaboradores.length > 0;
    document.getElementById("contagem").textContent = `Exibindo ${colaboradores.length} de ${total}`;
  }
};
