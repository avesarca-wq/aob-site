import React from 'react';
import { MessageCircle, Mail, Instagram, MapPin } from 'lucide-react';
import { PageRoute } from '../types';
import { CONSTANTS } from '../data/catalogo';
import { waComOrigem } from '../lib/links';

export const Contato: React.FC<{ onNavigate: (p: PageRoute) => void }> = ({ onNavigate }) => (
  <>
    <section className="sec-escura">
      <div className="wrap py-10 sm:py-14">
        <div className="eyebrow">Fale com a gente</div>
        <h1 className="sec-title" style={{ fontSize: '2.4rem' }}>Contato</h1>
        <p className="sec-sub" style={{ marginBottom: 0 }}>Um WhatsApp só para pedidos, rotas e dúvidas dos três criadouros.</p>
      </div>
    </section>
    <section className="section" style={{ paddingTop: 32 }}>
      <div className="wrap grid grid-cols-1 md:grid-cols-3 gap-5">
        <a href={waComOrigem('contato')} target="_blank" rel="noopener noreferrer" className="card p-7 no-underline">
          <MessageCircle className="w-8 h-8 text-[#1E8E5A] mb-3" />
          <h2 className="text-[1.3rem] text-[#1F3B2E] m-0">WhatsApp</h2>
          <p className="font-sans text-[1rem] text-[#1E2A24] mt-1 mb-1">{CONSTANTS.WHATSAPP_DISPLAY}</p>
          <p className="font-serif text-[0.9rem] text-[#5B6B5B] m-0">Resposta em horário comercial. Pedido pelo site chega com a mensagem pronta.</p>
        </a>
        <a href={`mailto:${CONSTANTS.EMAIL}`} className="card p-7 no-underline">
          <Mail className="w-8 h-8 text-[#B99034] mb-3" />
          <h2 className="text-[1.3rem] text-[#1F3B2E] m-0">E-mail</h2>
          <p className="font-sans text-[1rem] text-[#1E2A24] mt-1 mb-1">{CONSTANTS.EMAIL}</p>
          <p className="font-serif text-[0.9rem] text-[#5B6B5B] m-0">Para orçamentos maiores ou documentos.</p>
        </a>
        <a href={CONSTANTS.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="card p-7 no-underline">
          <Instagram className="w-8 h-8 text-[#B99034] mb-3" />
          <h2 className="text-[1.3rem] text-[#1F3B2E] m-0">Instagram</h2>
          <p className="font-sans text-[1rem] text-[#1E2A24] mt-1 mb-1">@avesarca</p>
          <p className="font-serif text-[0.9rem] text-[#5B6B5B] m-0">Fotos e vídeos do plantel e das rotas.</p>
        </a>
      </div>
      <div className="wrap mt-8">
        <div className="note flex items-start gap-2"><MapPin className="w-4 h-4 flex-none mt-1 text-[#B99034]" /> <span>Retirada em {CONSTANTS.RETIRADA}, com dia e hora combinados. Entregas em rota a partir de São Paulo — veja o <button onClick={() => onNavigate('rotas')} className="underline bg-transparent border-0 cursor-pointer text-[#1F3B2E] font-serif text-[0.95rem] p-0">calendário de rotas</button>.</span></div>
      </div>
    </section>
  </>
);
