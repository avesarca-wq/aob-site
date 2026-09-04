import React from 'react';
import { MapPin, Feather } from 'lucide-react';
import { PageRoute } from '../types';
import { CRIADORES, CONSTANTS } from '../data/catalogo';
import { AVES } from '../data/aves';

export const Criadores: React.FC<{ onNavigate: (p: PageRoute) => void }> = ({ onNavigate }) => {
  const lotesDe = (id: string) => AVES.filter((a) => a.criador === id || (a.criador === 'parceiros' && id !== 'aves-arca'));
  return (
    <>
      <section className="sec-escura">
        <div className="wrap py-10 sm:py-14">
          <div className="eyebrow">Quem cria</div>
          <h1 className="sec-title" style={{ fontSize: '2.4rem' }}>Criadouros parceiros</h1>
          <p className="sec-sub" style={{ marginBottom: 0 }}>
            A Aves Ornamentais Brasil reúne numa lista só o que três criadouros de São Paulo têm pronto para entregar. Cada ave sai do plantel de origem e viaja na mesma rota.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="wrap grid grid-cols-1 md:grid-cols-3 gap-5">
          {CRIADORES.map((c) => {
            const lotes = lotesDe(c.id);
            const aves = lotes.reduce((s, a) => s + a.machos + a.femeas, 0);
            return (
              <div key={c.id} className="card p-7">
                <div className="eyebrow" style={{ marginBottom: 6 }}>{c.responsavel}</div>
                <h2 className="text-[1.6rem] text-[#1F3B2E] m-0">{c.nome}</h2>
                <p className="font-sans text-[0.78rem] text-[#5B6B5B] mt-1 mb-3 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#B99034]" /> {c.cidade}</p>
                <p className="font-serif text-[1rem] text-[#1E2A24] m-0 mb-3">{c.descricao}</p>
                <p className="font-serif text-[0.92rem] text-[#5B6B5B] m-0 flex items-start gap-1.5"><Feather className="w-4 h-4 flex-none mt-1 text-[#B99034]" /> {c.especialidade}</p>
                <div className="mt-5 pt-4 border-t border-[#E1DCCF] font-sans text-[0.74rem] uppercase tracking-[1px] text-[#B99034] font-bold">
                  {c.id === 'aves-arca' ? `${lotes.length} lotes · ${aves} aves na lista` : 'lotes na lista junto com o parceiro'}
                </div>
              </div>
            );
          })}
        </div>
        <div className="wrap mt-10">
          <div className="card p-8 grid grid-cols-1 md:grid-cols-[1.4fr_0.6fr] gap-5 items-center">
            <div>
              <div className="eyebrow">Um só canal</div>
              <h2 className="text-[1.5rem] text-[#1F3B2E] m-0 mb-2">Pedido, rota e pagamento passam pela AOB.</h2>
              <p className="font-serif text-[1rem] text-[#5B6B5B] m-0">Você fala com um WhatsApp só ({CONSTANTS.WHATSAPP_DISPLAY}), recebe tudo na mesma rota e paga na entrega, ave por ave, ao conferir.</p>
            </div>
            <button onClick={() => onNavigate('aves')} className="btn btn-verde justify-self-start md:justify-self-end">Ver aves disponíveis</button>
          </div>
        </div>
      </section>
    </>
  );
};
