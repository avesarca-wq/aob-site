import React from 'react';
import { MapPin, Feather, UserRound } from 'lucide-react';
import { PageRoute } from '../types';
import { CRIADORES, CONSTANTS } from '../data/catalogo';

export const Criadores: React.FC<{ onNavigate: (p: PageRoute) => void }> = ({ onNavigate }) => {
  return (
    <>
      <section className="sec-escura">
        <div className="wrap py-10 sm:py-14">
          <div className="eyebrow">Quem cria</div>
          <h1 className="sec-title" style={{ fontSize: '2.4rem' }}>Criadouros parceiros</h1>
          <p className="sec-sub" style={{ marginBottom: 0 }}>
            A parceria de três criadouros de São Paulo numa lista só. Você escolhe aves de plantéis diferentes no mesmo pedido e elas viajam até você na mesma rota: uma viagem só para as aves, um frete só para você. Juntos, o que nenhum deles tem sozinho.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="wrap grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {CRIADORES.map((c) => {
            return (
              <div key={c.id} className="card p-7 flex flex-col text-center h-full">
                <div className="inline-flex self-center items-center gap-2 bg-[#1F3B2E] text-[#F6F1E6] font-sans text-[0.6rem] uppercase tracking-[1.6px] font-bold px-3 py-1.5 rounded-full mb-4">
                  <img src="/simbolo-creme.svg" alt="" className="w-3.5 h-3.5" /> Membro fundador
                </div>
                <div className="h-36 mb-5 flex items-center justify-center rounded-xl bg-white border border-[#E1DCCF] px-5 py-3 overflow-hidden">
                  {c.logo
                    ? <img src={c.logo} alt={`Logotipo ${c.nome}`} className="max-h-full max-w-full w-auto h-auto object-contain" style={c.logoEscala ? { transform: `scale(${c.logoEscala})` } : undefined} loading="lazy" />
                    : <span className="font-sans text-[0.7rem] uppercase tracking-[1.5px] text-[#9AA59A] font-bold border border-dashed border-[#C9D2C9] rounded-lg px-3 py-2">Logotipo em breve</span>}
                </div>
                <h2 className="text-[1.6rem] text-[#1F3B2E] m-0">{c.nome}</h2>
                <p className="font-sans text-[0.78rem] text-[#5B6B5B] mt-1 mb-1 flex items-center justify-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#B99034]" /> {c.cidade}</p>
                <p className="font-sans text-[0.78rem] text-[#5B6B5B] mt-0 mb-4 flex items-center justify-center gap-1.5"><UserRound className="w-3.5 h-3.5 text-[#B99034]" /> <span><b className="text-[#1F3B2E] font-semibold">{c.responsavel}</b> · {c.profissao}</span></p>
                <p lang="pt-BR" className="font-serif text-[1rem] text-[#1E2A24] m-0 mb-4 text-justify hyphens-auto">{c.descricao}</p>
                <p className="font-serif text-[0.92rem] text-[#5B6B5B] m-0 mt-auto pt-4 border-t border-[#E1DCCF] flex items-start justify-center gap-1.5 text-left"><Feather className="w-4 h-4 flex-none mt-1 text-[#B99034]" /> <span>{c.especialidade}</span></p>
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
