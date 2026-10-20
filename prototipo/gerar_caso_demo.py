"""Gera o caso demonstrativo do Fleet Force (dados FICTICIOS).

Frota mista de 40 veiculos, jul a set/2026: 16 caminhoes e 12 vans a diesel S10
e 12 carros flex (gasolina ou etanol). Duas saidas:
- dados/frota_demo.csv: a planilha de despesas "baguncada", com nomes de coluna e
  de despesa do jeito que um ERP ou extrato traria, para a US01 ter o que mapear;
- dados/veiculos_demo.csv: o cadastro rapido da frota (placa, tipo, combustivel,
  ano, valor venal), que o gestor preenche uma vez.

Problemas plantados de proposito (para a US02 e a US03 terem o que achar):
- combustivel pago acima do preco medio ANP de SP (diesel ~16%, gasolina e etanol ~4%);
- carros flex abastecendo gasolina 75% das vezes, com o etanol compensando;
- ~6% de passagens de pedagio cobradas em duplicidade;
- IPVA pago exatamente na aliquota legal (deve sair "eficiente");
- por tipo de veiculo, alguns com consumo ~20% pior, manutencao cara e pneu caro
  por km (ver perfis()).

Uso: python gerar_caso_demo.py   (sempre gera os mesmos arquivos: seed fixa)
"""
import csv
import random
from datetime import datetime
from pathlib import Path

SEED = 2026
MESES = [(2026, 7), (2026, 8), (2026, 9)]
DIAS_NO_MES = {7: 31, 8: 31, 9: 30}

# Perfil de cada tipo de veiculo (valores ficticios, ordem de grandeza de mercado)
TIPOS = {
    "caminhao": {"n": 16, "letra": "C", "combustivel": "diesel_s10", "km_mes": (4_500, 6_000), "km_l": (2.75, 3.10),
                 "abast_mes": 8, "cpk_manut": 0.60, "cpk_pneus": 0.35, "seguro": 1_450.0, "valor_venal": 520_000.0,
                 "aliquota_ipva": 0.015, "pedagios_mes": 30, "mult_tarifa": 3.0, "estac_mes": (0, 2), "p_multa": 0.12,
                 "pneu_desc": "Recapagem e reposicao 295/80R22.5", "ano": (2016, 2022)},
    "van": {"n": 12, "letra": "V", "combustivel": "diesel_s10", "km_mes": (3_000, 4_200), "km_l": (8.0, 9.0),
            "abast_mes": 6, "cpk_manut": 0.22, "cpk_pneus": 0.09, "seguro": 520.0, "valor_venal": 260_000.0,
            "aliquota_ipva": 0.04, "pedagios_mes": 12, "mult_tarifa": 1.0, "estac_mes": (1, 4), "p_multa": 0.18,
            "pneu_desc": "Pneus 225/65R16C", "ano": (2018, 2024)},
    "carro": {"n": 12, "letra": "F", "combustivel": "flex", "km_mes": (2_200, 3_200), "km_l": (10.5, 12.0),
              "abast_mes": 6, "cpk_manut": 0.12, "cpk_pneus": 0.04, "seguro": 380.0, "valor_venal": 95_000.0,
              "aliquota_ipva": 0.04, "pedagios_mes": 8, "mult_tarifa": 1.0, "estac_mes": (2, 6), "p_multa": 0.25,
              "pneu_desc": "Pneus 185/65R15", "ano": (2019, 2024)},
}
NOMES_TIPO = {"caminhao": "Caminhão", "van": "Van/utilitário", "carro": "Carro flex"}

# Preco medio pago pela frota (ANP SP 04 a 10/10/2026: diesel S10 7,32; gasolina 6,36; etanol 3,86)
PRECO_PAGO = {"diesel_s10": (8.49, 0.22), "gasolina": (6.62, 0.15), "etanol": (4.02, 0.12)}
DESC_COMBUSTIVEL = {"diesel_s10": "Diesel S10 - posto", "gasolina": "Gasolina comum - posto", "etanol": "Etanol hidratado - posto"}
P_GASOLINA_FLEX = 0.75        # carros flex abastecendo gasolina mesmo com o etanol compensando
RENDIMENTO_ETANOL = 0.70      # km/l com etanol ~ 70% do km/l com gasolina
DUPLICIDADE_PEDAGIO = 0.06
MULTAS = [130.16, 195.23, 293.47]  # media, grave, gravissima (CTB)
PRACAS = [("Praca Campinas", 13.70), ("Praca Jundiai", 11.20), ("Praca Limeira", 12.90), ("Praca Itupeva", 9.90)]

DADOS = Path(__file__).parent / "dados"
OUT = DADOS / "frota_demo.csv"
CADASTRO = DADOS / "veiculos_demo.csv"
COLUNAS = ["Data/Hora", "Placa", "Tipo de despesa", "Descricao", "Qtd (L)", "Km", "Valor (R$)"]


def placas_por_tipo():
    return {t: [f"DEM{i // 10}{p['letra']}{i % 10:02d}" for i in range(p["n"])] for t, p in TIPOS.items()}


def placas():
    return [pl for lista in placas_por_tipo().values() for pl in lista]


def perfis():
    """Veiculos com problema plantado, por tipo (sorteio separado, sempre o mesmo)."""
    rnd = random.Random(SEED + 7)
    qtd = {"caminhao": (3, 2, 2), "van": (2, 2, 1), "carro": (2, 1, 1)}
    out = {"consumo_ruim": set(), "manutencao_alta": set(), "pneus_alto": set()}
    for tipo, lista in placas_por_tipo().items():
        resto = list(lista)
        for chave, n in zip(out, qtd[tipo]):
            escolhidos = set(rnd.sample(resto, n))
            out[chave] |= escolhidos
            resto = [p for p in resto if p not in escolhidos]
    return out


def quando(rnd, ano, mes):
    dia = rnd.randint(1, DIAS_NO_MES[mes])
    return datetime(ano, mes, dia, rnd.randint(5, 21), rnd.randint(0, 59))


def gerar():
    rnd = random.Random(SEED)
    linhas, cadastro = [], []
    pf = perfis()
    for tipo, lista in placas_por_tipo().items():
        t = TIPOS[tipo]
        for placa in lista:
            cadastro.append([placa, NOMES_TIPO[tipo], "Flex" if t["combustivel"] == "flex" else "Diesel S10",
                             rnd.randint(*t["ano"]), f"{t['valor_venal']:.2f}".replace(".", ",")])
            km_l = rnd.uniform(*t["km_l"])          # para flex: km/l com gasolina
            if placa in pf["consumo_ruim"]:
                km_l *= 0.80
            f_manut = 2.0 if placa in pf["manutencao_alta"] else 1.0
            f_pneus = 1.8 if placa in pf["pneus_alto"] else 1.0
            for ano, mes in MESES:
                km_mes = rnd.uniform(*t["km_mes"])
                n_ab = t["abast_mes"]
                for _ in range(n_ab):
                    km = round(km_mes / n_ab)
                    if t["combustivel"] == "flex":
                        comb = "gasolina" if rnd.random() < P_GASOLINA_FLEX else "etanol"
                    else:
                        comb = t["combustivel"]
                    rend = km_l * (RENDIMENTO_ETANOL if comb == "etanol" else 1.0)
                    litros = round(km / rend * rnd.uniform(0.9, 1.1), 1)
                    preco = round(rnd.gauss(*PRECO_PAGO[comb]), 2)
                    linhas.append([quando(rnd, ano, mes), placa, "Abastecimento", DESC_COMBUSTIVEL[comb],
                                   litros, km, round(litros * preco, 2)])
                for _ in range(t["pedagios_mes"]):
                    praca, tarifa = rnd.choice(PRACAS)
                    linha = [quando(rnd, ano, mes), placa, "Tag pedagio", praca, "", "", round(tarifa * t["mult_tarifa"], 2)]
                    linhas.append(linha)
                    if rnd.random() < DUPLICIDADE_PEDAGIO:
                        linhas.append(list(linha))
                manut_mes = km_mes * t["cpk_manut"] * f_manut * rnd.uniform(0.85, 1.15)
                n_os = rnd.choice([1, 1, 2])
                for _ in range(n_os):
                    linhas.append([quando(rnd, ano, mes), placa, "Oficina",
                                   rnd.choice(["Revisao preventiva", "Troca de oleo", "Freios", "Suspensao"]),
                                   "", "", round(manut_mes / n_os, 2)])
                linhas.append([quando(rnd, ano, mes), placa, "Pneus", t["pneu_desc"], "", "",
                               round(km_mes * t["cpk_pneus"] * f_pneus * rnd.uniform(0.8, 1.2), 2)])
                linhas.append([datetime(ano, mes, 5, 9, 0), placa, "Seguro frota", "Parcela mensal", "", "", t["seguro"]])
                linhas.append([datetime(ano, mes, 10, 9, 0), placa, "IPVA/Licenc.", "Rateio mensal IPVA 2026", "", "",
                               round(t["valor_venal"] * t["aliquota_ipva"] / 12, 2)])
                if rnd.random() < t["p_multa"]:
                    linhas.append([quando(rnd, ano, mes), placa, "Infracao", "Multa de transito", "", "", rnd.choice(MULTAS)])
                for _ in range(rnd.randint(*t["estac_mes"])):
                    linhas.append([quando(rnd, ano, mes), placa, "Estac.", "Estacionamento", "", "",
                                   round(rnd.uniform(25, 80), 2)])
    linhas.sort(key=lambda l: (l[0], l[1]))
    DADOS.mkdir(exist_ok=True)
    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(COLUNAS)
        for l in linhas:
            l = list(l)
            l[0] = l[0].strftime("%d/%m/%Y %H:%M")
            l[6] = f"{l[6]:.2f}".replace(".", ",")
            if l[4] != "":
                l[4] = f"{l[4]:.1f}".replace(".", ",")
            w.writerow(l)
    with CADASTRO.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["Placa", "Tipo", "Combustivel", "Ano", "Valor venal (R$)"])
        w.writerows(cadastro)
    print(f"{len(linhas)} linhas -> {OUT}")
    print(f"{len(cadastro)} veiculos -> {CADASTRO}")


# Trecho Campinas-Jundiai-Sao Paulo (pontos aproximados da rota do caso demo)
ROTA = [(-22.905, -47.061), (-23.012, -46.989), (-23.186, -46.884), (-23.322, -46.799), (-23.531, -46.705)]
LIMIAR_FRENAGEM_G = -0.40   # mesmo limiar do firmware em ../wokwi
LIMIAR_ARRANCADA_G = 0.30
PLACA_KIT = "DEM0C00"       # caminhao com o kit
KM_POR_DIA_UTIL = 260


def gerar_eventos_iot():
    """Exemplo de saida do kit ESP32 com acelerometro (MPU6050) e GPS (NEO-6M).

    Mesmo formato CSV do firmware em ../wokwi. Um caminhao, 22 dias uteis de
    setembro. SIMULADO: mostra como o hardware alimenta a US03, nao e medicao real.
    - ocioso: ignicao ligada e GPS a 0 km/h;
    - frenagem_brusca / arrancada_brusca: pico do acelerometro alem do limiar;
    - excesso_velocidade: acima do limite do tipo de veiculo;
    - abastecimento_fora_da_rota: a planilha registra abastecimento, mas o GPS
      mostra o caminhao longe do posto naquele horario.
    A coluna km e a quilometragem acumulada pelo GPS.
    """
    rnd = random.Random(SEED + 1)
    rnd2 = random.Random(SEED + 2)
    out = DADOS / "eventos_iot_simulado.csv"
    linhas = []
    dias = [d for d in range(1, 31) if datetime(2026, 9, d).weekday() < 5]

    def ponto():
        lat, lon = rnd2.choice(ROTA)
        return round(lat + rnd2.uniform(-0.01, 0.01), 5), round(lon + rnd2.uniform(-0.01, 0.01), 5)

    def km_em(i, t):  # km acumulado: dias anteriores + fração do dia
        return round(i * KM_POR_DIA_UTIL + min(1.0, (t - i * 24 * 60) / 600) * KM_POR_DIA_UTIL, 1)

    for i, dia in enumerate(dias):
        t0 = i * 24 * 60
        for _ in range(rnd.randint(3, 6)):
            t0 += rnd.randint(40, 150)
            dur = rnd.randint(8, 40)
            rnd.randint(650, 900)
            rnd.uniform(0.2, 0.6)  # mantem a sequencia do sorteio das versoes anteriores
            lat, lon = ponto()
            linhas.append([t0 + dur, PLACA_KIT, lat, lon, 0, km_em(i, t0 + dur), 0.0, dur, "ocioso"])
        for _ in range(rnd2.randint(0, 3)):
            lat, lon = ponto()
            t = t0 + rnd2.randint(5, 300)
            if rnd2.random() < 0.6:
                linhas.append([t, PLACA_KIT, lat, lon, rnd2.randint(55, 85), km_em(i, t),
                               round(rnd2.uniform(-0.70, -0.42), 2), 0, "frenagem_brusca"])
            else:
                linhas.append([t, PLACA_KIT, lat, lon, rnd2.randint(5, 30), km_em(i, t),
                               round(rnd2.uniform(0.32, 0.48), 2), 0, "arrancada_brusca"])
        if dia in (8, 22):  # trechos acima de 90 km/h
            t = t0 + 200
            lat, lon = ponto()
            linhas.append([t, PLACA_KIT, lat, lon, 97, km_em(i, t), 0.0, 6, "excesso_velocidade"])
        if dia == 17:  # abastecimento lancado num posto a 60 km de onde o GPS mostra o caminhao
            linhas.append([t0 + 600, PLACA_KIT, -23.531, -46.705, 0, km_em(i, t0 + 600), 0.0, 0, "abastecimento_fora_da_rota"])
    linhas.sort(key=lambda l: l[0])
    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["timestamp_min", "placa", "lat", "lon", "velocidade_kmh", "km", "accel_pico_g", "duracao_min", "rotulo"])
        w.writerows(linhas)
    print(f"{len(linhas)} eventos simulados -> {out}")


if __name__ == "__main__":
    gerar()
    gerar_eventos_iot()
