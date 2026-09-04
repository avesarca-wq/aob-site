import { PageRoute } from '../types';
import { CONSTANTS } from '../data/catalogo';

/** Endereço próprio por página (o Google lê o href, não o clique). */
export const CAMINHOS: Record<PageRoute, string> = {
  home: '/',
  aves: '/aves',
  pedido: '/pedido',
  rotas: '/rotas',
  criadores: '/criadores',
  contato: '/contato',
  privacidade: '/privacidade',
};

export const ROTA_DO_CAMINHO = Object.fromEntries(
  Object.entries(CAMINHOS).map(([rota, caminho]) => [caminho, rota as PageRoute]),
) as Record<string, PageRoute>;

const MENSAGEM: Record<string, string> = {
  menu: 'Olá! Vim pelo site Aves Ornamentais Brasil e quero informações sobre as aves à pronta entrega.',
  rodape: 'Olá! Vim pelo rodapé do site Aves Ornamentais Brasil e quero informações sobre as aves.',
  'botao-flutuante': 'Olá! Vim pelo site Aves Ornamentais Brasil e quero informações sobre as aves.',
  contato: 'Olá! Vim pela página de contato da Aves Ornamentais Brasil.',
  rotas: 'Olá! Vim pela página de rotas da Aves Ornamentais Brasil e quero saber da entrega na minha cidade.',
  criadores: 'Olá! Vim pela página dos criadouros da Aves Ornamentais Brasil.',
};
const PADRAO = MENSAGEM.menu;

export const waComOrigem = (origem: string): string =>
  `${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent(MENSAGEM[origem] ?? PADRAO)}`;

export const waComTexto = (texto: string): string =>
  `${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent(texto)}`;
