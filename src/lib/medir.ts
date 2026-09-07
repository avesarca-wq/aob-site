/**
 * Camada de medição — Meta Pixel "AOB - Site" (1024778503896521).
 *
 * O pixel carregado em /meta-pixel.js dispara só PageView. Sem eventos de
 * carrinho e de pedido a Meta não sabe quem converteu: ela não consegue
 * otimizar a entrega do anúncio nem construir público semelhante a comprador,
 * e o anunciante não consegue atribuir venda a campanha.
 *
 * Este módulo é o único lugar do site que fala com o pixel. Se amanhã entrar
 * GA4, Umami ou outro, entra aqui e o resto do código não muda.
 *
 * Regra de ouro: medir nunca pode quebrar a página. Toda chamada é protegida —
 * se o pixel estiver bloqueado por adblock, ou ainda não tiver carregado, a
 * função simplesmente não faz nada.
 */

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const ehLocal = (): boolean =>
  typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname);

/** Eventos padrão do Meta. Nomes fixos: a Meta só otimiza pelos que ela conhece. */
type EventoPadrao = 'AddToCart' | 'InitiateCheckout' | 'Lead' | 'Contact' | 'ViewContent';

function enviar(evento: EventoPadrao, params: Params = {}): void {
  // Remove campos vazios: parâmetro undefined polui o relatório do Gerenciador.
  const limpo: Params = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') limpo[k] = v;
  }
  if (ehLocal()) {
    console.debug('[medir]', evento, limpo);
    return; // não sujar os dados de produção com teste local
  }
  try {
    if (typeof window.fbq === 'function') window.fbq('track', evento, limpo);
  } catch {
    /* medir não derruba a página */
  }
}

/** Ave adicionada ao pedido. Disparado no carrinho, então vale para qualquer página. */
export const medirAddToCart = (a: { nome: string; detalhe?: string; preco: number; quantidade: number }): void =>
  enviar('AddToCart', {
    content_name: [a.nome, a.detalhe].filter(Boolean).join(' '),
    content_type: 'product',
    value: a.preco * a.quantidade,
    currency: 'BRL',
    contents_qty: a.quantidade,
  });

/** Chegou na página de pedido com o carrinho montado — intenção real de compra. */
export const medirInitiateCheckout = (total: number, unidades: number): void =>
  enviar('InitiateCheckout', {
    value: total,
    currency: 'BRL',
    num_items: unidades,
  });

/**
 * Pedido registrado. É a conversão que a campanha deve otimizar.
 * Não é "Purchase" de propósito: o pagamento é na entrega, então a venda só se
 * confirma dias depois, na rota. Marcar como Purchase inflaria o resultado.
 */
export const medirPedido = (p: { codigo: string; total: number; unidades: number; rota: string }): void =>
  enviar('Lead', {
    content_name: `Pedido ${p.codigo}`,
    value: p.total,
    currency: 'BRL',
    num_items: p.unidades,
    delivery_category: p.rota,
  });

/** Clique num botão de WhatsApp — o canal onde a venda de fato fecha. */
export const medirContato = (origem: string): void =>
  enviar('Contact', { content_name: origem });
