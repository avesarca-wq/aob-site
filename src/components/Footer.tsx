import React from 'react';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { PageRoute } from '../types';
import { CAMINHOS, waComOrigem } from '../lib/links';
import { CONSTANTS, CRIADORES } from '../data/catalogo';
import { LISTA_DATA } from '../data/aves';

export const Footer: React.FC<{ onNavigate: (p: PageRoute) => void }> = ({ onNavigate }) => {
  const L = ({ route, label }: { route: PageRoute; label: string }) => (
    <a
      href={CAMINHOS[route]}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(route);
      }}
      className="font-sans text-[0.86rem] text-[#C9D2C9] hover:text-[#D2A93C] no-underline"
    >
      {label}
    </a>
  );
  return (
    <footer className="bg-[#162B21] text-[#F6F1E6] mt-auto">
      <div className="wrap py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img src="/logo-selo.png" alt="Aves Ornamentais Brasil" className="h-[110px] w-auto mb-3" />
            <p className="font-serif italic text-[#C9D2C9] text-[0.98rem] m-0 max-w-[36ch]">
              Aves à pronta entrega, de criadouros parceiros, com rota de entrega organizada a partir de São Paulo.
            </p>
          </div>
          <div>
            <div className="eyebrow">Navegação</div>
            <div className="flex flex-col gap-2">
              <L route="aves" label="Aves disponíveis" />
              <L route="tabela" label="Tabela de valores" />
              <L route="pedido" label="Meu pedido" />
              <L route="rotas" label="Rotas de entrega" />
              <L route="criadores" label="Criadouros parceiros" />
              <L route="contato" label="Contato" />
              <L route="privacidade" label="Privacidade" />
              <a
                href={CONSTANTS.PRE_RESERVA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[0.86rem] text-[#C9D2C9] hover:text-[#D2A93C] no-underline"
              >
                Encomenda / pré-reserva no avesarca.com.br ↗
              </a>
            </div>
          </div>
          <div>
            <div className="eyebrow">Contato</div>
            <a
              href={waComOrigem('rodape')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-sans text-[0.9rem] text-[#F6F1E6] no-underline hover:text-[#D2A93C] mb-2"
            >
              <MessageCircle className="w-4 h-4 text-[#D2A93C]" /> {CONSTANTS.WHATSAPP_DISPLAY}
            </a>
            <a href={`mailto:${CONSTANTS.EMAIL}`} className="flex items-center gap-2 font-sans text-[0.9rem] text-[#F6F1E6] no-underline hover:text-[#D2A93C] mb-2">
              <Mail className="w-4 h-4 text-[#D2A93C]" /> {CONSTANTS.EMAIL}
            </a>
            <a href={CONSTANTS.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-[0.9rem] text-[#F6F1E6] no-underline hover:text-[#D2A93C]">
              <Instagram className="w-4 h-4 text-[#D2A93C]" /> @avesarca
            </a>
            <p className="font-sans text-[0.74rem] text-[#8FA08F] mt-5 mb-0 leading-relaxed">
              Criadouros: {CRIADORES.map((c) => c.nome).join(' · ')}.<br />
              Lista de {LISTA_DATA} · estoque sujeito a alteração · pagamento na entrega.
            </p>
          </div>
        </div>
        <div className="border-t border-[#2E5240] mt-10 pt-5 flex flex-col sm:flex-row justify-between gap-2">
          <span className="font-sans text-[0.72rem] text-[#8FA08F]">© 2026 Aves Ornamentais Brasil</span>
          <span className="font-sans text-[0.72rem] text-[#8FA08F]">Entrega em rota ou retirada em {CONSTANTS.RETIRADA}</span>
        </div>
      </div>
    </footer>
  );
};
