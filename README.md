# Fleet Force: Challenge Sem Parar

Calculadora de economia para frotas de empresas, feita pela equipe **FleetForce** (FIAP, 1TIAPR, 2026) para o Challenge da **Sem Parar Empresas**.

A empresa envia a planilha de gastos que já tem. A ferramenta mostra **quanto a frota custa**, **se está gastando bem** e **onde e quanto dá para economizar, em reais**. Para a Sem Parar, é uma porta de entrada que gera contatos já qualificados.

> Este repositório é o ponto de referência do grupo: o que é o projeto, as regras que combinamos, o que já existe e o que ainda falta.

## Comece por aqui

| Quero saber | Abra |
|---|---|
| O que é o projeto e quais são as regras do jogo | [PROJETO.md](PROJETO.md) |
| O que falta na Sprint 2, prazos e quem faz | [PENDENCIAS.md](PENDENCIAS.md) |
| As três user stories e seus critérios de aceite (base da Sprint 2) | [docs/user-stories-sprint-1.md](docs/user-stories-sprint-1.md) |
| Quem são os concorrentes, com fontes | [docs/concorrencia.md](docs/concorrencia.md) |
| Como os testes e os números foram conferidos | [docs/simulados-passo-a-passo.md](docs/simulados-passo-a-passo.md) |
| O que o professor orientou (ata de 19/10) | [docs/referencias/Ata - Orientacao Sprint 1.pdf](docs/referencias/Ata%20-%20Orientacao%20Sprint%201.pdf) |
| O deck do pitch da Sprint 1 (v5; o da Sprint 2 ainda não está aqui) | [deck/Fleet_Force_Pitch_Sprint1_v5.pdf](deck/Fleet_Force_Pitch_Sprint1_v5.pdf) (PPTX ao lado) |
| O wireframe navegável da Sprint 2 (7 telas, TASK-04 do Trello) | [prototipo/wireframe/](prototipo/wireframe/LEIA-ME.md) |
| Logos, cores e fontes oficiais | [identidade-visual/](identidade-visual/) |

## Onde estamos

**Sprint 1 (proposta): concluída.** Pitch apresentado na Sprint Review 1 e entregas lançadas no Portal da FIAP.
**Sprint 2 (protótipo e validação técnica): em andamento**, aberta em 03/11/2026.

## Datas da Sprint 2

| Quando | O quê |
|---|---|
| Qui 12/11 | Card TASK-05 do Trello: revisar a proposta de valor e a jornada comercial (Vini) |
| Seg 16/11 | SPIKE-01: avaliação de telemetria *software-first* (João Paulo) |
| Qua 18/11 | TASK-04: wireframe do Fleet Force (Gustavo e Rafa Medici) |
| Sex 20/11 | TASK-03: estruturar a demonstração e a validação da Sprint 2 (Vini) |
| Dom 22/11 | TASK-06: revisar e validar as entregas (todos) |
| **Seg 23/11, 18h** | TASK-07: consolidar e entregar a Sprint 2 (Vini) |
| **Seg 23/11, 20h20** | **Sprint Review 2 com a Corpay (Sem Parar)**, online no Teams: 5 minutos de apresentação (cronometrados, no máximo 5) e 10 de perguntas. Todos prontos desde as 19h |
| **Seg 30/11** | Fim do período de entrega da Sprint 2 no Portal da FIAP (9 entregáveis, um por disciplina; a hora limite não aparece na tela) |

Prazos dos cards conforme o quadro do Trello na última leitura (09/11). A data da Review 2 foi informada pelo professor; o guia da Global Solution cita 3 ou 4/12, então vale reconfirmar com o Godoi. O calendário completo das 4 sprints está em [PROJETO.md](PROJETO.md#roadmap).

## Estrutura

```
deck/                pitch da Sprint 1 (v5): PPTX, PDF e o script que gera o deck
docs/                user stories, concorrência, conferência dos números e referências (ata, plano V3)
identidade-visual/   logos, design system e tokens oficiais da Fleet Force
prototipo/           caso demonstrativo, cálculo das 3 US, testes, telas, diagrama de componentes e o wireframe navegável da Sprint 2 (wireframe/)
wokwi/               kit de sensores simulado (acelerômetro e GPS), firmware em C++
```

## Como rodar

**Protótipo** (só Python 3 e `pytest`; os dados são de demonstração):

```bash
cd prototipo
python gerar_caso_demo.py     # gera os CSVs do caso demonstrativo (seed fixa)
python calcular.py            # US01, US02 e US03: grava dados/resultados.json
python -m pytest -q           # 28 testes, um por critério de aceite
python gerar_telas.py         # telas/fleet-force.html, abre direto no navegador
```

**Wireframe da Sprint 2** (HTML único, não precisa instalar nada; rode da raiz do repositório):

```bash
python -m http.server 4326 --directory prototipo/wireframe
```

Abra http://localhost:4326 (ou o `prototipo/wireframe/index.html` direto no navegador). Setas esquerda e direita trocam de tela; o interruptor "Mostrar critérios de aceite" mostra o texto dos critérios do Trello nas telas 4, 5 e 6. Detalhes em [prototipo/wireframe/LEIA-ME.md](prototipo/wireframe/LEIA-ME.md).

**Deck da Sprint 1** (Node.js; a fonte Inter precisa estar instalada para o PDF sair certo):

```bash
cd deck
npm install
npm run build                 # grava deck/Fleet_Force_Pitch_Sprint1_v5.pptx
```

Os números e textos do deck vêm de `prototipo/dados/resultados.json`. O diagrama de componentes do slide 9 é gerado por `deck/assets-fleet-force/gerar_uml.py` (SVG; depois renderize para PNG, por exemplo com o Edge). Se mudar o cálculo, rode o protótipo de novo antes de gerar o deck. O PDF final e as fontes embutidas saem de abrir o PPTX no PowerPoint e exportar.

## Como trabalhar aqui

- Uma tarefa por vez, em uma branch com nome curto (`ajuste-slide-9`, `ref-ipva`), e um Pull Request pequeno para a `main`. Peça uma olhada de outro integrante antes de juntar.
- Commits em português, dizendo o que mudou e por quê.
- Todo número novo precisa de fonte e data. Dado de demonstração sempre aparece rotulado como tal. Veja as regras em [PROJETO.md](PROJETO.md#regras-do-projeto).
- Nada de senha, chave de API ou dado real de cliente no repositório.
- Quando fechar uma pendência, marque no [PENDENCIAS.md](PENDENCIAS.md) no mesmo Pull Request.

## Equipe

| Integrante | Papel | GitHub |
|---|---|---|
| Gustavo Rezende | a preencher | [guhlrezende](https://github.com/guhlrezende) |
| João Paulo Ventura | a preencher | [Joaopdiasventura](https://github.com/Joaopdiasventura) |
| Ludson Fernandes | Negócios B2B (12 anos em telecom corporativo) | [LudsonFernandes](https://github.com/LudsonFernandes) |
| Rafael Medici | a preencher | [rafamedici](https://github.com/rafamedici) |
| Vini Pereira | a preencher | [ViNiSanPe](https://github.com/ViNiSanPe) |
