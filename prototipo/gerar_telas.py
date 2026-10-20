"""Monta telas/fleet-force.html com os resultados do caso demonstrativo embutidos.

Uso: python gerar_telas.py   (roda o calculo antes; abre direto no navegador, sem servidor)
"""
import json
from pathlib import Path

import calcular as fc

AQUI = Path(__file__).parent


def montar():
    res = fc.calcular()
    ref = json.loads((fc.BASE / "referencias.json").read_text(encoding="utf-8"))
    _, _, linhas, _ = fc.ler_planilha(fc.BASE / "frota_demo.csv", fc.ler_cadastro(fc.BASE / "veiculos_demo.csv"))
    por_periodo = {"todos": fc.us01(linhas)}
    for m in res["us01"]["periodo"]:
        por_periodo[m] = fc.us01(linhas, [m])
    tipos = sorted({(l["tipo"], fc.NOMES[l["categoria"]]) for l in linhas}, key=lambda t: t[1])
    dados = {**res, "us01_por_periodo": por_periodo, "total_por_mes": res["us01"]["total_por_mes"],
             "tipos": tipos, "consumo_ocioso": ref["ociosidade"]["consumo_l_por_hora"],
             "preco_anp": ref["referencias"]["combustivel"]["diesel_s10"]["valor"]}
    html = (AQUI / "telas" / "template.html").read_text(encoding="utf-8")
    html = html.replace("__DADOS__", json.dumps(dados, ensure_ascii=False))
    out = AQUI / "telas" / "fleet-force.html"
    out.write_text(html, encoding="utf-8")
    print(f"telas -> {out}")


if __name__ == "__main__":
    montar()
