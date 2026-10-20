# O que ainda falta

Estado em **20/10/2026**. Marque `[x]` quando fechar e preencha o responsável. Pendências sem dono não andam: escolha um nome.

Cada pendência também virou uma [issue](https://github.com/guhlrezende/fleet-force-challenge/issues), com label de prazo e milestone por Sprint. Assuma a sua se atribuindo na issue e marque aqui quando fechar.

## Esta semana (Sprint 1)

### Terça 20/10

- [ ] **Gravar o vídeo do pitch** (CP2 de AI Challenges): 5 minutos, rosto de quem fala visível, slides e rosto ao mesmo tempo, áudio claro. Pode ter uma pessoa só. Responsável: ___
- [ ] Subir no YouTube como **não listado**, abrir o link numa aba anônima para testar e conferir o checklist do enunciado. Responsável: ___
- [ ] **Postar o link no Teams até 23:55** (só um integrante posta) e guardar o print. Responsável: ___

### Quinta 22/10: Sprint Review ao vivo

- [ ] Confirmar o **horário** da Review. Responsável: ___
- [ ] Decidir se apresenta **uma ou duas pessoas** e quem são (A e B). Se for dupla, ensaiar as trocas sem "agora é o próximo slide". Responsável: ___
- [ ] **Ensaiar com cronômetro**: a meta é fechar a fala em 4min50s. Responsável: ___
- [ ] Dividir quem responde cada tipo de pergunta (técnica, negócio, concorrência, dados). Responsável: ___
- [ ] Deixar o deck aberto no slide 1 e o celular gravando o áudio. Responsável: ___

### Deck

- [ ] **Slide 16 (equipe):** foto padronizada (mesmo fundo, roupa de cor parecida), papel, formação e experiência de cada integrante. Hoje só há iniciais e a linha do Ludson. Responsável: cada um
- [ ] Confirmar com o grupo os **critérios de aceite novos do slide 10** (banco de dados, interface, comparação por tipo, motor de IA) e o **OBD na Sprint 2**. Responsável: ___
- [x] Rafa e Ludson revisaram o deck v4 (20/10): UML de componentes, LGPD separada, simulação explícita, motor ligado com ignição ou OBD, concorrência, validação e semáforo comercial já aplicados no v5. Falta eles olharem o v5.

## Decisões do grupo

- [ ] **Limites do semáforo** (hoje: até 5% acima da referência é eficiente, até 15% atenção, acima disso crítico) e **percentuais dos cenários** (hoje 50% e 80% da diferença). Estão em `prototipo/dados/referencias.json`.
- [ ] **Locação e depreciação** (tabela FIPE) entram como categorias novas? Sugestão: Sprint 2 ou depois.
- [ ] **Semáforo comercial:** definir o critério de cada cor (verde, amarelo, vermelho) para classificar as oportunidades. Ideia do Rafa, já citada no slide 12 como "ideia a validar".
- [ ] **Em qual Sprint entra o OBD** (hoje está na Sprint 2, ainda precisa de alinhamento do grupo).
- [ ] **Entradas de dados** além da planilha (PDF, foto de nota, dados do veículo): em qual Sprint entram?
- [ ] Aguardar o material que o professor disse que enviaria ao grupo (encaminhamento da ata).

## Conferências de conteúdo

- [ ] **IPVA de vans e carros flex:** conferir a alíquota (4% está assumida) no site da Alesp. Caminhão está em 1,5%. Responsável: ___
- [ ] Atualizar os cards **US01 a US03 no Trello** com os critérios aprovados. Responsável: ___
- [ ] Revisar o **diagrama técnico** em `prototipo/uml/` (nomes e tecnologias) caso o professor peça um UML formal. Responsável: ___
- [ ] Rodar o firmware do kit no **simulador do Wokwi** (roteiro em `wokwi/README.md`) e guardar um print. Hoje ele só compila. Responsável: ___
- [ ] Pesquisar um **módulo OBD Bluetooth barato** (cerca de R$ 100, pode ser usado) para testes. Encaminhamento da ata. Responsável: ___

## Informação que ainda falta

Itens que apareceram nas conversas do grupo e talvez já tenham resposta; confirme e apague o que não vale mais.

- [ ] Comentários do Vini sobre a viabilidade técnica.
- [ ] Disponibilidade do João Paulo ao longo do semestre.
- [ ] Transcrição da reunião com o professor Godoi (prometida em 28/09).

## Próximas Sprints (visão geral)

O detalhe está em [PROJETO.md](PROJETO.md#roadmap).

- [ ] **Sprint 2:** importação real de CSV/Excel, primeiro painel, kit em bancada, leitura pela porta OBD.
- [ ] **Sprint 3:** benchmark com fontes completas (incluindo seguro, multas e estacionamento), economia rastreável, relatório do CFO (US05).
- [ ] **Sprint 4:** fluxo integrado, sem depender das APIs da Sem Parar; testes e eventos do kit.
- [ ] **Backlog sem Sprint definida:** US04 (cadastro com CNPJ e consentimento LGPD). Decidir em qual Sprint entra.
- [ ] **Ao longo do projeto:** fechar a direção técnica (Python, nuvem, motor de IA) e validar com a Sem Parar a hipótese do funil de aquisição.

## Feito

- [x] Três user stories com valor, funcionalidades e critérios de aceite (30 critérios) validadas na orientação com o professor.
- [x] Protótipo com caso demonstrativo, cálculo das 3 US e 28 testes automáticos.
- [x] Deck v4 na identidade própria da Fleet Force, com falas A/B e tempos nas notas.
- [x] Pesquisa de concorrentes com fontes.
- [x] Orientação do professor registrada (ata de 19/10) e aplicada no deck.
