// Deck do pitch da Sprint 1 (Fleet Force), v4: identidade própria da Fleet Force (assets v0.0.1, 19/10/2026).
// Mesmo conteúdo, ordem e roteiro do v3 (build.js, identidade da Sem Parar). Muda só o visual:
// azul #0750ED, grafite #2E2D2D, branco; Inter; logos oficiais; telas e UML re-tematizados (assets-fleet-force/).
// Regras seguidas (design-system.md): tela branca/neutra, azul escasso, <=2 cores de ênfase por slide, 16:9,
// sem gradiente (pedido do Gustavo, 20/10), logo só sobre branco (em slide escuro vai num cartão branco), nada de copiar a Sem Parar.
// Coordenadas em px de um slide 1920x1080.
// Uso: cd deck && npm install && npm run build   (SKILL_DIR é opcional)
// Fonte: Inter (Regular, SemiBold e Bold) precisa estar instalada ou carregada na sessão para exportar o PDF.
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const lu = require("react-icons/lu");
const fs = require("fs");
// applyTheme só ajusta o tema (fontes e cores) dentro do .pptx; é opcional e vem de uma skill do Claude
const applyTheme = process.env.SKILL_DIR ? require(process.env.SKILL_DIR + "/scripts/apply_theme.js").applyTheme : null;
const path = require("path");

const CH = path.resolve(__dirname, ".."); // raiz do repositório
const AS = CH + "/deck/assets-fleet-force";
const OUT = process.env.OUT || CH + "/deck/Fleet_Force_Pitch_Sprint1_v5.pptx";
const R = JSON.parse(fs.readFileSync(CH + "/prototipo/dados/resultados.json", "utf8"));

const THEME = {
  name: "Fleet Force",
  headFontFace: "Inter",
  bodyFontFace: "Inter",
  colors: {
    dk1: "2E2D2D", lt1: "FFFFFF", dk2: "344054", lt2: "F6F8FC",
    accent1: "0750ED", accent2: "168A53", accent3: "C9362B", accent4: "EEF4FF",
    accent5: "667085", accent6: "C97A00", hlink: "0750ED", folHlink: "667085",
  },
};
const K = {
  ink: "2E2D2D", dark: "1D1C1C", panel: "2E2D2D", blue: "0750ED", blue4: "4F82FF", blue3: "85ABFF", blue50: "EEF4FF", blue100: "D9E6FF",
  paper: "F6F8FC", white: "FFFFFF", text: "344054", muted: "667085", soft: "B8C0CC", line: "D8DEE9", line2: "E7EAF0", n100: "EEF1F6",
  green: "168A53", amber: "C97A00", red: "C9362B", gray: "98A2B3",
};
const DISP = "Inter", BODY = "Inter", BODYS = "Inter SemiBold";
// SemiBold é família própria: negrito nela viraria negrito falso
const semNegrito = (f) => f === BODYS;
const px = (v) => v / 192;
const pt = (v) => v * 0.375;
const brl = (v) => "R$ " + Math.round(v).toLocaleString("pt-BR");
const milhar = (v) => "R$ " + Math.round(v / 1000).toLocaleString("pt-BR") + " mil";
const mi = (v) => "R$ " + (v / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + " mi";
const grandeza = (v) => (v >= 1e6 ? mi(v) : milhar(v)); // R$ 650 mil, R$ 1,31 mi

async function iconPng(Comp, color, sw = 2) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: "512", strokeWidth: sw }));
  return "image/png;base64," + (await sharp(Buffer.from(svg)).png().toBuffer()).toString("base64");
}
async function crop(file, h) {
  const buf = await sharp(file).extract({ left: 0, top: 0, width: 1280, height: h }).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
const png64 = async (file) => "image/png;base64," + (await sharp(file).png().toBuffer()).toString("base64");

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "Fleet Force - Pitch Sprint 1";
  pres.author = "Equipe FleetForce";
  pres.theme = { headFontFace: DISP, bodyFontFace: BODY };

  // ícones: uma família só (Lucide), traço de 2 px arredondado
  const IC = {};
  const lista = { truck: lu.LuTruck, fuel: lu.LuFuel, ticket: lu.LuTicket, wrench: lu.LuWrench, shield: lu.LuShieldCheck, file: lu.LuFileText,
    alert: lu.LuAlertTriangle, check: lu.LuBadgeCheck, pulse: lu.LuActivity, pin: lu.LuMapPin, sheet: lu.LuFileSpreadsheet, user: lu.LuUser,
    building: lu.LuBuilding2, monitor: lu.LuMonitor, server: lu.LuServer, database: lu.LuDatabase, sparkles: lu.LuSparkles, plug: lu.LuPlug, coins: lu.LuCoins, clock: lu.LuClock, chart: lu.LuLineChart, cpu: lu.LuCpu, handshake: lu.LuHeartHandshake };
  // M = azul da marca (fundo claro), L = azul claro (fundo escuro), W = branco, I = grafite
  for (const [k, Comp] of Object.entries(lista)) for (const [cn, cor] of Object.entries({ M: K.blue, L: K.blue4, W: K.white, I: K.ink })) IC[k + cn] = await iconPng(Comp, cor);
  IC.truckThin = await iconPng(lu.LuTruck, K.white, 1.2);
  // logos oficiais (recortados do PNG fornecido, sem alterar a arte)
  const LG = { full: AS + "/logo-full-t.png", symbol: AS + "/logo-symbol-t.png" };
  const LGdim = { full: [1320, 938], symbol: [966, 1178] };
  // painel da capa: azul chapado (cor seca, sem gradiente), com corte diagonal
  const capaPainel = "image/png;base64," + (await sharp(Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><polygon points="1500,0 1920,0 1920,1080 1340,1080" fill="#0750ED"/></svg>`)).png().toBuffer()).toString("base64");

  // ---------- helpers (px) ----------
  const T = (s, text, o) => s.addText(semNegrito(o.font) && Array.isArray(text) ? text.map((r) => ({ ...r, options: { ...r.options, bold: false } })) : text, {
    x: px(o.x), y: px(o.y), w: px(o.w), h: px(o.h), fontFace: o.font || BODY, fontSize: pt(o.size), bold: !!o.bold && !semNegrito(o.font), italic: !!o.italic,
    color: o.color || K.ink, align: o.align || "left", valign: o.valign || "top", margin: 0, charSpacing: o.cs ? o.cs / 3 : undefined,
    lineSpacingMultiple: o.lh, rotate: o.rot, transparency: o.tr, isTextBox: true, fit: "none", paraSpaceAfter: o.psa,
  });
  const run = (text, color, extra = {}) => ({ text, options: { color, ...extra } });
  const Rc = (s, o) => s.addShape(o.r ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE, {
    x: px(o.x), y: px(o.y), w: px(o.w), h: px(o.h), rectRadius: o.r ? Math.min(px(o.r), px(Math.min(o.w, o.h) / 2)) : undefined, rotate: o.rot,
    fill: o.fill ? { color: o.fill, transparency: o.tr || 0 } : { type: "none" },
    line: o.line ? { color: o.line, width: o.lw || 1.5 } : { type: "none" },
    shadow: o.shadow ? { type: "outer", color: "101828", opacity: o.shadow, blur: 12, offset: 3, angle: 90 } : undefined,
    objectName: o.name,
  });
  const Ov = (s, x, y, d, fill, line) => s.addShape(pres.shapes.OVAL, { x: px(x), y: px(y), w: px(d), h: px(d), fill: fill ? { color: fill } : { type: "none" }, line: line ? { color: line, width: 3 } : { type: "none" } });
  const Ic = (s, key, x, y, d, rot) => s.addImage({ data: IC[key], x: px(x), y: px(y), w: px(d), h: px(d), rotate: rot });
  // trilho: barra azul com a ponta cortada na diagonal (vocabulário de movimento da marca), uma por slide
  const rail = (s, y, color = K.blue, w = 360, h = 10) => s.addShape(pres.shapes.CUSTOM_GEOMETRY, {
    x: 0, y: px(y), w: px(w), h: px(h), fill: { color },
    points: [{ x: 0, y: 0 }, { x: px(w), y: 0 }, { x: px(w - h * 3), y: px(h) }, { x: 0, y: px(h) }, { close: true }],
  });
  const kicker = (s, text, x, y, color = K.blue) => T(s, text.toUpperCase(), { x, y: y - 14, w: 1000, h: 32, font: BODYS, size: 20, color, cs: 3 });
  const pill = (s, text, x, y, w, fill, color, line) => {
    Rc(s, { x, y, w, h: 46, fill, r: 23, line });
    T(s, text, { x, y, w, h: 46, font: BODYS, size: 17, color, align: "center", valign: "middle", cs: 2 });
  };
  // assinatura: símbolo no canto superior direito; em slide escuro vai sobre um cartão branco (não há versão inversa aprovada)
  const sig = (s, dark) => {
    const h = 56, w = Math.round((h * LGdim.symbol[0]) / LGdim.symbol[1]);
    if (dark) Rc(s, { x: 1764, y: 22, w: 76, h: 76, fill: K.white, r: 16 });
    s.addImage({ path: LG.symbol, x: px(dark ? 1764 + (76 - w) / 2 : 1840 - w), y: px(dark ? 22 + 10 : 26), w: px(w), h: px(h) });
  };
  const img = async (s, file, h, x, y, w) => {
    const hh = (w * h) / 1280;
    Rc(s, { x, y, w, h: hh, fill: K.white, r: 18, line: K.line, lw: 1, shadow: 0.08 });
    s.addImage({ data: await crop(file, h), x: px(x), y: px(y), w: px(w), h: px(hh), rounding: false });
    return hh;
  };
  // Bloco das US: história, o que faz e critérios de aceite
  const bloco = (s, x, y, w, d, dark) => {
    const tc = dark ? K.white : K.ink, mc = dark ? K.soft : K.muted, ac = dark ? K.blue4 : K.blue;
    T(s, d.hist, { x, y, w, h: 80, size: 26, italic: true, color: mc, lh: 1.05 });
    let yy = y + 110;
    T(s, "O QUE FAZ", { x, y: yy, w, h: 30, font: BODYS, size: 18, color: ac, cs: 3 }); yy += 42;
    const linhas = (t, larg, cw) => Math.max(1, Math.ceil((t.length * cw) / larg)); // estimativa de quebras a 27 px (cw = px por caractere)
    d.funcs.forEach((f) => { Rc(s, { x, y: yy + 14, w: 16, h: 5, fill: ac, r: 2 }); T(s, f, { x: x + 34, y: yy, w: w - 34, h: 72, size: 27, color: tc, lh: 0.95 }); yy += 52 + (linhas(f, w - 40, 14.2) - 1) * 28; });
    yy += 26;
    T(s, "PRONTO QUANDO · CRITÉRIOS DE ACEITE", { x, y: yy, w, h: 30, font: BODYS, size: 18, color: ac, cs: 3 }); yy += 44;
    d.cas.forEach((c) => { Ic(s, dark ? "checkL" : "checkM", x, yy + 2, 34); T(s, c, { x: x + 52, y: yy, w: w - 52, h: 72, size: 27, font: BODYS, color: tc, lh: 0.95 }); yy += 54 + (linhas(c, w - 58, 13.2) - 1) * 28; });
  };
  const slide = (bg) => { const s = pres.addSlide(); s.background = { color: bg }; return s; };
  // Seções do pitch, na ordem da "Estrutura de pitch de sucesso" do professor; a atual fica destacada
  const SECOES = ["PROBLEMA", "SOLUÇÃO", "NEGÓCIO", "CONCORRÊNCIA", "VALIDAÇÃO", "ROADMAP", "EQUIPE"];
  const nav = (s, atual, tom) => {
    const cor = { claro: [K.muted, K.blue], escuro: [K.soft, K.blue3] }[tom];
    const runs = [];
    SECOES.forEach((n, i) => {
      runs.push(run(n, i === atual ? cor[1] : cor[0]));
      if (i < SECOES.length - 1) runs.push(run("  ·  ", cor[0]));
    });
    T(s, runs, { x: 700, y: 42, w: 1030, h: 30, font: BODYS, size: 16, align: "right", cs: 1 });
  };

  const u1 = R.us01, u3 = R.us03, o = R.ociosidade_simulada;
  const comb = R.us02.comparacoes.find((c) => c.id === "combustivel_preco");
  const cons = R.us02.comparacoes.find((c) => c.id === "combustivel_consumo");
  const nCons = cons.veiculos_acima.length;
  const rk = Object.fromEntries(u3.ranking.map((i) => [i.id, i]));
  const dsl = comb.por_combustivel.find((x) => x.combustivel === "diesel_s10");
  const pago = dsl.pago.toFixed(2).replace(".", ",");
  const frotaTxt = u1.por_tipo.map((t) => `${t.n_veiculos} ${{ caminhao: "caminhões", van: "vans", carro: "carros" }[t.tipo]}`).join(", ").replace(/, ([^,]*)$/, " e $1");
  const mesTxt = milhar(u1.total_mensal_medio);

  // ================= 1 CAPA =================
  let s = slide(K.white);
  s.addImage({ data: capaPainel, x: 0, y: 0, w: 10, h: 5.625 });
  Ic(s, "truckThin", 1560, 190, 300);
  T(s, "Sprint 01", { x: 1590, y: 712, w: 300, h: 70, size: 52, bold: true, color: K.white });
  T(s, "PROPOSTA · NADA AQUI É PRODUTO PRONTO", { x: 1590, y: 790, w: 280, h: 70, font: BODYS, size: 17, color: K.white, cs: 2, lh: 1.25 });
  const lw = 400, lh = Math.round((lw * LGdim.full[1]) / LGdim.full[0]);
  s.addImage({ path: LG.full, x: px(104), y: px(60), w: px(lw), h: px(lh) });
  T(s, [run("Do gasto espalhado", K.ink, { breakLine: true }), run("à ", K.ink), run("economia em reais", K.blue)],
    { x: 120, y: 470, w: 1260, h: 260, font: DISP, size: 96, bold: true, lh: 1.02 });
  T(s, "Dados de frotas viram economia para o gestor e negócio para a Sem Parar", { x: 120, y: 760, w: 1100, h: 100, size: 34, color: K.text, lh: 1.15 });
  T(s, "CHALLENGE SEM PARAR EMPRESAS · EQUIPE FLEETFORCE · FIAP 2026", { x: 120, y: 950, w: 1200, h: 30, font: BODYS, size: 18, color: K.muted, cs: 2 });
  rail(s, 1070, K.blue);
  s.addNotes("CAPA (não conta no tempo). Fica na tela enquanto a conexão é feita. Celular já gravando o áudio.");

  // ================= 2 PROBLEMA =================
  s = slide(K.white);
  Rc(s, { x: 1260, y: 0, w: 660, h: 1080, fill: K.blue50 });
  kicker(s, "PROBLEMA", 120, 96);
  nav(s, 0, "claro"); sig(s, false);
  T(s, [run("“Quanto a frota", K.ink, { breakLine: true }), run("custa?”", K.blue)], { x: 120, y: 140, w: 1100, h: 250, font: DISP, size: 108, bold: true, lh: 1.0 });
  T(s, [run("Naira", K.ink, { bold: true }), run(" cuida de uma frota de 40 veículos: caminhões, vans e carros. Toda segunda o diretor pergunta. Ela não sabe responder, porque o gasto chega espalhado:", K.text)],
    { x: 120, y: 430, w: 1020, h: 190, size: 34, lh: 1.12 });
  const papeis = [["fuel", "Nota do posto", -4], ["ticket", "Extrato de pedágio", 3], ["wrench", "Planilha da oficina", -2], ["shield", "Boleto do seguro", 5], ["file", "IPVA e licenciamento", -5], ["alert", "Multas", 2]];
  papeis.forEach(([k, t, rot], i) => {
    const x = 120 + (i % 3) * 330 + (i > 2 ? 60 : 0), y = 690 + Math.floor(i / 3) * 150 + (i % 2 ? 18 : 0), w = 300, h = 112;
    Rc(s, { x, y, w, h, fill: K.white, r: 16, rot, line: K.line, lw: 1, shadow: 0.1 });
    // gira o ícone e o texto junto com o cartão (em torno do centro do cartão)
    const a = (rot * Math.PI) / 180, cx = x + w / 2, cy = y + h / 2, dx = 26 + 24 - w / 2, dy = 32 + 24 - h / 2;
    Ic(s, k + "M", cx + dx * Math.cos(a) - dy * Math.sin(a) - 24, cy + dx * Math.sin(a) + dy * Math.cos(a) - 24, 48, rot);
    const tdx = 92 + 95 - w / 2, tdy = 0;
    T(s, t, { x: cx + tdx * Math.cos(a) - tdy * Math.sin(a) - 95, y: cy + tdx * Math.sin(a) + tdy * Math.cos(a) - 40, w: 190, h: 80, size: 24, font: BODYS, color: K.ink, valign: "middle", lh: 0.98, rot });
  });
  T(s, "30%", { x: 1310, y: 210, w: 580, h: 240, font: DISP, size: 184, bold: true, color: K.blue, lh: 0.95 });
  T(s, "ou mais de redução no gasto com combustível é o que gestores relatam ao adotar gestão profissional de abastecimento.", { x: 1316, y: 500, w: 540, h: 300, size: 34, color: K.ink, lh: 1.15 });
  T(s, "FONTE: SEM PARAR EMPRESAS, LEVANTAMENTO COM GESTORES, CITADO PELA SETCESP (2023). É RELATO DE GESTORES, NÃO PROMESSA DO FLEET FORCE.", { x: 1316, y: 880, w: 540, h: 70, font: BODYS, size: 16, color: K.muted, cs: 1, lh: 1.3 });
  s.addNotes(
`0:00–0:25 (25 s)
A: "Esta é a Naira. Ela cuida de uma frota de 40 veículos: caminhões, vans e carros. Toda segunda o diretor pergunta: quanto a frota custa? E ela não sabe responder."
B: "O gasto chega espalhado: posto, pedágio, oficina, seguro, IPVA, multa."
A: "Quem faz gestão profissional do abastecimento relata mais de 30% de redução no combustível, segundo a própria Sem Parar Empresas."`);

  // ================= 3 PERSONAS E USER STORIES =================
  s = slide(K.white);
  kicker(s, "PROBLEMA · PERSONAS E USER STORIES", 120, 96);
  nav(s, 0, "claro"); sig(s, false);
  T(s, [run("Três personas. ", K.ink, { breakLine: true }), run("Uma dor: não saber onde economizar.", K.blue)], { x: 120, y: 130, w: 1700, h: 160, font: DISP, size: 64, bold: true, lh: 1.05 });
  // gestor: as 3 US da Sprint 1
  Rc(s, { x: 120, y: 330, w: 800, h: 540, fill: K.ink, r: 24 });
  Ic(s, "truckW", 170, 375, 72);
  T(s, "Gestor de frota", { x: 268, y: 376, w: 400, h: 64, font: DISP, size: 46, bold: true, color: K.white });
  pill(s, "SPRINT 1", 690, 384, 190, K.blue, K.white);
  T(s, "o centro da história: a Naira", { x: 268, y: 440, w: 600, h: 40, size: 26, color: K.soft });
  [["US01", "Ver o custo total consolidado"], ["US02", "Comparar meus custos com um benchmark"], ["US03", "Ver a economia potencial em R$, em gráficos"]].forEach(([us, t], i) => {
    const y = 530 + i * 105;
    pill(s, us, 170, y, 120, K.blue, K.white);
    T(s, t, { x: 320, y: y - 2, w: 560, h: 50, size: 28, font: BODYS, color: K.white, valign: "middle" });
  });
  // CFO e Sem Parar: desdobramentos no backlog
  [["userI", "CFO", "US05", "Relatório executivo de uma página, com os 3 maiores custos e as 3 maiores oportunidades"],
   ["buildingI", "Sem Parar", "US04", "Cadastro com CNPJ para o diagnóstico; o contato comercial só com autorização separada (LGPD)"]].forEach(([k, t, us, d], i) => {
    const x = 960 + i * 440;
    Rc(s, { x, y: 330, w: 400, h: 540, fill: K.paper, r: 24, line: K.line, lw: 1 });
    Ic(s, k, x + 40, 372, 64);
    T(s, t, { x: x + 40, y: 452, w: 340, h: 60, font: DISP, size: 44, bold: true, color: K.ink });
    pill(s, "BACKLOG", x + 40, 530, 170, K.n100, K.muted);
    pill(s, us, x + 40, 604, 120, K.white, K.blue, K.blue);
    T(s, d, { x: x + 40, y: 680, w: 330, h: 170, size: 26, color: K.ink, lh: 1.1 });
  });
  T(s, [run("Resolvendo a dor do gestor, ", K.ink), run("resolvemos a do CFO e geramos negócio para a Sem Parar.", K.blue)],
    { x: 120, y: 915, w: 1700, h: 60, size: 32, font: BODYS });
  rail(s, 1070);
  s.addNotes(
`0:25–0:44 (19 s)
B: "Escolhemos três user stories do gestor de frota para a Sprint 1: ver o custo total, comparar com um benchmark e ver a economia em reais."
A: "Resolvendo a dele, resolvemos a do CFO, que quer o resumo, e a da Sem Parar, que quer o contato."`);

  const CAP = AS + "/capturas/";

  // ================= 4 EXPERIÊNCIA DO USUÁRIO =================
  s = slide(K.paper);
  kicker(s, "SOLUÇÃO · COMO FUNCIONA", 120, 96);
  nav(s, 1, "claro"); sig(s, false);
  T(s, [run("Sem instalar nada,", K.ink, { breakLine: true }), run("sem arrumar planilha", K.blue)], { x: 120, y: 128, w: 1500, h: 210, font: DISP, size: 88, bold: true, lh: 1.02 });
  const passos = [["Envia", "a planilha que já tem, pelo navegador. Depois, também PDF e foto de nota"], ["Confere", "como entendemos as colunas; só pergunta o que não reconheceu"],
    ["Se cadastra", "CNPJ e tamanho da frota, só para liberar o diagnóstico (US04)"], ["Recebe", "as 3 respostas em R$, com a conta aberta"], ["Age", "leva o resumo ao diretor e, se quiser, autoriza a Sem Parar a entrar em contato"]];
  Rc(s, { x: 0, y: 438, w: 1920, h: 4, fill: K.line });
  passos.forEach(([t, d], i) => {
    const x = 120 + i * 352, lead = i === 2;
    Ov(s, x, 404, 72, lead ? K.blue : K.white, lead ? null : K.ink);
    T(s, String(i + 1), { x, y: 404, w: 72, h: 72, font: DISP, size: 36, bold: true, color: lead ? K.white : K.ink, align: "center", valign: "middle" });
    T(s, t, { x, y: 506, w: 330, h: 56, font: DISP, size: 38, bold: true, color: lead ? K.blue : K.ink });
    T(s, d, { x, y: 568, w: 310, h: 120, size: 24, color: K.text, lh: 1.1 });
  });
  T(s, "CONECTA COM OS PILARES DA SEM PARAR EMPRESAS", { x: 120, y: 735, w: 1200, h: 30, font: BODYS, size: 19, color: K.blue, cs: 3 });
  [["Eficiência e otimização", "economia priorizada em reais"], ["Confiança", "todo número com fonte e conta aberta"], ["Visão inovadora", "sensores nos veículos como evolução"]].forEach(([n, d], i) => {
    const x = 120 + i * 590;
    Rc(s, { x, y: 785, w: 540, h: 3, fill: K.ink });
    T(s, n, { x, y: 808, w: 560, h: 56, font: DISP, size: 38, bold: true, color: K.ink });
    T(s, d, { x, y: 880, w: 520, h: 40, size: 26, color: K.text });
  });
  T(s, "PILARES: SEMPARAREMPRESAS.COM.BR/SOBRE", { x: 120, y: 975, w: 900, h: 30, font: BODYS, size: 15, color: K.muted, cs: 2 });
  rail(s, 1070);
  s.addNotes(
`0:44–1:10 (26 s)
B: "Como funciona: a Naira não instala nada nem arruma planilha. Envia o arquivo, faz um cadastro só para liberar o diagnóstico e recebe as três respostas em reais. Hoje a entrada é a planilha; PDF, foto e dados do veículo vêm depois."
A: "E só se ela quiser, autoriza a Sem Parar a entrar em contato. Isso conversa com os pilares da empresa: eficiência, confiança e visão inovadora."`);

  // ================= 5 US01 =================
  s = slide(K.paper);
  kicker(s, "SOLUÇÃO · US01", 120, 96);
  nav(s, 1, "claro"); sig(s, false);
  T(s, [run("Quanto a", K.ink, { breakLine: true }), run("frota ", K.ink), run("custa", K.blue)], { x: 120, y: 128, w: 720, h: 220, font: DISP, size: 92, bold: true, lh: 1.0 });
  bloco(s, 120, 365, 680, {
    hist: "Como gestor de frota, quero ver o custo total consolidado, para entender quanto realmente gasto.",
    funcs: ["Lê a planilha CSV/Excel que ele já tem", "8 categorias, por tipo, veículo e km", "Avisa o dado que faltou"],
    cas: ["Total igual à soma da planilha, centavo por centavo", "Trocar o período recalcula tudo", "Sem dado aparece como “não informado”"],
  });
  await img(s, CAP + "us01.png", 680, 820, 120, 1020);
  T(s, mesTxt, { x: 820, y: 750, w: 600, h: 130, font: DISP, size: 100, bold: true, color: K.blue });
  T(s, `por mês na frota de demonstração\n${frotaTxt}`, { x: 1430, y: 762, w: 400, h: 110, size: 24, color: K.ink, lh: 1.1 });
  pill(s, "DADOS DE DEMONSTRAÇÃO", 820, 910, 400, K.ink, K.white);
  s.addNotes(
`1:10–1:32 (22 s)
A: "Primeira US: quanto eu gasto. Total do período, peso das 8 categorias, custo por tipo de veículo e por km. Na demonstração, ${mesTxt} por mês."
B: "Pronta quando o total bate com a planilha centavo por centavo, trocar o período recalcula tudo e o que faltou aparece como não informado, nunca como zero."`);

  // ================= 6 US02 =================
  s = slide(K.dark);
  await img(s, CAP + "us02.png", 900, 80, 110, 1000);
  pill(s, "DADOS DE DEMONSTRAÇÃO", 80, 40, 400, K.panel, K.white, "475467");
  T(s, `+${dsl.diferenca_pct.toFixed(0)}%`, { x: 120, y: 870, w: 300, h: 130, font: DISP, size: 92, bold: true, color: K.blue4 });
  T(s, "diesel pago acima\nda média da ANP (SP)", { x: 400, y: 880, w: 270, h: 90, size: 24, color: K.white, lh: 1.1 });
  T(s, String(nCons), { x: 700, y: 870, w: 70, h: 130, font: DISP, size: 92, bold: true, color: K.white });
  T(s, `veículos gastam ${cons.diferenca_pct.toFixed(0)}% mais\ncombustível que os do seu tipo`, { x: 780, y: 880, w: 340, h: 90, size: 24, color: K.white, lh: 1.1 });
  kicker(s, "SOLUÇÃO · US02", 1180, 96, K.blue3);
  nav(s, 1, "escuro"); sig(s, true);
  T(s, [run("Estou", K.white, { breakLine: true }), run("gastando ", K.white), run("bem?", K.blue4)], { x: 1180, y: 128, w: 700, h: 200, font: DISP, size: 76, bold: true, lh: 1.02 });
  bloco(s, 1180, 365, 650, {
    hist: "Como gestor, quero comparar meus custos com um benchmark, para saber se sou eficiente.",
    funcs: ["Referência pública: ANP, IPVA, extrato", "Sem referência pública: mediana do mesmo tipo", "Semáforo e fonte ao lado de cada número"],
    cas: ["Toda referência mostra fonte, data e versão", "Veículo fora da curva aparece com a placa", "Sem referência nunca vira “eficiente”"],
  }, true);
  s.addNotes(
`1:32–1:59 (27 s)
A: "Segunda: estou gastando bem? No diesel, a frota pagou R$ ${pago} contra R$ 7,32 da média da ANP, ${dsl.diferenca_pct.toFixed(0)}% acima. É o preço da semana de 4 a 10 de outubro, aplicado ao caso de demonstração."
B: "Sem referência pública, cada veículo é comparado só com os do mesmo tipo: ${nCons} gastam ${cons.diferenca_pct.toFixed(0)}% mais combustível. Toda referência tem fonte, e o que não tem nunca vira eficiente."
(Se perguntarem do 16% x 15%: no diesel é 16%; no combustível todo, 15%.)`);

  // ================= 7 US03 =================
  s = slide(K.paper);
  kicker(s, "SOLUÇÃO · US03", 120, 96);
  nav(s, 1, "claro"); sig(s, false);
  T(s, "Onde agir primeiro", { x: 120, y: 124, w: 1200, h: 90, font: DISP, size: 76, bold: true, color: K.ink });
  pill(s, "ECONOMIA SIMULADA, AINDA NÃO COMPROVADA", 1240, 150, 560, K.ink, K.white);
  T(s, [run(milhar(u3.totais.conservador_anual) + " ", K.blue), run("→ ", K.ink), run(grandeza(u3.totais.realista_anual), K.blue)], { x: 120, y: 222, w: 1750, h: 130, font: DISP, size: 108, bold: true });
  T(s, "por ano na frota de demonstração · cenário conservador (50% da diferença) → realista (80%)", { x: 120, y: 372, w: 1700, h: 40, size: 28, color: K.muted });
  await img(s, CAP + "us03.png", 725, 120, 465, 1000);
  bloco(s, 1200, 470, 620, {
    hist: "Como gestor, quero ver a economia potencial em R$, para priorizar as ações de maior impacto.",
    funcs: ["Economia de cada alavanca, em dois cenários", "Ranking com a ação e os veículos", "Clique na barra e veja a conta"],
    cas: ["Só há economia acima da referência", "A conta refeita à mão dá o mesmo valor", "Nada conta duas vezes; simulado fica fora"],
  });
  s.addNotes(
`1:59–2:17 (18 s)
A: "Terceira: onde agir primeiro? A economia de cada alavanca, com a ação e os veículos: de ${milhar(u3.totais.conservador_anual)} a ${grandeza(u3.totais.realista_anual).replace(/ mi$/, " milhão")} por ano na demonstração."
B: "Só há economia acima da referência, a conta refeita à mão bate e nada conta duas vezes. A Naira finalmente responde ao diretor."`);

  // ================= 8 ALAVANCAS =================
  s = slide(K.paper);
  kicker(s, "SOLUÇÃO · ALAVANCAS", 120, 96);
  nav(s, 1, "claro"); sig(s, false);
  T(s, [run("Não é só o", K.ink, { breakLine: true }), run("combustível", K.blue)], { x: 120, y: 128, w: 640, h: 220, font: DISP, size: 84, bold: true, lh: 1.02 });
  T(s, "Com a mesma planilha, cada veículo também é comparado com os do mesmo tipo, pela mediana.", { x: 120, y: 360, w: 540, h: 180, size: 30, color: K.text, lh: 1.12 });
  T(s, [run("O gestor só manda: ", K.ink, { bold: true }), run("placa, data e valor; no abastecimento, litros e km; e o cadastro da frota.", K.text)], { x: 120, y: 560, w: 540, h: 130, size: 28, lh: 1.12 });
  // gráfico de barras das alavancas calculadas
  Rc(s, { x: 760, y: 110, w: 1040, h: 550, fill: K.white, r: 20, line: K.line, lw: 1 });
  T(s, "CALCULADO NA DEMONSTRAÇÃO · POR ANO, CENÁRIO REALISTA", { x: 810, y: 140, w: 940, h: 30, font: BODYS, size: 17, color: K.blue, cs: 2 });
  const barras = [["Combustível: preço acima da ANP", "combustivel_preco"], ["Combustível: consumo por veículo", "combustivel_consumo"], ["Manutenção por km", "manutencao"], ["Pneus por km", "pneus"], ["Flex: etanol em vez de gasolina", "etanol_gasolina"], ["Pedágio cobrado em dobro", "pedagio"]];
  const vmax = rk.combustivel_preco.realista_anual;
  barras.forEach(([nome, id], i) => {
    const y = 188 + i * 74, v = rk[id].realista_anual;
    T(s, nome, { x: 810, y, w: 560, h: 34, size: 24, font: BODYS, color: K.ink });
    Rc(s, { x: 810, y: y + 40, w: 760, h: 18, fill: K.n100, r: 9 });
    Rc(s, { x: 810, y: y + 40, w: Math.max(22, (760 * v) / vmax), h: 18, fill: i === 0 ? K.blue : K.blue4, r: 9 });
    T(s, milhar(v), { x: 1560, y: y + 22, w: 210, h: 44, font: DISP, size: 30, bold: true, color: K.ink, align: "right" });
  });
  const cols = [["sheet", "MESMOS DADOS, PRÓXIMAS SPRINTS", ["Abastecimento suspeito", "Multas por placa e motorista", "Veículo que já compensa trocar"]],
    ["pulse", "ACELERÔMETRO + GPS (SIMULADO)", ["Motor ligado parado (com ignição ou OBD)", "Frenagem e arrancada bruscas", "Abastecimento longe do posto"]],
    ["handshake", "COM PARCERIA DA SEM PARAR", ["Extratos da tag de pedágio", "Extratos do cartão combustível"]]];
  cols.forEach(([k, t, itens], i) => {
    const x = 120 + i * 580, y = 720;
    Rc(s, { x, y, w: 540, h: 6, fill: i === 0 ? K.ink : i === 1 ? K.blue : K.gray, r: 3 });
    Ic(s, k + (i === 1 ? "M" : "I"), x, y + 30, 40);
    T(s, t, { x: x + 56, y: y + 38, w: 484, h: 34, font: BODYS, size: 17, color: K.ink, cs: 1 });
    itens.forEach((it, j) => T(s, it, { x, y: y + 92 + j * 48, w: 540, h: 44, size: 27, color: K.text }));
  });
  s.addNotes(
`2:17–2:33 (16 s)
B: "Não é só o combustível: cada veículo é comparado com os do mesmo tipo em consumo, manutenção e pneus, e os flex ganham a troca para o etanol."
A: "Depois vêm multas, sensores e, com parceria, tag e cartão."`);

  // ================= 9 UML DE COMPONENTES (feedback do grupo, 20/10) =================
  // Diagrama gerado por deck/assets-fleet-force/gerar_uml.py: sem nome de tecnologia nem de peça (ata do professor).
  s = slide(K.white);
  kicker(s, "SOLUÇÃO · UML", 120, 96);
  nav(s, 1, "claro"); sig(s, false);
  T(s, [run("Como funciona ", K.ink), run("por dentro", K.blue)], { x: 120, y: 120, w: 900, h: 80, font: DISP, size: 52, bold: true });
  T(s, "Diagrama de componentes (UML): um componente por user story. A planilha é lida no navegador e só os dados usados vão ao servidor.", { x: 1000, y: 118, w: 800, h: 80, size: 22, color: K.muted, lh: 1.15 });
  s.addImage({ path: AS + "/uml-componentes.png", x: px(130), y: px(205), w: px(1660), h: px((1660 * 740) / 1700) });
  s.addNotes(
`2:33–2:46 (13 s)
B: "Por dentro, um componente por user story: a interface lê a planilha no navegador e manda só os dados usados; o servidor faz as contas; o banco de dados fica na nuvem."
(Direção, não decisão: o professor pediu para não cravar tecnologia. Dizer "Python", "nuvem" e "IA" só como pista. Se perguntarem "e se o celular do cliente for fraco?": o pré-processamento é básico, só extração; se o aparelho abre o arquivo, ele consegue extrair os dados.)`);

  // ================= 10 CRITÉRIOS DE ACEITE POR COMPONENTE =================
  s = slide(K.white);
  kicker(s, "SOLUÇÃO · UML · CRITÉRIOS DE ACEITE", 120, 96);
  nav(s, 1, "claro"); sig(s, false);
  T(s, [run("Pronto quando, ", K.ink), run("em cada peça", K.blue)], { x: 120, y: 128, w: 1000, h: 90, font: DISP, size: 60, bold: true });
  T(s, "DIREÇÃO, NÃO DECISÃO: PYTHON, NUVEM E IA AINDA EM ESTUDO", { x: 1000, y: 160, w: 800, h: 30, font: BODYS, size: 14, color: K.muted, align: "right", cs: 1 });
  const caixa = (x, y, w, h, ic, titulo, sub, tag, itens, extra) => {
    Rc(s, { x, y, w, h, fill: K.white, r: 20, line: K.line, lw: 1.5 });
    Ic(s, ic, x + 28, y + 26, 44);
    T(s, titulo, { x: x + 88, y: y + 26, w: tag ? w - 88 - 190 : w - 110, h: 44, font: DISP, size: 34, bold: true, color: K.ink, valign: "middle" });
    if (tag) pill(s, tag, x + w - 176, y + 27, 150, K.ink, K.white);
    const nSub = Math.max(1, Math.ceil((sub.length * 11.4) / (w - 56)));
    T(s, sub, { x: x + 28, y: y + 86, w: w - 56, h: nSub * 27 + 4, size: 22, color: K.muted, lh: 1.12 });
    let yy = y + 86 + nSub * 27 + 24;
    if (extra) yy = extra(x, yy, w);
    Rc(s, { x: x + 28, y: yy, w: w - 56, h: 2, fill: K.line }); yy += 18;
    T(s, "PRONTO QUANDO", { x: x + 28, y: yy, w: 300, h: 24, font: BODYS, size: 15, color: K.blue, cs: 3 }); yy += 36;
    itens.forEach((it) => {
      const n = Math.max(1, Math.ceil((it.length * 11.9) / (w - 108)));
      Ic(s, "checkM", x + 28, yy + 1, 28);
      T(s, it, { x: x + 70, y: yy, w: w - 100, h: n * 28 + 4, size: 22, font: BODYS, color: K.ink, lh: 1.1 });
      yy += n * 27 + 16;
    });
  };
  const seta = (x, y, w, duas) => s.addShape(pres.shapes.LINE, { x: px(x), y: px(y), w: px(w), h: 0, line: { color: K.blue, width: 3, endArrowType: "triangle", beginArrowType: duas ? "triangle" : undefined } });
  const LX = 120, CX = 720, RX = 1280, CW = 480, SW = 520, TOP = 250, BOT = 690, BH = 420, BH2 = 340;
  caixa(LX, TOP, SW, BH, "monitorM", "Interface web", "o gestor usa pelo PC ou celular", null,
    ["Lê a planilha do gestor sem ele arrumar nada", "Envia ao servidor só os dados usados, não o arquivo inteiro", "Mostra o resultado em gráficos, com a fonte de cada número"]);
  caixa(CX, TOP, CW, 780, "serverM", "Servidor com API", "em Python; onde roda (nuvem) está em estudo", null,
    ["Todo número bate com a planilha, centavo por centavo", "Compara cada veículo só com os do mesmo tipo", "Mostra a economia em R$, com a ação e os veículos"],
    (x, yy, w) => { ["US01 · Custo total", "US02 · Comparação", "US03 · Economia"].forEach((t, i) => { Rc(s, { x: x + 28, y: yy + i * 62, w: w - 56, h: 52, fill: K.blue50, r: 12 }); T(s, t, { x: x + 28, y: yy + i * 62, w: w - 56, h: 52, size: 22, font: BODYS, color: K.blue, align: "center", valign: "middle" }); }); return yy + 3 * 62 + 4; });
  caixa(RX, TOP, SW, BH, "truckM", "Kit no veículo", "sensores de movimento e de posição", "SIMULADO",
    ["Conta as frenagens e arrancadas bruscas por 100 km", "Registra velocidade, km rodado e posição", "Só marca motor ligado parado com o sinal de ignição ou o OBD"]);
  caixa(LX, BOT, SW, BH2, "databaseM", "Banco de dados", "na nuvem; guarda gastos e diagnósticos", null,
    ["Guarda gastos e diagnósticos, com data e versão de cada referência", "Só guarda o contato comercial com autorização, separada do cadastro"]);
  caixa(RX, BOT, SW, BH2, "sparklesM", "Motor de IA", "explica os números; API em nuvem ou IA local, em estudo", "PREVISTO",
    ["Explica por que um custo subiu, usando só valores já calculados", "Nunca inventa números"]);
  seta(LX + SW + 6, TOP + 210, CX - LX - SW - 12, true);
  seta(LX + SW + 6, BOT + 170, CX - LX - SW - 12, true);
  seta(CX + CW + 6, TOP + 210, RX - CX - CW - 12, true);
  seta(CX + CW + 6, BOT + 170, RX - CX - CW - 12, true);
  rail(s, 1070);
  s.addNotes(
`2:46–2:56 (10 s)
A: "E cada peça tem o seu critério de aceite. Por exemplo: todo número bate com a planilha, e a IA nunca inventa número."
(Os critérios do banco de dados, da interface, da comparação por tipo e da IA são proposta nova, escrita a partir das US e do documento do Rafa. O Gustavo aprovou em 20/10; falta o grupo confirmar. O contato comercial só com autorização separada vem do feedback do Rafa (LGPD).)`);

  // ================= 10 HARDWARE (alto nível: sensor de X, sem modelo de peça) =================
  s = slide(K.dark);
  kicker(s, "SOLUÇÃO · HARDWARE", 120, 96, K.blue3);
  nav(s, 1, "escuro"); sig(s, true);
  T(s, [run("O veículo", K.white, { breakLine: true }), run("conta o que", K.white, { breakLine: true }), run("gasta", K.blue4)], { x: 120, y: 128, w: 800, h: 330, font: DISP, size: 84, bold: true, lh: 1.02 });
  T(s, "Um kit com acelerômetro e GPS: dado que a planilha não tem.", { x: 120, y: 500, w: 720, h: 90, size: 30, color: K.white, lh: 1.15 });
  T(s, brl(o.custo_estimado) + "/mês", { x: 120, y: 640, w: 820, h: 130, font: DISP, size: 108, bold: true, color: K.blue4 });
  T(s, `num caminhão: ${o.horas_ociosas.toLocaleString("pt-BR")} h parado com a ignição ligada = ${o.litros_estimados.toLocaleString("pt-BR")} l × R$ 7,32 · ${o.eventos_conducao_brusca} frenagens ou arrancadas bruscas em ${o.km.toLocaleString("pt-BR")} km · SIMULADO`, { x: 120, y: 790, w: 780, h: 120, size: 24, color: K.soft, lh: 1.15 });
  [["pulseL", "Acelerômetro", "SIMULADO", K.blue, "Mede frenagens e arrancadas bruscas, contadas por 100 km. Quem pisa demais gasta mais combustível."],
   ["pinL", "GPS", "SIMULADO", K.blue, "Velocidade e km rodado. Sozinhos, GPS e acelerômetro não sabem se o motor está ligado: para isso, precisamos do sinal de ignição ou da porta OBD."],
   ["plugL", "Porta OBD do veículo", "PRÓXIMA ETAPA", "475467", "Dados do próprio veículo por um módulo Bluetooth barato, sem mexer no tanque nem fio exposto. Pode mostrar se o motor está ligado."]].forEach(([k, t, chip, cf, d], i) => {
    const y = 116 + i * 206;
    Rc(s, { x: 1000, y, w: 800, h: 198, fill: K.panel, r: 24, line: "475467", lw: 1 });
    Ic(s, k, 1036, y + 28, 60);
    T(s, t, { x: 1116, y: y + 24, w: 440, h: 56, font: DISP, size: 38, bold: true, color: K.white, valign: "middle" });
    pill(s, chip, 1560, y + 28, 210, cf, K.white);
    T(s, d, { x: 1036, y: y + 98, w: 730, h: 92, size: 22, color: K.white, lh: 1.1 });
  });
  // fluxo do dado: sensores -> kit -> Wi-Fi -> nuvem e banco de dados -> análise
  T(s, "COMO O DADO CHEGA", { x: 1000, y: 742, w: 800, h: 30, font: BODYS, size: 18, color: K.blue3, cs: 2 });
  ["SENSORES", "KIT NO VEÍCULO", "CONEXÃO", "NUVEM + BANCO DE DADOS", "ANÁLISE E IA"].forEach((t, i) => {
    const x = 1000 + i * 166;
    Rc(s, { x, y: 785, w: 138, h: 96, fill: i === 4 ? K.blue : K.panel, r: 12, line: i === 4 ? null : "475467", lw: 1 });
    T(s, t, { x: x + 6, y: 785, w: 126, h: 96, font: BODYS, size: 14, color: K.white, align: "center", valign: "middle", lh: 1.1 });
    if (i < 4) T(s, "›", { x: x + 138, y: 800, w: 28, h: 60, font: DISP, size: 44, bold: true, color: K.blue4, align: "center", valign: "middle" });
  });
  T(s, "SIMULAÇÃO COM DADOS GERADOS POR SCRIPT", { x: 1000, y: 915, w: 820, h: 30, font: BODYS, size: 17, color: K.white, cs: 1 });
  T(s, "CONSUMO PARADO: US DOE/ARGONNE (0,8 GALÃO/H) · PREÇO: ANP, DIESEL S10 SP, 04 A 10/10/2026", { x: 120, y: 975, w: 820, h: 50, font: BODYS, size: 14, color: K.soft, cs: 1, lh: 1.25 });
  rail(s, 1070);
  s.addNotes(
`2:56–3:22 (26 s)
A: "O hardware: um kit com acelerômetro e GPS, para qualquer veículo. Ele mede frenagens bruscas e velocidade. Para saber se o motor está ligado, precisamos do sinal de ignição ou da porta OBD."
B: "Parado com o motor ligado, gasta uns 3 litros por hora: na simulação, ${brl(o.custo_estimado)} num mês. O próximo passo é ler os dados pela porta OBD, sem mexer no tanque."
(Alto nível, como o professor pediu: dizer "sensor de X", sem nome de peça. É simulação com dados gerados por script. GPS e acelerômetro sozinhos não confirmam motor ligado; isso vem da ignição ou do OBD. Fases futuras da ata: temperatura e nível de combustível, de preferência via OBD.)`);

  // ================= 11 MODELO DE NEGÓCIO =================
  s = slide(K.paper);
  kicker(s, "MODELO DE NEGÓCIO", 120, 96);
  nav(s, 2, "claro"); sig(s, false);
  T(s, [run("Grátis para o gestor. ", K.ink, { breakLine: true }), run("Negócio para a Sem Parar.", K.blue)], { x: 120, y: 128, w: 1700, h: 180, font: DISP, size: 72, bold: true, lh: 1.05 });
  [["Diagnóstico grátis", "o gestor envia a planilha e quer ver a economia"], ["Cadastro", "CNPJ e tamanho da frota, só para liberar o diagnóstico (US04)"],
   ["Autorização", "a empresa decide, em separado, se a Sem Parar pode entrar em contato (LGPD)"], ["Oferta certa", "com autorização, um lead qualificado: cartão, tag ou manutenção para aquela dor"]].forEach(([t, d], i) => {
    const x = 120 + i * 426, ult = i === 3;
    Rc(s, { x, y: 350, w: 400, h: 300, fill: ult ? K.blue : i === 0 ? K.white : K.ink, r: 20, line: i === 0 ? K.line : null, lw: 1 });
    const tc = i === 0 ? K.ink : K.white;
    T(s, "0" + (i + 1), { x: x + 34, y: 380, w: 200, h: 40, font: BODYS, size: 22, color: i === 0 ? K.blue : ult ? K.white : K.blue3, cs: 2 });
    T(s, t, { x: x + 34, y: 428, w: 340, h: 90, font: DISP, size: 38, bold: true, color: tc, lh: 1.02 });
    T(s, d, { x: x + 34, y: 530, w: 340, h: 110, size: 23, color: tc, lh: 1.1 });
    if (i < 3) T(s, "›", { x: x + 398, y: 460, w: 30, h: 80, font: DISP, size: 56, bold: true, color: K.blue, align: "center", valign: "middle" });
  });
  T(s, "ALINHADO À ESTRATÉGIA DA SEM PARAR", { x: 120, y: 720, w: 1000, h: 30, font: BODYS, size: 19, color: K.blue, cs: 2 });
  T(s, "O CEO da Sem Parar Empresas, Wagner Gramigna, diz que a empresa deixou de ser só pedágio e atua como plataforma de mobilidade corporativa, e vê a IA como ferramenta para reduzir custos de frotas.",
    { x: 120, y: 765, w: 960, h: 150, size: 27, color: K.ink, lh: 1.15 });
  T(s, "FONTE: TIMES BRASIL (CNBC), 10/06/2026", { x: 120, y: 940, w: 900, h: 30, font: BODYS, size: 15, color: K.muted, cs: 1 });
  Rc(s, { x: 1120, y: 700, w: 680, h: 290, fill: K.white, r: 20, line: K.line, lw: 1 });
  T(s, "SEMÁFORO COMERCIAL · IDEIA A VALIDAR", { x: 1156, y: 730, w: 620, h: 30, font: BODYS, size: 18, color: K.blue, cs: 2 });
  [["VERDE", K.green], ["AMARELO", K.amber], ["VERMELHO", K.red]].forEach(([t, cor], i) => {
    Rc(s, { x: 1156 + i * 210, y: 778, w: 190, h: 46, fill: K.white, r: 23, line: cor, lw: 3 });
    T(s, t, { x: 1156 + i * 210, y: 778, w: 190, h: 46, font: BODYS, size: 18, color: cor, align: "center", valign: "middle", cs: 2 });
  });
  T(s, "Cada oportunidade é classificada pelos problemas achados no diagnóstico e pelo potencial de oferecer uma solução da Sem Parar. O critério de cada cor o grupo ainda vai definir.", { x: 1156, y: 846, w: 610, h: 130, size: 22, color: K.ink, lh: 1.12 });
  s.addNotes(
`3:22–3:46 (24 s)
B: "O diagnóstico é grátis e só pede um cadastro, para liberar o resultado. O contato da Sem Parar é uma autorização separada: a empresa decide."
A: "Com ela, a Sem Parar recebe um contato que já chega com o desperdício medido em reais, classificado num semáforo comercial. É um canal de aquisição, uma hipótese que queremos validar com vocês."
(Semáforo comercial é ideia do Rafa, a validar: o critério de cada cor ainda será definido. Se perguntarem "por que não desenvolver internamente?": slide de apoio logo depois da equipe. Se perguntarem do CEO: Wagner Gramigna diz que a empresa deixou de ser só pedágio e atua como plataforma de mobilidade corporativa. Um piloto com o kit nos veículos é hipótese: custo, duração e conversão a testar.)`);

  // ================= 12 CONCORRÊNCIA EM DUAS DIMENSÕES =================
  s = slide(K.white);
  kicker(s, "CONCORRÊNCIA", 120, 96);
  nav(s, 3, "claro"); sig(s, false);
  T(s, [run("Eles cuidam de quem já é cliente. ", K.ink), run("Nós, de quem ainda não é.", K.blue)], { x: 120, y: 150, w: 580, h: 340, font: DISP, size: 50, bold: true, lh: 1.08 });
  T(s, "Pelo que cada empresa divulga, cartões, tags, telemetria e plataformas partem de contrato, instalação ou assinatura. As planilhas grátis que vimos organizam o custo, mas não dizem onde agir.", { x: 120, y: 540, w: 540, h: 250, size: 27, color: K.text, lh: 1.15 });
  T(s, "POSIÇÕES: AVALIAÇÃO DO GRUPO PELO QUE CADA EMPRESA DIVULGA. DETALHE E FONTES NO APOIO.", { x: 120, y: 900, w: 540, h: 60, font: BODYS, size: 14, color: K.muted, lh: 1.3, cs: 1 });
  // gráfico: x = facilidade para começar (preço e esforço), y = o que entrega
  const gx = 760, gy = 150, gw = 1040, gh = 760;
  Rc(s, { x: gx, y: gy, w: gw, h: gh, fill: K.paper, r: 16 });
  Rc(s, { x: gx + gw / 2, y: gy + 20, w: 2, h: gh - 40, fill: K.line });
  Rc(s, { x: gx + 20, y: gy + gh / 2, w: gw - 40, h: 2, fill: K.line });
  Rc(s, { x: gx, y: gy + gh + 14, w: gw, h: 4, fill: K.ink });
  Rc(s, { x: gx - 18, y: gy, w: 4, h: gh, fill: K.ink });
  T(s, "PEDE CONTRATO OU INSTALAÇÃO", { x: gx, y: gy + gh + 30, w: 440, h: 30, font: BODYS, size: 15, color: K.muted, cs: 1 });
  T(s, "GRÁTIS, COM A PLANILHA QUE JÁ TEM", { x: gx + gw - 480, y: gy + gh + 30, w: 480, h: 30, font: BODYS, size: 15, color: K.muted, align: "right", cs: 1 });
  T(s, "PREÇO E ESFORÇO PARA COMEÇAR", { x: gx + gw / 2 - 280, y: gy + gh + 64, w: 560, h: 34, font: BODYS, size: 17, color: K.ink, align: "center", cs: 2 });
  T(s, "O QUE ENTREGA", { x: gx - 230, y: gy + gh / 2 - 17, w: 400, h: 34, font: BODYS, size: 17, color: K.ink, align: "center", rot: 270, cs: 2 });
  T(s, "DIZ ONDE ECONOMIZAR, EM R$", { x: gx + 24, y: gy + 18, w: 460, h: 30, font: BODYS, size: 14, color: K.muted, cs: 1 });
  T(s, "REGISTRA E CONTROLA", { x: gx + 24, y: gy + gh - 46, w: 460, h: 30, font: BODYS, size: 14, color: K.muted, cs: 1 });
  const pos = [["CARTÕES", "Ticket Log, Pluxee", 0.16, 0.48], ["TAGS", "Veloe, ConectCar", 0.1, 0.3], ["TELEMETRIA", "Cobli, Sascar", 0.3, 0.6],
    ["INFLEET", "plataforma com IA", 0.2, 0.76], ["PLANILHAS GRÁTIS", "RoutEasy, calculadoras", 0.64, 0.22]];
  pos.forEach(([n, d, fx, fy]) => {
    const cx = gx + fx * gw, cy = gy + (1 - fy) * gh;
    Ov(s, cx - 15, cy - 15, 30, K.ink);
    T(s, [run(n, K.ink, { breakLine: true }), run(d, K.muted)], { x: cx + 26, y: cy - 30, w: 320, h: 70, size: 22, font: BODYS, lh: 1.05 });
  });
  const fx = gx + 0.8 * gw, fy = gy + (1 - 0.84) * gh;
  Ov(s, fx - 34, fy - 34, 68, K.blue);
  T(s, [run("FLEET FORCE", K.blue, { breakLine: true }), run("diagnóstico grátis, em R$", K.ink)], { x: fx - 270, y: fy + 44, w: 400, h: 80, size: 26, font: BODYS, align: "right", lh: 1.05 });
  s.addNotes(
`3:46–4:09 (23 s)
B: "Na concorrência olhamos duas coisas: o esforço para começar e o que a ferramenta entrega. Pelo que cada empresa divulga, cartões, tags, telemetria e a Infleet partem de contrato, instalação ou assinatura."
A: "Até onde encontramos, nenhum faz isso grátis com a planilha do gestor. O Fleet Force é a porta de entrada da Sem Parar."
(Não criticar ninguém nem afirmar o que não conseguimos comprovar. Dizer "não encontramos", nunca "não existe". A posição de cada empresa é avaliação do grupo pelo que ela divulga. A tabela de apoio, depois do slide da equipe, mostra quem faz o quê.)`);

  // ================= 13 VALIDAÇÃO =================
  s = slide(K.paper);
  kicker(s, "VALIDAÇÃO", 120, 96);
  nav(s, 4, "claro"); sig(s, false);
  T(s, [run("Como vamos saber ", K.ink), run("que funciona", K.blue)], { x: 120, y: 128, w: 1700, h: 110, font: DISP, size: 88, bold: true });
  T(s, "O QUE JÁ TEMOS NA SPRINT 1", { x: 120, y: 290, w: 900, h: 30, font: BODYS, size: 19, color: K.blue, cs: 3 });
  [["30", "critérios de aceite definidos para as 3 user stories da Sprint 1"], ["3 de 5", "user stories validadas; as outras 2 entram nas próximas sprints"],
   ["19/10", "na orientação, o professor considerou que a proposta faz sentido"]].forEach(([n, d], i) => {
    const x = 120 + i * 580;
    T(s, n, { x, y: 335, w: 540, h: 160, font: DISP, size: 136, bold: true, color: K.blue });
    T(s, d, { x, y: 505, w: 500, h: 110, size: 26, color: K.ink, lh: 1.1 });
  });
  T(s, "FONTE: ATA DA ORIENTAÇÃO COM O PROFESSOR (19/10/2026) E USER STORIES DA SPRINT 1", { x: 120, y: 632, w: 1680, h: 30, font: BODYS, size: 15, color: K.muted, cs: 1 });
  Rc(s, { x: 120, y: 680, w: 1680, h: 2, fill: K.line });
  T(s, "O QUE FUNCIONA, O QUE É SIMULADO E O QUE FALTA", { x: 120, y: 712, w: 1400, h: 30, font: BODYS, size: 19, color: K.blue, cs: 3 });
  [[K.green, "FUNCIONA HOJE", "Cálculo das 3 user stories e telas, com dados de demonstração"], [K.gray, "SIMULADO", "Frota de 40 veículos e eventos do kit de sensores, gerados por script"],
   [K.amber, "A DESENVOLVER", "Importação real, sensores e OBD no veículo, IA que explica, dados reais"]].forEach(([cor, t, d], i) => {
    const x = 120 + i * 580;
    Ov(s, x, 770, 24, cor);
    T(s, t, { x: x + 40, y: 764, w: 480, h: 36, font: BODYS, size: 24, color: K.ink, cs: 2 });
    T(s, d, { x: x + 40, y: 808, w: 500, h: 90, size: 24, color: K.text, lh: 1.12 });
  });
  T(s, "METAS DE SUCESSO: menos de 2 min do arquivo ao painel · linhas classificadas sem ajuste manual · todo número com fonte e conta aberta · R$ por ano de economia encontrada", { x: 120, y: 940, w: 1680, h: 60, font: BODYS, size: 18, color: K.muted, lh: 1.2 });
  s.addNotes(
`4:09–4:28 (19 s)
B: "Definimos 30 critérios de aceite, e o professor achou que a proposta faz sentido. Hoje funcionam o cálculo e as telas; frota e kit são simulados."
A: "O resto vamos desenvolver, e mediremos o sucesso pelo tempo até o painel e pela fonte de cada número."
(Só para perguntas: o protótipo de demonstração tem 28 testes automáticos que passam (19/10), cobrindo 27 dos 30 critérios; os 3 restantes são de tela. Os 16 veículos com problema plantado foram todos encontrados. É caso de demonstração, não dado real, e a economia mostrada é simulação, ainda não comprovada. Os limites do semáforo e os percentuais dos cenários (50% e 80%) ainda são hipóteses do grupo.)`);

  // ================= 14 ROADMAP =================
  s = slide(K.dark);
  kicker(s, "ROADMAP", 120, 96, K.blue3);
  nav(s, 5, "escuro"); sig(s, true);
  T(s, [run("O que existe ", K.white), run("e o que vem", K.blue4)], { x: 120, y: 128, w: 1700, h: 120, font: DISP, size: 88, bold: true });
  Rc(s, { x: 0, y: 402, w: 1920, h: 4, fill: "475467" });
  [["SPRINT 1", "Proposta", [["Funciona: ", "cálculo das 3 US e telas, no demo"], ["Simulado: ", "kit de sensores"]]],
   ["SPRINT 2", "Base funcional", [["A desenvolver: ", "importar CSV/Excel, primeiro painel, kit em bancada e leitura pela porta OBD"]]],
   ["SPRINT 3", "Valor financeiro", [["A desenvolver: ", "benchmark com fontes, economia rastreável e relatório do CFO"]]],
   ["SPRINT 4", "Integrado", [["A desenvolver: ", "fluxo ponta a ponta, sem depender das APIs da Sem Parar"], ["Depende de parceria: ", "piloto com dados autorizados"]]]].forEach(([sp, t, itens], i) => {
    const x = 160 + i * 440, atual = i === 0;
    Ov(s, x, 365, 80, atual ? K.blue : K.dark, atual ? null : K.white);
    T(s, String(i + 1), { x, y: 365, w: 80, h: 80, font: DISP, size: 40, bold: true, color: K.white, align: "center", valign: "middle" });
    if (atual) pill(s, "ESTAMOS AQUI", x - 10, 285, 220, K.blue, K.white);
    T(s, sp, { x, y: 490, w: 400, h: 34, font: BODYS, size: 19, color: atual ? K.blue3 : K.soft, cs: 2 });
    T(s, t, { x, y: 530, w: 410, h: 60, font: DISP, size: 40, bold: true, color: K.white });
    const runs = [];
    itens.forEach(([r, d], j) => { runs.push(run(r, K.white, { bold: true })); runs.push(run(d, K.soft, j < itens.length - 1 ? { breakLine: true } : {})); });
    T(s, runs, { x, y: 600, w: 390, h: 220, size: 24, lh: 1.12, psa: 8 });
  });
  [[K.green, "Funciona hoje", "cálculo e telas, com dados de demonstração"], [K.gray, "Simulado", "frota de demonstração e kit de sensores"], [K.amber, "A desenvolver", "importação real, OBD, bancada e IA que explica"], [K.blue4, "Depende de parceria", "piloto com dados autorizados e APIs da Sem Parar"]].forEach(([cor, t, d], i) => {
    const x = 120 + i * 440;
    Ov(s, x, 868, 22, cor);
    T(s, [run(t, K.white, { bold: true, breakLine: true }), run(d, K.soft)], { x: x + 38, y: 858, w: 380, h: 100, size: 22, lh: 1.12 });
  });
  rail(s, 1070);
  s.addNotes(
`4:28–4:40 (12 s)
A: "Sprint 2: importação real, kit em bancada e porta OBD. Sprint 3: benchmark e relatório do CFO. Sprint 4: tudo integrado, sem depender das APIs da Sem Parar."
(Se perguntarem: a IA entra como assistente que explica os números, e o piloto com dados reais só depois de uma parceria. Em qual Sprint entra o OBD ainda precisa de alinhamento do grupo; hoje está na Sprint 2.)`);

  // ================= 15 EQUIPE =================
  s = slide(K.white);
  kicker(s, "EQUIPE", 120, 96);
  nav(s, 6, "claro");
  T(s, [run("Quem faz o ", K.ink), run("Fleet Force", K.blue)], { x: 120, y: 128, w: 1700, h: 110, font: DISP, size: 88, bold: true });
  // fotos padronizadas: trocar os círculos pelas fotos (mesmo fundo, roupas de cor parecida)
  const equipe = [["GR", "Gustavo Rezende", "[papel · formação · experiência]"], ["JV", "João Paulo Ventura", "[papel · formação · experiência]"],
    ["LF", "Ludson Fernandes", "Negócios B2B · 12 anos em telecom corporativo"], ["RM", "Rafael Medici", "[papel · formação · experiência]"], ["VP", "Vini Pereira", "[papel · formação · experiência]"]];
  equipe.forEach(([ini, nome, papel], i) => {
    const x = 120 + i * 341, cxp = x + 50;
    Ov(s, cxp, 290, 200, K.blue50);
    T(s, ini, { x: cxp, y: 290, w: 200, h: 200, font: DISP, size: 64, bold: true, color: K.blue, align: "center", valign: "middle" });
    T(s, nome, { x, y: 515, w: 310, h: 90, font: DISP, size: 32, bold: true, color: K.ink, align: "center", valign: "bottom", lh: 1.05 });
    T(s, papel, { x: x + 10, y: 622, w: 290, h: 90, size: 22, color: papel.startsWith("[") ? K.gray : K.text, align: "center", lh: 1.1 });
  });
  T(s, [run("Gratidão. ", K.ink), run("Vamos às perguntas?", K.blue)], { x: 120, y: 745, w: 1400, h: 120, font: DISP, size: 84, bold: true });
  T(s, [run("Para o gestor, decisões melhores. ", K.ink), run("Para a Sem Parar, clientes que já chegam com a dor medida.", K.blue)], { x: 120, y: 880, w: 1400, h: 100, size: 30, font: BODYS, lh: 1.15 });
  const lw2 = 230, lh2 = Math.round((lw2 * LGdim.full[1]) / LGdim.full[0]);
  s.addImage({ path: LG.full, x: px(1570), y: px(800), w: px(lw2), h: px(lh2) });
  rail(s, 1070);
  s.addNotes(
`4:40–4:50 (10 s)
A: "Somos a FleetForce: [nomes, um papel cada]."
B: "Para o gestor, decisões melhores; para a Sem Parar, clientes com a dor medida. Gratidão, vamos às perguntas?"`);

  // ================= APOIO: POR QUE NÃO DESENVOLVER INTERNAMENTE =================
  s = slide(K.paper);
  kicker(s, "APOIO · PERGUNTA PROVÁVEL", 120, 96);
  sig(s, false);
  T(s, [run("Por que não fazer ", K.ink, { breakLine: true }), run("isso dentro da Sem Parar?", K.blue)], { x: 120, y: 128, w: 1700, h: 210, font: DISP, size: 80, bold: true, lh: 1.05 });
  [["Não é mais um sistema de gestão de frotas", "A Sem Parar já tem soluções para a frota. O Fleet Force organiza as oportunidades para elas."],
   ["É um funil de aquisição e expansão", "O diagnóstico grátis qualifica a empresa antes do contato comercial, com consentimento."],
   ["É uma hipótese, não uma certeza", "Queremos validar com a Sem Parar o interesse, o custo e a taxa de conversão."]].forEach(([t, d], i) => {
    const x = 120 + i * 580, tc = i === 0 ? K.ink : K.white;
    Rc(s, { x, y: 380, w: 540, h: 400, fill: i === 2 ? K.blue : i === 0 ? K.white : K.ink, r: 20, line: i === 0 ? K.line : null, lw: 1 });
    T(s, "0" + (i + 1), { x: x + 34, y: 410, w: 200, h: 40, font: BODYS, size: 22, color: i === 0 ? K.blue : i === 2 ? K.white : K.blue3, cs: 2 });
    T(s, t, { x: x + 34, y: 460, w: 472, h: 160, font: DISP, size: 34, bold: true, color: tc, lh: 1.08 });
    T(s, d, { x: x + 34, y: 635, w: 472, h: 130, size: 25, color: tc, lh: 1.12 });
  });
  T(s, "MENSAGEM CENTRAL", { x: 120, y: 830, w: 900, h: 30, font: BODYS, size: 19, color: K.blue, cs: 3 });
  T(s, "Transformar dados de frotas em economia para o gestor e em oportunidades de negócio para a Sem Parar.", { x: 120, y: 875, w: 1680, h: 110, size: 34, font: BODYS, color: K.ink, lh: 1.15 });
  s.addNotes("Slide de apoio, fora dos 5 minutos. Para a pergunta \"por que a Sem Parar apostaria nisso em vez de desenvolver internamente?\". Resposta: o Fleet Force pode ser a porta de entrada que organiza oportunidades para as soluções que a Sem Parar já tem, usando um diagnóstico gratuito para qualificar o cliente. É um novo funil de aquisição e expansão, não um novo produto de gestão de frotas. É uma hipótese que queremos validar com eles, não uma certeza. Mostra respeito pelo que eles já fazem.");

  // ================= APOIO: IA =================
  s = slide(K.dark);
  kicker(s, "APOIO · INTELIGÊNCIA ARTIFICIAL", 120, 96, K.blue3);
  sig(s, true);
  T(s, [run("Onde a IA entra ", K.white), run("e onde não", K.blue4)], { x: 120, y: 128, w: 1600, h: 110, font: DISP, size: 88, bold: true });
  [["CALCULA · HOJE NO PROTÓTIPO", "Regras e estatística, tudo auditável", ["Soma e classifica as 8 categorias de custo", "Compara com a mediana do mesmo tipo de veículo", "Usa referência pública com fonte e data (ANP)", "Cenários de economia com a conta aberta"], K.panel, K.white],
   ["ASSISTENTE DE IA · PREVISTO, NÃO IMPLEMENTADO", "Explica o que já foi calculado", ["Explica por que um custo subiu", "Resume as anomalias do período", "Sugere ações a partir de valores já calculados", "Não gera números próprios"], K.blue, K.white]].forEach(([t, sub, itens, fill, tc], i) => {
    const x = 120 + i * 860;
    Rc(s, { x, y: 290, w: 820, h: 540, fill, r: 24, line: i === 0 ? "475467" : null, lw: 1 });
    T(s, t, { x: x + 40, y: 322, w: 760, h: 30, font: BODYS, size: 17, color: i === 0 ? K.blue3 : K.white, cs: 2 });
    T(s, sub, { x: x + 40, y: 365, w: 740, h: 80, font: DISP, size: 38, bold: true, color: tc, lh: 1.05 });
    itens.forEach((it, j) => {
      const y = 470 + j * 84;
      Rc(s, { x: x + 40, y: y + 14, w: 16, h: 5, fill: i === 0 ? K.blue4 : K.white, r: 2 });
      T(s, it, { x: x + 74, y, w: 700, h: 72, size: 28, color: tc, lh: 1.05 });
    });
  });
  T(s, "DEPOIS, SE HOUVER DADOS E TESTES ADEQUADOS", { x: 120, y: 880, w: 1400, h: 30, font: BODYS, size: 17, color: K.blue3, cs: 2 });
  T(s, "Extração de PDF e foto e modelos preditivos. Nada disso está no protótipo de hoje.", { x: 120, y: 925, w: 1680, h: 60, size: 30, color: K.soft, lh: 1.1 });
  s.addNotes("Slide de apoio, fora dos 5 minutos. Para a pergunta \"e a IA?\". O cálculo, o benchmark e a economia usam regras e estatística auditáveis: dá para abrir a conta. O assistente conversacional é uma extensão prevista: explica aumentos de custo, resume anomalias e sugere ações a partir de valores já calculados, sem gerar números próprios. Extração de PDF e foto e modelos preditivos são possibilidades posteriores, sujeitas a testes e dados adequados. Não dizer que a IA já existe no protótipo.");

  // ================= APOIO: CONCORRÊNCIA EM DETALHE =================
  s = slide(K.paper);
  kicker(s, "APOIO · CONCORRÊNCIA EM DETALHE", 120, 96);
  sig(s, false);
  T(s, [run("Quem faz ", K.ink), run("o quê", K.blue)], { x: 120, y: 128, w: 1000, h: 100, font: DISP, size: 80, bold: true });
  const colsC = ["Sem contrato nem instalação", "Usa a planilha que o gestor já tem", "Todas as categorias de custo", "Compara com referência", "Economia em R$ por ação"];
  const cx0 = 600, cw = 240;
  colsC.forEach((c, j) => T(s, c, { x: cx0 + j * cw, y: 240, w: cw - 30, h: 90, size: 20, font: BODYS, color: K.ink, lh: 1.05, valign: "bottom" }));
  // 2 = faz · 1 = em parte · 0 = não encontramos
  const linhas = [["Cartões", "Ticket Log, Pluxee, ValeCard", [0, 0, 1, 1, 0]], ["Tag e plataforma", "Veloe, ConectCar", [0, 0, 1, 1, 0]],
    ["Telemetria", "Cobli, Sascar", [0, 0, 1, 1, 0]], ["Infleet", "telemetria, abastecimento e manutenção com IA", [0, 0, 1, 1, 1]],
    ["Planilhas grátis", "RoutEasy, calculadoras de custo/km", [2, 1, 1, 0, 0]], ["Fleet Force", "diagnóstico grátis, porta de entrada", [2, 2, 2, 1, 2]]];
  linhas.forEach(([n, d, v], i) => {
    const y = 350 + i * 98, nos = i === 5;
    if (nos) Rc(s, { x: 96, y: y - 10, w: 1730, h: 92, fill: K.blue, r: 16 });
    else Rc(s, { x: 120, y: y + 84, w: 1680, h: 2, fill: K.line });
    T(s, n, { x: 120, y, w: 460, h: 46, font: DISP, size: 34, bold: true, color: nos ? K.white : K.ink });
    T(s, d, { x: 120, y: y + 44, w: 470, h: 30, size: 19, color: nos ? K.white : K.muted });
    v.forEach((val, j) => {
      const x = cx0 + j * cw + 8, cor = nos ? K.white : K.blue;
      if (val === 2) Ov(s, x, y + 16, 40, cor);
      else if (val === 1) { Ov(s, x, y + 16, 40, null, cor); Rc(s, { x: x + 4, y: y + 20, w: 16, h: 32, fill: cor, r: 0 }); }
      else Rc(s, { x: x + 8, y: y + 34, w: 24, h: 4, fill: K.gray, r: 2 });
    });
  });
  T(s, "●  faz     ◐  em parte     -  não encontramos     ·     Avaliação do grupo pelo que cada empresa divulga (sites e imprensa, 2021 a 2026). Fontes no último slide.",
    { x: 120, y: 970, w: 1700, h: 60, font: BODYS, size: 16, color: K.muted, lh: 1.2 });
  s.addNotes("Slide de apoio, fora dos 5 minutos. Para a pergunta \"e a concorrência?\". Infleet é a mais parecida: junta dados e sugere ações com IA, mas é assinatura com integrações e telemetria. Geotab e Samsara (fora do Brasil) comparam a frota com outras parecidas, só para clientes deles.");

  // ================= APOIO: GASTOS E MODELO =================
  s = slide(K.paper);
  kicker(s, "APOIO · GASTOS DA FROTA", 120, 96);
  sig(s, false);
  T(s, [run("Para onde vai ", K.ink), run("o dinheiro", K.blue)], { x: 120, y: 128, w: 1500, h: 110, font: DISP, size: 80, bold: true });
  T(s, `Frota de demonstração: ${frotaTxt}; média por mês (jul a set/2026)`, { x: 120, y: 245, w: 1500, h: 40, size: 26, color: K.muted });
  // maior categoria em azul, as demais em neutros (um destaque só)
  const cores = [K.blue, K.ink, "475467", "667085", "98A2B3", "B8C0CC", "CBD2DC", "D8DEE9"];
  const cats = [...u1.categorias].sort((a, b) => b.valor - a.valor);
  let bx = 120;
  cats.forEach((c, i) => { const w = (1000 * c.pct) / 100; Rc(s, { x: bx, y: 315, w: Math.max(w, 3), h: 80, fill: cores[i] }); bx += w; });
  cats.forEach((c, i) => {
    const x = 120 + (i % 2) * 520, y = 440 + Math.floor(i / 2) * 78;
    Rc(s, { x, y: y + 8, w: 22, h: 22, fill: cores[i], r: 4, line: i > 5 ? K.gray : null, lw: 1 });
    T(s, c.nome, { x: x + 40, y, w: 250, h: 40, size: 25, font: BODYS, color: K.ink });
    T(s, c.pct.toFixed(1).replace(".", ",") + "%", { x: x + 280, y, w: 90, h: 40, size: 25, color: K.muted, align: "right" });
    T(s, brl(c.valor / u1.periodo.length), { x: x + 370, y, w: 140, h: 40, size: 25, color: K.ink, align: "right" });
  });
  Rc(s, { x: 1240, y: 300, w: 2, h: 640, fill: K.line });
  T(s, brl(u1.custo_por_veiculo_mes), { x: 1300, y: 300, w: 580, h: 130, font: DISP, size: 100, bold: true, color: K.blue });
  T(s, "por veículo por mês", { x: 1300, y: 430, w: 500, h: 40, size: 28, color: K.ink });
  T(s, "R$ " + u1.custo_por_km.toFixed(2).replace(".", ","), { x: 1300, y: 560, w: 580, h: 130, font: DISP, size: 100, bold: true, color: K.ink });
  T(s, "por km rodado", { x: 1300, y: 690, w: 500, h: 40, size: 28, color: K.ink });
  T(s, "VALORES DA FROTA DE DEMONSTRAÇÃO", { x: 1300, y: 880, w: 560, h: 30, font: BODYS, size: 15, color: K.muted, cs: 1 });
  s.addNotes("Slide de apoio, fora dos 5 minutos. Para perguntas sobre os gastos da frota. Valores da frota de demonstração. O diagnóstico é grátis para o gestor (slide de modelo de negócio).");

  // ================= FONTES =================
  s = slide(K.paper);
  kicker(s, "APOIO · FORA DOS 5 MINUTOS", 120, 96);
  sig(s, false);
  T(s, [run("Fontes ", K.ink), run("dos números", K.blue)], { x: 120, y: 128, w: 1600, h: 110, font: DISP, size: 80, bold: true });
  const fontes = [
    ["ANP", "Levantamento de Preços de Combustíveis, resumo semanal 04 a 10/10/2026, SP: diesel S10 R$ 7,32 (866 postos), gasolina comum R$ 6,36 (1.253), etanol R$ 3,86 (1.247)."],
    ["DOE/ARGONNE", "Idling Reduction for Long-Haul Trucks (AFDC, 2015): 0,8 galão/h parado, cerca de 3 l/h."],
    ["SETCESP", "“Sem Parar Empresas ainda mais completa”: levantamento com gestores, redução de mais de 30% no combustível."],
    ["SEM PARAR", "sempararempresas.com.br/sobre: confiança, abrangência, eficiência e otimização, foco nas pessoas, visão inovadora."],
    ["LEI SP", "Lei 13.296/2008, art. 9º: IPVA de caminhões 1,5%; vans e carros flex 4% assumido, a confirmar na Alesp."],
    ["FROTA DEMO", "Dados de demonstração gerados pelo grupo: 16 caminhões, 12 vans e 12 carros flex, jul a set/2026. Eventos do kit de sensores simulados por script."],
    ["MEDIANA", "Consumo, manutenção e pneus comparados com a mediana dos veículos do mesmo tipo (mínimo de 5 por grupo). Etanol: regra prática de rendimento de 70% da gasolina."],
    ["CONCORRÊNCIA", "Ticket Log (Edenred 2021), Pluxee, ValeCard e RoutEasy (Mundo Logística), Veloe (SETCESP), ConectCar (Neofeed), Cobli (Forbes 2021, Mobile Time 2023), Sascar (Michelin), Infleet (Brazil Journal, Teletime 2025)."],
    ["CEO SEM PARAR", "Times Brasil (CNBC), 10/06/2026: “CEO do Sem Parar Empresas vê IA como ferramenta para reduzir custos de frotas”."],
    ["PROPOSTA DO GRUPO", "Proposta de Rafael Medici e ata da orientação (Ludson Fernandes), 19/10/2026: posicionamento, IA explicativa prevista, hipótese de negócio, LGPD, critérios e roadmap. São hipóteses, não resultados."],
  ];
  fontes.forEach(([k, t], i) => {
    const y = 262 + i * 78;
    Rc(s, { x: 120, y: y - 18, w: 1680, h: 2, fill: K.line });
    T(s, k, { x: 120, y, w: 270, h: 34, font: BODYS, size: 18, color: K.blue, cs: 1 });
    T(s, t, { x: 410, y: y - 4, w: 1390, h: 72, size: 22, color: K.ink, lh: 1.1 });
  });
  s.addNotes("Slide de apoio, fora dos 5 minutos. Deixar pronto para a rodada de perguntas.");

  await pres.writeFile({ fileName: OUT });
  if (applyTheme) await applyTheme(OUT, THEME);
  console.log("ok ->", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
