import { PageRoute } from '../types';
import { CONSTANTS } from '../data/species';

/**
 * Endereço próprio por página. Antes tudo vivia em '/#pagina', o que dava ao Google
 * uma página só: as sete institucionais dividiam o mesmo título e a mesma descrição.
 * Os links antigos com # continuam funcionando e são reescritos para o caminho novo.
 *
 * Mora aqui, e não dentro do App, porque o menu e o rodapé precisam escrever o endereço
 * real no atributo href. O visitante sempre navegou certo — o React intercepta o clique —,
 * mas o robô do Google não clica: ele lê o href. Com '#especies' escrito ali, nenhuma das
 * 57 páginas do site tinha um link apontando para ela.
 */
export const CAMINHOS: Record<PageRoute, string> = {
  home: '/',
  especies: '/catalogo',
  procedencia: '/procedencia',
  entrega: '/entrega',
  sobre: '/sobre',
  'pre-reserva': '/pre-reserva',
  contato: '/contato',
  faq: '/duvidas',
  privacidade: '/privacidade',
};

export const ROTA_DO_CAMINHO = Object.fromEntries(
  Object.entries(CAMINHOS).map(([rota, caminho]) => [caminho, rota as PageRoute]),
) as Record<string, PageRoute>;

/**
 * WhatsApp com a origem escrita na mensagem. Sem isso a conversa chega em branco e não dá
 * para saber se o cliente veio do menu, do rodapé, da página de entrega ou do Instagram.
 * O catálogo não passa por aqui: a mensagem dele já traz a variedade escolhida.
 */
const MENSAGEM: Record<string, string> = {
  menu: 'Olá! Vim pelo menu do site da Aves Arca e quero informações sobre as aves.',
  rodape: 'Olá! Vim pelo rodapé do site da Aves Arca e quero informações sobre as aves.',
  'botao-flutuante': 'Olá! Vim pelo site da Aves Arca e quero informações sobre as aves.',
  contato: 'Olá! Vim pela página de contato do site da Aves Arca.',
  procedencia: 'Olá! Vim pela página de procedência e quero saber da documentação das aves.',
  duvidas: 'Olá! Vim pelas dúvidas frequentes do site e ficou uma pergunta.',
  'pre-reserva': 'Olá! Vim pela página de pré-reserva do site da Aves Arca.',
  entrega: 'Olá! Vim pela página de entrega e quero saber do envio para a minha região.',
};

const PADRAO = 'Olá! Vim pelo site da Aves Arca e quero informações sobre as aves.';

export const waComOrigem = (origem: string): string =>
  `${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent(MENSAGEM[origem] ?? PADRAO)}`;
