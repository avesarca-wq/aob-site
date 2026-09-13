/**
 * Metadados por rota — a única fonte de verdade de título e descrição do site.
 *
 * Fica fora do App.tsx porque dois consumidores precisam dele:
 *   1. o App, que troca o <head> ao navegar (o que o Google, que executa JS, lê);
 *   2. scripts/prerender.mjs, que grava um HTML por rota no build (o que o
 *      WhatsApp, o Facebook e o Instagram leem — eles NÃO executam JavaScript).
 *
 * Antes desta separação, todo link compartilhado no WhatsApp mostrava o card
 * genérico da home, qualquer que fosse a página.
 */
import { PageRoute } from './types';
import { TOTAL_AVES, TOTAL_LOTES } from './data/aves';
import { CONSTANTS } from './data/catalogo';
import { EH_REDE, MARCA_ATUAL } from './marcas';

export const SITE = CONSTANTS.DOMINIO;

export const M = CONSTANTS.MARCA;
export const META: Record<PageRoute, { titulo: string; descricao: string }> = {
  home: { titulo: `${M} — aves ornamentais à pronta entrega`, descricao: EH_REDE ? `${TOTAL_AVES} aves ornamentais à pronta entrega de três criadouros parceiros: aquáticas, faisões, pavões, perdizes e mais. Rota de entrega marcada, pagamento na entrega.` : `${TOTAL_AVES} aves ornamentais à pronta entrega. ${MARCA_ATUAL.frase} Rota de entrega marcada, pagamento na entrega.` },
  aves: { titulo: `Aves disponíveis — ${TOTAL_LOTES} lotes — ${M}`, descricao: 'Lista de aves ornamentais à pronta entrega com preço, estoque por sexo e criadouro. Monte o pedido e pague na entrega.' },
  tabela: { titulo: `Tabela de valores — ${TOTAL_LOTES} lotes — ${M}`, descricao: 'Todas as aves em estoque numa página só: sexo, unidade e preço. Marque as quantidades e feche o pedido direto na tabela.' },
  pedido: { titulo: `Meu pedido — ${M}`, descricao: 'Feche seu pedido de aves ornamentais: cidade, rota de entrega e confirmação pelo WhatsApp. Sem pagamento antecipado.' },
  rotas: { titulo: `Rotas de entrega — ${M}`, descricao: 'Calendário das rotas de entrega por região, cidades atendidas e frete por saída a partir de São Paulo.' },
  criadores: { titulo: `Criadouros parceiros — ${M}`, descricao: 'Aves Arca, Stima Aves e Criadouro Aliança: quem cria as aves da lista.' },
  consultoria: { titulo: `Consultoria técnica — ${M}`, descricao: 'Biólogo e zootecnista parceiros da rede: recinto, manejo, nutrição, sanidade e formação de casais para quem cria aves ornamentais.' },
  contato: { titulo: `Contato — ${M}`, descricao: `WhatsApp, e-mail e Instagram de ${M}.` },
  privacidade: { titulo: `Privacidade — ${M}`, descricao: 'Como tratamos os dados de quem faz um pedido.' },
};

