// src/pages/Criadouro.tsx — "O criadouro": a página de quem responde, nos sites de criadouro.
// Na rede, a rota /criadores mostra os três parceiros (Criadores.tsx); aqui mostra um só.
import React from 'react';
import { MapPin, Stethoscope, Feather, Network } from 'lucide-react';
import { PageRoute } from '../types';
import { CRIADORES, CONSTANTS } from '../data/catalogo';
import { TOTAL_VARIEDADES } from '../data/aves';
import { MARCA_ATUAL } from '../marcas';
import { waComOrigem } from '../lib/links';

export const Criadouro: React.FC<{ onNavigate: (p: PageRoute) => void }> = ({ onNavigate }) => {
  const c = CRIADORES.find((x) => (MARCA_ATUAL.criadores as string[]).includes(x.id)) ?? CRIADORES[0];
  const m = MARCA_ATUAL;
  return (
    <>
      <section className="sec-escura">
        <div className="wrap py-10 sm:py-14">
          <div className="eyebrow">Quem cria</div>
          <h1 className="sec-title" style={{ fontSize: '2.4rem' }}>{c.nome}</h1>
          <p className="sec-sub" style={{ marginBottom: 0 }}>
            {m.responsavel}, {m.credencial}. {TOTAL_VARIEDADES} variedades criadas no mesmo plantel, em {m.cidade}.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="wrap grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <div className="card p-7 text-center">
            <div className="h-40 mb-5 flex items-center justify-center rounded-xl bg-white border border-[var(--line)] px-5 py-3 overflow-hidden">
              <img src={c.logo} alt={`Logotipo ${c.nome}`} className="max-h-full max-w-full w-auto h-auto object-contain" style={c.logoEscala ? { transform: `scale(${c.logoEscala})` } : undefined} />
            </div>
            <p className="font-sans text-[0.78rem] text-[var(--muted)] mt-1 mb-1 flex items-center justify-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[var(--ouro2)]" /> {c.cidade}</p>
            <p className="font-sans text-[0.78rem] text-[var(--muted)] mt-0 mb-4 flex items-center justify-center gap-1.5"><Stethoscope className="w-3.5 h-3.5 text-[var(--ouro2)]" /> <span><b className="text-[var(--verde)] font-semibold">{m.responsavel}</b> · {m.credencial}</span></p>
            <p className="font-serif text-[0.92rem] text-[var(--muted)] m-0 pt-4 border-t border-[var(--line)] flex items-start justify-center gap-1.5 text-left"><Feather className="w-4 h-4 flex-none mt-1 text-[var(--ouro2)]" /> <span>{c.especialidade}</span></p>
          </div>

          <div>
            <div className="eyebrow">A criação</div>
            <h2 className="text-[1.6rem] text-[var(--verde)] m-0 mb-3">Um pouco de tudo — e é essa a ideia.</h2>
            <p lang="pt-BR" className="font-serif text-[1.02rem] text-[var(--ink)] m-0 mb-4 text-justify hyphens-auto">
              Pavões, faisões, perdizes, pombas, psitacídeos, turacos, aquáticas e aves de quintal no mesmo plantel. Não é dispersão: é a única criação da rede que consegue montar um espaço inteiro — o lago, o gramado, o viveiro e o quintal — com aves que nasceram no mesmo lugar, sob o mesmo manejo, e que chegam na mesma rota.
            </p>
            <p lang="pt-BR" className="font-serif text-[1.02rem] text-[var(--ink)] m-0 mb-4 text-justify hyphens-auto">
              {c.descricao}
            </p>
            <p lang="pt-BR" className="font-serif text-[1.02rem] text-[var(--ink)] m-0 mb-6 text-justify hyphens-auto">
              Toda ave sai daqui com a orientação de manejo de quem cuida dela desde o ovo — e com um número para ligar depois. É isso que a palavra <em>segurança</em>, na primeira linha do site, quer dizer.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => onNavigate('aves')} className="btn btn-verde">Ver o plantel</button>
              <a href={waComOrigem('criadores')} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Falar com {m.responsavel.replace('Dr. ', '')}</a>
            </div>
          </div>
        </div>

        <div className="wrap mt-10">
          <div className="card p-8 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 items-center">
            <div className="w-12 h-12 rounded-full bg-[var(--verde)] text-[var(--ouro)] flex items-center justify-center"><Network className="w-6 h-6" /></div>
            <div>
              <div className="eyebrow">Parte de uma rede</div>
              <h2 className="text-[1.4rem] text-[var(--verde)] m-0 mb-2">Três criadouros, uma rota.</h2>
              <p lang="pt-BR" className="font-serif text-[1rem] text-[var(--muted)] m-0 text-justify hyphens-auto">
                O {c.nome} faz parte da Aves Ornamentais Brasil, com o Aves Arca (aquáticas, São Paulo) e o Criadouro Aliança (faisões raros, Jundiaí). A lista conjunta e o calendário de rotas ficam em avesornamentaisbrasil.com.br; o que você vê aqui é só o que nasce em {m.cidade}. WhatsApp direto: {CONSTANTS.WHATSAPP_DISPLAY}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
