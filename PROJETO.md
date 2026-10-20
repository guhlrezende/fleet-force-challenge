# Parâmetros gerais do projeto

Referência única do grupo. Estado em **20/10/2026**. Quando uma decisão mudar, altere aqui no mesmo Pull Request.

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

## Roadmap

| Sprint | Foco | Entrega prevista |
|---|---|---|
| 1 | Proposta | 3 US com critérios, UML, telas e kit simulado |
| 2 | Base funcional | Importação de CSV/Excel, primeiro painel, kit em bancada e leitura pela porta OBD |
| 3 | Valor financeiro | Benchmark com fontes, economia rastreável, relatório do CFO |
| 4 | Integrado | Fluxo ponta a ponta, sem depender das APIs da Sem Parar; testes e eventos do kit |

Depende de parceria com a Sem Parar: piloto com dados autorizados e integrações com a tag e o cartão. A leitura pela porta OBD na Sprint 2 ainda precisa da confirmação de todo o grupo.

## Limites conhecidos

- O caso demonstrativo (40 veículos, jul a set/2026) é fictício. O preço de referência da ANP é de uma semana só (04 a 10/10/2026), aplicado a todo o período.
- Seguro, multas e estacionamento ainda não têm referência (Sprint 3).
- Manutenção e pneus em 3 meses são pouco; no produto, usar 12 meses.
- As alíquotas do IPVA de vans e carros (4%) são assumidas e faltam conferir na legislação paulista.
- O rendimento do etanol (70% da gasolina) é regra prática.
- Os limites do semáforo de eficiência (até 5% acima é eficiente, até 15% atenção) e os cenários de economia (50% e 80% da diferença) são hipóteses do grupo, ainda sem aprovação formal.
