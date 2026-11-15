# Wireframe navegável do Fleet Force (Sprint 2)

Entrega do card **TASK-04 · Criar wireframe do Fleet Force** do Trello: 7 telas conectadas, em HTML único (`index.html`), com a identidade do pacote `anexos/assets-fleet-force-v0.0.1/`.

## Como abrir

Duas opções:

```bash
python -m http.server 4326 --directory prototipo/wireframe
```

e abrir http://localhost:4326 (rode da raiz do repositório `fleet-force-challenge`), ou abrir o `index.html` direto no navegador (o logo e tudo mais carregam por caminho relativo em `assets/`).

**Onde editar:** a partir de 09/11/2026 o código do wireframe é versionado no repositório `guhlrezende/fleet-force-challenge`, em `prototipo/wireframe/`. A cópia que existe no Vault Obsidian (`areas/educacao/.../challenge-sem-parar/prototipo/wireframe/`) é só a primeira versão: não editar lá.

- Setas esquerda e direita (ou os botões Voltar e Avançar) trocam de tela.
- O interruptor **Mostrar critérios de aceite** mostra, nas telas 4, 5 e 6, a faixa com o texto do critério do Trello: Consolidação (US01), Comparação por categoria (US02) e Priorização e Total (US03). Também liga por URL: `?crit=1`.

## As 7 telas (as do card do Trello)

1. Início e proposta
2. Cadastro da frota
3. Entrada de dados financeiros (planilha com mapeamento de colunas, ou manual)
4. **Custo consolidado** (critério 1, US01)
5. **Comparação com referências** (critério 2, US02)
6. **Economia potencial** (critério 3, US03)
7. Contato comercial opcional (backlog, US04)

## Dados

Todos os valores vêm da frota fictícia de demonstração da Sprint 1 (`prototipo/dados/resultados.json`, referências 2026-10-12.1, preços ANP de 04 a 10/10/2026). Por isso aparece "Dados de demonstração" em todas as telas. Para atualizar, rodar `python calcular.py` em `prototipo/` e copiar os números para o objeto `D` do `index.html`.

## Arquivos

| Caminho | O que é |
|---|---|
| `index.html` | o wireframe (CSS e JS dentro) |
| `assets/` | logos oficiais do pacote, sem alteração (`logo-wordmark.svg` no cabeçalho) |
| `capturas/` | PNG de cada tela (1280 px), com e sem a faixa do critério |
| `REVISAO-DESIGN.md` | revisão de design, o que foi corrigido e o que está aberto |
