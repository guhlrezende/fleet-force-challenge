"""Gera o diagrama de componentes (UML 2) do slide 9 em SVG, na identidade da Fleet Force.

Uso: python gerar_uml.py   -> uml-componentes.svg (depois renderizar para PNG, por exemplo com o Edge)
Sem nome de tecnologia nem de peça (orientação do professor): só "Python" e "API" como pista.
"""
from pathlib import Path

AZUL, GRAFITE, MUTED, LINHA, FUNDO, AZUL50 = "#0750ED", "#2E2D2D", "#667085", "#98A2B3", "#F6F8FC", "#EEF4FF"
o = []


def add(s):
    o.append(s)


def txt(x, y, t, size=14, weight=400, fill=GRAFITE, anchor="start", italic=False):
    st = ' font-style="italic"' if italic else ""
    add(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{st}>{t}</text>')


def linhas(x, y, ts, size=14, fill=MUTED, dy=18, anchor="start"):
    for i, t in enumerate(ts):
        txt(x, y + i * dy, t, size, 400, fill, anchor)


def icone(x, y, cor=GRAFITE):
    # ícone de componente (UML 2): retângulo com dois encaixes
    add(f'<rect x="{x}" y="{y}" width="20" height="14" rx="2" fill="#fff" stroke="{cor}" stroke-width="1.6"/>')
    add(f'<rect x="{x - 5}" y="{y + 3}" width="9" height="3.5" fill="#fff" stroke="{cor}" stroke-width="1.4"/>')
    add(f'<rect x="{x - 5}" y="{y + 8}" width="9" height="3.5" fill="#fff" stroke="{cor}" stroke-width="1.4"/>')


def caixa(x, y, w, h, estilo="normal", sw=None):
    if estilo == "us":
        add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{AZUL50}" stroke="{AZUL}" stroke-width="{sw or 2.2}"/>')
    elif estilo == "futuro":
        add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{FUNDO}" stroke="{LINHA}" stroke-width="2" stroke-dasharray="7 5"/>')
    elif estilo == "grande":
        add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#fff" stroke="{GRAFITE}" stroke-width="{sw or 3}"/>')
    else:
        add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="#fff" stroke="{GRAFITE}" stroke-width="{sw or 2.2}"/>')


def badge(x, y, t):
    add(f'<rect x="{x}" y="{y}" width="44" height="20" rx="10" fill="{AZUL}"/>')
    txt(x + 22, y + 14.5, t, 12, 700, "#fff", "middle")


def porta(x, y):
    add(f'<rect x="{x - 5}" y="{y - 5}" width="10" height="10" fill="#fff" stroke="{GRAFITE}" stroke-width="1.8"/>')


def bola(x, y, cor=GRAFITE):
    add(f'<circle cx="{x}" cy="{y}" r="7" fill="#fff" stroke="{cor}" stroke-width="1.8"/>')


def meia(x, y, cor=GRAFITE):
    # soquete (interface requerida): arco aberto para a esquerda
    add(f'<path d="M {x + 6} {y - 9} A 9 9 0 0 0 {x + 6} {y + 9}" fill="none" stroke="{cor}" stroke-width="1.8"/>')


def seta(d, tracejada=False, cor=GRAFITE, w=1.8, fim=True):
    da = ' stroke-dasharray="6 5"' if tracejada else ""
    m = ' marker-end="url(#ponta)"' if fim else ""
    add(f'<path d="{d}" fill="none" stroke="{cor}" stroke-width="{w}"{da}{m}/>')


W, H = 1700, 740
add(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 60 {W} {H}" width="{W}" height="{H}" font-family="Inter, Arial, sans-serif">')
add('<defs><marker id="ponta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2E2D2D"/></marker></defs>')
add(f'<rect y="60" width="{W}" height="{H}" fill="#fff"/>')

# ator
add(f'<circle cx="70" cy="410" r="14" fill="#fff" stroke="{GRAFITE}" stroke-width="2"/>')
add(f'<path d="M70 424 V470 M70 438 H44 M70 438 H96 M70 470 L50 505 M70 470 L90 505" stroke="{GRAFITE}" stroke-width="2" fill="none" stroke-linecap="round"/>')
txt(70, 532, "Gestor", 15, 700, GRAFITE, "middle")
txt(70, 550, "de frota", 15, 700, GRAFITE, "middle")

# interface web (x de 120 a 420; folga de 70 px até o servidor para caber o rótulo REST/JSON)
caixa(120, 100, 300, 480, "grande")
icone(382, 112)
txt(142, 134, "«component»", 13, 400, MUTED, italic=True)
txt(142, 160, "Interface Web", 21, 700)
txt(142, 182, "roda no navegador", 14, 400, MUTED)
caixa(142, 200, 256, 170, "us")
badge(156, 214, "US01")
icone(366, 216, AZUL)
txt(156, 262, "Pré-processamento", 18, 700)
linhas(156, 290, ["lê o CSV/Excel aqui;", "envia só as colunas usadas,", "em JSON, e não o arquivo", "inteiro"], 14.5, GRAFITE)
caixa(142, 410, 256, 140, "normal")
icone(366, 424)
txt(156, 452, "Painel", 18, 700)
linhas(156, 480, ["custos, semáforo e", "economia em R$"], 14.5, MUTED)
# ator -> componentes
seta("M 88 432 L 142 285", True)
bola(112, 352, GRAFITE)
txt(104, 328, "planilha", 13, 400, MUTED, "end")
seta("M 96 470 L 142 480", True, fim=False)
bola(120, 476, GRAFITE)
txt(98, 460, "painel", 13, 400, MUTED)
# interface -> servidor (REST/JSON)
add(f'<path d="M 398 285 H 520" stroke="{GRAFITE}" stroke-width="1.8" fill="none"/>')
porta(420, 285)
porta(490, 285)
bola(445, 285)
meia(468, 285)
txt(452, 262, "REST/JSON", 12, 400, MUTED, "middle")
add(f'<path d="M 398 480 H 440 V 285" stroke="{GRAFITE}" stroke-width="1.8" fill="none"/>')

# servidor
caixa(490, 100, 850, 480, "grande")
icone(1304, 112)
txt(512, 134, "«component»", 13, 400, MUTED, italic=True)
txt(512, 160, "Servidor Fleet Force", 21, 700)
txt(740, 160, "Python · API", 15, 400, MUTED)
caixa(515, 210, 130, 105, "normal")
icone(615, 218)
txt(527, 245, "API REST", 17, 700)
linhas(527, 268, ["orquestra as US", "e devolve JSON"], 13.5, MUTED, 17)
us = [("Importação", "US01", ["valida as linhas", "já extraídas"]), ("Consolidação", "US01", ["8 categorias, por", "veículo e por km"]),
      ("Benchmark", "US02", ["ANP, lei do IPVA e", "mediana do tipo"]), ("Economia", "US03", ["cenários 50%/80%,", "conta aberta"])]
xs = [690, 860, 1030, 1200]
for (n, b, d), x in zip(us, xs):
    caixa(x, 200, 140, 125, "us")
    badge(x + 10, 212, b)
    icone(x + 112, 214, AZUL)
    txt(x + 10, 262, n, 16.5, 700)
    linhas(x + 10, 284, d, 13.5, GRAFITE, 17)
# ligações entre US
for i, rot in enumerate(["despesas", "custos", "desvios"]):
    xa = xs[i] + 140
    add(f'<path d="M {xa} 262 H {xa + 30}" stroke="{GRAFITE}" stroke-width="1.8" fill="none"/>')
    bola(xa + 8, 262)
    meia(xa + 17, 262)
    txt(xa + 15, 196, rot, 12.5, 400, MUTED, "middle")
# «use»
seta("M 580 210 V 178 H 1270", True, fim=False)
for cx in [760, 930, 1100, 1270]:
    seta(f"M {cx} 178 V 200", True)
txt(880, 172, "«use»", 13, 400, MUTED, italic=True)
# IA explicativa (futuro)
caixa(515, 395, 150, 110, "futuro")
icone(635, 403, LINHA)
txt(527, 430, "IA explicativa", 16, 700, MUTED)
linhas(527, 452, ["explica números já", "calculados", "(futuro)"], 13.5, MUTED, 17)
seta("M 580 315 V 395", True, cor=LINHA, fim=False)
txt(592, 360, "resultados", 12.5, 400, MUTED)
# Referências
caixa(1030, 395, 140, 110, "normal")
icone(1142, 403)
txt(1042, 430, "Referências", 16, 700)
linhas(1042, 452, ["versionadas,", "com fonte e", "data"], 13.5, MUTED, 17)
add(f'<path d="M 1100 325 V 395" stroke="{GRAFITE}" stroke-width="1.8" fill="none"/>')
bola(1100, 345)
meia(1094, 372)
txt(1112, 362, "referências", 12.5, 400, MUTED)
# Ingestão IoT (futuro)
caixa(1200, 395, 120, 110, "futuro")
icone(1292, 403, LINHA)
txt(1212, 430, "Ingestão", 16, 700, MUTED)
txt(1212, 448, "IoT", 16, 700, MUTED)
linhas(1212, 470, ["eventos do kit", "(Sprint 2+)"], 13.5, MUTED, 17)
seta("M 1270 325 V 395", True, cor=LINHA, fim=False)
txt(1282, 362, "eventos", 12.5, 400, MUTED)

# banco de dados
caixa(790, 650, 320, 100, "normal")
icone(1074, 660)
txt(805, 684, "«component»", 12.5, 400, MUTED, italic=True)
txt(805, 708, "Banco de dados", 18, 700)
linhas(805, 730, ["na nuvem: despesas, referências e diagnósticos"], 13.5, MUTED, 17)
add(f'<path d="M 950 580 V 650" stroke="{GRAFITE}" stroke-width="1.8" fill="none"/>')
porta(950, 580)
bola(950, 606)
meia(944, 630)
txt(964, 618, "persistência", 12.5, 400, MUTED)

# kit no veículo (futuro) e fontes públicas
caixa(1385, 130, 295, 200, "futuro")
icone(1646, 142, LINHA)
txt(1402, 164, "Sprint 2+ · no veículo", 13, 400, MUTED, italic=True)
txt(1402, 192, "Kit no veículo", 19, 700, MUTED)
linhas(1402, 218, ["acelerômetro + GPS", "sinal de ignição ou", "porta OBD, depois"], 14.5, MUTED, 19)
add(f'<path d="M 1340 450 H 1362 V 240 H 1385" stroke="{LINHA}" stroke-width="1.8" fill="none" stroke-dasharray="6 5"/>')
porta(1340, 450)
bola(1356, 450, LINHA)
txt(1372, 400, "dados do kit", 12.5, 400, MUTED)
caixa(1385, 440, 295, 130, "normal")
icone(1646, 452)
txt(1402, 474, "«externo»", 13, 400, MUTED, italic=True)
txt(1402, 500, "Fontes públicas", 19, 700)
linhas(1402, 526, ["ANP (semanal), lei do IPVA", "de SP e pedágio"], 14.5, MUTED, 19)
add(f'<path d="M 1100 505 V 545 H 1385" stroke="{GRAFITE}" stroke-width="1.8" fill="none"/>')
porta(1340, 545)
meia(1364, 545)
txt(1256, 535, "HTTPS", 12.5, 400, MUTED)

# como ler
txt(150, 650, "COMO LER", 14, 700, AZUL)
add(f'<path d="M 150 683 H 176" stroke="{GRAFITE}" stroke-width="1.8"/>')
bola(182, 683)
txt(204, 688, "interface fornecida", 14, 400, GRAFITE)
meia(172, 713)
add(f'<path d="M 150 713 H 178" stroke="{GRAFITE}" stroke-width="1.8"/>')
txt(204, 718, "interface requerida", 14, 400, GRAFITE)
bola(166, 743)
meia(170, 743)
txt(204, 748, "ligação entre componentes", 14, 400, GRAFITE)
porta(163, 773)
txt(204, 778, "porta de conexão", 14, 400, GRAFITE)
seta("M 440 683 H 480", True)
txt(494, 688, "«use»: depende de", 14, 400, GRAFITE)
add(f'<rect x="440" y="703" width="38" height="20" rx="4" fill="{AZUL50}" stroke="{AZUL}" stroke-width="2"/>')
txt(494, 718, "núcleo da Sprint 1", 14, 400, GRAFITE)
add(f'<rect x="440" y="733" width="38" height="20" rx="4" fill="{FUNDO}" stroke="{LINHA}" stroke-width="2" stroke-dasharray="5 3"/>')
txt(494, 748, "evolução (Sprint 2+ ou futuro)", 14, 400, GRAFITE)

# nota
add(f'<rect x="1130" y="640" width="550" height="140" rx="6" fill="{FUNDO}"/>')
add(f'<rect x="1130" y="640" width="5" height="140" fill="{AZUL}"/>')
txt(1152, 668, "PRÓXIMAS US VIRAM COMPONENTES DA MESMA API", 13.5, 700, AZUL)
linhas(1152, 694, ["US04 (cadastro e autorização de contato, LGPD) e US05", "(relatório do CFO) se ligam à API REST sem mudar o", "núcleo. APIs da Sem Parar (tag, cartão) só com parceria;", "ignição e OBD entram depois do kit básico."], 14.5, GRAFITE, 20)
add("</svg>")

Path(__file__).with_name("uml-componentes.svg").write_text("\n".join(o), encoding="utf-8")
print("uml-componentes.svg gerado")
