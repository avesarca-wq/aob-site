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
import { mkdir, readFile, writeFile, rm, copyFile, appendFile, access, readdir } from 'node:fs/promises';
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
  const { imagem, SIZES_FICHA } = await carregarImagens();
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
    html = comMarca(comFontes(comFavicon(html)));
    html = await comPedacoDaRota(html, rota);
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
    html = trocarTag(html, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${p.imagem}" />`);
    if (TEMA) html = trocarTag(html, /<meta name="theme-color"[^>]*>/, `<meta name="theme-color" content="${TEMA}" />`);
    html = comMarca(comFontes(comFavicon(html)));
    // A foto da ficha é o LCP. Sem isto o navegador só a descobre quando o React
    // monta; o preload deixa o download começar junto com o do JavaScript, e com
    // o mesmo srcset/sizes do site, para vir a variante do tamanho da tela.
    // Só a foto de verdade entra no preload e no corpo sem JS. A ave sem foto
    // mostra a moldura da categoria na tela; a placa de /og/ é para o
    // compartilhamento e para o JSON-LD, não para o primeiro render.
    const foto = p.temFotoPropria ? imagem(p.imagem.replace(SITE, '')) : null;
    // og:image:width/height com o tamanho real do arquivo: a lista tem foto
    // 1200x900, 1200x675 e 1200x803, e antes ia 900 para todas. As placas de
    // categoria são 1200x900 por construção.
    html = trocarTag(html, /<meta property="og:image:width"[^>]*>/, `<meta property="og:image:width" content="${foto ? foto.width : 1200}" />`);
    html = trocarTag(html, /<meta property="og:image:height"[^>]*>/, `<meta property="og:image:height" content="${foto ? foto.height : 900}" />`);
    if (foto) {
      html = html.replace(
        '</head>',
        `  <link rel="preload" as="image" href="${foto.src}" imagesrcset="${foto.srcSet}" imagesizes="${SIZES_FICHA}" fetchpriority="high" />\n  </head>`,
      );
    }
    html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(jsonldAve(p))}</script>\n  </head>`);
    const corpo = `<div id="conteudo-sem-js">
      <h1>${esc(p.nome)}</h1>
      <p><em>${esc(p.cientifico)}</em> · ${esc(p.grupo)} · ${p.preco === null ? 'sob consulta' : 'a partir de R$ ' + p.preco.toLocaleString('pt-BR')}</p>
      ${foto ? `<img src="${foto.src}" srcset="${foto.srcSet}" sizes="${SIZES_FICHA}" alt="${esc(p.nome)}" width="${foto.width}" height="${foto.height}" fetchpriority="high" />` : ''}
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

  const { AVES } = await carregarAves();
  await arquivosDaMarca({ inexistentes, CAMINHOS, fotosUsadas: new Set(AVES.map((a) => a.foto).filter(Boolean)) });

  await rm(TMP, { recursive: true, force: true });
  console.log(`prerender: ${gravadas} páginas gravadas com meta própria (${PAGINAS_AVES.length} de aves) · sitemap com ${urls.length} URLs`);
}

const MARCA_ID = process.env.VITE_MARCA ?? 'aob';
const existe = (p) => access(p).then(() => true, () => false);

/**
 * Favicon por marca. O index.html traz os ícones do AOB; para as outras marcas,
 * public/marca/<id>/ tem favicon-32.png, favicon-192.png e icone.svg (quando há).
 */
/**
 * Preload das duas faces do primeiro render, por marca. O index.html traz as do
 * AOB (EB Garamond 600 + Inter 400); a Stima e a Aliança abrem em Poppins.
 * Preload de fonte que a página não usa é byte jogado fora e ainda atrasa o
 * que importa — por isso a troca, e não a soma.
 */
const FACES_DO_PRIMEIRO_RENDER = {
  aob: ['eb-garamond-latin-600-normal', 'inter-latin-400-normal'],
  stima: ['poppins-latin-600-normal', 'inter-latin-400-normal'],
  alianca: ['poppins-latin-600-normal', 'inter-latin-400-normal'],
};

/**
 * data-marca no <html> já no arquivo gravado. src/main.tsx também escreve, mas
 * só quando o React monta — até lá a página pintava com a paleta e as fontes do
 * AOB. Na Stima isso chegava a baixar a EB Garamond, que ela não usa.
 */
const comMarca = (html) => html.replace('<html lang="pt-BR">', `<html lang="pt-BR" data-marca="${MARCA_ID}">`);

/**
 * Cada rota pesada mora num pedaço próprio (React.lazy em src/App.tsx). Sem aviso,
 * quem abre /pedido/ direto só começa a baixar esse pedaço depois que o pacote
 * principal roda — uma ida e volta a mais, justo em quem chegou para comprar.
 * O modulepreload põe esse download em paralelo com o do pacote principal.
 * O pedaço leva o nome do componente, que é como o Vite o nomeia.
 */
const COMPONENTE_DA_ROTA = {
  tabela: ['Tabela'], pedido: ['Pedido', 'CidadeInput'], rotas: ['Rotas'],
  consultoria: ['Consultoria'], contato: ['Contato'], privacidade: ['Privacidade'],
  sanidade: ['Sanidade'],
};

let ASSETS = null;
async function comPedacoDaRota(html, rota) {
  const nomes = rota === 'criadores'
    ? [MARCA_ID === 'aob' ? 'Criadores' : 'Criadouro']
    : COMPONENTE_DA_ROTA[rota];
  if (!nomes) return html;
  ASSETS ??= await readdir(join(DIST, 'assets')).catch(() => []);
  const links = ASSETS
    .filter((f) => f.endsWith('.js') && nomes.some((n) => f.startsWith(`${n}-`)))
    .map((f) => `<link rel="modulepreload" crossorigin href="/assets/${f}">`)
    .join('\n    ');
  return links ? html.replace('</head>', `  ${links}\n  </head>`) : html;
}

function comFontes(html) {
  const faces = FACES_DO_PRIMEIRO_RENDER[MARCA_ID] ?? FACES_DO_PRIMEIRO_RENDER.aob;
  if (faces === FACES_DO_PRIMEIRO_RENDER.aob) return html;
  const linhas = faces
    .map((f) => `<link rel="preload" as="font" type="font/woff2" href="/fonts/${f}.woff2" crossorigin>`)
    .join('\n    ');
  return html.replace(
    /<link rel="preload" as="font"[^>]*>\s*<link rel="preload" as="font"[^>]*>/,
    linhas,
  );
}

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
 * E o que é material de trabalho (LEIA-ME, manifesto, e as fotos da Stima nas
 * marcas que não são a Stima) sai do dist para não ser servido.
 */
async function arquivosDaMarca({ inexistentes, CAMINHOS, fotosUsadas }) {
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
  const lixo = ['LEIA-ME.md', 'manifesto.json', 'aves-stima/manifesto.json', 'aves-stima/LEIA-ME.md', 'og/LEIA-ME.md'];
  // Fora da Stima, /aves-stima/ não sai inteira: o AOB herda a foto da variedade
  // (src/data/aves.ts) e precisa das que usa. Some só o que esta marca não mostra
  // — a pasta tem 4,8 MB, não faz sentido publicar as 33 em todo build.
  if (MARCA_ID !== 'stima') {
    for (const f of await readdir(join(DIST, 'aves-stima')).catch(() => [])) {
      if (!f.endsWith('.webp')) continue;
      // Da variante -480/-800 vale a original: se a foto é usada, as variantes vão junto.
      const original = `/aves-stima/${f.replace(/-\d+\.webp$/, '.webp')}`;
      if (!fotosUsadas.has(original)) lixo.push(join('aves-stima', f));
    }
  }
  // As placas de categoria são geradas para as três marcas; vai só a desta.
  for (const f of await readdir(join(DIST, 'og')).catch(() => [])) {
    if (f.endsWith('.png') && !f.endsWith(`-${MARCA_ID}.png`)) lixo.push(join('og', f));
  }
  for (const l of lixo) await rm(join(DIST, l), { recursive: true, force: true });
  for (const m of ['aob', 'stima', 'alianca']) if (m !== MARCA_ID) await rm(join(DIST, 'marca', m), { recursive: true, force: true });
}

/** AVES mora em src/data/aves.ts; mesma transpilação do seo.ts. */
async function carregarAves() {
  const saida = join(TMP, 'aves.mjs');
  await build({
    entryPoints: [join(RAIZ, 'src/data/aves.ts')],
    bundle: true, format: 'esm', platform: 'node', outfile: saida, logLevel: 'silent',
    define: { 'import.meta.env': JSON.stringify({ VITE_MARCA: process.env.VITE_MARCA ?? 'aob' }) },
  });
  return import(`file://${saida}`);
}

/** srcset e sizes moram em src/lib/imagens.ts; mesma transpilação do seo.ts. */
async function carregarImagens() {
  const saida = join(TMP, 'imagens.mjs');
  await build({
    entryPoints: [join(RAIZ, 'src/lib/imagens.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: saida,
    logLevel: 'silent',
  });
  return import(`file://${saida}`);
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
