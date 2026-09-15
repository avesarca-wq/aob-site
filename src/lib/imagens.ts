import { VARIANTES } from './variantes';

/**
 * srcset e dimensões a partir do manifesto de scripts/imagens.mjs.
 *
 * O ganho está no `sizes` de cada uso: é ele que diz ao navegador a largura em
 * que a imagem vai aparecer, e é por ele que o celular baixa a de 480 em vez da
 * de 1200. Sem `sizes` o navegador assume 100vw e escolhe grande demais.
 */
export interface Imagem {
  src: string;
  srcSet?: string;
  width: number;
  height: number;
}

/** `/aves/x.webp` + 480 → `/aves/x-480.webp`. Mesma regra do script. */
const variante = (src: string, largura: number) => `${src.replace(/\.[a-z]+$/i, '')}-${largura}.webp`;

/**
 * Imagem pronta para o <img>. Se o arquivo não estiver no manifesto (SVG, foto
 * nova ainda sem variante), devolve só o src — a página continua certa, sem
 * srcset, em vez de apontar para arquivo que não existe.
 *
 * `ate` corta o srcset numa largura máxima. Serve para o celular de tela densa:
 * um card de 344px num aparelho de DPR 3 pede 1.032px, e o navegador ia buscar
 * a original de 1.200 — dez vezes o peso da de 480 para uma diferença que
 * ninguém vê num card desse tamanho.
 */
export const imagem = (src: string, ate?: number): Imagem => {
  const v = VARIANTES[src];
  if (!v) return { src, width: 0, height: 0 };
  const degraus = ate ? v.degraus.filter((w) => w <= ate) : v.degraus;
  const cabeOriginal = !ate || v.w <= ate;
  const partes = degraus.map((w) => `${variante(src, w)} ${w}w`);
  if (cabeOriginal) partes.push(`${src} ${v.w}w`);
  // O src é o maior degrau que sobrou: é ele que vale em navegador sem srcset.
  const principal = cabeOriginal ? src : variante(src, degraus[degraus.length - 1]);
  return { src: principal, srcSet: partes.join(', '), width: v.w, height: v.h };
};

/** Maior arquivo que vale a pena num card, mesmo em tela densa. */
export const TETO_CARD = 800;

/**
 * Ficha: a de 1.200 só a partir de 768px, que é onde o layout vira duas colunas.
 *
 * O critério pedido era "só quando a largura exibida passar de 600px", mas a
 * coluna da foto nunca passa de ~503px, nem em tela larga — pela conta do
 * SIZES_FICHA, (1096 - 40) / 2.1. Cortar literalmente em 600px exibidos tiraria
 * a de 1.200 de todo lugar, inclusive do computador de tela densa, onde ela é
 * a certa.
 *
 * 1024px é onde a coluna passa de 448px: com DPR 2 isso já pede mais de 800, e
 * aí a de 1.200 é a escolha honesta. Abaixo disso ela nem entra no srcset —
 * inclusive no tablet de 768px com DPR 3, que com o ponto de quebra do layout
 * (768px) ainda ia buscar 1.200 para uma coluna de 326px.
 */
export const TETO_FICHA_CELULAR = 800;
export const MEDIA_FICHA_GRANDE = '(min-width: 1024px)';
export const MEDIA_FICHA_PEQUENA = '(max-width: 1023px)';

/** Largura máxima do conteúdo: .wrap tem 1140px com 22px de recuo dos dois lados. */
const CONTEUDO = 'min(1096px, 100vw - 44px)';

/**
 * Card da vitrine: 3 colunas com 20px de vão acima de 1024px (~352px cada),
 * 2 colunas entre 640 e 1023, 1 coluna no celular.
 */
export const SIZES_CARD = `(min-width: 1024px) 352px, (min-width: 640px) calc((${CONTEUDO} - 20px) / 2), calc(100vw - 44px)`;

/** Ficha: coluna da foto é 1fr de um 1fr/1.1fr com 40px de vão, acima de 768px. */
export const SIZES_FICHA = `(min-width: 768px) calc((${CONTEUDO} - 40px) / 2.1), calc(100vw - 44px)`;

/**
 * Logotipo exibido com altura fixa: a largura sai da proporção do arquivo.
 * `alturaSm` é a altura a partir de 640px, quando o logotipo cresce — sem ela o
 * `sizes` do desktop vale também no celular e o navegador baixa um degrau acima
 * do necessário (era o caso do logotipo da Stima no cabeçalho).
 */
export const sizesPorAltura = (src: string, alturaCss: number, alturaSm?: number): string => {
  const v = VARIANTES[src];
  const largura = (altura: number) => (v ? Math.round((altura * v.w) / v.h) : altura);
  return alturaSm === undefined
    ? `${largura(alturaCss)}px`
    : `(min-width: 640px) ${largura(alturaSm)}px, ${largura(alturaCss)}px`;
};
