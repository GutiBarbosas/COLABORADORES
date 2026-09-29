# Dashboard de Colaboradores

Visualização dos colaboradores ativos, gerada a partir da planilha `FINAL_DASH.xlsx`.

**Funcionalidades:** cartões de colaboradores (com salário), busca por nome, filtros por Supervisor, Gerente, Loja,
Função e Município/LOC e a seção 🎂 Próximos aniversários (hoje + 7 dias seguintes, calculada com dia e
mês de `DT_NASC`; não é afetada pelos filtros) e a seção 📄 Contratos de experiência (vencimentos aos 30 e
90 dias da `ADMISSÃO`; também não é afetada pelos filtros). Sem deploy ou autenticação.

## Como usar
Abra o `index.html` no navegador (não precisa instalar nada).

## Estrutura
```
├── index.html               # página principal
├── css/styles.css           # estilos (responsivo, tema claro/escuro automático, visual escuro e sóbrio)
├── js/
│   ├── utils.js             # funções auxiliares
│   ├── filters.js           # busca e filtros
│   ├── render.js            # montagem dos cartões
│   ├── birthdays.js         # seção Próximos aniversários
│   ├── contracts.js         # seção Contratos de experiência
│   └── script.js            # ponto de entrada
├── data/colaboradores.js    # dados da planilha (somente 9 campos)
├── scripts/xlsx_para_js.py  # regenera data/colaboradores.js (só os 9 campos)
└── docs/HISTORICO_DO_PROJETO.md
```

## Identidade visual
Visual sóbrio, com aparência de sistema interno de RH: cabeçalho escuro nos dois temas, paleta em tons de
grafite/azul-acinzentado (sem cores vibrantes), cantos menos arredondados e contraste de texto mínimo de 4,5:1.
O tema continua automático (segue o modo claro/escuro do sistema/navegador); as cores ficam nas variáveis do
início de `css/styles.css`. Somente estilos foram alterados — textos, estrutura e funcionalidades permanecem.

## Contratos de experiência
Contrato de **30 dias + prorrogação de 60 dias = 90 dias no total**. A partir da `ADMISSÃO`:

| Marco | Cálculo | Etiqueta na tela |
|---|---|---|
| 1º período | admissão + 30 dias | 1º período — 30 dias |
| Término total | admissão + 90 dias | Prorrogação — 90 dias |

- **Janela:** aparecem os vencimentos de hoje até 15 dias à frente (`DIAS_A_FRENTE`) e os que venceram nos
  últimos 7 dias (`DIAS_ATRAS`), marcados como "Vencido". Os dois valores ficam no topo de `js/contracts.js`.
- **Cada cartão mostra:** nome, loja, função, admissão, data do vencimento e quantos dias faltam
  (ou há quantos dias venceu). Vencimento no dia aparece como **Vence hoje**.
- **Ordem:** pelo vencimento mais próximo (os já vencidos recentemente aparecem primeiro).
- Usa somente `ADMISSÃO`, `COLABORADOR`, `LOJA` e `FUNÇÃO`; não altera a base nem depende dos filtros.
- Atualiza sozinha a cada abertura da página e ao regenerar os dados com `scripts/xlsx_para_js.py`.

## Atualizar os dados
```bash
pip install openpyxl
python scripts/xlsx_para_js.py caminho/FINAL_DASH.xlsx
```
O script gera **somente** estes campos: `SUPERVISOR`, `GERENTE`, `FUNÇÃO`, `MUNICIPIO`, `DT_NASC`,
`LOJA`, `COLABORADOR`, `ADMISSÃO`, `SALÁRIO`. Qualquer outra coluna que a planilha tenha (`CPNJ`, CPF, `STATUS`,
`MÊS_NASC`, `1º MÊS`, `3 MÊS` etc.) é ignorada.

Conversões técnicas: datas viram texto `AAAA-MM-DD`; erro de fórmula do Excel (`#N/A` etc.) e `DT_NASC`/`ADMISSÃO`
que não sejam data viram vazio. Cada caso é listado no final da execução ("ATENÇÃO") para corrigir na planilha.

## Gerentes por loja
O campo `GERENTE` de `data/colaboradores.js` foi atualizado conforme a versão mais recente de `BASE_DASH_GITHUB.xlsx`
(23 colaboradores das lojas 4, 6 e 29). Os demais campos permanecem como estavam.

## Exibição x dados
O salário aparece no cartão como moeda brasileira (ex.: `R$ 1.714,00`, sempre com centavos); sem valor, aparece "—".
A data de nascimento fica em `data/colaboradores.js` e é usada apenas para a seção de aniversários (a tela mostra só dia/mês).
Na tela, a função é comparada sem diferenciar maiúsculas/minúsculas e o valor `0` é tratado como
"não informada"; os dados originais não são alterados.

## Dados pessoais
CPF e CNPJ **não fazem parte** deste projeto: ficam apenas na planilha completa, guardada fora do repositório.
Já `data/colaboradores.js` contém nomes completos, **datas de nascimento reais e salários**, e o GitHub Pages
publica o site (e os dados) de forma pública; use repositório privado e restrinja o acesso a quem pode ver essas informações.
