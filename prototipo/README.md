# Protótipo do Fleet Force (base da Sprint 1 e da Sprint 2)

Caso demonstrativo, cálculo das 3 US, telas, UML e, desde a Sprint 2, o **wireframe navegável** em [`wireframe/`](wireframe/LEIA-ME.md) (7 telas do card TASK-04 do Trello). O que muda da Sprint 1 para a 2 está em [../PROJETO.md](../PROJETO.md#sprint-2-em-andamento). Tudo com **dados de demonstração** (frota fictícia e mista de 40 veículos: 16 caminhões, 12 vans e 12 carros flex, jul a set/2026). As referências (ANP de diesel, gasolina e etanol, lei do IPVA, consumo parado) são reais e com fonte em `dados/referencias.json`.

## Comandos

```bash
python gerar_caso_demo.py     # gera dados/frota_demo.csv, dados/veiculos_demo.csv e dados/eventos_iot_simulado.csv (seed fixa)
python calcular.py            # US01, US02, US03 -> dados/resultados.json e resumo no terminal
python -m pytest -q           # 28 testes, um por critério de aceite (CA1.1 a CA3.9)
python gerar_telas.py         # telas/fleet-force.html (abre direto no navegador, sem servidor)
python -m http.server 4326 --directory wireframe   # wireframe da Sprint 2 em http://localhost:4326
```

### Deck e PDFs (histórico da Sprint 1)

> **O deck atual (v5) é gerado na pasta `deck/` da raiz do repositório** (`cd deck; npm install; npm run build`; ver o [README da raiz](../README.md)). Os comandos abaixo são do deck v2, na identidade antiga da Sem Parar, e ficam só como registro. **Não usar a identidade da Sem Parar**: a visual oficial está em [../identidade-visual/](../identidade-visual/).

```bash
# deck: precisa de pptxgenjs@3.12.0 react-icons@5.3.0 react@18.3.1 react-dom@18.3.1 sharp@0.33.5 numa pasta com npm install
NODE_PATH=<pasta>/node_modules SKILL_DIR=<skill pptx> node deck/build.js    # grava ../anexos/Fleet_Force_Pitch_Sprint1.pptx
# PDFs: md -> html (identidade Sem Parar), depois Edge imprime em PDF
python pdf/md_para_html.py ../user-stories-sprint-1.md us.html
python pdf/md_para_html_pacote.py ../sprint-1-pacote.md pacote.html
msedge --headless --no-pdf-header-footer --virtual-time-budget=6000 --print-to-pdf=../anexos/<nome>.pdf file:///<caminho>/us.html
```

Capturas das telas (usadas no deck): `msedge --headless --hide-scrollbars --virtual-time-budget=6000 --window-size=1280,900 --screenshot=telas/capturas/us01.png "file:///.../telas/fleet-force.html#us01"` (abas: importar, us01, us02, us03). A da US03 usa `fleet-force.html?item=1#us03` para abrir a conta do consumo.

Deck v4 (19/10, identidade Fleet Force): `deck/build-fleet-force.js` gera `../anexos/Fleet_Force_Pitch_Sprint1_v4-identidade-fleet-force.pptx` (use `OUT=` para outro destino). Usa os logos e as telas/UML re-tematizados de `deck/assets-fleet-force/` e a fonte Inter (Regular, SemiBold, Bold). O PowerPoint salva com as fontes embutidas e exporta o PDF, como no v2.

Deck v2 (12/10): mesmo visual da versão no Figma Slides, com fontes Saira Condensed Black, Hanken Grotesk e JetBrains Mono (Google Fonts, instaladas só no PC do Gustavo). Depois de gerar, abrir no PowerPoint e salvar com as fontes embutidas e exportar o PDF (`SaveAs` com `EmbedTrueTypeFonts`), senão quem não tem as fontes vê fonte substituta.

Identidade visual (do site sempararempresas.com.br): magenta `#D60852`, quase preto `#0E0D0D`, texto `#363636`, cartões brancos com cantos de 16px e sombra leve, títulos em caixa alta condensada em duas cores. Fontes: Saira Condensed e Hanken Grotesk (HTML e UML); Arial Narrow e Calibri (pptx, porque a Agenda do site é paga).

## Arquivos

| Caminho | O que é |
|---|---|
| `dados/frota_demo.csv` | Planilha "bagunçada" da frota fictícia (3.944 linhas, separador `;`) |
| `dados/veiculos_demo.csv` | Cadastro rápido da frota: placa, tipo, combustível, ano, valor venal |
| `dados/eventos_iot_simulado.csv` | Exemplo da saída do kit ESP32, mesmo formato do firmware em `../wokwi` |
| `dados/referencias.json` | Benchmarks com fonte, limites do semáforo e percentuais dos cenários |
| `calcular.py` | Motor: mapeamento de colunas, consolidação, benchmark e economia |
| `test_criterios.py` | Critérios de aceite do documento das US, como testes |
| `telas/fleet-force.html` | Protótipo de tela (4 abas: importar, custo total, benchmark, economia) |
| `telas/capturas/*.png` | Capturas 1280x720 usadas no deck |
| `uml/componentes.svg` e `.png` | Diagrama de componentes |
| `wireframe/index.html` | Wireframe navegável da Sprint 2 (7 telas, identidade Fleet Force); capturas, revisão de design e instruções na própria pasta |

## Números do caso demonstrativo

- Custo médio: R$ 516.878 por mês, R$ 12.922 por veículo, R$ 3,22 por km. Por tipo: caminhão R$ 24.871/mês (R$ 4,72/km), van R$ 6.792 (R$ 1,88/km), carro R$ 3.120 (R$ 1,15/km)
- Preço pago x ANP (SP, 04 a 10/10/2026): diesel R$ 8,49 x 7,32 (+16%), gasolina R$ 6,64 x 6,36, etanol R$ 4,01 x 3,86; no total, +15%, crítico
- Carros flex: 6.517 l de gasolina com o etanol a 61% da gasolina (compensa abaixo de 70%)
- Mediana do mesmo tipo (caminhão com caminhão, van com van, carro com carro): 7 veículos com consumo pior, 11 com manutenção cara e 9 com pneu caro por km; os 16 plantados no gerador foram todos encontrados, o resto é "atenção" por variação normal
- Pedágio: 133 passagens cobradas em duplicidade, +6%, atenção. IPVA: eficiente
- Economia potencial: R$ 406 mil (conservador, 50%) a R$ 650 mil (realista, 80%) por ano. Realista: preço do combustível R$ 404 mil, consumo R$ 101 mil, manutenção R$ 86 mil, pneus R$ 29 mil, etanol nos flex R$ 18 mil, pedágio R$ 12 mil
- Kit simulado (1 caminhão): 43,2 h parado com a ignição ligada no mês, R$ 957; 28 eventos bruscos em 5.720 km (0,5 por 100 km)

## Limites (dizer na apresentação)

- Não é o produto: é um protótipo para mostrar as telas e provar que os critérios são verificáveis.
- A referência de preço é da semana de 04 a 10/10 (ANP, SP), e os dados são de jul a set (simplificação do caso demo). O projeto tem outras duas referências de preço da ANP (Brasil de 18 a 24/10 no Statistical e MG do 1º semestre no motor do João Paulo); a escolha do pitch está pendente em [../PENDENCIAS.md](../PENDENCIAS.md), e trocar a referência exige ajustar este caso demo e os testes.
- Seguro, multas e estacionamento ainda não têm referência (Sprint 3). Consumo, manutenção e pneus usam a mediana dos veículos do mesmo tipo (mínimo de 5 por grupo), que mostra quem está fora da curva, não se a frota inteira gasta demais.
- Três meses é pouco para manutenção e pneus, que têm gastos concentrados (troca de jogo de pneus, retífica). No produto, usar 12 meses. No caso demo esses gastos foram gerados proporcionais ao km para a comparação ficar legível.
- As alíquotas do IPVA (caminhão 1,5%; van e carro flex 4%, assumido) precisam ser conferidas no texto consolidado da lei.
- O rendimento do etanol (70% da gasolina) é regra prática; no produto, usar o consumo real de cada carro com cada combustível.
