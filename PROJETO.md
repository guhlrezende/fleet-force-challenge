# Parâmetros gerais do projeto

Referência única do grupo. Estado em **15/11/2026** (Sprint 2). Quando uma decisão mudar, altere aqui no mesmo Pull Request. As seções de **user stories, entrada de dados, hardware e arquitetura** descrevem a proposta da Sprint 1 e ainda não foram reescritas para a Sprint 2; o que mudou nela está em [Sprint 2](#sprint-2-em-andamento).

## Em uma frase

Uma calculadora de economia para frotas: o gestor envia a planilha que já tem e vê quanto gasta, se gasta bem e onde agir primeiro, em reais. Para a Sem Parar Empresas, é uma isca que gera contatos qualificados.

## Contexto

- **Cliente:** Sem Parar Empresas (B2B: tag de pedágio, estacionamento, cartão combustível, manutenção).
- **Problema dela:** captar clientes novos, que hoje vêm de mídia e de listas compradas.
- **O que pediu:** uma calculadora de redução de custos de frota que mostre onde economizar, entregue valor de verdade e funcione como isca. Princípios dados por ela: simples, confiável, flexível e progressiva.
- **Prazo:** entregável funcional em até 8 meses do início do Challenge, em 4 Sprints de até 1 mês. Cada Sprint tem um vídeo do pitch (checkpoint de AI Challenges) e uma Sprint Review ao vivo com a empresa.
- **Dados:** a Sem Parar não vai fornecer dados. Trabalhamos com frota fictícia e referências públicas.
- **Nome:** Fleet Force é o produto; FleetForce é a equipe.

## Proposta de valor

- **Para o gestor de frota:** visibilidade dos custos e das oportunidades de economia, sem instalar nada nem arrumar planilha.
- **Para a Sem Parar:** uma forma de atrair empresas e gerar oportunidades comerciais qualificadas, mediante consentimento. Não é mais um sistema de gestão de frotas, e sim um canal de aquisição e expansão. **Isso é uma hipótese a validar com a empresa, não uma certeza.**
- **Mensagem central:** transformar dados de frotas em economia para o gestor e em oportunidades de negócio para a Sem Parar.
- **Posicionamento:** os concorrentes cuidam de quem já é cliente; nós, de quem ainda não é. No pitch, evitamos afirmações genéricas sobre concorrentes que não conseguimos comprovar.
- **Semáforo comercial (ideia do Rafa, a validar):** classificar as oportunidades em verde, amarelo e vermelho pelos problemas achados no diagnóstico e pelo potencial de oferecer uma solução da Sem Parar. O critério de cada cor ainda precisa ser definido.

## História que usamos no pitch

A Naira gerencia uma frota de 40 veículos (caminhões, vans e carros). O gasto chega espalhado: posto, pedágio, oficina, seguro, IPVA e multas. Quando o diretor pergunta "quanto a frota custa e estamos gastando bem?", ela não sabe responder nem onde cortar. O produto é para frotas em geral, não só caminhão.

## User stories

| US | Pergunta | O que o sistema faz | Quando |
|---|---|---|---|
| US01 Custo total | Quanto eu gasto? | Lê a planilha, soma, separa em 8 categorias e mostra custo por veículo, por tipo e por km | Sprint 1 |
| US02 Benchmark | Estou gastando bem? | Compara com referência pública (ANP, lei do IPVA, extrato de pedágio) e, onde não há, com a mediana dos veículos do mesmo tipo; marca eficiente, atenção ou crítico | Sprint 1 |
| US03 Economia | Onde agir primeiro? | Economia de cada alavanca acima da referência, em dois cenários, ranking em R$ com a ação e os veículos | Sprint 1 |
| US04 Cadastro | Quem é a empresa? | Cadastro com CNPJ só para liberar o diagnóstico; o contato comercial da Sem Parar depende de uma autorização separada (LGPD) | Backlog |
| US05 Relatório do CFO | O que levo ao diretor? | Relatório executivo de uma página, com os 3 maiores custos e as 3 maiores oportunidades | Backlog |

Valor, funcionalidades e os **30 critérios de aceite** das três primeiras estão em [docs/user-stories-sprint-1.md](docs/user-stories-sprint-1.md). O protótipo tem 28 testes automáticos que cobrem 27 desses critérios; os 3 restantes são de tela.

## Entrada de dados

- **Hoje:** planilha CSV ou Excel que o gestor já tem, mais um cadastro rápido da frota (placa, tipo, combustível, ano, valor).
- **Depois:** PDF e foto de nota, dados do veículo (kit de sensores e porta OBD) e, só com parceria, extratos da tag e do cartão da Sem Parar.
- Cada veículo só é comparado com os do mesmo tipo; grupo com menos de 5 veículos fica sem referência.

## Hardware

- **Kit com acelerômetro e GPS**, para qualquer veículo. O acelerômetro mede aceleração (frenagens e arrancadas bruscas, contadas por 100 km); o GPS dá velocidade, km e posição.
- **Motor ligado parado:** GPS e acelerômetro, sozinhos, não sabem se o motor está ligado. Para isso é preciso o sinal de ignição ou a leitura pela porta OBD.
- **Próxima etapa de coleta:** leitura pela porta OBD do veículo, com módulo Bluetooth barato (cerca de R$ 100). Sem sensor no tanque de combustível e sem fio exposto no veículo.
- **Fases futuras citadas na ata:** temperatura e nível de combustível, de preferência via OBD.
- **Hoje é simulação.** Os eventos do kit são gerados por script (`prototipo/gerar_caso_demo.py`); o firmware em `wokwi/` compila, mas ainda não foi rodado no simulador.

## Arquitetura em alto nível

Cinco peças: **interface web**, **servidor com API**, **banco de dados**, **motor de IA** (prevista) e **kit no veículo**. O pitch mostra um diagrama de componentes UML (slide 9, gerado por `deck/assets-fleet-force/gerar_uml.py`) e, em seguida, os critérios de aceite de cada peça (slide 10). O diagrama técnico antigo, com nomes de tecnologia, está em `prototipo/uml/` e é só para uso interno.

Direção, não decisão: Python, nuvem (AWS em estudo) e API em nuvem ou IA local. Os detalhes técnicos serão definidos pelo grupo ao longo do projeto.

**A IA só explica o que já foi calculado** (por que um custo subiu, resumo das anomalias, sugestões a partir de valores existentes). O cálculo, o benchmark e a economia continuam em regras e estatística que dá para auditar, e a IA nunca inventa número.

## Regras do projeto

1. **Todo número tem fonte e data.** Referências públicas: ANP (combustível, SP), lei do IPVA, DOE/Argonne (consumo parado). Sem fonte, o número não entra.
2. **Dado de demonstração aparece rotulado** ("dados de demonstração" ou "simulado"), em slide, tela e documento.
3. **Não apresentar proposta ou simulação como pronto.** Dizer com clareza o que funciona hoje, o que é simulado e o que é próxima fase.
4. **Concorrência:** dizer "não encontramos", nunca "não existe". Não usar números de economia que os concorrentes divulgam: são marketing deles.
5. **No pitch, não cravar tecnologia nem modelo de peça** (orientação do professor). Falar "sensor de X", dar só a pista da direção.
6. **Identidade visual própria da Fleet Force** (azul `#0750ED`, grafite `#2E2D2D`, branco, fonte Inter). Nada de cores, logo ou ilustrações da Sem Parar. Regras completas em [identidade-visual/design-system.md](identidade-visual/design-system.md).
7. **LGPD:** o cadastro que libera o diagnóstico é separado da autorização para a Sem Parar entrar em contato comercial. O diagnóstico não autoriza compartilhar dados nem fazer marketing.
8. **Critérios de aceite verificáveis.** Toda funcionalidade nova vira critério que dê para testar.
9. **A Sprint 1 mostra o que será feito e o raciocínio, não o desenvolvimento.** Os testes ficam como resposta para as perguntas da banca.

## Como o pitch é montado

Estrutura da aula (ponto de partida, não regra fixa): user stories, problema, proposta de valor, UML com critérios de aceite, equipe. Cerca de 5 minutos de fala (o roteiro do deck fecha em 4min50s) e 10 de perguntas. Se forem dois apresentadores, ensaiar as trocas para ficarem naturais, sem "agora é o próximo slide". As falas A e B, com os tempos de cada slide, estão nas notas do PPTX.

## Sprint 2 (em andamento)

Aberta em 03/11/2026, com entrega no Portal até 30/11 e **Sprint Review 2 com a Corpay (Sem Parar) na segunda 23/11, às 20h20**, online no Teams (5 minutos de apresentação e 10 de perguntas). Datas e responsáveis em [PENDENCIAS.md](PENDENCIAS.md).

- **O que o AI Challenges pede:** wireframes das principais telas, implementação inicial de **3 critérios de aceite** da Sprint 1 (de uma ou mais US; não é preciso implementar a US inteira), PDF único, Trello atualizado e vídeo de até 5 minutos com todos os integrantes.
- **Wireframe:** versão 1 navegável com as 7 telas do card TASK-04 em `prototipo/wireframe/` (PR 28, mesclado na `main` em 15/11), na identidade da Fleet Force. Falta a aprovação do grupo sobre o conteúdo das telas. Prazos, entregáveis e decisões abertas em [docs/sprint-2.md](docs/sprint-2.md); resultados da Sprint 1 em [docs/sprint-1-resultados.md](docs/sprint-1-resultados.md).
- **Os 3 critérios:** ainda **não decididos**. A proposta em discussão usa o texto dos cards do Trello: Consolidação (US01), Comparação por categoria (US02) e Priorização com Total (US03). A numeração CA1.x a CA3.x de `docs/user-stories-sprint-1.md` é uma versão estendida que o Trello nunca recebeu; no PDF e no vídeo os critérios devem aparecer com o texto e a ordem do Trello.
- **Conflito de escopo a resolver:** o quadro do Trello diz que a Sprint 2 é concepção e prototipação visual e que a implementação fica para a Sprint 3, enquanto o AIC pede implementação inicial de 3 critérios. O protótipo da Sprint 1 (28 testes) é o que sustenta a demonstração.
- **Retorno da Sem Parar na Review 1:** não usar só telemetria, mas também outros tipos de dados. O SPIKE-01 (telemetria *software-first*) e os dados públicos (Inmetro e ANP) respondem a isso; o feedback também teria mostrado preocupação com custos (a confirmar).
- **Dados que ligam as Sprints:** o Statistical da Sprint 1 usou a PBE Veicular 2026 do Inmetro e a ANP; o motor de cálculo do João Paulo usa as mesmas fontes e acrescenta a frota real da UFMG 2025 (217 veículos), em [fleet-force-calculation-engine](https://github.com/Joaopdiasventura/fleet-force-calculation-engine). Falta decidir a referência de preço da ANP do pitch (ver Limites conhecidos).
- **Dados continuam fictícios ou públicos:** sem dado real de cliente.

## Roadmap

| Sprint | Foco | Entrega prevista | Situação |
|---|---|---|---|
| 1 | Proposta | 3 US com critérios, UML, telas e kit simulado | Concluída (Review 1 realizada, entregas no Portal) |
| 2 | Protótipo e validação técnica | Wireframes, 3 critérios com implementação inicial, telemetria estruturada, dados e persistência (por disciplina) | **Em andamento** (Review 2 em 23/11, Portal até 30/11) |
| 3 | Valor financeiro | Benchmark com fontes, economia rastreável, relatório do CFO; pelo Trello, a implementação funcional das US | A fazer |
| 4 | Integrado | Fluxo ponta a ponta, sem depender das APIs da Sem Parar; testes e eventos do kit | A fazer |

O roadmap original da Sprint 1 previa na Sprint 2 "importação de CSV/Excel, primeiro painel, kit em bancada e leitura pela porta OBD". O foco acima segue o que o Portal pede hoje; **o que entra de fato na Sprint 2 e em qual Sprint entra o OBD ainda precisa da confirmação de todo o grupo.**

Depende de parceria com a Sem Parar: piloto com dados autorizados e integrações com a tag e o cartão.

## Limites conhecidos

- O caso demonstrativo (40 veículos, jul a set/2026) é fictício. O preço de referência da ANP é de uma semana só (04 a 10/10/2026, SP), aplicado a todo o período.
- **Há três referências de preço da ANP no projeto:** SP de 04 a 10/10 (protótipo), média do Brasil de 18 a 24/10 (Statistical da Sprint 1, gasolina R$ 6,49) e mediana de MG do 1º semestre de 2026 (motor do João Paulo, gasolina R$ 6,34). Em MG, na semana de 18 a 24/10, a gasolina foi R$ 6,32, então a diferença entre 6,49 e 6,34 vem de ser Brasil contra MG, não de ser semana contra semestre. Qualquer valor em reais deve dizer o estado e o período.
- Seguro, multas e estacionamento ainda não têm referência (Sprint 3).
- Manutenção e pneus em 3 meses são pouco; no produto, usar 12 meses.
- As alíquotas do IPVA de vans e carros (4%) são assumidas e faltam conferir na legislação paulista.
- O rendimento do etanol (70% da gasolina) é regra prática.
- Os limites do semáforo de eficiência (até 5% acima é eficiente, até 15% atenção) e os cenários de economia (50% e 80% da diferença) são hipóteses do grupo, ainda sem aprovação formal.
