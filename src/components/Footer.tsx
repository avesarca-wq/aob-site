import React from 'react';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { PageRoute } from '../types';
import { CAMINHOS, waComOrigem } from '../lib/links';
import { CONSTANTS } from '../data/catalogo';
import { EH_REDE, MARCA_ATUAL } from '../marcas';

export const Footer: React.FC<{ onNavigate: (p: PageRoute) => void }> = ({ onNavigate }) => {
  const L = ({ route, label }: { route: PageRoute; label: string }) => (
    <a
      href={CAMINHOS[route]}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(route);
      }}
      className="font-sans text-[0.86rem] text-[var(--claro-2)] hover:text-[var(--ouro)] no-underline"
    >
      {label}
    </a>
  );
  return (
    <footer className="bg-[var(--verde-2)] text-[var(--marfim)] mt-auto">
      <div className="wrap py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            {EH_REDE
              ? <img src={MARCA_ATUAL.logoSelo} alt={CONSTANTS.MARCA} className="h-[110px] w-auto mb-3" />
              : <div className="inline-block bg-white rounded-lg p-3 mb-3"><img src={MARCA_ATUAL.logoSelo} alt={CONSTANTS.MARCA} className="h-[64px] w-auto" /></div>}
            <p className="font-serif italic text-[var(--claro-2)] text-[0.98rem] m-0 max-w-[36ch]">
              {EH_REDE ? 'Aves à pronta entrega, de criadouros parceiros, com rota de entrega organizada a partir de São Paulo.' : MARCA_ATUAL.frase}
            </p>
            {!EH_REDE && <p className="font-sans text-[0.78rem] text-[var(--claro-3)] mt-3 mb-0">{MARCA_ATUAL.responsavel} · {MARCA_ATUAL.credencial} · {MARCA_ATUAL.cidade}</p>}
          </div>
          <div>
            <div className="eyebrow">Navegação</div>
            <div className="flex flex-col gap-2">
              <L route="aves" label={EH_REDE ? 'Aves disponíveis' : 'O plantel'} />
              <L route="tabela" label="Tabela de valores" />
              <L route="pedido" label="Meu pedido" />
              <L route="rotas" label="Rotas de entrega" />
              <L route="criadores" label={EH_REDE ? 'Criadouros parceiros' : 'O criadouro'} />
              {EH_REDE ? <L route="consultoria" label="Consultoria" /> : <L route="sanidade" label="Sanidade e manejo" />}
              <L route="contato" label="Contato" />
              <L route="privacidade" label="Privacidade" />
              {EH_REDE ? (
                <a href={CONSTANTS.PRE_RESERVA_URL} target="_blank" rel="noopener noreferrer" className="font-sans text-[0.86rem] text-[var(--claro-2)] hover:text-[var(--ouro)] no-underline">
                  Encomenda / pré-reserva no avesarca.com.br ↗
                </a>
              ) : (
                <a href="https://avesornamentaisbrasil.com.br/aves" target="_blank" rel="noopener noreferrer" className="font-sans text-[0.86rem] text-[var(--claro-2)] hover:text-[var(--ouro)] no-underline">
                  Lista conjunta da rede ↗
                </a>
              )}
            </div>
          </div>
          <div>
            <div className="eyebrow">Contato</div>
            <a
              href={waComOrigem('rodape')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-sans text-[0.9rem] text-[var(--marfim)] no-underline hover:text-[var(--ouro)] mb-2"
            >
              <MessageCircle className="w-4 h-4 text-[var(--ouro)]" /> {CONSTANTS.WHATSAPP_DISPLAY}
            </a>
            <a href={`mailto:${CONSTANTS.EMAIL}`} className="flex items-center gap-2 font-sans text-[0.9rem] text-[var(--marfim)] no-underline hover:text-[var(--ouro)] mb-2">
              <Mail className="w-4 h-4 text-[var(--ouro)]" /> {CONSTANTS.EMAIL}
            </a>
            <a href={CONSTANTS.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-[0.9rem] text-[var(--marfim)] no-underline hover:text-[var(--ouro)]">
              <Instagram className="w-4 h-4 text-[var(--ouro)]" /> @{CONSTANTS.INSTAGRAM.replace(/.*instagram\.com\//, '').replace(/\/$/, '')}
            </a>
          </div>
        </div>
        <div className="border-t border-[var(--verde-claro)] mt-10 pt-5 flex flex-col sm:flex-row justify-between gap-2">
          <span className="font-sans text-[0.72rem] text-[var(--muted-3)]">© 2026 {CONSTANTS.MARCA}{!EH_REDE && ' · parte da rede Aves Ornamentais Brasil'}</span>
          <span className="font-sans text-[0.72rem] text-[var(--muted-3)]">Entrega em rota ou retirada em {CONSTANTS.RETIRADA}</span>
        </div>
      </div>
    </footer>
  );
};
