"""Converte a planilha de colaboradores em data/colaboradores.js.

Uso:  python scripts/xlsx_para_js.py caminho/BASE_DASH_GITHUB.xlsx

Gera SOMENTE os campos listados em CAMPOS. Qualquer outra coluna da planilha
(CPF, SALÁRIO, CNPJ etc.) é ignorada e nunca chega ao arquivo de dados.
Os valores são copiados como estão na planilha; única conversão técnica:
datas viram texto ISO (AAAA-MM-DD).
"""
import json, sys, datetime
import openpyxl

CAMPOS = ["SUPERVISOR", "GERENTE", "FUNÇÃO", "MUNICIPIO",
          "DT_NASC", "LOJA", "COLABORADOR", "ADMISSÃO"]

origem = sys.argv[1] if len(sys.argv) > 1 else "BASE_DASH_GITHUB.xlsx"
destino = "data/colaboradores.js"

ws = openpyxl.load_workbook(origem, data_only=True).active
linhas = list(ws.iter_rows(values_only=True))
cabecalho = [str(c).strip() if c is not None else "" for c in linhas[0]]

faltando = [c for c in CAMPOS if c not in cabecalho]
if faltando:
    sys.exit(f"Colunas ausentes na planilha: {', '.join(faltando)}")
indices = {c: cabecalho.index(c) for c in CAMPOS}

def valor(v):
    return v.strftime("%Y-%m-%d") if isinstance(v, (datetime.datetime, datetime.date)) else v

registros = [
    {c: valor(l[i]) for c, i in indices.items()}
    for l in linhas[1:] if any(v is not None for v in l)
]

with open(destino, "w", encoding="utf-8") as f:
    f.write("// Gerado por scripts/xlsx_para_js.py — somente os campos: " + ", ".join(CAMPOS) + ".\n")
    f.write("window.COLABORADORES_DADOS = ")
    json.dump(registros, f, ensure_ascii=False, indent=1)
    f.write(";\n")

ignoradas = [c for c in cabecalho if c and c not in CAMPOS]
print(f"{len(registros)} registros gravados em {destino}")
if ignoradas:
    print("Colunas ignoradas:", ", ".join(ignoradas))
