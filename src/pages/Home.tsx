import React from 'react';
import { ArrowRight, Truck, HandCoins, ListChecks, CalendarDays } from 'lucide-react';
import { PageRoute } from '../types';
import { AVES, TOTAL_AVES, TOTAL_LOTES, LISTA_DATA } from '../data/aves';
import { CATEGORIAS, CRIADORES, ROTAS, CONSTANTS, proximaSaida, dataCurta, brl } from '../data/catalogo';
import { AveCard } from '../components/AveCard';
import { CAMINHOS } from '../lib/links';

export const Home: React.FC<{ onNavigate: (p: PageRoute, extra?: string) => void }> = ({ onNavigate }) => {
  const destaques = AVES.filter((a) => a.foto).sort((a, b) => b.preco - a.preco).slice(0, 6);
  const rotasComData = ROTAS.map((r) => ({ r, p: proximaSaida(r) })).filter((x) => x.p);
  const porCategoria = (id: string) => AVES.filter((a) => a.categoria === id);
  const menor = Math.min(...AVES.map((a) => a.preco));

  return (
    <>
      {/* HERO */}
      <section className="sec-escura relative overflow-hidden">
        <div className="wrap py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div>
            <div className="eyebrow">Lista de {LISTA_DATA} · três criadouros, uma lista</div>
            <h1 className="font-serif text-[2.5rem] sm:text-[3.4rem] leading-[1.05] m-0 text-[#F6F1E6]">
              Aves ornamentais à <em className="not-italic text-[#D2A93C]">pronta entrega</em>, com rota marcada.
            </h1>
            <p className="font-serif text-[1.15rem] text-[#C9D2C9] mt-5 mb-8 max-w-[52ch]">
              {TOTAL_AVES} aves em {TOTAL_LOTES} lotes de {CRIADORES.length} criadouros parceiros. Você escolhe, monta o pedido, a gente confirma a rota da sua região — e você paga só na entrega, com a ave na mão.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={CAMINHOS.aves} onClick={(e) => { e.preventDefault(); onNavigate('aves'); }} className="btn btn-ouro">
                Ver aves disponíveis <ArrowRight className="w-4 h-4" />
              </a>
              <a href={CAMINHOS.rotas} onClick={(e) => { e.preventDefault(); onNavigate('rotas'); }} className="btn btn-ghost-claro">
                Rotas de entrega
              </a>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <img src="/logo-selo.png" alt="" className="w-[380px] opacity-95" />
          </div>
        </div>
        <div className="border-t border-[#2E5240]">
          <div className="wrap py-7 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="stat"><b>{TOTAL_AVES}</b><span>aves disponíveis</span></div>
            <div className="stat"><b>{TOTAL_LOTES}</b><span>variedades / lotes</span></div>
            <div className="stat"><b>{CRIADORES.length}</b><span>criadouros</span></div>
            <div className="stat"><b>{rotasComData[0] ? dataCurta(rotasComData[0].p!.saida) : '—'}</b><span>próxima rota</span></div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="section">
        <div className="wrap">
          <div className="eyebrow">O que tem hoje</div>
          <h2 className="sec-title">Por categoria</h2>
          <p className="sec-sub">A lista é abastecida conforme a necessidade: quando um criadouro tem lote pronto, ele entra aqui. A partir de {brl(menor)}.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIAS.map((c) => {
              const n = porCategoria(c.id);
              const aves = n.reduce((s, a) => s + a.machos + a.femeas, 0);
              const vazio = n.length === 0;
              return (
                <a
                  key={c.id}
                  href={`${CAMINHOS.aves}?categoria=${c.id}`}
                  onClick={(e) => { e.preventDefault(); if (!vazio) onNavigate('aves', c.id); }}
                  className={`card p-5 no-underline ${vazio ? 'opacity-60 cursor-default' : ''}`}
                >
                  <div className="font-sans text-[0.64rem] tracking-[1.5px] uppercase text-[#B99034] font-bold">
                    {vazio ? 'em formação' : `${n.length} ${n.length === 1 ? 'lote' : 'lotes'} · ${aves} aves`}
                  </div>
                  <h3 className="text-[1.25rem] text-[#1F3B2E] mt-1 mb-1">{c.nome}</h3>
                  <p className="font-serif text-[0.9rem] text-[#5B6B5B] m-0">{c.descricao}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="section bg-[#F6F1E6] border-y border-[#E1DCCF]">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
            <div>
              <div className="eyebrow">Fotos do plantel</div>
              <h2 className="sec-title">Destaques da lista</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={CAMINHOS.aves} onClick={(e) => { e.preventDefault(); onNavigate('aves'); }} className="btn btn-ghost">
                Ver todas as {TOTAL_LOTES} variedades
              </a>
              <a href={CAMINHOS.tabela} onClick={(e) => { e.preventDefault(); onNavigate('tabela'); }} className="btn btn-verde">
                Tabela de valores · pedido rápido
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {destaques.map((a) => (
              <AveCard key={a.id} ave={a} onVerPedido={() => onNavigate('pedido')} />
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="section">
        <div className="wrap">
          <div className="text-center">
            <div className="eyebrow">Como funciona</div>
            <h2 className="sec-title center">Três passos, nenhum pagamento antecipado</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
            {[
              { i: ListChecks, t: '1. Monte o pedido', d: 'Escolha as aves na lista — casal, macho ou fêmea — e informe sua cidade. O site já mostra a rota e o frete.' },
              { i: CalendarDays, t: '2. A gente confirma a rota', d: 'Você recebe a confirmação no WhatsApp com a data de saída da rota da sua região ou a retirada em São Paulo.' },
              { i: HandCoins, t: '3. Pague na entrega', d: 'Você confere a ave e paga na hora, em Pix ou dinheiro. Sem sinal, sem depósito antecipado.' },
            ].map((p) => (
              <div key={p.t} className="card p-7">
                <p.i className="w-8 h-8 text-[#D2A93C] mb-3" strokeWidth={1.6} />
                <h3 className="text-[1.3rem] text-[#1F3B2E] m-0 mb-2">{p.t}</h3>
                <p className="font-serif text-[1rem] text-[#5B6B5B] m-0">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROTAS */}
      <section className="sec-escura section">
        <div className="wrap grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <div>
            <div className="eyebrow">Rotas de entrega</div>
            <h2 className="sec-title">Saída de São Paulo, entrega na sua região</h2>
            <p className="sec-sub">As aves dos três criadouros viajam juntas, numa rota organizada por região. Quanto mais pedidos na mesma rota, mais cedo ela fecha.</p>
            <a href={CAMINHOS.rotas} onClick={(e) => { e.preventDefault(); onNavigate('rotas'); }} className="btn btn-ouro">
              <Truck className="w-4 h-4" /> Ver calendário e cidades
            </a>
          </div>
          <div className="grid gap-3">
            {rotasComData.map(({ r, p }) => (
              <div key={r.regiao} className="rounded-2xl border border-[#2E5240] bg-[#162B21] p-5 flex flex-wrap justify-between gap-3 items-center">
                <div>
                  <div className="font-serif text-[1.2rem] text-[#F6F1E6]">{r.nome}</div>
                  <div className="font-sans text-[0.78rem] text-[#C9D2C9]">{r.nota}</div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-[1.6rem] text-[#D2A93C] leading-none">{dataCurta(p!.saida)}</div>
                  <div className="font-sans text-[0.7rem] uppercase tracking-[1px] text-[#C9D2C9]">pedidos até {dataCurta(p!.fecha)}</div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-[#2E5240] p-5">
              <div className="font-serif text-[1.2rem] text-[#F6F1E6]">Grande São Paulo e raio de 150 km</div>
              <div className="font-sans text-[0.78rem] text-[#C9D2C9]">Data combinada direto pelo WhatsApp · retirada em {CONSTANTS.RETIRADA}</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRÉ-RESERVA */}
      <section className="section">
        <div className="wrap">
          <div className="card p-8 md:p-10 grid grid-cols-1 md:grid-cols-[1.4fr_0.6fr] gap-6 items-center">
            <div>
              <div className="eyebrow">Não achou o que procura?</div>
              <h2 className="text-[1.7rem] text-[#1F3B2E] m-0 mb-2">Aqui é só o que está pronto para sair.</h2>
              <p className="font-serif text-[1rem] text-[#5B6B5B] m-0">
                Variedade que ainda vai nascer, ou que não está na lista de hoje, é encomenda: a pré-reserva sem pagamento antecipado continua no site da Aves Arca.
              </p>
            </div>
            <a href={CONSTANTS.PRE_RESERVA_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost justify-self-start md:justify-self-end">
              Pré-reserva no avesarca.com.br ↗
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
