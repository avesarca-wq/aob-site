import React from 'react';
import { MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { PageRoute } from '../types';
import { CAMINHOS, waComOrigem } from '../lib/links';
import { useCart } from '../cart/CartContext';
import { medir } from '../lib/analytics';

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

interface FloatingWhatsAppProps {
  currentPage?: PageRoute;
  onNavigate?: (page: PageRoute) => void;
}

/**
 * Barra fixa do rodapé — WhatsApp quando o carrinho está vazio, pré-reserva quando não está.
 *
 * POR QUE MUDOU (31/08/2026, gargalo carrinho -> pedido):
 * entre 26 e 28/08 o site registrou 83 adições ao carrinho, 9 tentativas de envio e
 * apenas 2 bloqueios de validação. A perda estava ANTES do botão de enviar, não dentro
 * do formulário. E o motivo estava na tela: no celular o crachá do carrinho só existia
 * DENTRO do menu hamburguer fechado (o Header o renderiza em `hidden md:flex` e no menu
 * aberto), e o único elemento fixo na tela era este botão do WhatsApp. Quem adicionava
 * uma ave pelo telefone — e a maior porta de entrada é o link da bio do Instagram — não
 * via sinal nenhum de que tinha um pedido em andamento, nem caminho para o formulário.
 *
 * O QUE FAZ AGORA:
 * - carrinho vazio: o botão do WhatsApp, exatamente como era antes;
 * - carrinho com itens: a barra vira "Ver minha pré-reserva · N aves · R$ X" e o WhatsApp
 *   encolhe para um ícone ao lado. Uma ação principal por vez, sem perder o canal consultivo.
 *
 * MEDICAO: o clique dispara `ir_para_pedido` — exatamente o passo que não tinha instrumento
 * entre `add_carrinho` e `ver_conferencia`. E o botão do WhatsApp passa a disparar
 * `clicar_whatsapp` com `com_carrinho`, para deixar de ser uma saída invisível.
 */
export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ currentPage, onNavigate }) => {
  const { totalLinhas, totalAves, totalReferencia } = useCart();

  // Na própria página de pré-reserva a barra não teria para onde levar — e cobriria o fim
  // do formulário justamente na hora de enviar.
  const mostrarPedido = totalLinhas > 0 && currentPage !== 'pre-reserva';

  const irParaPedido = () => {
    medir('ir_para_pedido', {
      de: 'barra-fixa',
      linhas: totalLinhas,
      aves: totalAves,
      total_referencia: totalReferencia,
    });
    if (onNavigate) {
      onNavigate('pre-reserva');
      return;
    }
    // Sem a prop (componente usado isolado): navegação pelo endereço real.
    window.location.href = CAMINHOS['pre-reserva'];
  };

  const aoClicarWhatsApp = () =>
    medir('clicar_whatsapp', { de: 'botao-flutuante', com_carrinho: totalLinhas > 0 });

  if (!mostrarPedido) {
    return (
      <a
        href={waComOrigem('botao-flutuante')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp com Aves Arca"
        onClick={aoClicarWhatsApp}
        className="fixed bottom-6 right-6 z-40 bg-[#4A5D4E] hover:bg-[#3d4d40] text-white p-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 font-sans text-xs font-bold transition-all duration-300 ease-in-out">
          Falar no WhatsApp
        </span>
      </a>
    );
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-[#D4A373] bg-white/95 backdrop-blur-sm shadow-[0_-4px_18px_rgba(23,40,42,0.12)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="wrap max-w-3xl flex items-center gap-2.5 py-2.5">
        <button
          type="button"
          onClick={irParaPedido}
          className="btn btn-gold flex-1 min-w-0 py-2.5 px-4 flex items-center justify-between gap-3 text-left"
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="min-w-0">
              <span className="block font-sans text-[0.82rem] font-bold leading-tight">
                Ver minha pré-reserva
              </span>
              <span className="block font-sans text-[0.68rem] leading-tight opacity-90">
                {totalAves} {totalAves === 1 ? 'ave' : 'aves'} · {formatBRL(totalReferencia)}
              </span>
            </span>
          </span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>

        <a
          href={waComOrigem('botao-flutuante')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp com Aves Arca"
          onClick={aoClicarWhatsApp}
          className="shrink-0 bg-[#4A5D4E] hover:bg-[#3d4d40] text-white p-3 rounded-full shadow-md transition-colors flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};
