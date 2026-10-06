"""Converte a planilha de colaboradores em data/colaboradores.js.

Uso:  python scripts/xlsx_para_js.py caminho/new_dash.xlsx

Gera SOMENTE os campos listados em CAMPOS. Qualquer outra coluna da planilha
(CPF, CNPJ/CPNJ, STATUS, MÊS_NASC, 1º MÊS, 3 MÊS etc.) é ignorada e nunca chega
ao arquivo de dados.
Os valores são copiados como estão na planilha; conversões técnicas:
- datas viram texto ISO (AAAA-MM-DD); datas gravadas como número serial do Excel (ex.: NASC = 35304) também;
- erro de fórmula do Excel (#N/A, #REF! etc.) vira vazio (null);
- DT_NASC/ADMISSÃO que não sejam data viram vazio (null).
Cada caso é listado no final para que a planilha possa ser corrigida.
"""
import json, sys, datetime
import openpyxl

CAMPOS = ["SUPERVISOR", "GERENTE", "FUNÇÃO", "MUNICIPIO",
          "DT_NASC", "LOJA", "COLABORADOR", "ADMISSÃO", "SALÁRIO", "SEXO"]
# Coluna da planilha -> campo usado pelo dashboard. A planilha nova não tem MUNICIPIO:
# o campo é omitido dos dados (o dashboard o trata como vazio).
ORIGEM = {"SUPERVISOR": "SUPER", "GERENTE": "GERENTE", "FUNÇÃO": "FUNÇÃO",
          "DT_NASC": "NASC", "LOJA": "LOJA", "COLABORADOR": "Nome do Funcionário",
          "ADMISSÃO": "ADMISSÃO", "SALÁRIO": "Salário Base", "SEXO": "Sexo"}
CAMPOS_DATA = ("DT_NASC", "ADMISSÃO")
ERROS_EXCEL = {"#N/A", "#REF!", "#VALUE!", "#DIV/0!", "#NAME?", "#NULL!", "#NUM!"}

origem = sys.argv[1] if len(sys.argv) > 1 else "new_dash.xlsx"
destino = "data/colaboradores.js"

ws = openpyxl.load_workbook(origem, data_only=True).active
linhas = list(ws.iter_rows(values_only=True))
cabecalho = [str(c).strip() if c is not None else "" for c in linhas[0]]

faltando = [o for o in ORIGEM.values() if o not in cabecalho]
if faltando:
    sys.exit(f"Colunas ausentes na planilha: {', '.join(faltando)}")
indices = {c: cabecalho.index(o) for c, o in ORIGEM.items()}

def valor(v, c=None):
    if c in CAMPOS_DATA and isinstance(v, int) and not isinstance(v, bool):  # número serial do Excel
        return (datetime.date(1899, 12, 30) + datetime.timedelta(days=v)).strftime("%Y-%m-%d")
    return v.strftime("%Y-%m-%d") if isinstance(v, (datetime.datetime, datetime.date)) else v

avisos = []

def campo(c, v, n):
    v = valor(v, c)
    if isinstance(v, str) and v.strip() in ERROS_EXCEL:
        avisos.append(f"linha {n}: {c} = {v.strip()} (erro do Excel) -> vazio")
        return None
    if c in CAMPOS_DATA and v is not None and not (isinstance(v, str) and len(v) == 10 and v[4] == "-" and v[7] == "-"):
        avisos.append(f"linha {n}: {c} = {v!r} (não é data) -> vazio")
        return None
    return v

registros = [
    {c: campo(c, l[i], n) for c, i in indices.items()}
    for n, l in enumerate(linhas[1:], start=2) if any(v is not None for v in l)
]

with open(destino, "w", encoding="utf-8") as f:
    f.write("// Gerado por scripts/xlsx_para_js.py — somente os campos: " + ", ".join(CAMPOS) + ".\n")
    f.write("window.COLABORADORES_DADOS = ")
    json.dump(registros, f, ensure_ascii=False, indent=1)
    f.write(";\n")

ignoradas = [c for c in cabecalho if c and c not in ORIGEM.values()]
print(f"{len(registros)} registros gravados em {destino}")
if ignoradas:
    print("Colunas ignoradas:", ", ".join(ignoradas))
for a in avisos:
    print("ATENÇÃO —", a)
