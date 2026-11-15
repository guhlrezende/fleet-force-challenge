# Revisão de design: wireframe do Fleet Force (Sprint 2)

Revisado em 09/11/2026 contra o design system da Fleet Force (`../../identidade-visual/design-system.md`) e o card TASK-04 do Trello (7 telas). Direção estética: funcionalista (estilo Dieter Rams/Swiss): neutros, azul `#0750ED` como único acento, dados como protagonista. A skill `frontend-design` desaconselha a Inter, mas a marca a exige, então a Inter fica.

Referências usadas (web, padrões e não cópia de layout): KPIs de custo por km no topo e detalhe abaixo, tendência no período em vez de só o número ([Oxmaint](https://oxmaint.com/industries/fleet-management/fleet-analytics-dashboard-real-time-kpis-2026), [Geotab](https://geotab.com/blog/fleet-management-kpis)); ranking em estilo Pareto com percentual acumulado ([InetSoft](https://inetsoft.com/info/how-to-make-a-pareto-chart-definition-uses)). O A1 Gallery não foi usado porque exige login.

## Capturas feitas

Em `capturas/` (1280 px de largura, Edge headless). Também testado a 375 px no navegador do app: sem rolagem horizontal em nenhuma das 7 telas.

| Arquivo | O que mostra |
|---|---|
| `01-inicio.png` a `07-contato.png` | as 7 telas, sem as anotações |
| `04-consolidado-com-criterio.png`, `05-comparacao-com-criterio.png`, `06-economia-com-criterio.png` | as 3 telas dos critérios, com a faixa do critério do Trello |

## Corrigido durante a revisão

- Logo cortado e pequeno: o arquivo tem muita margem branca; passou a ser enquadrado na área desenhada, com 144 px de largura, acima do mínimo do manual (140 px).
- A rolagem ficava deslocada 24 px ao carregar: rolagem imediata e `scrollRestoration` manual.
- Barra "Por mês" destacava julho (arbitrário): agora destaca o último mês.
- A origem da referência (pública ou mediana da frota) só aparecia na legenda: virou um selo em cada linha da tabela de comparação.
- Alvo de toque do botão de abrir a conta no ranking: de 32 para 44 px. Selos de 11 px passaram a 12 px.

## Ainda abertos

**Deveria corrigir**
1. A tela 4 não tem filtro de período (mês, trimestre, ano), que a US01 menciona. O Trello só exige total mensal e anual, que a tela tem, mas vale um filtro quando houver dados por categoria e mês.
2. Texto pequeno nos selos de status e legendas (12 px). Atende o mínimo do manual, mas é apertado numa apresentação por vídeo.
3. No celular o cabeçalho ocupa meia tela (logo, selos, interruptor e etapas empilhados). Uma versão compacta ajudaria se o wireframe for mostrado no celular.

**Poderia melhorar**
1. Sem modo escuro (o design system do pacote não define).
2. Sem estado vazio nem de erro nas telas 2 e 3 (arquivo inválido, coluna sem categoria já aparece).
3. O wireframe usa dados de demonstração fixos; não recalcula ao editar (o recálculo é critério da Sprint 3).

## O que funciona bem

- Cada uma das 3 telas dos critérios abre com uma frase de decisão ("91% da economia nas 3 primeiras ações"), os números vêm do protótipo da Sprint 1 e o interruptor "Mostrar critérios de aceite" liga cada tela ao texto exato do card do Trello.
- Status sempre com ícone e texto, nunca só cor.
- Respeita a identidade: azul só no foco, 8 px de ritmo, raios de 12 e 16, cartões com borda e sem sombra pesada.
- Navegação por teclado: setas esquerda e direita trocam de tela, foco visível, rótulos nos campos.
