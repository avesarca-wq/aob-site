import { PageRoute } from '../types';
import { CONSTANTS } from '../data/catalogo';

/** Endereço próprio por página (o Google lê o href, não o clique).
 *  Com barra final: é assim que a Netlify serve dist/<rota>/index.html sem
 *  redirecionar — sitemap, canonical e link precisam bater com a URL servida. */
export const CAMINHOS: Record<PageRoute, string> = {
  home: '/',
  aves: '/aves/',
  tabela: '/tabela/',
  pedido: '/pedido/',
  rotas: '/rotas/',
  criadores: '/criadores/',
  consultoria: '/consultoria/',
  sanidade: '/sanidade/',
  contato: '/contato/',
  privacidade: '/privacidade/',
};

export const ROTA_DO_CAMINHO = Object.fromEntries(
  Object.entries(CAMINHOS).map(([rota, caminho]) => [caminho.replace(/\/+$/, '') || '/', rota as PageRoute]),
) as Record<string, PageRoute>;

const N = CONSTANTS.MARCA;
const MENSAGEM: Record<string, string> = {
  menu: `Olá! Vim pelo site ${N} e quero informações sobre as aves à pronta entrega.`,
  rodape: `Olá! Vim pelo rodapé do site ${N} e quero informações sobre as aves.`,
  'botao-flutuante': `Olá! Vim pelo site ${N} e quero informações sobre as aves.`,
  contato: `Olá! Vim pela página de contato do site ${N}.`,
  rotas: `Olá! Vim pela página de rotas do site ${N} e quero saber da entrega na minha cidade.`,
  criadores: `Olá! Vim pela página dos criadouros do site ${N}.`,
  consultoria: `Olá! Vim pela página de consultoria do site ${N} e quero falar com um consultor.`,
  sanidade: `Olá! Vim pela página de sanidade do site ${N} e tenho uma dúvida sobre manejo.`,
};
const PADRAO = MENSAGEM.menu;

export const waComOrigem = (origem: string): string =>
  `${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent(MENSAGEM[origem] ?? PADRAO)}`;

export const waComTexto = (texto: string): string =>
  `${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent(texto)}`;

/** Pergunta sobre uma variedade sem preço ou sem lote na semana. */
export const waSobConsulta = (nome: string): string =>
  waComTexto(`Olá! Vi ${nome} no site ${N} e quero saber disponibilidade e preço.`);

/** Slug da ficha de uma ave: o lote herda o slug da variedade do catálogo-base
 *  quando tem uma, senão usa o próprio id. Mesma regra do PAGINAS_AVES (seo.ts),
 *  senão o link do card aponta para uma página que não foi gerada. */
export const slugDaAve = (a: { id: string; variedade?: string }): string => a.variedade ?? a.id;

/** Endereço da ficha. Com barra final, como o resto das rotas. */
export const caminhoDaAve = (slug: string): string => `/aves/${slug}/`;
