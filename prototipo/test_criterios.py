"""Criterios de aceite das US01-US03 verificados no caso demonstrativo.

Cada teste tem o codigo do criterio (CA1.3 etc.) do documento
user-stories-sprint-1.md. Rodar: python -m pytest -q
"""
import copy
import csv
import json
import statistics

import pytest

import calcular as fc
import gerar_caso_demo as demo


@pytest.fixture(scope="module")
def base():
    ref = json.loads((fc.BASE / "referencias.json").read_text(encoding="utf-8"))
    mapa, nao_rec, linhas, sem_cat = fc.ler_planilha(fc.BASE / "frota_demo.csv", cadastro())
    return ref, mapa, nao_rec, linhas, sem_cat


def cadastro():
    return fc.ler_cadastro(fc.BASE / "veiculos_demo.csv")


@pytest.fixture(scope="module")
def res():
    return fc.calcular()


def soma_bruta_csv():
    with open(fc.BASE / "frota_demo.csv", encoding="utf-8") as f:
        return sum(fc.num(r["Valor (R$)"]) for r in csv.DictReader(f, delimiter=";"))


# ---------- US01 ----------
def test_ca1_1_importacao_reconhece_colunas_e_categorias(base):
    _, mapa, nao_rec, linhas, sem_cat = base
    assert {"data", "placa", "tipo", "valor", "litros", "km"} <= set(mapa)
    assert nao_rec == []
    cats = {l["categoria"] for l in linhas}
    assert {"combustivel", "pedagio", "manutencao"} <= cats
    assert sem_cat == []


def test_ca1_2_coluna_desconhecida_e_reportada_nao_descartada():
    mapa, nao_rec = fc.mapear_colunas(["Data", "Placa", "Tipo", "Valor", "Centro de custo"])
    assert "Centro de custo" in nao_rec
    assert fc.categoria_de("Lavagem") is None  # vai para "sem categoria", que e listado


def test_ca1_3_total_igual_soma_da_planilha(res):
    assert res["us01"]["total"] == pytest.approx(soma_bruta_csv(), abs=0.005)


def test_ca1_4_filtro_de_periodo(base, res):
    _, _, _, linhas, _ = base
    meses = res["us01"]["periodo"]
    soma_meses = sum(fc.us01(linhas, [m])["total"] for m in meses)
    assert soma_meses == pytest.approx(res["us01"]["total"], abs=0.01)
    so_julho = fc.us01(linhas, ["07/2026"])
    assert so_julho["periodo"] == ["07/2026"]
    assert so_julho["total"] < res["us01"]["total"]


def test_ca1_5_percentuais_somam_100(res):
    pcts = [c["pct"] for c in res["us01"]["categorias"] if c["pct"] is not None]
    assert sum(pcts) == pytest.approx(100, abs=0.05)


def test_ca1_6_custo_por_veiculo_e_por_km(res):
    u = res["us01"]
    assert u["custo_por_veiculo_mes"] == pytest.approx(u["total_mensal_medio"] / u["n_veiculos"], abs=0.01)
    assert u["custo_por_km"] == pytest.approx(u["total"] / u["km"], abs=0.01)


def test_ca1_7_categoria_ausente_nao_vira_zero(base):
    _, _, _, linhas, _ = base
    sem_multas = [l for l in linhas if l["categoria"] != "multas"]
    r = fc.us01(sem_multas)
    multas = next(c for c in r["categorias"] if c["categoria"] == "multas")
    assert multas["valor"] is None and multas["status"] == "nao informado"
    assert r["categorias_preenchidas"] == 7


def test_ca1_6b_frota_mista_quebra_por_tipo(res):
    u = res["us01"]
    assert {t["tipo"] for t in u["por_tipo"]} == {"caminhao", "van", "carro"}
    assert sum(t["total"] for t in u["por_tipo"]) == pytest.approx(u["total"], abs=0.05)
    assert sum(t["n_veiculos"] for t in u["por_tipo"]) == u["n_veiculos"] == 40


def test_ca1_8_recalculo_ao_alterar_valor(base):
    _, _, _, linhas, _ = base
    antes = fc.us01(linhas)["total"]
    alteradas = copy.deepcopy(linhas)
    alteradas[0]["valor"] += 100
    assert fc.us01(alteradas)["total"] == pytest.approx(antes + 100, abs=0.01)


# ---------- US02 ----------
def test_ca2_1_toda_referencia_tem_fonte(res):
    for c in res["us02"]["comparacoes"]:
        if "diferenca_pct" in c:
            assert c["fonte"] and c["periodo_fonte"]
    assert res["us02"]["versao_referencias"]


def test_ca2_2_combustivel_usa_anp_de_cada_combustivel(base, res):
    comb = next(c for c in res["us02"]["comparacoes"] if c["id"] == "combustivel_preco")
    assert "ANP" in comb["fonte"] and comb["periodo_fonte"]
    anp = {x["combustivel"]: x["anp"] for x in comb["por_combustivel"]}
    assert anp == {"diesel_s10": 7.32, "gasolina": 6.36, "etanol": 3.86}
    # a referencia total e a soma litros x ANP de cada combustivel
    _, _, _, linhas, _ = base
    esperado = sum(l["litros"] * anp[l["comb"]] for l in linhas if l["categoria"] == "combustivel")
    assert comb["custo_referencia"] == pytest.approx(esperado, abs=0.05)


def test_ca2_4_diferenca_bate_com_calculo_manual(res):
    for c in res["us02"]["comparacoes"]:
        if "diferenca_pct" in c:
            dif = c["custo_cliente"] - c["custo_referencia"]
            assert c["diferenca_rs"] == pytest.approx(dif, abs=0.01)
            assert c["diferenca_pct"] == pytest.approx(100 * dif / c["custo_referencia"], abs=0.01)


def test_ca2_5_limites_vem_da_configuracao(base):
    ref = base[0]
    cfg = copy.deepcopy(ref["classificacao"])
    assert fc.classificar(10, cfg) == "atencao"
    cfg["atencao_ate"] = 8
    assert fc.classificar(10, cfg) == "critico"


def test_ca2_6_sem_referencia_nunca_e_eficiente(res):
    for c in res["us02"]["comparacoes"]:
        if "diferenca_pct" not in c:
            assert c["classificacao"] in ("sem referencia disponivel", "sem dado para comparar")


def test_ca2_7_caso_demo_tem_critico_e_eficiente(res):
    classes = {c["classificacao"] for c in res["us02"]["comparacoes"]}
    assert {"critico", "eficiente"} <= classes


def item(res, id_):
    return next(c for c in res["us02"]["comparacoes"] if c.get("id") == id_)


def test_ca2_8_referencia_da_frota_acha_os_veiculos_plantados(base, res):
    ref, _, _, linhas, _ = base
    v = fc.por_veiculo(linhas, ref["rendimento_etanol"])
    cons = item(res, "combustivel_consumo")
    assert cons["fonte"] and cons["tipo_referencia"] == "frota"
    # mediana calculada dentro de cada tipo, em km por litro equivalente
    for tipo in ("caminhao", "van", "carro"):
        kml = [d["km"] / d["litros_eq"] for d in v.values() if d["tipo"] == tipo]
        assert cons["medianas"][tipo] == pytest.approx(statistics.median(kml), abs=0.01)
    perfis = demo.perfis()
    for id_, plantados in [("combustivel_consumo", "consumo_ruim"), ("manutencao", "manutencao_alta"),
                           ("pneus", "pneus_alto")]:
        acima = item(res, id_)["veiculos_acima"]
        assert perfis[plantados] <= {a["placa"] for a in acima}, id_
        # dentro de cada tipo, os plantados sao os piores
        for tipo in ("caminhao", "van", "carro"):
            pl = {p for p in perfis[plantados] if v[p]["tipo"] == tipo}
            do_tipo = sorted((a for a in acima if a["tipo"] == tipo), key=lambda a: -a["diferenca_pct"])
            assert {a["placa"] for a in do_tipo[:len(pl)]} == pl, (id_, tipo)


def veiculo(placa, tipo, km, litros, gasto, manut, pneus, comb="diesel_s10"):
    return [{"placa": placa, "tipo_veiculo": tipo, "categoria": "combustivel", "comb": comb, "km": km, "litros": litros, "valor": gasto},
            {"placa": placa, "tipo_veiculo": tipo, "categoria": "manutencao", "comb": None, "km": 0, "litros": 0, "valor": manut},
            {"placa": placa, "tipo_veiculo": tipo, "categoria": "pneus", "comb": None, "km": 0, "litros": 0, "valor": pneus}]


def test_ca2_8_frota_homogenea_nao_gera_economia(base):
    ref = base[0]
    linhas = [l for i in range(10) for l in veiculo(f"HOM{i}", "caminhao", 3000.0, 1000.0, 8000.0, 1800.0, 1000.0)]
    for c in fc.benchmark_interno(linhas, ref, {}):
        assert c["veiculos_acima"] == [] and c["diferenca_rs"] == 0
        assert c["classificacao"] == "eficiente"


def test_ca2_9_nunca_compara_tipos_diferentes(base):
    # 5 caminhoes iguais e 5 carros iguais: se o carro fosse comparado com o caminhao, alguem sairia "acima"
    ref = base[0]
    linhas = [l for i in range(5) for l in veiculo(f"CAM{i}", "caminhao", 3000.0, 1000.0, 8000.0, 1800.0, 1000.0)]
    linhas += [l for i in range(5) for l in veiculo(f"CAR{i}", "carro", 2500.0, 220.0, 1400.0, 300.0, 100.0, "gasolina")]
    cad = {f"CAR{i}": {"combustivel": "flex"} for i in range(5)}
    for c in fc.benchmark_interno(linhas, ref, cad):
        assert c["veiculos_acima"] == [], c["id"]


def test_ca2_10_grupo_pequeno_fica_sem_referencia(base):
    ref = base[0]
    linhas = [l for i in range(6) for l in veiculo(f"CAM{i}", "caminhao", 3000.0, 1000.0 + 50 * i, 8000.0, 1800.0, 1000.0)]
    linhas += [l for i in range(4) for l in veiculo(f"VAN{i}", "van", 3000.0, 300.0 + 80 * i, 2000.0, 600.0, 200.0)]
    for c in fc.benchmark_interno(linhas, ref, {}):
        assert c["grupos_sem_referencia"] == ["van"]
        assert all(a["tipo"] != "van" for a in c["veiculos_acima"])


def test_ca2_11_etanol_so_quando_compensa(base, res):
    ref = copy.deepcopy(base[0])
    _, _, _, linhas, _ = base
    troca = item(res, "etanol_gasolina")
    assert troca["diferenca_rs"] > 0  # na semana da ANP o etanol estava a 61% da gasolina
    ref["referencias"]["combustivel"]["etanol"]["valor"] = 4.80  # 75% da gasolina: nao compensa
    t2 = next(c for c in fc.us02(linhas, ref, cadastro())["comparacoes"] if c.get("id") == "etanol_gasolina")
    assert t2["diferenca_rs"] == 0


# ---------- US03 ----------
def test_ca3_1_eficiente_tem_economia_zero(res):
    for i in res["us03"]["ranking"]:
        comp = item(res, i["id"])
        if comp["diferenca_rs"] <= 0:
            assert i["realista_anual"] == 0


def test_ca3_2_calculo_reproduzivel(res):
    meses = len(res["us01"]["periodo"])
    for i in res["us03"]["ranking"]:
        comp = item(res, i["id"])
        esperado = max(0, comp["diferenca_rs"]) / meses * 0.8 * 12
        assert i["realista_anual"] == pytest.approx(esperado, abs=0.05)


def test_ca3_3_cenarios_configuraveis(base, res):
    ref = copy.deepcopy(base[0])
    ref["cenarios"]["conservador"] = 0.25
    r = fc.us03(res["us02"]["comparacoes"], len(res["us01"]["periodo"]), ref)
    assert r["totais"]["conservador_anual"] == pytest.approx(
        res["us03"]["totais"]["conservador_anual"] / 2, abs=0.05)


def test_ca3_4_ranking_ordenado_e_totais(res):
    vals = [i["realista_anual"] for i in res["us03"]["ranking"]]
    assert vals == sorted(vals, reverse=True)
    t = res["us03"]["totais"]
    assert t["realista_anual"] == pytest.approx(sum(vals), abs=0.05)


def test_ca3_5_toda_economia_tem_formula_e_fonte(res):
    for i in res["us03"]["ranking"]:
        assert i["formula"] and i["fonte"]


def test_ca3_8_combustivel_nao_soma_duas_vezes(base, res):
    ref, _, _, linhas, _ = base
    cad = cadastro()
    gasto = sum(l["valor"] for l in linhas if l["categoria"] == "combustivel")
    v = fc.por_veiculo(linhas, ref["rendimento_etanol"])
    # preco + troca de combustivel = gasto real - litros equivalentes x melhor preco ANP de cada veiculo
    custo_melhor_preco = sum(d["litros_eq"] * fc.preco_por_km_ideal(cad[p]["combustivel"], ref) for p, d in v.items())
    preco_troca = item(res, "combustivel_preco")["diferenca_rs"] + item(res, "etanol_gasolina")["diferenca_rs"]
    assert preco_troca == pytest.approx(gasto - custo_melhor_preco, abs=0.5)
    # e o consumo so tira litros que sobram: o total nunca passa do gasto real
    soma = preco_troca + item(res, "combustivel_consumo")["diferenca_rs"]
    assert 0 < soma < gasto


def test_ca3_9_toda_economia_tem_acao_recomendada(res):
    for i in res["us03"]["ranking"]:
        assert i["acao"]
        if i["tipo_referencia"] == "frota" and i["realista_anual"] > 0:
            assert i["veiculos"], i["id"]  # diz em quais veiculos agir


def test_ca3_6_simulado_fica_fora_do_total(res):
    o = res["ociosidade_simulada"]
    if o:
        assert o["fora_do_total"] and "simulado" in o["origem"]
        cats = {i["categoria"] for i in res["us03"]["ranking"]}
        assert "ociosidade" not in cats
