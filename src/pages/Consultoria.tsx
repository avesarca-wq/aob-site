import React from 'react';
import { Instagram, UserRound, Sprout, ArrowRight, MessageCircle } from 'lucide-react';
import { PageRoute } from '../types';
import { CONSULTORES, CONSTANTS } from '../data/catalogo';
import { waComOrigem } from '../lib/links';

export const Consultoria: React.FC<{ onNavigate: (p: PageRoute) => void }> = ({ onNavigate }) => (
  <>
    <section className="sec-escura">
      <div className="wrap py-10 sm:py-14">
        <div className="eyebrow">Depois da compra</div>
        <h1 className="sec-title" style={{ fontSize: '2.4rem' }}>Consultoria</h1>
        <p lang="pt-BR" className="sec-sub text-justify hyphens-auto" style={{ marginBottom: 0 }}>
          Comprar a ave é a parte fácil. O que separa quem desiste de quem faz plantel é o que vem
          depois: recinto certo, ração certa, casal certo. Por isso a rede tem dois consultores — um
          biólogo e a zootecnia — para quem está começando não aprender no erro, e para quem já cria
          resolver o que emperrou.
        </p>
      </div>
    </section>

    <section className="section" style={{ paddingTop: 32 }}>
      <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        {CONSULTORES.map((c) => (
          <div key={c.id} className="card p-7 flex flex-col text-center h-full">
            <div className="h-32 mb-5 flex items-center justify-center rounded-xl bg-white border border-[#E1DCCF] px-5 py-3 overflow-hidden">
              <img
                src={c.logo}
                alt={`Logotipo ${c.nome}`}
                className="max-h-full max-w-full w-auto h-auto object-contain"
                style={c.logoEscala ? { transform: `scale(${c.logoEscala})` } : undefined}
                loading="lazy"
              />
            </div>

            <h2 className="text-[1.6rem] text-[#1F3B2E] m-0">{c.nome}</h2>
            <p className="font-sans text-[0.78rem] text-[#5B6B5B] mt-1 mb-4 flex items-center justify-center gap-1.5">
              <UserRound className="w-3.5 h-3.5 text-[#B99034]" />
              <span>
                <b className="text-[#1F3B2E] font-semibold">{c.responsavel}</b> · {c.profissao}
              </span>
            </p>

            <p className="font-serif italic text-[1rem] text-[#B99034] m-0 mb-3">“{c.chamada}”</p>
            <p lang="pt-BR" className="font-serif text-[1rem] text-[#1E2A24] m-0 mb-4 text-justify hyphens-auto">
              {c.descricao}
            </p>

            <div className="mt-auto pt-4 border-t border-[#E1DCCF]">
              <p className="font-serif text-[0.92rem] text-[#5B6B5B] m-0 mb-4 flex items-start justify-center gap-1.5 text-left">
                <Sprout className="w-4 h-4 flex-none mt-1 text-[#B99034]" />
                <span>{c.frentes.join(' · ')}</span>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <a
                  href={`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(
                    `Olá! Vim pela página de consultoria da Aves Ornamentais Brasil e quero falar sobre ${c.frentes[0].toLowerCase()}.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa !py-2 inline-flex"
                >
                  <MessageCircle className="w-4 h-4" /> {c.whatsappDisplay}
                </a>
                <a
                  href={c.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost !py-2 inline-flex"
                >
                  <Instagram className="w-4 h-4" /> {c.arroba}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="wrap mt-10">
        <div className="card p-8 grid grid-cols-1 md:grid-cols-[1.4fr_0.6fr] gap-5 items-center">
          <div>
            <div className="eyebrow">Como funciona</div>
            <h2 className="text-[1.5rem] text-[#1F3B2E] m-0 mb-2">A consultoria é contratada direto com cada um.</h2>
            <p lang="pt-BR" className="font-serif text-[1rem] text-[#5B6B5B] m-0 text-justify hyphens-auto">
              A AOB não intermedeia nem cobra por isso: são profissionais independentes que a rede
              indica porque confia no trabalho. Fale direto com eles pelo WhatsApp ou pelo Instagram. Se
              não souber por onde começar, chame no nosso WhatsApp {CONSTANTS.WHATSAPP_DISPLAY} que a gente aponta o
              caminho — dúvida de espécie e recinto é com o biólogo; ração, sanidade e reprodução é
              com a zootecnia.
            </p>
          </div>
          <div className="grid gap-2 justify-self-start md:justify-self-end">
            <a href={waComOrigem('consultoria')} target="_blank" rel="noopener noreferrer" className="btn btn-wa !py-2">
              <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
            </a>
            <button onClick={() => onNavigate('aves')} className="btn btn-ghost !py-2">
              Ver aves disponíveis <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </>
);
