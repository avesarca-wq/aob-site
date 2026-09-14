/**
 * scripts/imagens.mjs — variantes menores das imagens e o manifesto de dimensões.
 *
 * Por quê: as fotos são de 1200 px e o card as exibe a ~352 px; o logotipo da
 * Stima tem 1920 px e aparece a 94 px no cabeçalho. O navegador baixava o
 * arquivo inteiro para desenhar um terço dele — na remedição de 14/09 a foto
 * virou o LCP de /aves/ e das fichas.
 *
 * O que grava, ao lado de cada original:
 *   · fotos de ave  → <nome>-480.webp e <nome>-800.webp
 *     (a original tem 1200 px e já é o degrau de 1200 do srcset)
  *   · logotipos     → <nome>-240.webp, -480.webp e -960.webp
 *     (só os degraus menores que o original; o original fecha o srcset)
 * E src/lib/variantes.ts, com largura, altura e degraus de cada imagem — é dele
 * que os componentes tiram srcset e width/height, em vez de número escrito à mão.
 *
 * Rodar de novo quando entrarem imagens novas:
 *     node scripts/imagens.mjs            (só o que falta ou está velho)
 *     node scripts/imagens.mjs --tudo     (refaz todas)
 *     node scripts/imagens.mjs --limpar   (apaga variante cuja original sumiu)
 *
 * Não mexe em og-*.png, favicons nem SVG: o og:image tem de continuar sendo o
 * arquivo original, do tamanho que as redes sociais pedem.
 */
import sharp from 'sharp';
import { readdir, stat, unlink, writeFile } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';

const QUALIDADE = 80;
/** Pastas varridas: [caminho, degraus de largura]. */
const ALVOS = [
  ['public/aves', [480, 800]],
  ['public/aves-stima', [480, 800]],
  ['public/criadouros', [240, 480, 960]],
  ['public/consultoria', [240, 480, 960]],
];
/** Imagens soltas na raiz de public/ que também são exibidas pequenas. */
const SOLTAS = [
  ['public/logo-horizontal.png', [240, 480, 960]],
  ['public/logo-selo.png', [240, 480, 960]],
];

const EXTENSOES = ['.webp', '.png', '.jpg', '.jpeg'];
const ehVariante = (f) => /-\d+\.webp$/.test(f);
const semExtensao = (f) => f.slice(0, -extname(f).length);
/** `/aves/x.webp` + 480 → `/aves/x-480.webp`. A mesma regra vive em src/lib/imagens.ts. */
const nomeVariante = (caminho, largura) => `${semExtensao(caminho)}-${largura}.webp`;

const maisNovo = async (a, b) => {
  try {
    const [x, y] = await Promise.all([stat(a), stat(b)]);
    return x.mtimeMs >= y.mtimeMs;
  } catch {
    return false;
  }
};

async function main() {
  const tudo = process.argv.includes('--tudo');
  const limpar = process.argv.includes('--limpar');
  let geradas = 0, puladas = 0, removidas = 0;
  const manifesto = {};

  const trabalho = [...SOLTAS];
  for (const [pasta, degraus] of ALVOS) {
    let arquivos;
    try {
      arquivos = await readdir(pasta);
    } catch {
      console.log(`· ${pasta}: não existe, pulando`);
      continue;
    }
    if (limpar) {
      for (const f of arquivos.filter(ehVariante)) {
        const original = arquivos.find((o) => !ehVariante(o) && semExtensao(o) === f.replace(/-\d+\.webp$/, ''));
        if (!original) { await unlink(join(pasta, f)); removidas++; }
      }
    }
    for (const f of arquivos) {
      if (!EXTENSOES.includes(extname(f).toLowerCase()) || ehVariante(f)) continue;
      trabalho.push([join(pasta, f), degraus]);
    }
  }

  for (const [caminho, degraus] of trabalho) {
    const { width, height } = await sharp(caminho).metadata();
    // Só os degraus que realmente encolhem o arquivo; o original fecha o srcset.
    const uteis = degraus.filter((w) => w < width);
    for (const largura of uteis) {
      const destino = nomeVariante(caminho, largura);
      if (!tudo && (await maisNovo(destino, caminho))) { puladas++; continue; }
      await sharp(caminho).resize({ width: largura, withoutEnlargement: true }).webp({ quality: QUALIDADE }).toFile(destino);
      geradas++;
    }
    // A chave é o endereço público (sem o "public/"), como aparece no src.
    manifesto[caminho.replace(/^public/, '')] = { w: width, h: height, degraus: uteis };
  }

  const linhas = Object.entries(manifesto)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `  '${k}': { w: ${v.w}, h: ${v.h}, degraus: [${v.degraus.join(', ')}] },`)
    .join('\n');
  await writeFile(
    'src/lib/variantes.ts',
    `// GERADO POR scripts/imagens.mjs — não edite à mão.\n` +
    `// Largura, altura e degraus de srcset de cada imagem. Rode o script de novo\n` +
    `// quando entrar foto nova: 'node scripts/imagens.mjs'.\n` +
    `export interface Variante { w: number; h: number; degraus: number[] }\n` +
    `export const VARIANTES: Record<string, Variante> = {\n${linhas}\n};\n`,
    'utf8',
  );

  console.log(
    `imagens: ${trabalho.length} originais · ${geradas} variantes gravadas · ${puladas} já em dia` +
    (removidas ? ` · ${removidas} órfãs removidas` : '') +
    ` · manifesto com ${Object.keys(manifesto).length} entradas`,
  );
}

main().catch((e) => { console.error(e); process.exit(1); });
