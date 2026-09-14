/**
 * scripts/og-categorias.mjs — imagem de reserva por categoria, 1200x900.
 *
 * Por quê: o Product do JSON-LD precisa de `image`. A ave sem foto no plantel
 * ficava sem esse campo, e o Google descarta o rich result inteiro quando ele
 * falta. Em vez de deixar sem, entra uma placa da categoria, na cor da marca.
 *
 * Grava public/og/<categoria>-<marca>.png para as três marcas. O prerender
 * apaga do dist as que não são da marca do build, como já faz com os favicons.
 *
 * Rodar de novo ao acrescentar categoria ou mexer na paleta:
 *     node scripts/og-categorias.mjs
 *
 * As categorias e as cores vêm de src/data/catalogo.ts e src/marcas.ts — as
 * mesmas que o site usa; aqui não há lista paralela para sair do lugar.
 */
import sharp from 'sharp';
import { build } from 'esbuild';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const RAIZ = process.cwd();
const TMP = join(RAIZ, '.tmp-og');
const DESTINO = join(RAIZ, 'public', 'og');

/** Fundo e cor do texto de cada marca; o resto da paleta não entra aqui. */
const PALETA = {
  aob: { fundo: '#1F3B2E', texto: '#D2A93C', apoio: '#C9D2C9' },
  stima: { fundo: '#28306F', texto: '#7DCB95', apoio: '#C7CDE8' },
  alianca: { fundo: '#1E2430', texto: '#C7A15A', apoio: '#C2C7D0' },
};

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Placa sóbria: moldura fina, nome da categoria e o nome da marca embaixo. */
const placa = ({ categoria, marca, fundo, texto, apoio }) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
  <rect width="1200" height="900" fill="${fundo}"/>
  <rect x="48" y="48" width="1104" height="804" fill="none" stroke="${texto}" stroke-opacity="0.45" stroke-width="3"/>
  <text x="600" y="430" font-family="DejaVu Serif, Georgia, serif" font-size="92" font-weight="600" fill="${texto}" text-anchor="middle">${esc(categoria)}</text>
  <text x="600" y="520" font-family="DejaVu Sans, sans-serif" font-size="34" letter-spacing="6" fill="${apoio}" text-anchor="middle">${esc(marca.toUpperCase())}</text>
</svg>`;

/** catalogo.ts e marcas.ts são TypeScript; mesma transpilação do prerender. */
async function carregar(entrada, marca) {
  const saida = join(TMP, `${marca}-${entrada.replace(/\//g, '_')}.mjs`);
  await build({
    entryPoints: [join(RAIZ, entrada)],
    bundle: true, format: 'esm', platform: 'node', outfile: saida, logLevel: 'silent',
    define: { 'import.meta.env': JSON.stringify({ VITE_MARCA: marca }) },
  });
  return import(`file://${saida}`);
}

async function main() {
  await mkdir(DESTINO, { recursive: true });
  let gravadas = 0;
  for (const marca of Object.keys(PALETA)) {
    const { CATEGORIAS } = await carregar('src/data/catalogo.ts', marca);
    const { MARCAS } = await carregar('src/marcas.ts', marca);
    const nomeDaMarca = MARCAS[marca].nome;
    for (const c of CATEGORIAS) {
      const svg = placa({ categoria: c.nome, marca: nomeDaMarca, ...PALETA[marca] });
      await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(join(DESTINO, `${c.id}-${marca}.png`));
      gravadas++;
    }
  }
  // Marca d'água para quem abrir a pasta sem contexto.
  await writeFile(join(DESTINO, 'LEIA-ME.md'), 'Gerado por scripts/og-categorias.mjs. Não edite à mão.\n', 'utf8');
  await rm(TMP, { recursive: true, force: true });
  console.log(`og: ${gravadas} placas gravadas em public/og`);
}

main().catch((e) => { console.error(e); process.exit(1); });
