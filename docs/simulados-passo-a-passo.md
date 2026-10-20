---
title: Simulados do Fleet Force, passo a passo e resultados
aliases: [simulados passo a passo, como foram feitos os simulados, evidencias dos testes]
tags: [fiap, challenge, prototipo, testes]
type: nota
created: 2026-10-19
updated: 2026-10-19
status: seedling
summary: Explica como o caso demonstrativo (frota fictícia de 40 veículos), o cálculo das 3 US, o kit ESP32 simulado e os 28 testes foram feitos, com os resultados rodados em 19/10/2026 e os limites do que foi verificado. Base do PDF para o grupo.
---

# Simulados do Fleet Force: passo a passo e resultados

> Versão para o grupo, 19/10/2026. Todos os números são de **dados de demonstração**: uma frota fictícia gerada por script. Nada aqui é dado real da Sem Parar nem de cliente.

## Resumo

- Os números dos slides (R$ 517 mil por mês de custo, R$ 406 a 650 mil por ano de economia potencial, R$ 957 por mês do kit) saem de uma frota fictícia de 40 veículos, gerada por um script, e de um motor de cálculo em Python.
- **28 testes automáticos passam** (conferido em 19/10/2026). Eles cobrem 27 dos 30 critérios de aceite das 3 US.
- O resultado é reproduzível: rodar o gerador de novo produz arquivos idênticos (semente fixa; conferido comparando o hash dos arquivos).
- Limites: o firmware do ESP32 compila, mas **ainda não foi rodado no simulador Wokwi**; 3 critérios de tela não têm teste automático; a alíquota de IPVA de vans e carros (4%) é assumida e precisa ser conferida.

## 1. O que é o simulado

A Sem Parar não vai fornecer dados reais (informação do prof. Godoi). Por isso o grupo trabalha com um **caso demonstrativo** e com **referências públicas reais, sempre com fonte**.

| Item | Valor |
|---|---|
| Frota | 40 veículos: 16 caminhões, 12 vans e 12 carros flex |
| Período | julho a setembro de 2026 |
| Planilha de despesas | 3.944 linhas, "bagunçada" de propósito (nomes de coluna e de despesa como um ERP traria) |
| Cadastro da frota | 40 linhas: placa, tipo, combustível, ano, valor venal |
| Eventos do kit ESP32 | 132 eventos simulados de um caminhão (placa DEM0C00) |

## 2. Passo a passo

Todos os arquivos estão em `challenge-sem-parar/prototipo/`. Os comandos rodam na pasta `prototipo`.

### Passo 1. Gerar a frota fictícia

```bash
python gerar_caso_demo.py
```

O script usa a semente fixa `2026`, então sempre gera os mesmos arquivos: `dados/frota_demo.csv`, `dados/veiculos_demo.csv` e `dados/eventos_iot_simulado.csv`. Cada tipo de veículo tem um perfil (valores fictícios, em ordem de grandeza de mercado):

| Tipo | Km por mês | Km por litro | Manutenção por km | Pneus por km | Seguro por mês | IPVA |
|---|---|---|---|---|---|---|
| Caminhão (16) | 4.500 a 6.000 | 2,75 a 3,10 | R$ 0,60 | R$ 0,35 | R$ 1.450 | 1,5% |
| Van (12) | 3.000 a 4.200 | 8,0 a 9,0 | R$ 0,22 | R$ 0,09 | R$ 520 | 4% (assumido) |
| Carro flex (12) | 2.200 a 3.200 | 10,5 a 12,0 | R$ 0,12 | R$ 0,04 | R$ 380 | 4% (assumido) |

**Problemas plantados de propósito**, para as US02 e US03 terem o que encontrar:

- combustível pago acima do preço médio da ANP: diesel R$ 8,49 contra R$ 7,32 (cerca de 16% acima), gasolina R$ 6,62 contra R$ 6,36 e etanol R$ 4,02 contra R$ 3,86 (cerca de 4% acima);
- carros flex abastecendo gasolina em 75% das vezes, mesmo quando o etanol compensa;
- cerca de 6% das passagens de pedágio cobradas em duplicidade;
- IPVA pago exatamente na alíquota legal (deve sair "eficiente");
- por tipo, alguns veículos com consumo cerca de 20% pior, manutenção cara ou pneu caro por km: **16 veículos** (7 de consumo, 5 de manutenção e 4 de pneus).

Exemplo das primeiras linhas da planilha gerada:

```text
Data/Hora;Placa;Tipo de despesa;Descricao;Qtd (L);Km;Valor (R$)
01/07/2026 05:20;DEM0C06;Tag pedagio;Praca Campinas;;;41,10
01/07/2026 05:20;DEM1V01;Oficina;Troca de oleo;;;482,24
01/07/2026 06:18;DEM0F06;Abastecimento;Gasolina comum - posto;40,6;394;270,80
```

### Passo 2. Referências públicas com fonte

Ficam em `dados/referencias.json`, junto com os limites do semáforo e os percentuais dos cenários (50% e 80%):

- **ANP**, levantamento semanal de 04 a 10/10/2026, SP: diesel S10 R$ 7,32, gasolina comum R$ 6,36, etanol R$ 3,86;
- **Lei estadual 13.296/2008, art. 9º**: IPVA de caminhões 1,5% (vans e carros flex: 4%, assumido);
- **DOE/Argonne**: veículo pesado parado consome cerca de 0,8 galão por hora (3,03 litros por hora).

### Passo 3. Calcular as 3 US

```bash
python calcular.py
```

O motor (`calcular.py`) faz, nesta ordem:

1. **Importação:** reconhece as colunas e classifica cada linha em uma das 8 categorias. No caso demo, 3.944 de 3.944 linhas foram classificadas.
2. **US01, custo total:** soma por categoria, por veículo, por tipo e por km.
3. **US02, benchmark:** compara combustível com a ANP; consumo, manutenção e pneus com a **mediana dos veículos do mesmo tipo** (mínimo de 5 por grupo; um carro nunca é comparado com um caminhão); marca cada categoria como eficiente, atenção ou crítica.
4. **US03, economia:** economia anual = diferença acima da referência × percentual do cenário (conservador 50%, realista 80%), com o cuidado de não contar duas vezes o preço, a troca de combustível e o consumo.

A saída vai para `dados/resultados.json`.

### Passo 4. Rodar os testes

```bash
python -m pytest -v
```

São 28 testes, escritos a partir dos critérios de aceite do documento das US. Resultado em 19/10/2026: **28 passed in 0.31s**. A lista está na seção 3.

### Passo 5. Simular o kit ESP32

Os 132 eventos do kit (`dados/eventos_iot_simulado.csv`) são gerados pelo mesmo script do Passo 1, no mesmo formato que o firmware imprime. O motor lê esse arquivo, marca os valores como "simulado" e os mantém **fora do total** da economia.

```text
timestamp_min,placa,lat,lon,velocidade_kmh,km,accel_pico_g,duracao_min,rotulo
112,DEM0C00,-23.17943,-46.87987,0,48.5,0.0,13,ocioso
374,DEM0C00,-22.91496,-47.06148,85,162.1,-0.51,0,frenagem_brusca
```

O firmware (`wokwi/src/main.cpp`) usa ESP32, acelerômetro MPU6050 e GPS NEO-6M. Como o Wokwi não tem módulo GPS, ele gera sentenças NMEA de uma rota Campinas a São Paulo e as lê com a biblioteca TinyGPSPlus, a mesma do NEO-6M real. Estado: **compila com PlatformIO e o formato NMEA foi conferido em teste no PC; ainda não foi rodado no simulador do Wokwi**.

### Passo 6. Telas e capturas

```bash
python gerar_telas.py
```

Gera `telas/fleet-force.html` (4 abas: importar, custo total, benchmark e economia), de onde saíram as capturas usadas nos slides.

## 3. Resultados (rodados em 19/10/2026)

### US01, custo total (jul a set/2026)

| Indicador | Valor |
|---|---|
| Custo total no período | R$ 1.550.632,84 |
| Custo médio por mês | R$ 516.877,61 |
| Custo por veículo por mês | R$ 12.921,94 |
| Custo por km | R$ 3,22 |

| Categoria | Valor no período | Peso |
|---|---|---|
| Combustível | R$ 960.525,83 | 61,9% |
| Manutenção | R$ 218.797,19 | 14,1% |
| Pneus | R$ 112.327,78 | 7,2% |
| Seguro | R$ 102.000,00 | 6,6% |
| IPVA/licenciamento | R$ 73.800,24 | 4,8% |
| Pedágio | R$ 63.707,00 | 4,1% |
| Estacionamento | R$ 15.696,57 | 1,0% |
| Multas | R$ 3.778,23 | 0,2% |

Por tipo: caminhão R$ 24.871 por veículo por mês (R$ 4,72 por km); van R$ 6.792 (R$ 1,88 por km); carro R$ 3.120 (R$ 1,15 por km).

### US02, benchmark

| Comparação | Resultado | Detalhe |
|---|---|---|
| Combustível: preço | Crítico, +15,2% (R$ 126.383) | diesel R$ 8,49 x R$ 7,32; gasolina R$ 6,64 x R$ 6,36; etanol R$ 4,01 x R$ 3,86 |
| Flex: etanol x gasolina | Crítico, +15,3% (R$ 5.512) | 6.517 litros de gasolina em carros flex; o etanol custa 61% da gasolina (compensa abaixo de 70%) |
| Combustível: consumo | Crítico, +21,6% (R$ 31.496) | 7 de 40 veículos acima da mediana do seu tipo |
| Manutenção | Crítico, +52,7% (R$ 26.958) | 11 de 40 veículos acima da mediana do seu tipo |
| Pneus | Crítico, +36,7% (R$ 9.022) | 9 de 40 veículos acima da mediana do seu tipo |
| Pedágio | Atenção, +6,2% (R$ 3.724) | 133 passagens cobradas em duplicidade (R$ 63.707 cobrado x R$ 59.984 devido) |
| IPVA/licenciamento | Eficiente, 0% | R$ 73.800 pago = R$ 73.800 pela alíquota |
| Estacionamento, seguro, multas | Sem referência disponível | nunca classificados como eficientes |

### US03, economia potencial por ano

| Alavanca | Conservador (50%) | Realista (80%) |
|---|---|---|
| Combustível: preço | R$ 252.767 | R$ 404.427 |
| Combustível: consumo | R$ 62.992 | R$ 100.787 |
| Manutenção | R$ 53.915 | R$ 86.264 |
| Pneus | R$ 18.044 | R$ 28.870 |
| Flex: etanol x gasolina | R$ 11.023 | R$ 17.637 |
| Pedágio | R$ 7.447 | R$ 11.915 |
| IPVA/licenciamento | R$ 0 | R$ 0 |
| **Total por ano** | **R$ 406.188** | **R$ 649.901** |

### Kit ESP32 simulado (1 caminhão, 1 mês)

| Indicador | Valor |
|---|---|
| Tempo parado com a ignição ligada | 43,2 h |
| Combustível estimado | 130,8 litros (43,2 h x 3,03 l/h) |
| Custo estimado | R$ 957,42 (130,8 litros x R$ 7,32, o diesel da ANP) |
| Eventos de frenagem ou arrancada brusca | 28 em 5.720 km (0,5 por 100 km) |
| Excessos de velocidade | 2 |
| Abastecimento fora da rota | 1 |

Estes valores são **simulados**, não entram no total da economia e só valem com o sinal de ignição ligado ao ESP32 (o GPS sozinho não confirma motor ligado parado).

### Testes automáticos: 28 passaram

| Teste | O que verifica | Resultado |
|---|---|---|
| CA1.1 | Importação reconhece as colunas e as categorias | Passou |
| CA1.2 | Coluna desconhecida é reportada, não descartada | Passou |
| CA1.3 | Total igual à soma da planilha | Passou |
| CA1.4 | Filtro de período | Passou |
| CA1.5 | Percentuais das categorias somam 100% | Passou |
| CA1.6 | Custo por veículo e por km | Passou |
| CA1.6b | Frota mista: quebra por tipo | Passou |
| CA1.7 | Categoria ausente não vira R$ 0,00 | Passou |
| CA1.8 | Recálculo ao alterar um valor | Passou |
| CA2.1 | Toda referência tem fonte | Passou |
| CA2.2 | Combustível comparado com a ANP de cada combustível | Passou |
| CA2.4 | Diferença bate com o cálculo manual | Passou |
| CA2.5 | Limites do semáforo vêm da configuração | Passou |
| CA2.6 | Sem referência nunca aparece como eficiente | Passou |
| CA2.7 | Caso demo tem categoria crítica e eficiente | Passou |
| CA2.8 | Veículos plantados são os piores do seu tipo | Passou |
| CA2.8 | Frota homogênea não gera economia | Passou |
| CA2.9 | Nunca compara tipos diferentes | Passou |
| CA2.10 | Grupo com menos de 5 veículos fica sem referência | Passou |
| CA2.11 | Etanol só quando compensa | Passou |
| CA3.1 | Categoria eficiente tem economia zero | Passou |
| CA3.2 | Cálculo reproduzível | Passou |
| CA3.3 | Cenários configuráveis | Passou |
| CA3.4 | Ranking ordenado e totais | Passou |
| CA3.5 | Toda economia tem fórmula e fonte | Passou |
| CA3.8 | Combustível não é somado duas vezes | Passou |
| CA3.9 | Toda economia tem ação recomendada | Passou |
| CA3.6 | Valores simulados ficam fora do total | Passou |

## 4. Como conferir sozinho

```bash
cd challenge-sem-parar/prototipo
python gerar_caso_demo.py     # regenera os dados (mesmos arquivos, semente fixa)
python calcular.py            # mostra o resumo no terminal e grava resultados.json
python -m pytest -v           # 28 testes
```

## 5. Limites: o que dizer e o que não dizer

- **Dados fictícios.** Os problemas foram plantados de propósito. "Achar os 16 veículos" prova que o motor funciona, não que uma frota real terá os mesmos problemas.
- **Cobertura dos testes.** São 28 testes para 27 dos 30 critérios. Ficaram **sem teste automático** três critérios que dependem da tela: CA1.9 (selos "simulado" e "dados de demonstração"), CA2.3 (trocar o tipo de veículo troca a referência) e CA3.7 (recálculo da economia ao alterar um custo). Não foram conferidos nesta rodada.
- **Wokwi.** O firmware compila e o formato NMEA foi conferido no PC, mas o roteiro do simulador (`wokwi/README.md`) ainda não foi executado. O arquivo `resultados.json` rotula o kit como "ESP32 no Wokwi", porém os eventos vêm do script, não de uma execução do simulador.
- **IPVA.** A alíquota de 4% para vans e carros flex é assumida e precisa ser conferida no texto da lei e no site da Alesp.
- **Preço da ANP.** A referência é da semana de 04 a 10/10, aplicada a despesas de julho a setembro.
- **Categorias sem referência.** Seguro, multas e estacionamento ainda não têm referência (Sprint 3).
- **Mediana do mesmo tipo.** Mostra quem está fora da curva, não se a frota inteira gasta demais.
- **Prazo curto.** Três meses de dados são pouco para manutenção e pneus; no produto, usar 12 meses.
- **Economia é potencial.** É a diferença acima da referência vezes um percentual de cenário, não um resultado medido.
