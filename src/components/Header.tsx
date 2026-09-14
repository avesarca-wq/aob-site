import React, { useState } from 'react';
import { Menu, X, MessageCircle, ShoppingBasket } from 'lucide-react';
import { PageRoute } from '../types';
import { CAMINHOS, waComOrigem } from '../lib/links';
import { useCart } from '../cart/CartContext';
import { brl, CONSTANTS } from '../data/catalogo';
import { EH_REDE, MARCA_ATUAL } from '../marcas';

interface Props {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

export const Header: React.FC<Props> = ({ currentPage, onNavigate }) => {
  const [aberto, setAberto] = useState(false);
  const { totalUnidades, totalReferencia } = useCart();

  const itens: { route: PageRoute; label: string }[] = EH_REDE
    ? [
        { route: 'home', label: 'Início' },
        { route: 'aves', label: 'Aves disponíveis' },
        { route: 'tabela', label: 'Tabela de valores' },
        { route: 'rotas', label: 'Rotas de entrega' },
        { route: 'criadores', label: 'Criadouros' },
        { route: 'consultoria', label: 'Consultoria' },
        { route: 'contato', label: 'Contato' },
      ]
    : [
        { route: 'home', label: 'Início' },
        { route: 'aves', label: 'Plantel' },
        { route: 'tabela', label: 'Tabela' },
        { route: 'rotas', label: 'Rotas' },
        { route: 'criadores', label: 'O criadouro' },
        { route: 'sanidade', label: 'Sanidade' },
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
            {totalUnidades > 0 ? `Pedido · ${totalUnidades} · ${brl(totalReferencia)}` : 'Meu pedido'}
          </span>
        </>
      }
      className={`flex items-center gap-1.5 font-sans text-[0.78rem] font-bold rounded-full px-3.5 py-1.5 transition-colors ${
        totalUnidades > 0 ? 'bg-[var(--ouro)] text-[var(--verde)] hover:bg-[var(--ouro2)]' : 'bg-[var(--verde-claro)] text-[var(--marfim)] hover:bg-[var(--verde-hover)]'
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
            aria-label={`${CONSTANTS.MARCA} — início`}
            className="flex items-center"
          >
            {EH_REDE
              ? <img src={MARCA_ATUAL.logoHorizontal} alt={CONSTANTS.MARCA} className="h-[44px] sm:h-[52px] w-auto" />
              : <span className="flex items-center gap-2.5"><span className="bg-white rounded-md px-1.5 py-1 flex items-center"><img src={MARCA_ATUAL.logoHorizontal} alt="" className="h-[36px] sm:h-[42px] w-auto" /></span><span className="font-serif text-[1.15rem] sm:text-[1.3rem] font-semibold text-[var(--marfim)] leading-none">{CONSTANTS.MARCA}</span></span>}
          </a>

          <nav className="hidden lg:flex items-center gap-5 whitespace-nowrap" aria-label="Navegação principal">
            {itens.map((it) => (
              <Link
                key={it.route}
                route={it.route}
                label={it.label}
                className={`font-sans text-[0.82rem] font-semibold tracking-[0.2px] transition-colors pb-0.5 ${
                  currentPage === it.route
                    ? 'text-[var(--marfim)] border-b-2 border-[var(--ouro)]'
                    : 'text-[var(--claro-2)] hover:text-[var(--marfim)]'
                }`}
              />
            ))}
            {badge}
            <a
              href={waComOrigem('menu')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-sans text-[0.8rem] font-bold text-[var(--marfim)] hover:text-[var(--ouro)]"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            {badge}
            <button
              onClick={() => setAberto(!aberto)}
              className="p-2 text-[var(--marfim)] bg-transparent border-0 cursor-pointer"
              aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={aberto}
            >
              {aberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {aberto && (
          <nav className="lg:hidden pb-4 border-t border-[var(--verde-claro)]" aria-label="Menu">
            <div className="flex flex-col gap-1 pt-3">
              {itens.map((it) => (
                <Link
                  key={it.route}
                  route={it.route}
                  label={it.label}
                  className={`font-sans text-[0.95rem] font-semibold px-3 py-2.5 rounded-lg ${
                    currentPage === it.route ? 'bg-[var(--verde-claro)] text-[var(--marfim)]' : 'text-[var(--claro-2)]'
                  }`}
                />
              ))}
              <a
                href={waComOrigem('menu')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[0.95rem] font-semibold px-3 py-2.5 text-[var(--ouro)] flex items-center gap-2"
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
