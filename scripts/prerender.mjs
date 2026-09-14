/**
 * Pré-renderização — grava um index.html por rota depois do build do Vite.
 *
 * O PROBLEMA que isto resolve
 * ---------------------------
 * O site é uma aplicação de página única: o servidor devolve sempre o mesmo
 * index.html, e título, descrição e canônica só passam a existir depois que o
 * navegador executa o JavaScript. O Google executa e enxerga tudo certo, mas
 * três leitores importantes NÃO executam:
 *
 *   · WhatsApp, ao montar a pré-visualização de um link enviado numa conversa;
 *   · Facebook e Instagram, ao montar o card de um link compartilhado;
 *   · qualquer robô que leia só o HTML cru.
 *
 * Para eles, toda página do site parecia a home. Um link da Tabela de Valores
 * mandado para um cliente aparecia como "aves ornamentais à pronta entrega",
 * não como a tabela — num negócio que fecha no WhatsApp, isso custa venda.
 *
 * COMO FUNCIONA
 * -------------
 * Depois de `vite build`, este script lê dist/index.html e, para cada rota,
 * grava uma cópia em dist/<rota>/index.html com:
 *
 *   · <title>, description, canonical e as tags Open Graph corretas;
 *   · um bloco de conteúdo real dentro de #root, com <h1> e links <a href>
 *     de verdade — o React substitui esse bloco ao montar, mas quem não roda
 *     JavaScript lê o texto e consegue navegar.
 *
 * A Netlify serve dist/aves/index.html para /aves automaticamente, e a regra
 * coringa do _redirects continua cobrindo o que não tiver arquivo.
 *
 * FONTE ÚNICA
 * -----------
 * Título e descrição vêm de src/seo.ts, o mesmo módulo que o App usa em tempo
 * de execução. Não há tabela duplicada aqui: mudar o texto num lugar muda nos
 * dois, e não existe como um sair do outro.
 */
import { build } from 'esbuild';
import { mkdir, readFile, writeFile, rm, copyFile, appendFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const RAIZ = process.cwd();
const DIST = join(RAIZ, 'dist');
const TMP = join(RAIZ, '.prerender-tmp');

/** Escapa o que vai virar atributo ou texto de HTML. */
const esc = (t) =>
  String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * src/seo.ts é TypeScript e importa outros módulos do projeto, então o Node não
 * consegue importá-lo direto. O esbuild (já usado pelo Vite) transpila para um
 * .mjs temporário que o Node importa normalmente.
 */
async function carregarSeo() {
  await mkdir(TMP, { recursive: true });
  const saida = join(TMP, 'seo.mjs');
  await build({
    entryPoints: [join(RAIZ, 'src/seo.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    // src/marcas.ts lê import.meta.env.VITE_MARCA, que só existe dentro do Vite.
    // Aqui o Node importa o bundle direto, então o valor entra por define —
    // a mesma variável que a Netlify usa no build de cada marca.
    define: { 'import.meta.env': JSON.stringify({ VITE_MARCA: process.env.VITE_MARCA ?? 'aob' }) },
    outfile: saida,
    logLevel: 'silent',
  });
  return import(`file://${saida}`);
}

/** Troca uma meta/link já existente no HTML, ou insere antes de </head>. */
function trocarTag(html, seletorRegex, tagNova) {
  return seletorRegex.test(html)
    ? html.replace(seletorRegex, tagNova)
    : html.replace('</head>', `  ${tagNova}\n  </head>`);
}

/**
 * Conteúdo visível sem JavaScript. Não tenta imitar a página inteira — dá o
 * essencial: o que a página é, e como chegar às outras. Os links são <a href>
 * de verdade porque o menu do site é feito de botões, e um robô que não executa
 * JavaScript não consegue seguir botão nenhum.
 */
function corpoEstatico({ titulo, descricao, caminhos, rotaAtual, ocultas }) {
  const navegacao = Object.entries(caminhos)
    .filter(([rota]) => rota !== rotaAtual && !ocultas.has(rota))
    .map(([rota, caminho]) => `<a href="${caminho}">${esc(rota)}</a>`)
    .join(' · ');
  return `<div id="conteudo-sem-js">
      <h1>${esc(titulo)}</h1>
      <p>${esc(descricao)}</p>
      <nav>${navegacao}</nav>
    </div>`;
}

async function main() {
  const { META, SITE, M: MARCA, TEMA, OG_IMAGEM, PAGINAS_AVES, JSONLD_ORGANIZACAO, jsonldAve, EH_REDE } = await carregarSeo();
  // Rotas que esta marca não linka no menu ficam fora do sitemap (existem, mas não são convite).
  const foraDoSitemap = new Set(['pedido', 'privacidade', EH_REDE ? 'sanidade' : 'consultoria']);
  const { CAMINHOS } = await carregarCaminhos();
  const base = await readFile(join(DIST, 'index.html'), 'utf8');

  let gravadas = 0;
  // Rotas que não existem nesta marca: não ganham página (e, abaixo, viram 301).
  const inexistentes = new Set(EH_REDE ? [] : ['consultoria']);
  for (const [rota, { titulo, descricao }] of Object.entries(META)) {
    const caminho = CAMINHOS[rota];
    if (!caminho || inexistentes.has(rota)) continue;
    const url = SITE + caminho;

    let html = base;
    // O index.html vem com os textos do AOB escritos à mão; nos sites de marca
    // (VITE_MARCA) a home também precisa da meta própria — site_name, canonical,
    // og:url e theme-color inclusive. Por isso a home passa por aqui como as outras.
    html = trocarTag(html, /<meta property="og:site_name"[^>]*>/, `<meta property="og:site_name" content="${esc(MARCA)}" />`);
    html = trocarTag(html, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${OG_IMAGEM}" />`);
    html = comFavicon(html);
    if (TEMA) html = trocarTag(html, /<meta name="theme-color"[^>]*>/, `<meta name="theme-color" content="${TEMA}" />`);
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(titulo)}</title>`);
    html = trocarTag(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(descricao)}" />`);
    html = trocarTag(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
    html = trocarTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(titulo)}" />`);
    html = trocarTag(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(descricao)}" />`);
    html = trocarTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);
    html = trocarTag(html, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(titulo)}" />`);
    html = trocarTag(html, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(descricao)}" />`);

    // A página de pedido não deve ser indexada (o _redirects já a bloqueia no robots).
    if (rota === 'pedido') {
      html = trocarTag(html, /<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow" />');
    }

    html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(JSONLD_ORGANIZACAO)}</script>\n  </head>`);
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${corpoEstatico({ titulo, descricao, caminhos: CAMINHOS, rotaAtual: rota, ocultas: new Set([...foraDoSitemap, ...inexistentes]) })}</div>`,
    );

    const destino = caminho === '/' ? join(DIST, 'index.html') : join(DIST, caminho.replace(/^\//, ''), 'index.html');
    await mkdir(dirname(destino), { recursive: true });
    await writeFile(destino, html, 'utf8');
    gravadas++;
  }

  // Uma página por ave: /aves/<slug>/index.html com meta, imagem e Product em JSON-LD.
  for (const p of PAGINAS_AVES) {
    const url = SITE + p.caminho;
    let html = base;
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(p.titulo)}</title>`);
    html = trocarTag(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(p.descricao)}" />`);
    html = trocarTag(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
    html = trocarTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(p.titulo)}" />`);
    html = trocarTag(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(p.descricao)}" />`);
    html = trocarTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);
    html = trocarTag(html, /<meta property="og:site_name"[^>]*>/, `<meta property="og:site_name" content="${esc(MARCA)}" />`);
    html = trocarTag(html, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${p.imagem ?? OG_IMAGEM}" />`);
    if (p.imagem) {
      html = trocarTag(html, /<meta property="og:image:width"[^>]*>/, '<meta property="og:image:width" content="1200" />');
      html = trocarTag(html, /<meta property="og:image:height"[^>]*>/, '<meta property="og:image:height" content="900" />');
    }
    if (TEMA) html = trocarTag(html, /<meta name="theme-color"[^>]*>/, `<meta name="theme-color" content="${TEMA}" />`);
    html = comFavicon(html);
    html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(jsonldAve(p))}</script>\n  </head>`);
    const corpo = `<div id="conteudo-sem-js">
      <h1>${esc(p.nome)}</h1>
      <p><em>${esc(p.cientifico)}</em> · ${esc(p.grupo)} · ${p.preco === null ? 'sob consulta' : 'a partir de R$ ' + p.preco.toLocaleString('pt-BR')}</p>
      ${p.imagem ? `<img src="${p.imagem}" alt="${esc(p.nome)}" width="1200" height="900" />` : ''}
      <p>${esc(p.resumo || p.descricao)}</p>
      <nav><a href="${CAMINHOS.aves}">Ver todas as aves</a> · <a href="${CAMINHOS.home}">${esc(MARCA)}</a></nav>
    </div>`;
    html = html.replace('<div id="root"></div>', `<div id="root">${corpo}</div>`);
    const destino = join(DIST, 'aves', p.slug, 'index.html');
    await mkdir(dirname(destino), { recursive: true });
    await writeFile(destino, html, 'utf8');
    gravadas++;
  }

  // sitemap.xml e robots.txt da marca deste build (o public/ trazia os do AOB fixos).
  const hoje = new Date().toISOString().slice(0, 10);
  const urls = [
    ...Object.entries(CAMINHOS).filter(([r]) => !foraDoSitemap.has(r) && !inexistentes.has(r)).map(([, c]) => ({ loc: SITE + c, pri: c === '/' ? '1.0' : '0.8' })),
    ...PAGINAS_AVES.map((p) => ({ loc: SITE + p.caminho, pri: p.emEstoque ? '0.7' : '0.5' })),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${hoje}</lastmod><priority>${u.pri}</priority></url>`).join('\n') + '\n</urlset>\n';
  await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
  await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /pedido\nSitemap: ${SITE}/sitemap.xml\n`, 'utf8');

  await arquivosDaMarca({ inexistentes, CAMINHOS });

  await rm(TMP, { recursive: true, force: true });
  console.log(`prerender: ${gravadas} páginas gravadas com meta própria (${PAGINAS_AVES.length} de aves) · sitemap com ${urls.length} URLs`);
}

const MARCA_ID = process.env.VITE_MARCA ?? 'aob';
const existe = (p) => access(p).then(() => true, () => false);

/**
 * Favicon por marca. O index.html traz os ícones do AOB; para as outras marcas,
 * public/marca/<id>/ tem favicon-32.png, favicon-192.png e icone.svg (quando há).
 */
function comFavicon(html) {
  if (MARCA_ID === 'aob') return html;
  const base = `/marca/${MARCA_ID}`;
  html = html.replace(/<link rel="icon" type="image\/svg\+xml"[^>]*>\n?/, '');
  html = html.replace(/<link rel="icon" type="image\/png" sizes="32x32"[^>]*>/, `<link rel="icon" type="image/png" sizes="32x32" href="${base}/favicon-32.png" />`);
  html = html.replace(/<link rel="apple-touch-icon"[^>]*>/, `<link rel="apple-touch-icon" href="${base}/favicon-192.png" />`);
  return html;
}

/**
 * O public/ é um só para as três marcas. O que muda por marca é copiado aqui, por cima:
 *   · favicon.ico                  ← public/marca/<id>/favicon.ico (ou o do AOB)
 *   · lista-aves-disponiveis.pdf   ← public/marca/<id>/lista.pdf (o PDF da própria marca)
 *   · _redirects                   ← ganha os 301 das rotas que a marca não tem
 * E o que é material de trabalho (LEIA-ME, manifesto, fotos da Stima fora da Stima)
 * sai do dist para não ser servido.
 */
async function arquivosDaMarca({ inexistentes, CAMINHOS }) {
  const pasta = join(RAIZ, 'public', 'marca', MARCA_ID);
  for (const [origem, destino] of [['favicon.ico', 'favicon.ico'], ['lista.pdf', 'lista-aves-disponiveis.pdf']]) {
    if (await existe(join(pasta, origem))) await copyFile(join(pasta, origem), join(DIST, destino));
  }
  const regras = [...inexistentes].map((r) => `${CAMINHOS[r]}  ${CAMINHOS.sanidade}  301!\n${CAMINHOS[r].replace(/\/$/, '')}  ${CAMINHOS.sanidade}  301!`);
  if (regras.length) {
    const atual = await readFile(join(DIST, '_redirects'), 'utf8');
    // As regras da marca entram ANTES do coringa, senão nunca são lidas.
    await writeFile(join(DIST, '_redirects'), atual.replace('/*  /index.html', regras.join('\n') + '\n/*  /index.html'), 'utf8');
  }
  const lixo = ['LEIA-ME.md', 'manifesto.json', 'aves-stima (pasta de fotos)', 'SEO e medicao - Stima e AOB', 'aves-stima/manifesto.json', 'aves-stima/LEIA-ME.md'];
  if (MARCA_ID !== 'stima') lixo.push('aves-stima');
  // Cópias soltas das fotos da Stima na raiz do public (upload errado de 14/09): fora do dist.
  const { readdir } = await import('node:fs/promises');
  for (const f of await readdir(DIST)) if (f.endsWith('.webp') && await existe(join(RAIZ, 'public', 'aves-stima', f))) lixo.push(f);
  for (const l of lixo) await rm(join(DIST, l), { recursive: true, force: true });
  for (const m of ['aob', 'stima', 'alianca']) if (m !== MARCA_ID) await rm(join(DIST, 'marca', m), { recursive: true, force: true });
}

/** CAMINHOS mora em src/lib/links.ts; mesma transpilação do seo.ts. */
async function carregarCaminhos() {
  const saida = join(TMP, 'links.mjs');
  await build({
    entryPoints: [join(RAIZ, 'src/lib/links.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    // src/marcas.ts lê import.meta.env.VITE_MARCA, que só existe dentro do Vite.
    // Aqui o Node importa o bundle direto, então o valor entra por define —
    // a mesma variável que a Netlify usa no build de cada marca.
    define: { 'import.meta.env': JSON.stringify({ VITE_MARCA: process.env.VITE_MARCA ?? 'aob' }) },
    outfile: saida,
    logLevel: 'silent',
  });
  return import(`file://${saida}`);
}

main().catch((e) => {
  console.error('prerender falhou:', e);
  process.exit(1);
});
