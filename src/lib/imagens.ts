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
 */
export const imagem = (src: string): Imagem => {
  const v = VARIANTES[src];
  if (!v) return { src, width: 0, height: 0 };
  const degraus = [...v.degraus.map((w) => `${variante(src, w)} ${w}w`), `${src} ${v.w}w`];
  return { src, srcSet: degraus.join(', '), width: v.w, height: v.h };
};

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
