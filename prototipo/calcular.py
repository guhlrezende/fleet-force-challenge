"""Motor do Fleet Force para o caso demonstrativo: US01, US02 e US03.

Serve para frotas mistas (caminhoes, vans, carros flex). Le a planilha do cliente
(dados/frota_demo.csv) e o cadastro rapido dos veiculos (dados/veiculos_demo.csv:
placa, tipo, combustivel, ano, valor venal), mapeia colunas e tipos de despesa para
as 8 categorias, consolida o custo (US01), compara com as referencias de
dados/referencias.json (US02) e calcula a economia potencial (US03).

Referencias:
- publicas: preco medio ANP de cada combustivel, aliquota do IPVA por tipo, extrato
  do pedagio (cada passagem cobrada uma vez);
- da propria frota: consumo e custo por km de manutencao e pneus contra a mediana
  dos veiculos DO MESMO TIPO (caminhao com caminhao, carro com carro), so em grupos
  com pelo menos min_grupo veiculos.

Combustivel sem contar duas vezes (preco + troca de combustivel + consumo):
gasto real - litros necessarios no consumo mediano x melhor preco ANP por km.
Para carros flex o consumo e medido em litros equivalentes de gasolina
(1 l de etanol = rendimento_etanol l de gasolina).

Os eventos do ESP32 (dados/eventos_iot_simulado.csv), quando existem, entram
separados e marcados como "simulado".

Uso: python calcular.py            -> grava dados/resultados.json e imprime o resumo
"""
import csv
import json
import statistics
import unicodedata
from collections import defaultdict
from pathlib import Path

BASE = Path(__file__).parent / "dados"

CATEGORIAS = ["combustivel", "pedagio", "estacionamento", "manutencao",
              "pneus", "seguro", "ipva", "multas"]
NOMES = {"combustivel": "Combustível", "pedagio": "Pedágio",
         "estacionamento": "Estacionamento", "manutencao": "Manutenção",
         "pneus": "Pneus", "seguro": "Seguro", "ipva": "IPVA/licenciamento",
         "multas": "Multas"}
NOMES_TIPO = {"caminhao": "caminhão", "van": "van", "carro": "carro"}
NOMES_COMB = {"diesel_s10": "diesel", "gasolina": "gasolina", "etanol": "etanol"}

# Sinonimos de coluna -> campo padrao (US01, CA1.1)
SINONIMOS_COLUNA = {
    "data": ["data", "data/hora", "dt", "data da despesa"],
    "placa": ["placa", "veiculo", "veículo"],
    "tipo": ["tipo de despesa", "categoria", "tipo", "despesa"],
    "descricao": ["descricao", "descrição", "historico", "histórico"],
    "litros": ["qtd (l)", "litros", "quantidade (l)", "volume"],
    "km": ["km", "quilometragem", "hodometro"],
    "valor": ["valor (r$)", "valor", "valor abastecido", "total"],
}
# Sinonimos de tipo de despesa -> categoria
SINONIMOS_TIPO = {
    "combustivel": ["abastecimento", "combustivel", "diesel", "posto"],
    "pedagio": ["tag pedagio", "pedagio", "vale-pedagio"],
    "estacionamento": ["estac.", "estacionamento", "patio"],
    "manutencao": ["oficina", "manutencao", "revisao"],
    "pneus": ["pneus", "pneu", "borracharia"],
    "seguro": ["seguro frota", "seguro", "apolice"],
    "ipva": ["ipva/licenc.", "ipva", "licenciamento"],
    "multas": ["infracao", "multa", "multas"],
}


def norm(s):
    s = unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode()
    return s.strip().lower()


def num(s):
    return float(str(s).replace(".", "").replace(",", ".")) if str(s).strip() else 0.0


def mapear_colunas(cabecalho):
    mapa, nao_reconhecidas = {}, []
    for col in cabecalho:
        campo = next((c for c, sins in SINONIMOS_COLUNA.items()
                      if norm(col) in [norm(x) for x in sins]), None)
        if campo:
            mapa[campo] = col
        else:
            nao_reconhecidas.append(col)
    return mapa, nao_reconhecidas


def categoria_de(tipo):
    t = norm(tipo)
    for cat, sins in SINONIMOS_TIPO.items():
        if t in [norm(x) for x in sins]:
            return cat
    return None


def combustivel_de(descricao):
    d = norm(descricao)
    if "etanol" in d or "alcool" in d:
        return "etanol"
    if "gasolina" in d:
        return "gasolina"
    if "diesel" in d:
        return "diesel_s10"
    return None


def tipo_veiculo_de(texto):
    t = norm(texto)
    if "caminh" in t:
        return "caminhao"
    if "van" in t or "utilit" in t or "furg" in t:
        return "van"
    return "carro"


def ler_cadastro(caminho):
    """Cadastro rapido: placa -> tipo, combustivel ('flex' ou 'diesel_s10'), ano, valor venal."""
    with open(caminho, encoding="utf-8") as f:
        out = {}
        for r in csv.DictReader(f, delimiter=";"):
            comb = "flex" if "flex" in norm(r["Combustivel"]) else (combustivel_de(r["Combustivel"]) or norm(r["Combustivel"]))
            out[r["Placa"]] = {"tipo": tipo_veiculo_de(r["Tipo"]), "combustivel": comb,
                               "ano": int(r["Ano"]), "valor_venal": num(r["Valor venal (R$)"])}
        return out


def ler_planilha(caminho, cadastro=None):
    with open(caminho, encoding="utf-8") as f:
        leitor = csv.DictReader(f, delimiter=";")
        mapa, nao_rec = mapear_colunas(leitor.fieldnames)
        linhas, sem_categoria = [], []
        for r in leitor:
            cat = categoria_de(r[mapa["tipo"]])
            item = {"data": r[mapa["data"]], "placa": r[mapa["placa"]],
                    "tipo": r[mapa["tipo"]], "descricao": r[mapa.get("descricao", "")] if "descricao" in mapa else "",
                    "litros": num(r[mapa["litros"]]) if "litros" in mapa else 0.0,
                    "km": num(r[mapa["km"]]) if "km" in mapa else 0.0,
                    "valor": num(r[mapa["valor"]]), "categoria": cat}
            item["mes"] = item["data"][3:10]  # "MM/AAAA"
            item["comb"] = combustivel_de(item["descricao"]) if cat == "combustivel" else None
            item["tipo_veiculo"] = (cadastro or {}).get(item["placa"], {}).get("tipo", "carro")
            (linhas if cat else sem_categoria).append(item)
    return mapa, nao_rec, linhas, sem_categoria


def classificar(dif_pct, cfg):
    if dif_pct <= cfg["eficiente_ate"]:
        return "eficiente"
    if dif_pct <= cfg["atencao_ate"]:
        return "atencao"
    return "critico"


def us01(linhas, meses_filtro=None):
    sel = [l for l in linhas if not meses_filtro or l["mes"] in meses_filtro]
    por_cat = defaultdict(float)
    for l in sel:
        por_cat[l["categoria"]] += l["valor"]
    total = sum(por_cat.values())
    placas = {l["placa"] for l in sel}
    km = sum(l["km"] for l in sel if l["categoria"] == "combustivel")
    cats = []
    for c in CATEGORIAS:
        v = por_cat.get(c)
        cats.append({"categoria": c, "nome": NOMES[c],
                     "valor": round(v, 2) if v is not None else None,
                     "pct": round(100 * v / total, 2) if v else None,
                     "status": "informado" if v is not None else "nao informado"})
    meses = sorted({l["mes"] for l in sel}, key=lambda m: (m[3:], m[:2]))
    # quebra por tipo de veiculo (frota mista)
    por_tipo = []
    for t in sorted({l["tipo_veiculo"] for l in sel}, key=lambda x: list(NOMES_TIPO).index(x)):
        lt = [l for l in sel if l["tipo_veiculo"] == t]
        tot_t = sum(l["valor"] for l in lt)
        km_t = sum(l["km"] for l in lt if l["categoria"] == "combustivel")
        n_t = len({l["placa"] for l in lt})
        por_tipo.append({"tipo": t, "nome": NOMES_TIPO[t], "n_veiculos": n_t, "total": round(tot_t, 2),
                         "custo_por_veiculo_mes": round(tot_t / len(meses) / n_t, 2),
                         "custo_por_km": round(tot_t / km_t, 2) if km_t else None})
    return {"periodo": meses, "total": round(total, 2),
            "total_mensal_medio": round(total / len(meses), 2),
            "n_veiculos": len(placas),
            "custo_por_veiculo_mes": round(total / len(meses) / len(placas), 2),
            "km": round(km), "custo_por_km": round(total / km, 2) if km else None,
            "categorias": cats, "por_tipo": por_tipo,
            "categorias_preenchidas": sum(1 for c in cats if c["valor"] is not None)}


def anp(ref):
    return {c: r["valor"] for c, r in ref["referencias"]["combustivel"].items()}


def preco_por_km_ideal(comb_veic, ref):
    """Melhor preco ANP por litro equivalente: diesel -> diesel; flex -> o mais barato por km."""
    p = anp(ref)
    if comb_veic == "flex":
        return min(p["gasolina"], p["etanol"] / ref["rendimento_etanol"])
    return p[comb_veic]


def us02(linhas, ref, cadastro):
    meses = len({l["mes"] for l in linhas})
    cfg = ref["classificacao"]
    p_anp = anp(ref)
    out = []
    # Combustivel: preco pago por litro x ANP, combustivel por combustivel
    comb = [l for l in linhas if l["categoria"] == "combustivel"]
    pago = sum(l["valor"] for l in comb)
    custo_ref, por_comb = 0.0, []
    for c in ("diesel_s10", "gasolina", "etanol"):
        lc = [l for l in comb if l["comb"] == c]
        if not lc:
            continue
        lit, val = sum(l["litros"] for l in lc), sum(l["valor"] for l in lc)
        custo_ref += lit * p_anp[c]
        por_comb.append({"combustivel": c, "nome": NOMES_COMB[c], "litros": round(lit, 1),
                         "pago": round(val / lit, 2), "anp": p_anp[c],
                         "diferenca_pct": round(100 * (val / lit - p_anp[c]) / p_anp[c], 1)})
    r = ref["referencias"]["combustivel"]["diesel_s10"]
    out.append({"id": "combustivel_preco", "categoria": "combustivel", "indicador": "R$ por litro, por combustível",
                "comparacao_txt": " · ".join(f"{x['nome']} {brl(x['pago'])} x {brl(x['anp'])}" for x in por_comb),
                "por_combustivel": por_comb,
                "cliente": round(pago, 2), "referencia": round(custo_ref, 2),
                "custo_cliente": round(pago, 2), "custo_referencia": round(custo_ref, 2),
                "fonte": r["fonte"], "periodo_fonte": r["periodo"]})
    # Carros flex: etanol x gasolina (so quando o etanol compensa pelo rendimento)
    rend = ref["rendimento_etanol"]
    lg = sum(l["litros"] for l in comb if l["comb"] == "gasolina" and cadastro.get(l["placa"], {}).get("combustivel") == "flex")
    if lg:
        compensa = p_anp["etanol"] / p_anp["gasolina"] < rend
        cli = lg * p_anp["gasolina"]
        idl = lg / rend * p_anp["etanol"] if compensa else cli
        out.append({"id": "etanol_gasolina", "categoria": "combustivel", "indicador": "gasolina x etanol nos flex",
                    "comparacao_txt": f"etanol a {100 * p_anp['etanol'] / p_anp['gasolina']:.0f}% da gasolina (compensa abaixo de {100 * rend:.0f}%)",
                    "detalhe": f"{lg:,.0f} l de gasolina em carros flex".replace(",", "."),
                    "cliente": round(cli, 2), "referencia": round(idl, 2),
                    "custo_cliente": round(cli, 2), "custo_referencia": round(idl, 2),
                    "fonte": f"{r['fonte']} · rendimento do etanol: {ref['fonte_rendimento_etanol']}", "periodo_fonte": r["periodo"]})
    # Pedagio: cobranca x cobranca sem duplicidade
    ped = [l for l in linhas if l["categoria"] == "pedagio"]
    vistos, dup_valor, dup_qtd = set(), 0.0, 0
    for l in ped:
        chave = (l["placa"], l["descricao"], l["data"])
        if chave in vistos:
            dup_valor += l["valor"]
            dup_qtd += 1
        vistos.add(chave)
    cobrado = sum(l["valor"] for l in ped)
    out.append({"id": "pedagio", "categoria": "pedagio", "indicador": "cobrado x devido",
                "comparacao_txt": f"{brl(cobrado)} cobrado x {brl(cobrado - dup_valor)} devido",
                "cliente": round(cobrado, 2), "referencia": round(cobrado - dup_valor, 2),
                "custo_cliente": round(cobrado, 2), "custo_referencia": round(cobrado - dup_valor, 2),
                "detalhe": f"{dup_qtd} passagens cobradas em duplicidade",
                "fonte": ref["referencias"]["pedagio"]["fonte"], "periodo_fonte": "extrato do cliente"})
    # IPVA: pago x aliquota legal de cada tipo sobre o valor venal do cadastro
    ip = ref["referencias"]["ipva"]
    pago_ipva = sum(l["valor"] for l in linhas if l["categoria"] == "ipva")
    # rateio mensal por veiculo, arredondado ao centavo como no boleto
    devido = sum(round(v["valor_venal"] * ip["aliquotas"][v["tipo"]] / 12, 2) for v in cadastro.values()) * meses
    out.append({"id": "ipva", "categoria": "ipva", "indicador": "pago x alíquota legal",
                "comparacao_txt": f"{brl(pago_ipva)} pago x {brl(devido)} pela alíquota",
                "cliente": round(pago_ipva, 2), "referencia": round(devido, 2),
                "custo_cliente": round(pago_ipva, 2), "custo_referencia": round(devido, 2),
                "fonte": ip["fonte"], "periodo_fonte": "vigente"})
    for item in out:
        dif = item["custo_cliente"] - item["custo_referencia"]
        item["diferenca_rs"] = round(dif, 2)
        item["diferenca_pct"] = round(100 * dif / item["custo_referencia"], 2) if item["custo_referencia"] else 0.0
        item["classificacao"] = classificar(item["diferenca_pct"], cfg)
        item.setdefault("nome", NOMES[item["categoria"]])
        item["tipo_referencia"] = "publica"
    out[0]["nome"] = "Combustível: preço"
    if out[1]["id"] == "etanol_gasolina":
        out[1]["nome"] = "Flex: etanol x gasolina"
    pos = 2 if out[1]["id"] == "etanol_gasolina" else 1
    out[pos:pos] = benchmark_interno(linhas, ref, cadastro)
    com_ref = {i["categoria"] for i in out}
    presentes = {l["categoria"] for l in linhas}
    for c in CATEGORIAS:
        if c not in com_ref:
            out.append({"categoria": c, "nome": NOMES[c],
                        "classificacao": "sem dado para comparar" if c not in presentes
                        else "sem referencia disponivel"})
    return {"versao_referencias": ref["versao"], "limites": cfg, "comparacoes": out}


def por_veiculo(linhas, rendimento_etanol=0.70):
    """km, litros (e litros equivalentes de gasolina) e gasto de cada veiculo."""
    v = defaultdict(lambda: defaultdict(float))
    for l in linhas:
        d = v[l["placa"]]
        d["tipo"] = l["tipo_veiculo"]
        if l["categoria"] == "combustivel":
            d["km"] += l["km"]
            d["litros"] += l["litros"]
            d["litros_eq"] += l["litros"] * (rendimento_etanol if l["comb"] == "etanol" else 1.0)
        d[l["categoria"]] += l["valor"]
    return v


def benchmark_interno(linhas, ref, cadastro):
    """Consumo e custo por km de manutencao e pneus contra a mediana DO MESMO TIPO de veiculo.

    Para cada veiculo: diferenca % = (gasto real - gasto se estivesse na mediana do seu tipo)
    / gasto na mediana. Passou de 'eficiente_ate', entra na lista e na economia.
    Grupos com menos de min_grupo veiculos ficam de fora ("sem referencia na frota").
    O combustivel a mais e valorizado pelo melhor preco ANP por km (diesel; ou, no flex,
    o mais barato entre gasolina e etanol pelo rendimento), para nao somar duas vezes
    com os itens de preco e de troca de combustivel.
    """
    cfg = ref["classificacao"]
    fonte = ref["referencia_interna"]["fonte"]
    min_grupo = ref["referencia_interna"]["min_grupo"]
    todos = {p: d for p, d in por_veiculo(linhas, ref["rendimento_etanol"]).items() if d["km"] > 0}
    grupos = defaultdict(list)
    for p, d in todos.items():
        grupos[d["tipo"]].append(p)
    validos = {t: ps for t, ps in grupos.items() if len(ps) >= min_grupo}
    fora = sorted(t for t in grupos if t not in validos)
    n = sum(len(ps) for ps in validos.values())
    out = []

    def item(id_, categoria, nome, indicador, real, ideal, fmt, medianas, valores):
        acima = []
        for p in sorted(real):
            dif_pct = 100 * (real[p] - ideal[p]) / ideal[p] if ideal[p] else 0.0
            if dif_pct > cfg["eficiente_ate"]:
                acima.append({"placa": p, "tipo": todos[p]["tipo"], "valor": round(valores[p], 2),
                              "diferenca_pct": round(dif_pct, 1),
                              "diferenca_rs": round(real[p] - ideal[p], 2),
                              "classificacao": classificar(dif_pct, cfg)})
        acima.sort(key=lambda a: a["diferenca_rs"], reverse=True)
        cli = sum(real[a["placa"]] for a in acima)
        idl = sum(ideal[a["placa"]] for a in acima)
        dif = cli - idl
        pct = 100 * dif / idl if idl else 0.0
        return {"id": id_, "categoria": categoria, "nome": nome, "indicador": indicador,
                "tipo_referencia": "frota", "medianas": {t: round(m, 2) for t, m in medianas.items()},
                "custo_cliente": round(cli, 2), "custo_referencia": round(idl, 2),
                "diferenca_rs": round(dif, 2), "diferenca_pct": round(pct, 2),
                "classificacao": classificar(pct, cfg) if acima else "eficiente",
                "veiculos_acima": acima, "grupos_sem_referencia": fora,
                "detalhe": f"{len(acima)} de {n} veículos acima da mediana do seu tipo",
                "comparacao_txt": "mediana " + " · ".join(f"{NOMES_TIPO[t]} {fmt(m)}" for t, m in medianas.items()),
                "fonte": fonte, "periodo_fonte": f"{n} veículos, comparados só com o mesmo tipo"}

    # Consumo: km por litro equivalente de gasolina (diesel: litro de diesel)
    kml, real, ideal, med_c = {}, {}, {}, {}
    for t, ps in validos.items():
        k = {p: todos[p]["km"] / todos[p]["litros_eq"] for p in ps}
        med_c[t] = statistics.median(k.values())
        for p in ps:
            preco = preco_por_km_ideal(cadastro.get(p, {}).get("combustivel", "diesel_s10"), ref)
            kml[p] = k[p]
            real[p] = todos[p]["litros_eq"] * preco
            ideal[p] = todos[p]["km"] / med_c[t] * preco
    out.append(item("combustivel_consumo", "combustivel", "Combustível: consumo", "km por litro (equivalente)",
                    real, ideal, lambda x: f"{x:.1f} km/l".replace(".", ","), med_c, kml))
    # Manutencao e pneus: R$ por km contra a mediana do tipo
    for cat in ("manutencao", "pneus"):
        cpk, real, ideal, med = {}, {}, {}, {}
        for t, ps in validos.items():
            c = {p: todos[p][cat] / todos[p]["km"] for p in ps}
            med[t] = statistics.median(c.values())
            for p in ps:
                cpk[p] = c[p]
                real[p] = todos[p][cat]
                ideal[p] = todos[p]["km"] * med[t]
        out.append(item(cat, cat, NOMES[cat], "R$ por km", real, ideal, lambda x: f"{brl(x)}/km", med, cpk))
    return out


def us03(comparacoes, meses, ref):
    cen = ref["cenarios"]
    itens = []
    for c in comparacoes:
        if "diferenca_rs" not in c:
            continue
        dif_mes = max(0.0, c["diferenca_rs"]) / meses
        itens.append({"id": c["id"], "categoria": c["categoria"], "nome": c["nome"],
                      "tipo_referencia": c["tipo_referencia"],
                      "acao": ref["acoes"][c["id"]],
                      "veiculos": [a["placa"] for a in c.get("veiculos_acima", [])],
                      "diferenca_mensal": round(dif_mes, 2),
                      "formula": formula(c, meses),
                      "fonte": c["fonte"],
                      **{f"{k}_mensal": round(dif_mes * p, 2) for k, p in cen.items()},
                      **{f"{k}_anual": round(dif_mes * p * 12, 2) for k, p in cen.items()}})
    itens.sort(key=lambda i: i["realista_anual"], reverse=True)
    tot = {f"{k}_{p}": round(sum(i[f"{k}_{p}"] for i in itens), 2)
           for k in cen for p in ("mensal", "anual")}
    return {"cenarios": cen, "ranking": itens, "totais": tot}


def formula(c, meses):
    base = f"diferença no período {brl(c['diferenca_rs'])} ÷ {meses} meses × cenário"
    if c["id"] == "combustivel_consumo":
        return ("litros a mais do que o veículo gastaria no consumo mediano do seu tipo × melhor preço ANP "
                "(o preço acima da ANP e a troca de combustível já estão nos outros itens); " + base)
    if c["id"] == "etanol_gasolina":
        return ("litros de gasolina nos flex × preço ANP da gasolina − os mesmos km com etanol "
                "(litros ÷ rendimento) × preço ANP do etanol; " + base)
    if c["tipo_referencia"] == "frota":
        return f"custo do veículo − km × custo por km mediano do seu tipo, só nos veículos acima do limite; {base}"
    return f"max(0, custo cliente − referência); {base}"


def ler_eventos(arq):
    with arq.open(encoding="utf-8") as f:
        return list(csv.DictReader(l for l in f if not l.startswith("#")))


def ociosidade(ref):
    arq = BASE / "eventos_iot_simulado.csv"
    if not arq.exists():
        return None
    ev = ler_eventos(arq)
    minutos = sum(float(e["duracao_min"]) for e in ev if e["rotulo"] == "ocioso")
    conducao = sum(1 for e in ev if e["rotulo"] in ("frenagem_brusca", "arrancada_brusca"))
    excesso = sum(1 for e in ev if e["rotulo"] == "excesso_velocidade")
    fora_rota = sum(1 for e in ev if e["rotulo"] == "abastecimento_fora_da_rota")
    km = max((float(e["km"]) for e in ev), default=0.0)
    oc = ref["ociosidade"]
    preco = anp(ref)["diesel_s10"]
    custo = minutos / 60 * oc["consumo_l_por_hora"] * preco
    return {"origem": "simulado (ESP32 no Wokwi)", "veiculo": ev[0]["placa"] if ev else None,
            "eventos": len(ev), "horas_ociosas": round(minutos / 60, 1),
            "litros_estimados": round(minutos / 60 * oc["consumo_l_por_hora"], 1),
            "custo_estimado": round(custo, 2), "eventos_conducao_brusca": conducao,
            "km": round(km), "bruscos_por_100km": round(100 * conducao / km, 1) if km else None,
            "excesso_velocidade": excesso, "abastecimentos_fora_da_rota": fora_rota,
            "sensores": "acelerômetro MPU6050 + GPS NEO-6M",
            "regra_ocioso": "ignição ligada e GPS a 0 km/h",
            "formula": "horas ociosas × consumo parado (l/h) × preço ANP",
            "fonte_consumo": oc["fonte"], "fora_do_total": True}


def calcular():
    ref = json.loads((BASE / "referencias.json").read_text(encoding="utf-8"))
    cadastro = ler_cadastro(BASE / "veiculos_demo.csv")
    mapa, nao_rec, linhas, sem_cat = ler_planilha(BASE / "frota_demo.csv", cadastro)
    r1 = us01(linhas)
    r1_mensal = {m: us01(linhas, [m])["total"] for m in r1["periodo"]}
    r2 = us02(linhas, ref, cadastro)
    r3 = us03(r2["comparacoes"], len(r1["periodo"]), ref)
    res = {"origem_dados": "dados de demonstração (frota fictícia)",
           "importacao": {"linhas": len(linhas) + len(sem_cat), "classificadas": len(linhas),
                          "sem_categoria": len(sem_cat), "mapa_colunas": mapa,
                          "colunas_nao_reconhecidas": nao_rec, "veiculos_no_cadastro": len(cadastro)},
           "us01": {**r1, "total_por_mes": r1_mensal}, "us02": r2, "us03": r3,
           "ociosidade_simulada": ociosidade(ref)}
    (BASE / "resultados.json").write_text(json.dumps(res, ensure_ascii=False, indent=2),
                                          encoding="utf-8")
    return res


def brl(v):
    return f"R$ {v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


if __name__ == "__main__":
    r = calcular()
    u1, u2, u3 = r["us01"], r["us02"], r["us03"]
    print(f"Importação: {r['importacao']['classificadas']}/{r['importacao']['linhas']} linhas classificadas")
    print(f"US01 total {u1['periodo'][0]} a {u1['periodo'][-1]}: {brl(u1['total'])} "
          f"| médio/mês {brl(u1['total_mensal_medio'])} | por veículo/mês {brl(u1['custo_por_veiculo_mes'])} "
          f"| por km {brl(u1['custo_por_km'])}")
    for c in u1["categorias"]:
        print(f"   {c['nome']:<20} {brl(c['valor']):>18}  {c['pct']:5.1f}%")
    for t in u1["por_tipo"]:
        print(f"   [{t['nome']}] {t['n_veiculos']} veículos, {brl(t['custo_por_veiculo_mes'])}/veículo/mês, {brl(t['custo_por_km'])}/km")
    print("US02:")
    for c in u2["comparacoes"]:
        extra = f" ({c['diferenca_pct']:+.1f}%, {brl(c['diferenca_rs'])})" if "diferenca_pct" in c else ""
        print(f"   {c['nome']:<26} {c['classificacao']}{extra} {c.get('detalhe', '')} {c.get('comparacao_txt', '')}")
    print("US03 (anual):")
    for i in u3["ranking"]:
        print(f"   {i['nome']:<26} conservador {brl(i['conservador_anual']):>16} | realista {brl(i['realista_anual']):>16}")
    t = u3["totais"]
    print(f"   TOTAL anual: conservador {brl(t['conservador_anual'])} | realista {brl(t['realista_anual'])}")
    if r["ociosidade_simulada"]:
        o = r["ociosidade_simulada"]
        print(f"Kit (simulado, {o['veiculo']}): {o['horas_ociosas']} h ocioso -> {brl(o['custo_estimado'])}; "
              f"{o['eventos_conducao_brusca']} eventos bruscos em {o['km']} km = {o['bruscos_por_100km']} por 100 km")
