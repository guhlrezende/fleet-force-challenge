# O que ainda falta

Estado em **12/11/2026**, Sprint 2. Marque `[x]` quando fechar e preencha o responsável. Pendências sem dono não andam: escolha um nome.

As [issues](https://github.com/guhlrezende/fleet-force-challenge/issues) #1 a #27 foram criadas na Sprint 1 (milestone "Sprint 1 (Review em 22/10)") e **ainda não foram revisadas**: algumas já foram feitas e outras mudaram. Este arquivo é a lista atual; ao assumir algo, use a issue correspondente ou abra uma nova com o milestone da Sprint 2.

## Prazos que mandam

- **Seg 23/11, 20h20:** Sprint Review 2 com a Corpay (Sem Parar), online no Teams. 5 minutos de apresentação e 10 de perguntas. Todos prontos desde as 19h. Reconfirmar a data com o professor (o guia da Global Solution cita 3 ou 4/12).
- **Seg 23/11, 18h:** card TASK-07 do Trello (consolidar e entregar a Sprint 2), 2h20 antes da Review.
- **Seg 30/11:** fim do período de entrega da Sprint 2 no Portal da FIAP.
- Datas dos outros cards do Trello (última leitura em 09/11): TASK-05 em 12/11, SPIKE-01 em 16/11, TASK-04 em 18/11, TASK-03 em 20/11, TASK-06 em 22/11.

## AI Challenges: protótipo e validação técnica

O enunciado pede wireframes, implementação inicial de **3 critérios de aceite** da Sprint 1, PDF único, Trello atualizado e vídeo de até 5 minutos com todos os integrantes (parte 1 wireframes, parte 2 demonstração técnica dos 3 critérios).

- [ ] **Wireframe navegável (TASK-04, 18/11):** a versão 1 com as 7 telas está no [PR 28](https://github.com/guhlrezende/fleet-force-challenge/pull/28). Falta o grupo aprovar o conteúdo das telas, o Vini conferir contra o design system e anexar as capturas ao card TASK-04 e aos cards US01 a US03. Responsável: Gustavo e Rafa Medici
- [ ] **Aprovar os 3 critérios de aceite.** Proposta (usar o texto dos cards do Trello): US01 "Consolidação" (custo total mensal e anual, divisão por categoria e custo médio por veículo, com a soma conferida contra a planilha); US02 "Comparação por categoria" (custo próprio, referência e diferença em % e em R$); US03 "Priorização" e "Total" (ranking do maior para o menor valor anual e economia total nos dois cenários). Responsável: ___
- [ ] **Resolver o conflito de escopo no Trello:** o quadro põe a implementação na Sprint 3, mas o AIC pede implementação inicial de 3 critérios na Sprint 2. Criar um card (ou ajustar a Etapa 3 das US) para os 3 critérios e para a demonstração técnica do vídeo. Responsável: ___
- [ ] **Preparar o Trello para a avaliação:** mover US01 a US03 de A Fazer para Fazendo ou Feito, marcar as etapas 1 e 2, anexar evidências (capturas do wireframe e dos testes), corrigir os rótulos de Sprint (US02, US03 e TASK-02 ainda estão como "Sprint 1"), pôr o Rafa no card TASK-04, repriorizar US04 a US07 e criar card para o PDF e o vídeo. Combinar com o grupo antes de mexer no quadro. Responsável: ___
- [ ] **PDF único** com nomes e papéis (Scrum Master e Developers), resumo da sprint, US trabalhadas, evidências, wireframes, reflexão técnica e o link completo do Trello e do vídeo, sem mascarar. Responsável: ___
- [ ] **Vídeo de até 5 minutos** (YouTube não listado), todos participam. Responsável: ___

## Sprint Review 2 (23/11)

- [ ] Decidir **quem apresenta** (uma ou duas pessoas) e dividir as falas. Responsável: ___
- [ ] Montar o **roteiro e os slides** da Review 2 (5 minutos: o que mudou desde a Review 1, wireframes, os 3 critérios funcionando, o que é protótipo e o que não é). O deck da Sprint 1 (v5) não serve como está. Responsável: ___
- [ ] **Ensaiar com cronômetro**, preparar as perguntas para a Sem Parar e dividir quem responde cada tipo de pergunta. Responsável: ___
- [ ] Registrar o que a Sem Parar disse na Review 1 (hoje só lembramos: **não usar só telemetria, também outros tipos de dados**; segundo as anotações do grupo, o feedback também mostrou preocupação com **custos**, a confirmar). Responsável: ___

## Decisões do grupo

- [ ] **Referência de preço da ANP para o pitch** (estado e período). Hoje há três: o protótipo usa SP de 04 a 10/10/2026 (gasolina 6,36), o Statistical da Sprint 1 usa a média do Brasil de 18 a 24/10 (gasolina 6,49) e o motor do Jojo usa a mediana de MG do 1º semestre (gasolina 6,34). Qualquer valor em reais precisa dizer estado e período. Se for MG, o caso demonstrativo e os testes do protótipo (hoje em SP) precisam ser ajustados junto. Responsável: ___
- [ ] **Hardware e telemetria:** o SPIKE-01 avalia telemetria *software-first*; há também a ideia de apresentar o hardware como extensão da TAG da Sem Parar. Alinhar com a orientação da ata (sem fio exposto, preferir leitura pela porta OBD) e com o feedback de custo. Em qual Sprint entra o OBD. Responsável: ___
- [ ] **Limites do semáforo** (hoje: até 5% acima da referência é eficiente, até 15% atenção, acima disso crítico) e **percentuais dos cenários** (hoje 50% e 80% da diferença), em `prototipo/dados/referencias.json`. Responsável: ___
- [ ] **Semáforo comercial:** definir o critério de cada cor (verde, amarelo, vermelho) para classificar as oportunidades. Ideia do Rafa. Responsável: ___
- [ ] **US04** (cadastro com CNPJ e consentimento LGPD): em qual Sprint entra. Responsável: ___
- [ ] **Entradas de dados** além da planilha (PDF, foto de nota, dados do veículo) e **locação e depreciação** (tabela FIPE) como categorias novas: em qual Sprint entram? Responsável: ___
- [ ] **Organization do GitHub** para centralizar os repositórios de entrega (proposta do João Paulo, 07/11). Hoje cada entrega fica em um repositório. Responsável: ___
- [ ] **Quem entrega cada disciplina no Portal**, a lista dos 5 RMs e o formato do envio (o Portal só aceita `.zip`, `.rar` e `.7zip`). Responsável: ___

## Dados e referências

- [ ] O **motor de cálculo do João Paulo** ([fleet-force-calculation-engine](https://github.com/Joaopdiasventura/fleet-force-calculation-engine)) usa a tabela do Inmetro, a ANP e a frota real da UFMG 2025. Pedir que o README cite que Inmetro e ANP vêm da Sprint 1 de Statistical. Responsável: ___
- [ ] Combinar a **conexão entre as Sprints**: o que cada disciplina reaproveita da base, do protótipo e das referências (Inmetro, ANP, UFMG). Responsável: ___
- [ ] **IPVA de vans e carros flex:** conferir a alíquota (4% está assumida) no site da Alesp. Caminhão está em 1,5%. Responsável: ___

## Dos 9 entregáveis da Sprint 2 no Portal

Enunciado completo de cada um fica no Portal da FIAP. Marque quando entregue.

- [ ] AI Challenges: wireframes, 3 critérios, PDF, Trello e vídeo (acima)
- [ ] AI Computer Systems & Sensors: coleta periódica com dois cenários, dataset CSV, arquitetura de comunicação atualizada, código do ESP32 com os arquivos do Wokwi e vídeo
- [ ] Cognitive Data Science: consulta de custo por veículo, procedure, função de classificação e view consolidada, em um PDF com capa ABNT
- [ ] Computational Thinking with Python: versão 2 da calculadora com persistência, CRUD, comparação de períodos e README
- [ ] Cognitive Cybersecurity: Security Design Document com plano de resposta a incidentes (o João Paulo já entregou a parte dele no repositório `fleet-force-security`; falta o grupo revisar)
- [ ] Machine Learning & Modelling: notebook de EDA em repositório do GitHub
- [ ] Plataformas, Serviços Cognitivos & Cloud: ETL no AWS Academy (S3, Lambda, RDS, CloudWatch) em vídeo
- [ ] Redes Neurais: MLP para o problema da Sem Parar, em notebook
- [ ] Statistical Computing: gráficos, análises univariadas e relatório técnico

## Próximas Sprints (visão geral)

O detalhe está em [PROJETO.md](PROJETO.md#roadmap).

- [ ] **Sprint 3:** benchmark com fontes completas (incluindo seguro, multas e estacionamento), economia rastreável, relatório do CFO (US05). Pelo quadro do Trello, a implementação funcional das US também fica aqui.
- [ ] **Sprint 4:** fluxo integrado, sem depender das APIs da Sem Parar; testes e eventos do kit.
- [ ] **Ao longo do projeto:** fechar a direção técnica (Python, nuvem, motor de IA) e validar com a Sem Parar a hipótese do funil de aquisição.

## Feito

- [x] Três user stories com valor, funcionalidades e critérios de aceite (30 critérios) validadas na orientação com o professor.
- [x] Protótipo com caso demonstrativo, cálculo das 3 US e 28 testes automáticos.
- [x] Pesquisa de concorrentes com fontes.
- [x] Orientação do professor registrada (ata de 19/10) e aplicada no deck.
- [x] **Sprint 1 concluída:** deck v5 (identidade própria da Fleet Force), vídeo do pitch (CP2 de AI Challenges), Sprint Review 1 realizada e entregas lançadas no Portal.
- [x] Wireframe navegável v1 com as 7 telas do TASK-04 (PR 28, falta aprovação do grupo).
- [x] Parte de Cyber da Sprint 2 entregue pelo João Paulo (08/11), aguardando revisão.
