import React, { useState } from 'react';
import { Menu, X, MessageCircle, ShoppingBasket } from 'lucide-react';
import { PageRoute } from '../types';
import { CAMINHOS, waComOrigem } from '../lib/links';
import { useCart } from '../cart/CartContext';
import { brl } from '../data/catalogo';

interface Props {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

export const Header: React.FC<Props> = ({ currentPage, onNavigate }) => {
  const [aberto, setAberto] = useState(false);
  const { totalUnidades, totalReferencia } = useCart();

  const itens: { route: PageRoute; label: string }[] = [
    { route: 'home', label: 'Início' },
    { route: 'aves', label: 'Aves disponíveis' },
    { route: 'rotas', label: 'Rotas de entrega' },
    { route: 'criadores', label: 'Criadouros' },
    { route: 'contato', label: 'Contato' },
  ];

  const ir = (r: PageRoute) => {
    onNavigate(r);
    setAberto(false);
  };

  const Link: React.FC<{ route: PageRoute; label: React.ReactNode; className: string }> = ({ route, label, className }) => (
    <a
      href={CAMINHOS[route]}
      onClick={(e) => {
        e.preventDefault();
        ir(route);
      }}
      className={className}
    >
      {label}
    </a>
  );

  const badge = (
    <Link
      route="pedido"
      label={
        <>
          <ShoppingBasket className="w-4 h-4" />
          <span>
            {totalUnidades > 0 ? `Meu pedido · ${totalUnidades} · ${brl(totalReferencia)}` : 'Meu pedido'}
          </span>
        </>
      }
      className={`flex items-center gap-1.5 font-sans text-[0.78rem] font-bold rounded-full px-3.5 py-1.5 transition-colors ${
        totalUnidades > 0 ? 'bg-[#D2A93C] text-[#1F3B2E] hover:bg-[#B99034]' : 'bg-[#2E5240] text-[#F6F1E6] hover:bg-[#3a6650]'
      }`}
    />
  );

  return (
    <header className="nav-bar">
      <div className="wrap">
        <div className="flex items-center justify-between h-[72px]">
          <a
            href={CAMINHOS.home}
            onClick={(e) => {
              e.preventDefault();
              ir('home');
            }}
            aria-label="Aves Ornamentais Brasil — início"
            className="flex items-center"
          >
            <img src="/logo-horizontal.png" alt="Aves Ornamentais Brasil" className="h-[44px] sm:h-[52px] w-auto" />
          </a>

          <nav className="hidden lg:flex items-center gap-6" aria-label="Navegação principal">
            {itens.map((it) => (
              <Link
                key={it.route}
                route={it.route}
                label={it.label}
                className={`font-sans text-[0.86rem] font-semibold tracking-[0.3px] transition-colors pb-0.5 ${
                  currentPage === it.route
                    ? 'text-[#F6F1E6] border-b-2 border-[#D2A93C]'
                    : 'text-[#C9D2C9] hover:text-[#F6F1E6]'
                }`}
              />
            ))}
            {badge}
            <a
              href={waComOrigem('menu')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-sans text-[0.8rem] font-bold text-[#F6F1E6] hover:text-[#D2A93C]"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            {badge}
            <button
              onClick={() => setAberto(!aberto)}
              className="p-2 text-[#F6F1E6] bg-transparent border-0 cursor-pointer"
              aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={aberto}
            >
              {aberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {aberto && (
          <nav className="lg:hidden pb-4 border-t border-[#2E5240]" aria-label="Menu">
            <div className="flex flex-col gap-1 pt-3">
              {itens.map((it) => (
                <Link
                  key={it.route}
                  route={it.route}
                  label={it.label}
                  className={`font-sans text-[0.95rem] font-semibold px-3 py-2.5 rounded-lg ${
                    currentPage === it.route ? 'bg-[#2E5240] text-[#F6F1E6]' : 'text-[#C9D2C9]'
                  }`}
                />
              ))}
              <a
                href={waComOrigem('menu')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[0.95rem] font-semibold px-3 py-2.5 text-[#D2A93C] flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
