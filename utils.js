// Funções utilitárias (sem regra de negócio)
const Utils = {
  // minúsculas e sem acentos — usado só para comparar textos na busca
  normalizar(texto) {
    return String(texto ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  },
  // "2024-04-02" -> "02/04/2024" (sem usar Date, evita erro de fuso horário)
  formatarData(iso) {
    if (!iso) return "—";
    const [a, m, d] = String(iso).slice(0, 10).split("-");
    return `${d}/${m}/${a}`;
  },
  // 1714 -> "R$ 1.714,00" (moeda brasileira, sempre com centavos); sem valor numérico -> "—"
  formatarMoeda(valor) {
    if (typeof valor !== "number" || !isFinite(valor)) return "—";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  },
  iniciais(nome) {
    const p = String(nome).replace(/\./g, "").split(/\s+/).filter(Boolean);
    return ((p[0] || "")[0] || "") + ((p[1] || "")[0] || "");
  },
  escapar(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }
};
