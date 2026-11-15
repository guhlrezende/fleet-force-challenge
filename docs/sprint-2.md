# Sprint 2: protótipo e validação técnica

Estado em **15/11/2026**. Reúne prazos, entregáveis, os 3 critérios de aceite a implementar, o estado do Trello e as decisões abertas. A lista de tarefas com responsáveis fica em [PENDENCIAS.md](../PENDENCIAS.md), e as regras gerais em [PROJETO.md](../PROJETO.md).

## Prazos

| Quando | O quê |
|---|---|
| Qui 12/11 | TASK-05: revisar a proposta de valor e a jornada comercial (Vini) |
| Seg 16/11 | SPIKE-01: avaliação de telemetria *software-first* (João Paulo) |
| Qua 18/11 | TASK-04: wireframe (Gustavo e Rafa Medici) |
| Sex 20/11 | TASK-03: estruturar a demonstração e a validação da Sprint 2 (Vini) |
| Dom 22/11 | TASK-06: revisar e validar as entregas (todos) |
| **Seg 23/11, 18h** | TASK-07: consolidar e entregar a Sprint 2 (Vini) |
| **Seg 23/11, 20h20** | **Sprint Review 2 com a Corpay (Sem Parar)**, online no Teams: 5 minutos de apresentação (cronometrados) e 10 de perguntas; todos prontos desde as 19h |
| **Seg 30/11** | Fim do período de entrega da Sprint 2 no Portal (a hora limite não aparece) |

Prazos dos cards conforme a última leitura do Trello (09/11). O guia da Global Solution cita a Review com a Sem Parar em 3 ou 4/12; vale reconfirmar com o professor.

## Os 9 entregáveis do Portal

Um por disciplina. O enunciado oficial está no Portal da FIAP.

| Disciplina | O que pede |
|---|---|
| AI Challenges | Wireframes, implementação inicial de **3 critérios de aceite** da Sprint 1, PDF único (papéis, resumo, US, evidências, wireframes, reflexão técnica, link do Trello e do vídeo), Trello atualizado e vídeo de até 5 min com todos os integrantes |
| AI Computer Systems & Sensors | Coleta periódica com dois cenários e verificação de leitura inválida, dataset CSV, arquitetura de comunicação atualizada, código do ESP32 com os arquivos do Wokwi e vídeo |
| Cognitive Data Science | Consulta de custo por veículo, procedure da categoria de maior despesa, função de classificação (ALTO acima de R$ 10.000, MÉDIO de 5.000 a 10.000, BAIXO abaixo de 5.000) e view consolidada, em PDF com capa ABNT |
| Computational Thinking with Python | Versão 2 da calculadora com persistência, CRUD, comparação de períodos, variação percentual e README atualizado |
| Cognitive Cybersecurity | Security Design Document com arquitetura, identidade e acesso, proteção de dados, logs e plano de resposta a pelo menos 3 incidentes |
| Machine Learning & Modelling | Notebook de EDA em repositório do GitHub |
| Plataformas, Serviços Cognitivos & Cloud | ETL no AWS Academy (S3, Lambda, RDS, CloudWatch), em vídeo |
| Redes Neurais | MLP para classificar (eficiente, atenção, crítico) ou estimar o custo do veículo no mês, em notebook |
| Statistical Computing | Gráficos, análises univariadas com separatrizes e relatório técnico, em R ou Python |

Ainda por decidir: **quem entrega cada disciplina**, os 5 RMs e o formato do envio (o Portal só aceita `.zip`, `.rar` e `.7zip`).

## Os 3 critérios de aceite (proposta, a aprovar)

O enunciado de AI Challenges pede 3 critérios definidos na Sprint 1, de uma ou mais US, sem precisar implementar a US inteira. A proposta usa o texto dos cards do Trello, porque o professor confere os cards:

| US | Critério do Trello |
|---|---|
| US01 | **Consolidação:** mostra custo total mensal e anual, divisão por categoria e custo médio por veículo |
| US02 | **Comparação por categoria:** o gestor vê o próprio custo, o de referência e a diferença em % e em R$ |
| US03 | **Priorização** (categorias ordenadas do maior para o menor valor anual em R$) e **Total** (economia total mensal e anual nos dois cenários) |

A numeração CA1.x a CA3.x de [user-stories-sprint-1.md](user-stories-sprint-1.md) é uma versão estendida que o Trello nunca recebeu. No PDF e no vídeo, os critérios devem aparecer com o texto e a ordem do Trello. O protótipo da Sprint 1 (28 testes) sustenta a demonstração técnica.

## O que já existe

- **Wireframe navegável** com as 7 telas do card TASK-04, na identidade da Fleet Force, em [prototipo/wireframe/](../prototipo/wireframe/LEIA-ME.md). Entrou na `main` em 15/11.
- **Protótipo e testes** da Sprint 1 em [prototipo/](../prototipo/README.md).
- **Referências de dados:** Inmetro (PBE Veicular 2026) e ANP, usadas no Statistical da Sprint 1; o motor do João Paulo usa as mesmas fontes mais a frota real da UFMG 2025 (repositório `Joaopdiasventura/fleet-force-calculation-engine`).

## Estado do Trello (leitura de 09/11)

- Em Feito, só o TASK-01 (feedback da Review 1). Em Fazendo, o TASK-02 (matriz de riscos). US01, US02 e US03 seguem em A Fazer, sem etapa marcada, e nenhum card tem anexo.
- **Conflito de escopo:** o quadro põe a implementação funcional na Sprint 3, mas o AI Challenges pede implementação inicial de 3 critérios nesta Sprint. É preciso criar um card ou ajustar as etapas das US.
- Rótulos de Sprint inconsistentes (US02, US03 e TASK-02 ainda como "Sprint 1"), o TASK-04 está só no Gustavo e o backlog (US04 a US07) não foi repriorizado.

## Decisões abertas

- **Referência de preço da ANP do pitch** (estado e período). Há três no projeto: SP de 04 a 10/10 (protótipo), média do Brasil de 18 a 24/10 (Statistical) e mediana de MG do 1º semestre de 2026 (motor do João Paulo). Em MG, na semana de 18 a 24/10, a gasolina foi R$ 6,32, perto dos R$ 6,34 da mediana do semestre; a diferença para os R$ 6,49 vem de ser Brasil contra MG. Trocar a referência exige ajustar o caso demo e os testes do protótipo, que usam SP.
- **Hardware e telemetria:** o SPIKE-01 avalia telemetria sem hardware dedicado; há também a ideia de apresentar o hardware como extensão da TAG da Sem Parar. Precisa conversar com a orientação da ata (sem fio exposto, preferir OBD) e com a preocupação de custos do retorno da Review 1. "A TAG quebra" e "a integração é barata" ainda não têm fonte.
- **Limites do semáforo e percentuais dos cenários** (hoje 5%, 15% e 50%/80%), semáforo comercial, US04 e entradas de dados além da planilha.

## Roteiro da Review 2 (rascunho)

Cinco minutos cronometrados (alvo de 4min50s):

| Tempo | Bloco |
|---|---|
| 0:00 a 0:30 | Abertura e a história da Naira |
| 0:30 a 1:00 | O que mudou desde a Review 1 |
| 1:00 a 2:00 | Wireframe: a jornada em 7 telas |
| 2:00 a 3:40 | Os 3 critérios funcionando (cerca de 30 s cada) |
| 3:40 a 4:15 | O que é protótipo e o que não é |
| 4:15 a 4:50 | Sprint 3 e uma pergunta para a empresa |

O vídeo de AI Challenges (até 5 min, todos falam) segue a ordem: apresentação, wireframes, demonstração técnica dos 3 critérios e limitações. **Quem fala cada parte ainda não foi definido**, e o deck da Review 2 ainda não existe (o `deck/` é o da Sprint 1).
