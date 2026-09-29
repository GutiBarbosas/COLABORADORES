// Busca e filtros. Os campos aqui listados definem os filtros da tela.
const VAZIO = "__vazio__";

const Filters = {
  campos: [
    { id: "f-supervisor", chave: "supervisor", rotulo: "Todos os supervisores" },
    { id: "f-gerente",    chave: "gerente",    rotulo: "Todos os gerentes" },
    { id: "f-loja",       chave: "loja",       rotulo: "Todas as lojas", numerico: true },
    { id: "f-funcao",     chave: "funcao",     rotulo: "Todas as funções" },
    { id: "f-municipio",  chave: "municipio",  rotulo: "Todos os municípios" }
  ],

  montarOpcoes(lista) {
    this.campos.forEach(({ id, chave, rotulo, numerico }) => {
      const valores = [...new Set(lista.map(c => c[chave] || VAZIO))];
      const temVazio = valores.includes(VAZIO);
      const ordenados = valores.filter(v => v !== VAZIO)
        .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: !!numerico }));
      if (temVazio) ordenados.push(VAZIO);
      document.getElementById(id).innerHTML =
        `<option value="">${rotulo}</option>` +
        ordenados.map(v => `<option value="${Utils.escapar(v)}">${v === VAZIO ? "Não informada" : Utils.escapar(v)}</option>`).join("");
    });
  },

  estado() {
    const e = { busca: Utils.normalizar(document.getElementById("busca").value) };
    this.campos.forEach(({ id, chave }) => { e[chave] = document.getElementById(id).value; });
    return e;
  },

  aplicar(lista, e) {
    return lista.filter(c =>
      (!e.busca || Utils.normalizar(c.nome).includes(e.busca)) &&
      this.campos.every(({ chave }) => !e[chave] || (c[chave] || VAZIO) === e[chave])
    );
  },

  limpar() {
    document.getElementById("busca").value = "";
    this.campos.forEach(({ id }) => { document.getElementById(id).value = ""; });
  }
};
