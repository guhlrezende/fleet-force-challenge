---
title: User Stories da Sprint 1 (US01, US02, US03)
aliases: [us sprint 1, criterios de aceite sprint 1, documento das 3 us]
tags: [fiap, challenge, pitch, scrum]
type: nota
created: 2026-10-11
updated: 2026-10-11
status: seedling
summary: Documento único das 3 user stories da Sprint 1 do Fleet Force (custo total consolidado, benchmark e economia potencial em gráficos), com valor, proposta de funcionalidades e critérios de aceite verificáveis. Junta o pitch de 05/10, os cards do Trello e o Plano Consolidado V3. Desde 11/10 à noite, consumo, manutenção e pneus são comparados com a mediana da própria frota e a US03 lista todas as alavancas de economia. Proposta para o grupo aprovar; responsáveis em aberto.
---

# User Stories da Sprint 1

> **Proposta para o grupo aprovar.** É o que o enunciado do CP2 cobra para cada US: o valor que ela entrega, a proposta de funcionalidades e os critérios de aceite. Fontes: pitch da US1 de 05/10 (`anexos/Pitch US1 – Custo total da frota.pptx`), cards do Trello (cards-trello), `anexos/Fleet_Force_Plano_Consolidado_V3.pdf` e `anexos/Fleet_Force_Roteiro_Sprint1.pdf`. Onde as fontes divergem, a escolha feita aqui está marcada com **(decidir)**.
>
> **Responsáveis: em aberto.** O grupo decide quem fica com cada US e com cada parte (ver a seção "Quem faz o quê" no fim).

## Visão geral

**Promessa (V3):** transformar dados dispersos da frota em economia concreta, em reais e com fonte.

As três US são uma sequência só. Cada uma usa o resultado da anterior:

```text
US01 Custo total  ──►  US02 Benchmark  ──►  US03 Economia potencial
"quanto gasto?"        "gasto bem?"          "onde agir primeiro e quanto ganho?"
```

**Persona:** gestor de frota (na história do pitch, a Naira, gestora de uma frota de 40 veículos (caminhões, vans e carros) que não consegue responder ao diretor quanto a frota custa). CFO e Sem Parar aparecem como desdobramento (US04 lead e US05 relatório, no Backlog).

**Caso demonstrativo (decidir):** todos os critérios abaixo são verificados com o mesmo arquivo de demonstração, uma frota fictícia e mista de 40 veículos (16 caminhões, 12 vans e 12 carros flex) com 3 meses de despesas e o cadastro da frota, escrita "dados de demonstração" em todas as telas. Isso deixa os critérios testáveis antes de existir dado real e resolve o "R$ 487 mil ilustrativo" do pitch antigo: o número do slide passa a sair desse arquivo.

**O que é medido, simulado ou futuro** (pedido do prof. Noris e seção 8 do V3):

| Origem do dado | Na Sprint 1 | Como aparece na tela |
|---|---|---|
| Planilha do cliente (CSV/Excel) | Arquivo de demonstração | "dados de demonstração" |
| Referências públicas (ANP, tarifas de pedágio) | Valores reais com fonte e data | fonte e data ao lado do número |
| ESP32 no Wokwi (acelerômetro MPU6050 e GPS NEO-6M) | Simulado | "simulado" |
| PDF, foto, OBD-II, APIs da Sem Parar | Evolução futura | só no roadmap |

---

## US01: Custo total consolidado

**User story:** Como gestor de frota, quero visualizar o custo total da minha frota de forma consolidada, para entender quanto realmente estou gastando com a operação.

### Valor

- **Para o gestor:** responde em segundos a pergunta "quanto a frota custa?", que hoje exige juntar nota de posto, extrato de pedágio, planilha da oficina e boleto do seguro.
- **Para a Sem Parar:** é a porta de entrada. Sem custo consolidado não existe benchmark nem economia, e pedágio e combustível, que a Sem Parar já atende, aparecem com o peso real na conta do cliente.

### Proposta de funcionalidades

1. **Entrada por planilha (CSV/Excel):** o gestor envia o arquivo que já tem. O sistema reconhece as colunas pelo nome ou sinônimo ("valor abastecido" vira combustível), mostra o mapeamento para confirmação e só pergunta o que não encontrou.
2. **Entrada manual:** formulário com nº de veículos, tipo de veículo e custo por categoria, para quem não tem planilha. Nenhuma categoria é obrigatória.
3. **Painel consolidado:** total do período, divisão por categoria (gráfico de barras ou pizza), custo médio por veículo e, quando houver km, custo por km.
4. **Filtro de período:** mês, trimestre ou ano.
5. **Aviso de dado incompleto:** lista as categorias que ficaram de fora ou foram estimadas.
6. **Cadastro rápido da frota:** placa, tipo (caminhão, van, carro, moto), combustível, ano e valor venal, preenchido uma vez. É o que permite comparar cada veículo só com os do mesmo tipo e usar a alíquota de IPVA e o preço de combustível certos. A US01 mostra o custo também por tipo de veículo.
7. **Dados do hardware (simulado):** o ESP32 no Wokwi, com acelerômetro e GPS, gera eventos de motor ligado parado (ignição ligada e GPS a 0 km/h), frenagem e arrancada bruscas (acelerômetro, contadas por 100 km), excesso de velocidade e posição, em CSV. Na US01 eles só aparecem como linha "eventos registrados (simulado)"; o custo deles entra na US03.

**Categorias (decidido em 11/10): as 8 do Trello.** Combustível, pedágio, estacionamento, manutenção, pneus, seguro, IPVA/licenciamento e multas. As 6 do pitch de 05/10 estão contidas nelas.

### Critérios de aceite

Unificam os 3 do pitch (soma num valor, escolhe o período, mostra o peso de cada categoria) com os 6 do Trello.

- [ ] **CA1.1 Importação:** com o arquivo de demonstração, o sistema reconhece pelo menos combustível, pedágio e manutenção sem ajuste manual e mostra o mapeamento antes de calcular.
- [ ] **CA1.2 Coluna não reconhecida:** se uma coluna não for reconhecida, o sistema pergunta a categoria dela em vez de descartá-la, e nenhuma linha do arquivo some do total sem aviso.
- [ ] **CA1.3 Soma correta:** o custo total exibido é igual à soma das linhas do arquivo, com diferença de R$ 0,00 (conferido contra a soma feita na própria planilha).
- [ ] **CA1.4 Período:** ao trocar o período (mês, trimestre, ano), o total e as categorias mudam para refletir só as despesas daquele intervalo.
- [ ] **CA1.5 Peso de cada categoria:** cada categoria mostra o valor em R$ e o percentual do total, e os percentuais somam 100%.
- [ ] **CA1.6 Custo por veículo:** o painel mostra o custo médio por veículo (total ÷ nº de veículos) e, se houver km no arquivo, o custo por km.
- [ ] **CA1.6b Frota mista:** com o cadastro, o custo aparece também por tipo de veículo, e a soma dos tipos é igual ao total.
- [ ] **CA1.7 Dado incompleto:** categorias sem dado aparecem como "não informado", nunca como R$ 0,00, e o painel diz quantas das 8 categorias foram preenchidas.
- [ ] **CA1.8 Recálculo:** ao corrigir ou acrescentar um valor, o total é atualizado sem recarregar a página.
- [ ] **CA1.9 Origem visível:** todo valor que veio do Wokwi traz o selo "simulado" e todo valor do arquivo de demonstração traz "dados de demonstração".

---

## US02: Comparar com benchmark

**User story:** Como gestor de frota, quero comparar meus custos com um benchmark, para entender se minha operação está eficiente em relação a outras referências.

### Valor

- **Para o gestor:** saber se o custo está alto ou normal. "Gastei R$ 180 mil em combustível" não diz nada sozinho; "paguei 9% acima do preço médio da ANP na minha região" diz onde olhar.
- **Para a Sem Parar:** cada categoria classificada como crítica é uma necessidade identificada e mensurável, que pode virar conversa comercial sem promessa vazia (V3, seção 10).

### Proposta de funcionalidades

1. **Base de referências públicas:** começa com o que tem fonte aberta e atualizada. Combustível pelo preço médio da ANP (por estado e tipo de combustível), IPVA pela alíquota da lei e pedágio pela conferência do extrato (cada passagem cobrada uma vez). As outras categorias entram conforme houver fonte (ex.: planilha de custos do piso mínimo de frete da ANTT, NTC&Logística) **(fontes a levantar)**.
2. **Referência da própria frota, por tipo:** onde não há referência pública boa, cada veículo é comparado com a mediana dos veículos **do mesmo tipo** (caminhão com caminhão, van com van, carro com carro): consumo e custo por km de manutenção e de pneus. No carro flex, o consumo é medido em litros equivalentes de gasolina (1 l de etanol rende cerca de 0,7 l de gasolina). Grupo com menos de 5 veículos fica "sem referência na frota". A tela lista os veículos que passaram do limite, com a placa.
3. **Enquadramento do perfil:** com o tipo de veículo (leve, utilitário, pesado) e o porte da frota, o sistema escolhe a referência adequada.
4. **Tela de comparação:** para cada categoria, o custo do cliente, a referência, a diferença em % e em R$, e a fonte com data.
5. **Semáforo:** eficiente, atenção ou crítico, com limites configuráveis (ex.: até 5% acima = eficiente; 5 a 15% = atenção; acima de 15% = crítico) **(decidir os limites)**.
6. **Evolução futura:** comparar com grupos de frotas parecidas usando os diagnósticos já feitos, quando houver base e autorização (V3).

### Critérios de aceite

- [ ] **CA2.1 Fonte em todo número:** cada valor de referência mostra fonte, data de coleta e versão da base. Nenhuma referência aparece sem origem.
- [ ] **CA2.2 Combustível pela ANP:** cada combustível (diesel, gasolina, etanol) é comparado com o preço médio da ANP do estado, e a data do levantamento aparece na tela.
- [ ] **CA2.3 Enquadramento:** informando tipo e quantidade de veículos, o sistema aplica a referência daquele perfil, e trocar o tipo de veículo troca a referência usada.
- [ ] **CA2.4 Comparação por categoria:** para cada categoria com dado e com referência, a tela mostra custo próprio, referência, diferença em % e diferença em R$, e as contas batem com o cálculo manual.
- [ ] **CA2.5 Classificação:** cada categoria recebe eficiente, atenção ou crítico conforme os limites da configuração, e mudar um limite muda a classificação sem alterar o código.
- [ ] **CA2.6 Sem dado ou sem referência:** a categoria aparece como "sem dado para comparar" ou "sem referência disponível", nunca como eficiente.
- [ ] **CA2.7 Caso demonstrativo:** com o arquivo de demonstração, pelo menos uma categoria aparece como crítica e uma como eficiente (prova que a classificação diferencia os casos).
- [ ] **CA2.8 Referência da própria frota:** consumo e custo por km de manutenção e pneus de cada veículo são comparados com a mediana do seu tipo; os veículos acima do limite aparecem com a placa e a diferença em %. Numa frota em que todos são iguais, nenhum aparece e a economia é zero.
- [ ] **CA2.9 Só compara o mesmo tipo:** um carro nunca é comparado com um caminhão (numa frota com caminhões iguais entre si e carros iguais entre si, ninguém aparece acima).
- [ ] **CA2.10 Grupo pequeno:** tipo com menos de 5 veículos fica "sem referência na frota" e nenhum veículo dele entra na economia.
- [ ] **CA2.11 Etanol x gasolina:** nos carros flex, a troca para o etanol só gera economia quando o etanol custa menos de 70% da gasolina na ANP.

---

## US03: Economia potencial em R$, em gráficos

**User story:** Como gestor de frota, quero visualizar a economia potencial em R$, para conseguir priorizar as ações de maior impacto financeiro.

### Valor

- **Para o gestor:** sai da análise e chega na decisão: onde agir primeiro e quanto isso vale por ano. É o que o roteiro chama de "saber onde agir primeiro, não uma lista de funcionalidades".
- **Para o CFO:** um número em reais, com conta aberta, que dá para levar para a diretoria (base da US05).
- **Para a Sem Parar:** o lead já chega com a dor medida em reais (base da US04).

### Proposta de funcionalidades

1. **Motor de economia:** para cada alavanca acima da referência, economia = (custo do cliente − referência) × percentual do cenário. Alavanca eficiente tem economia zero. No consumo, manutenção e pneus, a conta é feita veículo por veículo, contra a mediana do seu tipo, e só entram os que passaram do limite.
2. **Dois cenários:** conservador (ex.: 50% da diferença) e realista (ex.: 80%), com percentuais configuráveis **(decidir os percentuais)**.
3. **Ranking em gráfico com a ação:** barras horizontais do maior para o menor valor anual em R$ (Pareto), com o total mensal e anual nos dois cenários. Cada barra diz o que fazer e em quais veículos (ex.: "revisar rota, carga e condução de DEM0C01, DEM1V04...").
4. **"Como chegamos neste número":** ao clicar numa barra, aparece a fórmula, os valores usados e a fonte da referência.
5. **Ociosidade (simulado):** a partir dos eventos do ESP32 no Wokwi, custo do motor ligado parado = horas paradas × consumo em litros por hora × preço ANP. Fica numa barra separada com o selo "simulado", fora do total, como demonstração de como o hardware vai alimentar a economia **(decidir se entra no pitch)**.
6. **Proteção contra dado estimado:** categoria estimada aparece como "potencial a confirmar", fora do total, com convite para informar o dado real.
7. **Etanol x gasolina nos carros flex:** com o preço da ANP da semana, mostra quanto a frota economizaria abastecendo os flex com etanol enquanto ele custar menos de 70% da gasolina (na semana de 04 a 10/10/2026, em SP, estava a 61%).
8. **Sem contar duas vezes:** preço do combustível, troca etanol x gasolina e consumo são alavancas separadas. O combustível a mais do consumo é valorizado pelo melhor preço ANP por km (no flex, o mais barato entre gasolina e etanol), porque o preço acima da ANP e a troca já estão nos outros itens.

**Onde dá para economizar (alavancas):** a US03 não é só o combustível. Com a mesma planilha e o cadastro da frota:

| Alavanca | Dado usado | Situação |
|---|---|---|
| Combustível: preço acima da ANP (diesel, gasolina, etanol) | litros, valor, combustível, UF | calculado no caso demo |
| Combustível: consumo contra a mediana do mesmo tipo | litros, km, placa, tipo | calculado no caso demo |
| Carros flex: etanol em vez de gasolina | litros, combustível, preços ANP | calculado no caso demo |
| Manutenção por km contra a mediana | valor, km, placa | calculado no caso demo |
| Pneus por km contra a mediana | valor, km, placa | calculado no caso demo |
| Pedágio cobrado em dobro | extrato da tag | calculado no caso demo |
| IPVA acima da alíquota | valor pago, valor venal | calculado (sai eficiente) |
| Abastecimento suspeito (mais litros que o tanque, dois seguidos sem rodar) | litros, km, data, placa | próximas sprints, mesmos dados |
| Multas por placa e motorista; indicar condutor no prazo | data, placa, infração | próximas sprints |
| Veículo que já compensa trocar | custo por km e ano do veículo (no cadastro) | próximas sprints |
| Motor ligado parado, eventos bruscos por 100 km, excesso de velocidade e abastecimento longe do posto | ESP32 com acelerômetro e GPS | simulado no Wokwi |
| Extratos da tag e do cartão combustível | dados da Sem Parar | depende de parceria |

O gestor só precisa mandar placa, data e valor de cada despesa; no abastecimento, litros e km; e o cadastro rápido da frota.

### Critérios de aceite

- [ ] **CA3.1 Só há economia acima da referência:** categorias eficientes ou abaixo da referência mostram economia de R$ 0,00.
- [ ] **CA3.2 Cálculo reproduzível:** para qualquer categoria, refazer a conta à mão (diferença × percentual do cenário) dá o mesmo valor da tela.
- [ ] **CA3.3 Cenários:** a tela mostra os dois cenários lado a lado, e mudar um percentual na configuração muda o resultado sem alterar o código.
- [ ] **CA3.4 Ranking:** o gráfico ordena as categorias do maior para o menor valor anual, e o total mensal e anual aparece nos dois cenários.
- [ ] **CA3.5 Explicação:** toda barra do gráfico abre a fórmula, os valores e a fonte usados. Nenhum valor de economia aparece sem explicação.
- [ ] **CA3.6 Separação do que não é confirmado:** valores estimados ("potencial a confirmar") e simulados (Wokwi) aparecem separados e não entram no total.
- [ ] **CA3.7 Recálculo:** ao alterar um custo na US01, a economia é recalculada sem recarregar a página.
- [ ] **CA3.8 Sem contar duas vezes:** preço mais troca de combustível é igual ao gasto real menos os litros equivalentes ao melhor preço ANP de cada veículo; somando o consumo, o total nunca passa do gasto real.
- [ ] **CA3.9 Ação recomendada:** toda barra mostra o que fazer e, nas alavancas por veículo, em quais veículos.

---

## Critérios de sucesso (para o slide do pitch)

Diferente dos critérios de aceite, que dizem se a funcionalidade está pronta, estes dizem se a solução gera valor. Juntam a aula de 05/10 e a seção 11 do V3:

| Critério | Como medir | US |
|---|---|---|
| Redução de custo | Economia potencial anual em R$ no caso demonstrativo | US03 |
| Agilidade | Tempo do envio do arquivo até o painel consolidado (meta a definir, ex.: menos de 2 min) | US01 |
| Confiança | % de números na tela com fonte e cálculo reproduzível (meta: 100%) | US02, US03 |
| Qualidade da importação | % de linhas do arquivo classificadas sem ajuste manual | US01 |

## Como cada US aparece no pitch

Cerca de 1 min por US dentro da mesma história (pitch e arquitetura, seção 2):

- **US01:** "A Naira manda a planilha que já tem e vê, em segundos, quanto a frota custou e onde está o peso."
- **US02:** "Agora ela sabe se está gastando bem: o diesel dela está 16% acima do preço médio da ANP, com a fonte na tela, e cada veículo foi comparado com os do mesmo tipo."
- **US03:** "E sabe por onde começar: o gráfico mostra a economia de cada ação em reais, com a conta aberta."
- Os critérios de aceite podem ir num slide por US ou num slide-resumo com 2 ou 3 critérios de cada (o roteiro do Ludson corta primeiro o slide 6 se o tempo apertar).

## Decisões pendentes deste documento

1. Categorias da US01: **decidido em 11/10, ficam as 8 do Trello.**
2. Caso demonstrativo: **decidido em 12/10**, frota mista de 40 veículos (16 caminhões, 12 vans, 12 carros flex), 3 meses, gerada por `prototipo/gerar_caso_demo.py`.
3. Limites do semáforo da US02 e percentuais dos cenários da US03.
4. Se a barra "ociosidade (simulado)" do hardware entra no pitch.
5. Atualizar o Trello com os critérios aprovados, para pitch e quadro dizerem a mesma coisa.

## Quem faz o quê (em aberto)

| Parte | Responsável |
|---|---|
| US01: texto final, critérios e fala do pitch | |
| US02: texto final, critérios, levantamento das fontes (ANP, pedágio) | |
| US03: texto final, critérios, fórmulas e cenários | |
| Arquivo do caso demonstrativo (CSV) | |
| Hardware no Wokwi (eventos simulados) | |
| Atualizar os cards no Trello | |

## Relacionado

Briefing da Sprint 1 · sprint-1-plano-e-cronograma · pitch-e-arquitetura · Status do Challenge · Enunciado do CP2 AIC · Cards do Trello
