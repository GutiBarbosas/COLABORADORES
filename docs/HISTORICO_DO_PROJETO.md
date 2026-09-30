# Histórico do Projeto

## Etapa 1 — Visualização de colaboradores
- Base: `BASE_DASH.xlsx` (aba "RELA FINAL", 339 colaboradores ativos, 11 colunas).
- Entregue: cartões (nome, função, loja, município/LOC, gerente, supervisor, admissão), busca por nome e 5 filtros.
- Não incluído de propósito: indicadores, cálculos, deploy, autenticação.
- Observações da base: cabeçalhos originais `MUNICIPIO` e `CPNJ` mantidos como estão; FUNÇÃO com "Gerente"/"GERENTE" e um valor `0`.

## Etapa 2 — Nova base sem dados sensíveis
- Base passou a ser `BASE_DASH_GITHUB.xlsx` (339 colaboradores, 8 colunas: SUPERVISOR, GERENTE, FUNÇÃO, MUNICIPIO, DT_NASC, LOJA, COLABORADOR, ADMISSÃO), usada exclusivamente.
- CPF, SALÁRIO e CNPJ removidos de `data/colaboradores.js` e do dashboard; a planilha completa fica só no computador, fora do GitHub.
- `scripts/xlsx_para_js.py` agora gera apenas os 8 campos (ignora as demais colunas e avisa se faltar alguma).
- Dashboard inalterado: busca, 5 filtros, cards, tema claro/escuro, layout responsivo.
- Próxima etapa (ainda não iniciada): aniversários e contratos de experiência.

## Etapa 3 — Próximos aniversários
- Nova seção "🎂 Próximos aniversários" no topo da página: nome, dia/mês, loja e função; ordenada do mais próximo ao mais distante; "Hoje" destacado; mensagem simples quando não há aniversariantes.
- Cálculo: usa só dia e mês de `DT_NASC`; janela = hoje + 7 dias seguintes (constante `DIAS_A_FRENTE` em `js/birthdays.js`); 29/02 é tratado como 28/02 em anos não bissextos.
- Seção independente dos filtros; filtros, cards e dados não foram alterados.
- Observação: todas as `DT_NASC` da base atual estão em 1999, em sequência (01/01, 02/01, 03/01...), o que parece data provisória e não a real — os aniversariantes exibidos só serão corretos com as datas reais.
- Não iniciado: contratos de experiência.

## Etapa 4 — Contratos de experiência
- Nova seção "📄 Contratos de experiência" (abaixo dos aniversários e acima dos filtros), em `js/contracts.js`.
- Regra da empresa: 30 dias + prorrogação de 60 dias = 90 dias no total. Marcos calculados a partir de `ADMISSÃO`: **admissão + 30 dias** (1º período) e **admissão + 90 dias** (término total).
- Janela: vencimentos de hoje até 15 dias à frente (`DIAS_A_FRENTE`) e vencidos nos últimos 7 dias (`DIAS_ATRAS`), para não perder um vencimento que acabou de passar (marcados como "Vencido").
- Cada item mostra nome, loja, função, admissão, data do vencimento e dias restantes; "Vence hoje" destacado; 1º período (âmbar) e Prorrogação (azul) diferenciados por cor e etiqueta, com variações para tema claro/escuro. Ordenação pelo vencimento mais próximo.
- Cálculo com `Date.UTC` (sem efeito de fuso ou horário de verão; virada de mês/ano e anos bissextos tratados automaticamente).
- Seção independente dos filtros. Usa apenas campos já existentes; nenhum campo novo foi adicionado à base.
- Alterações em arquivos existentes foram só de encaixe: uma seção em `index.html`, uma tag `<script>`, uma linha em `js/script.js` (`Contracts.render(visao)`) e estilos acrescentados ao final de `css/styles.css`. Aniversários, filtros, cartões, dados e script de conversão não foram alterados.
- Conferência: resultado da página igual a um cálculo independente sobre os 339 registros (22 itens na data de teste 29/09/2026).
- Observação: contam-se 30 e 90 dias corridos após a data de admissão, exatamente como definido. Se o RH preferir contar o dia da admissão como 1º dia (vencimento = admissão + 29 e + 89), a mudança é só nos valores de `PRAZOS` em `js/contracts.js`.
- Não iniciado: ficha detalhada do colaborador e outros controles.

## Etapa 5 — Identidade visual e atualização de gerentes
Somente duas alterações; nenhuma funcionalidade nova.

**1. Identidade visual (`css/styles.css`)**
- Nova paleta sóbria, predominantemente escura: cabeçalho escuro nos dois temas; tema escuro em tons de grafite/azul-acinzentado; tema claro com fundo cinza-azulado e destaque em azul aço. Removido o verde-água vibrante.
- Cores de contratos de experiência (1º período, prorrogação, vencido) mantêm o mesmo significado, com tons mais discretos nos dois temas.
- Cantos menos arredondados (cartões 8 px; campos e itens internos 6 px) e `color-scheme` declarado para que campos/listas nativos acompanhem o tema.
- Tema claro/escuro automático preservado (`prefers-color-scheme`). Contraste de texto conferido: mínimo 5,0:1 no tema claro e 6,4:1 no escuro.
- Nenhuma alteração em HTML, JavaScript, textos, estrutura ou responsividade.

**2. Gerentes por loja (`data/colaboradores.js`)**
- Campo `GERENTE` atualizado a partir da `BASE_DASH_GITHUB.xlsx` mais recente: 23 colaboradores alterados.
  - Loja 4: RAQUEL → RAYANE (1)
  - Loja 6: RAQUEL/SONIA → SÔNIA (9)
  - Loja 29: ELANE → KLEBER (13)
- Nenhum outro campo foi alterado (nomes, funções, supervisores, municípios, nascimentos, admissões, lojas). Cada linha foi conferida contra a planilha por colaborador e loja antes da troca.
- O filtro Gerente deixa de listar ELANE e SONIA e passa a listar KLEBER e SÔNIA (com acento); os demais filtros têm as mesmas opções.
- Observação: a planilha nova também traz SUPERVISOR diferente em 9 linhas (loja 4: 1; loja 6: 8). Como o pedido foi alterar só os gerentes, os supervisores **não** foram atualizados. Por isso `scripts/xlsx_para_js.py` não foi executado (ele regravaria todos os campos, inclusive SUPERVISOR).

**Verificação**
- Página aberta em navegador (temas claro e escuro, desktop e celular 390 px) sem erros de JavaScript.
- Comparação com a versão anterior: contagem de cartões, busca, limpar filtros, cada filtro, aniversários e contratos de experiência com resultados idênticos; única diferença observada foi o valor de Gerente nos 23 cartões e nas opções do filtro Gerente.

## Etapa 6 — Base FINAL_DASH e salário nos cartões
Atualização de dados e inclusão do salário; nenhuma funcionalidade nova.

**Base de dados (`data/colaboradores.js`)**
- Base passou a ser `FINAL_DASH.xlsx` (aba "FINAL"): **333 colaboradores** (antes 339), regenerada com `scripts/xlsx_para_js.py`.
- Campos carregados (exatamente 9): `SUPERVISOR`, `GERENTE`, `FUNÇÃO`, `MUNICIPIO`, `DT_NASC`, `LOJA`, `COLABORADOR`, `ADMISSÃO`, `SALÁRIO`.
- Ignorados e ausentes de qualquer arquivo do site: `CPNJ` (CNPJ), CPF, `STATUS`, `MÊS_NASC`, `1º MÊS`, `3 MÊS`.
- `GERENTE` conforme a nova planilha (substitui os valores da Etapa 5). `DT_NASC` agora com datas reais; a seção de aniversários passou a usá-las sem alteração de lógica.
- Nomes agora completos (antes abreviados, ex.: "JOSIMEIRE C." → "JOSIMEIRE CARVALHO DOS SANTOS").
- Contratos de experiência inalterados: continuam calculados só por `ADMISSÃO` (30 e 90 dias, mesma janela); `1º MÊS` e `3 MÊS` não são usados.

**Salário**
- Exibido no cartão (linha "Salário", após Admissão) como moeda brasileira: `R$ 1.714,00`, sempre com centavos; sem valor numérico exibe "—".
- Alterações de código: `Utils.formatarMoeda` em `js/utils.js`, uma linha em `js/render.js` e uma em `js/script.js` (`salario: r["SALÁRIO"]`). Nenhuma alteração em CSS, HTML, filtros, busca, aniversários ou contratos.

**Script de conversão (`scripts/xlsx_para_js.py`)**
- `SALÁRIO` incluído na lista de campos. Erro de fórmula do Excel e `DT_NASC`/`ADMISSÃO` que não sejam data passam a virar vazio, com aviso no final da execução.

**Ocorrências na planilha (dados copiados como estão, exceto o tratamento acima)**
- Linha 185 (loja 17, SILVANA DE SOUZA): `SALÁRIO` = `#N/A` e `FUNÇÃO` = 0 → salário exibido como "—" e função como "Função não informada".
- Linha 144 (loja 11, KEITH ANDRADE DA SILVA): `DT_NASC` contém o nome em vez de uma data → fica vazio e a pessoa não aparece em aniversários.
- Lojas 4 e 6 têm dois gerentes cada na planilha (loja 4: RAYANE e RAQUEL; loja 6: SONIA e RAQUEL), e SONIA voltou sem acento (antes SÔNIA); o filtro Gerente lista as duas grafias/nomes conforme a planilha.
- A coluna `MÊS_NASC` não coincide com `DT_NASC` (parece ter ficado das datas provisórias); não é usada.

**Verificação**
- 333 cartões renderizados, comparados com a planilha campo a campo (nome, função, loja, município, gerente, supervisor, admissão, salário): sem divergências.
- Todas as opções dos 5 filtros e a busca conferidas contra contagens independentes; sem erros de JavaScript; sem rolagem horizontal em 1280 px e 390 px.
- Aniversários e contratos conferidos contra cálculo independente na data atual e em 4 datas simuladas (incluindo "Hoje" e virada de ano): iguais.
- Busca textual nos arquivos do site: nenhuma ocorrência de CNPJ, CPF, STATUS ou das colunas ignoradas.

## Etapa 7 — Inclusão de 1 colaborador
- `data/colaboradores.js` regenerado com `scripts/xlsx_para_js.py` a partir da `FINAL_DASH.xlsx` atualizada: **334 colaboradores** (antes 333).
- Único registro novo: CAUA FELIPE JESUS LIMA (loja 9, ASSISTENTE DE LOGISTICA). A função é nova na base, então passa a aparecer como opção no filtro Função. Nenhum outro registro foi alterado.
- Nenhum arquivo de código, estilo ou documentação de funcionalidade foi alterado; as ocorrências da planilha da Etapa 6 (linhas 144 e 185) continuam iguais.
- Conferência: 334 cartões conferidos com a planilha, filtros, busca, aniversários e contratos iguais a um cálculo independente; sem CNPJ, CPF ou colunas ignoradas nos arquivos do site.

## Etapa 8 — Atualização de funções e salários
- `data/colaboradores.js` regenerado com `scripts/xlsx_para_js.py` a partir da `FINAL_DASH.xlsx` atualizada. Continuam 334 colaboradores; ninguém incluído ou removido.
- Alterados somente os campos `FUNÇÃO` (9 colaboradores) e `SALÁRIO` (8 colaboradores), todos da loja 9 e mais a SILVANA DE SOUZA (loja 17), que antes estava sem função e sem salário (linha 185 da planilha) e agora tem BALCONISTA e R$ 1.820,00.
- Funções novas na base (aparecem no filtro Função): AUX ADMINISTRATIVO, AUXILIAR ADMINISTRATIVO_NIVEL I, SUP. FINANCEIRO, COORDE. FINANCEIRO e ASSISTENTE DP. A função ADMINISTRATIVO deixa de existir na base.
- Há salários com centavos (R$ 1.891,26; R$ 1.917,48; R$ 2.148,94), exibidos normalmente pelo formato já existente.
- Nenhum arquivo de código, estilo ou outra documentação foi alterado. Permanece a ocorrência da linha 144 (DT_NASC de KEITH ANDRADE DA SILVA com o nome no lugar da data).
- Conferência: 334 cartões comparados com a planilha, todas as opções dos filtros, busca, aniversários e contratos iguais a um cálculo independente; sem CNPJ, CPF ou colunas ignoradas nos arquivos do site.

