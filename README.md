# Fleet Force: Challenge Sem Parar

Calculadora de economia para frotas de empresas, feita pela equipe **FleetForce** (FIAP, 1TIAPR, 2026) para o Challenge da **Sem Parar Empresas**.

A empresa envia a planilha de gastos que já tem. A ferramenta mostra **quanto a frota custa**, **se está gastando bem** e **onde e quanto dá para economizar, em reais**. Para a Sem Parar, é uma porta de entrada que gera contatos já qualificados.

> Este repositório é o ponto de referência do grupo: o que é o projeto, as regras que combinamos, o que já existe e o que ainda falta.

## Comece por aqui

| Quero saber | Abra |
|---|---|
| O que é o projeto e quais são as regras do jogo | [PROJETO.md](PROJETO.md) |
| O que ainda falta fazer e quem faz | [PENDENCIAS.md](PENDENCIAS.md) |
| As três user stories e seus critérios de aceite | [docs/user-stories-sprint-1.md](docs/user-stories-sprint-1.md) |
| Quem são os concorrentes, com fontes | [docs/concorrencia.md](docs/concorrencia.md) |
| Como os testes e os números foram conferidos | [docs/simulados-passo-a-passo.md](docs/simulados-passo-a-passo.md) |
| O que o professor orientou (ata de 19/10) | [docs/referencias/Ata - Orientacao Sprint 1.pdf](docs/referencias/Ata%20-%20Orientacao%20Sprint%201.pdf) |
| O deck do pitch | [deck/Fleet_Force_Pitch_Sprint1_v4.pdf](deck/Fleet_Force_Pitch_Sprint1_v4.pdf) (PPTX ao lado) |
| Logos, cores e fontes oficiais | [identidade-visual/](identidade-visual/) |

## Datas

| Quando | O quê |
|---|---|
| Terça 20/10, 23:55 | Vídeo do pitch da Sprint 1 (CP2 de AI Challenges), 5 minutos, rosto de quem fala visível, link no Teams |
| Quinta 22/10 | Sprint Review ao vivo com a Sem Parar: cerca de 5 min de fala e 10 de perguntas (horário a confirmar) |

O calendário completo das 4 sprints está em [PROJETO.md](PROJETO.md#roadmap).

## Estrutura

```
deck/                pitch da Sprint 1: PPTX, PDF e o script que gera o deck
docs/                user stories, concorrência, conferência dos números e referências (ata, plano V3)
identidade-visual/   logos, design system e tokens oficiais da Fleet Force
prototipo/           caso demonstrativo, cálculo das 3 US, testes, telas e diagrama de componentes
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

**Deck** (Node.js; a fonte Inter precisa estar instalada para o PDF sair certo):

```bash
cd deck
npm install
npm run build                 # grava deck/Fleet_Force_Pitch_Sprint1_v4.pptx
```

Os números e textos do deck vêm de `prototipo/dados/resultados.json`. Se mudar o cálculo, rode o protótipo de novo antes de gerar o deck. O PDF final e as fontes embutidas saem de abrir o PPTX no PowerPoint e exportar.

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
