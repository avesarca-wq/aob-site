import React, { useState } from 'react';
import { PageRoute } from '../types';
import { CAMINHOS, waComOrigem } from '../lib/links';
import { LOGO_HEADER } from '../data/logo';
import { Menu, X, MessageCircle, ShoppingBasket } from 'lucide-react';
import { useCart } from '../cart/CartContext';

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalLinhas, totalAves, totalReferencia } = useCart();

  // 27/08/2026: o cracha dizia "1 de 10" — anunciava um teto que ninguem pediu.
  // Passa a dizer o que a pessoa tem no carrinho: quantas aves e quanto e.
  const resumoPedido = `${totalAves} ${totalAves === 1 ? 'ave' : 'aves'} · ${new Intl.NumberFormat(
    'pt-BR',
    { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }
  ).format(totalReferencia)}`;

  const navItems: { route: PageRoute; label: string; isHighlight?: boolean }[] = [
    { route: 'home', label: 'Início' },
    { route: 'especies', label: 'Espécies' },
    { route: 'procedencia', label: 'Procedência' },
    { route: 'entrega', label: 'Entrega' },
    { route: 'sobre', label: 'Sobre' },
    { route: 'faq', label: 'Dúvidas' },
    { route: 'pre-reserva', label: 'Pré-reserva', isHighlight: true },
    { route: 'contato', label: 'Contato' },
  ];

  const handleNav = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="nav-bar">
      <div className="wrap">
        <div className="flex items-center justify-between h-[68px]">
          {/* BRAND */}
          <a
            href={CAMINHOS.home}
            onClick={(e) => {
              e.preventDefault();
              handleNav('home');
            }}
            className="brand flex items-center no-underline focus:outline-none"
            aria-label="Aves Arca - Início"
          >
            <img
              src={LOGO_HEADER}
              alt="Aves Arca"
              className="h-[32px] sm:h-[44px] w-auto object-contain transition-opacity hover:opacity-95"
            />
          </a>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navegação principal">
            {navItems.map((item) => {
              const isActive = currentPage === item.route;
              if (item.isHighlight) {
                return (
                  <a
                    key={item.route}
                    href={CAMINHOS[item.route]}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(item.route);
                    }}
                    className={`font-sans text-[0.86rem] font-bold tracking-[0.3px] px-4 py-1.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-[#D4A373] text-white shadow-sm'
                        : 'bg-[#FAFBF8] text-[#D4A373] hover:bg-[#D4A373] hover:text-white border border-[#D4A373]/40'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <a
                  key={item.route}
                  href={CAMINHOS[item.route]}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.route);
                  }}
                  className={`font-sans text-[0.86rem] font-semibold tracking-[0.3px] transition-colors duration-200 ${
                    isActive ? 'text-[#4A5D4E] font-bold border-b-2 border-[#4A5D4E]' : 'text-[#5A635C] hover:text-[#4A5D4E]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}

            {totalLinhas > 0 && (
              <a
                href={CAMINHOS['pre-reserva']}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('pre-reserva');
                }}
                className="flex items-center gap-1.5 font-sans text-[0.78rem] font-bold text-[#4A5D4E] bg-[#F1EBDD] border border-[#C1732B]/40 rounded-full px-3 py-1.5 hover:bg-[#C1732B] hover:text-white transition-colors"
                aria-label={`Meu pedido: ${resumoPedido}`}
              >
                <ShoppingBasket className="w-4 h-4" />
                <span>
                  {resumoPedido}
                </span>
              </a>
            )}

            <a
              href={waComOrigem('menu')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa text-xs py-2 px-4 ml-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </nav>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            type="button"
            className="md:hidden p-2 text-[#4A5D4E] hover:text-[#D4A373] focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Alternar menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b-2 border-[#D4A373] shadow-lg px-6 py-4 flex flex-col gap-3 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentPage === item.route;
            return (
              <a
                key={item.route}
                href={CAMINHOS[item.route]}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.route);
                }}
                className={`font-sans text-[0.95rem] py-2 font-semibold tracking-[0.3px] border-b border-[#E0E2D9] flex items-center justify-between ${
                  isActive ? 'text-[#D4A373] font-bold' : 'text-[#2D3436]'
                }`}
              >
                <span>{item.label}</span>
                {item.isHighlight && (
                  <span className="text-[0.7rem] uppercase bg-[#D4A373] text-white px-2 py-0.5 rounded-full font-bold">
                    Destaque
                  </span>
                )}
              </a>
            );
          })}
          {totalLinhas > 0 && (
            <a
              href={CAMINHOS['pre-reserva']}
              onClick={(e) => {
                e.preventDefault();
                handleNav('pre-reserva');
              }}
              className="flex items-center justify-between font-sans text-[0.9rem] font-bold text-[#4A5D4E] bg-[#F1EBDD] border border-[#C1732B]/40 rounded-xl px-4 py-2.5 mt-1"
            >
              <span className="flex items-center gap-2">
                <ShoppingBasket className="w-4 h-4" />
                Meu pedido
              </span>
              <span>
                {resumoPedido}
              </span>
            </a>
          )}
          <a
            href={waComOrigem('menu')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa text-center py-2.5 mt-2"
          >
            <MessageCircle className="w-4 h-4" />
            Falar no WhatsApp
          </a>
        </div>
      )}
    </header>
  );
};
