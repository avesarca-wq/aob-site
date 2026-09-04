import React, { useMemo, useState } from 'react';
import { CalendarDays, MapPin, MessageCircle } from 'lucide-react';
import { PageRoute } from '../types';
import { ROTAS, CONSTANTS, proximaSaida, dataCurta, dataLonga, brl } from '../data/catalogo';
import { ZONAS } from '../data/zonas';
import { CIDADES } from '../data/cidades';
import { CidadeInput, entregaDaCidade } from '../components/CidadeInput';
import { waComOrigem } from '../lib/links';

export const Rotas: React.FC<{ onNavigate: (p: PageRoute) => void }> = ({ onNavigate }) => {
  const [cidade, setCidade] = useState('');
  const info = useMemo(() => entregaDaCidade(cidade), [cidade]);
  const cidadesDaRegiao = (regiao: string) => CIDADES.filter((c) => c.r === regiao).sort((a, b) => b.p - a.p);

  return (
    <>
      <section className="sec-escura">
        <div className="wrap py-10 sm:py-14">
          <div className="eyebrow">Entrega</div>
          <h1 className="sec-title" style={{ fontSize: '2.4rem' }}>Rotas de entrega</h1>
          <p className="sec-sub" style={{ marginBottom: 0 }}>
            As aves dos três criadouros saem juntas de São Paulo numa rota por região, em data marcada. Frete por saída, não por quilômetro. Pagamento na entrega.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="wrap">
          <div className="card p-6 sm:p-8 mb-10 max-w-2xl">
            <div className="eyebrow">Encontre sua cidade</div>
            <h2 className="text-[1.5rem] text-[#1F3B2E] m-0 mb-4">Quando a rota passa na sua cidade?</h2>
            <CidadeInput value={cidade} onChange={(c) => setCidade(c)} mostrarResumo={false} />
            {info && (
              <div className="mt-4 rounded-2xl bg-[#1F3B2E] text-[#F6F1E6] p-5">
                <div className="font-sans text-[0.68rem] uppercase tracking-[1.5px] text-[#D2A93C] font-bold mb-1">{info.cidade.c} — {info.cidade.uf}</div>
                <div className="font-serif text-[1.4rem] leading-tight">{info.rota?.nome ?? info.cidade.r}</div>
                <div className="font-sans text-[0.85rem] text-[#C9D2C9] mt-2">
                  {info.prox
                    ? <>Próxima saída <strong className="text-[#F6F1E6]">{dataLonga(info.prox.saida)}</strong> · pedidos até {dataCurta(info.prox.fecha)}</>
                    : info.zona.n === 1
                      ? 'Data combinada direto pelo WhatsApp — ou retirada em São Paulo.'
                      : 'Rota em formação: faça o pedido e a gente avisa quando fechar a data.'}
                </div>
                <div className="font-sans text-[0.85rem] text-[#C9D2C9] mt-1">Frete: <strong className="text-[#F6F1E6]">{info.zona.tarifaTexto}</strong> · {info.zona.rotulo}</div>
                <button onClick={() => onNavigate('aves')} className="btn btn-ouro mt-4 !py-2">Escolher as aves</button>
              </div>
            )}
          </div>

          <div className="eyebrow">Calendário set–nov/2026</div>
          <h2 className="sec-title">Rotas por região</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ROTAS.map((r) => {
              const p = proximaSaida(r);
              const cidades = cidadesDaRegiao(r.regiao);
              return (
                <div key={r.regiao} className="card p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[1.35rem] text-[#1F3B2E] m-0">{r.nome}</h3>
                      <p className="font-serif text-[0.92rem] text-[#5B6B5B] mt-1 mb-0">{r.nota}</p>
                    </div>
                    {p ? (
                      <div className="text-right flex-none">
                        <div className="font-serif text-[1.7rem] text-[#B99034] leading-none">{dataCurta(p.saida)}</div>
                        <div className="font-sans text-[0.62rem] uppercase tracking-[1px] text-[#5B6B5B]">próxima saída</div>
                      </div>
                    ) : (
                      <span className="chip chip-claro flex-none">{r.datas.length ? 'encerrada' : r.regiao.startsWith('Entrega rápida') ? 'a combinar' : 'em formação'}</span>
                    )}
                  </div>
                  {r.datas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {r.datas.map((d) => {
                        const dt = new Date(d + 'T12:00:00-03:00');
                        const passada = dt.getTime() < Date.now();
                        return (
                          <span key={d} className={`chip ${passada ? 'chip-claro opacity-50' : p && dataCurta(p.saida) === dataCurta(dt) ? 'chip-ouro' : 'chip-verde'}`}>
                            <CalendarDays className="w-3 h-3" /> {dataCurta(dt)}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <details className="mt-4">
                    <summary className="font-sans text-[0.78rem] font-semibold text-[#1F3B2E] cursor-pointer flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B99034]" /> {cidades.length} cidades atendidas
                    </summary>
                    <p className="font-sans text-[0.78rem] text-[#5B6B5B] mt-2 mb-0 leading-relaxed">
                      {cidades.slice(0, 40).map((c) => c.c).join(' · ')}{cidades.length > 40 ? ` · e mais ${cidades.length - 40}` : ''}
                    </p>
                  </details>
                </div>
              );
            })}
          </div>

          <div className="mt-12">
            <div className="eyebrow">Frete por saída</div>
            <h2 className="sec-title">Zonas de frete</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[ZONAS[1], ZONAS[2], ZONAS[3], ZONAS[5], ZONAS[4]].map((z) => (
                <div key={z.n} className="card p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[1.15rem] text-[#1F3B2E] m-0">{z.rotulo}</h3>
                    <b className="font-serif text-[1.3rem] text-[#B99034]">{z.tarifaTexto}</b>
                  </div>
                  <p className="font-sans text-[0.78rem] text-[#5B6B5B] mt-1 mb-1">{z.prazo}.</p>
                  <p className="font-serif text-[0.9rem] text-[#5B6B5B] m-0">{z.detalhe}</p>
                </div>
              ))}
              <div className="card p-5 border-dashed">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-[1.15rem] text-[#1F3B2E] m-0">Retirada em {CONSTANTS.RETIRADA}</h3>
                  <b className="font-serif text-[1.3rem] text-[#B99034]">{brl(0)}</b>
                </div>
                <p className="font-serif text-[0.9rem] text-[#5B6B5B] mt-1 mb-0">Dia e hora combinados pelo WhatsApp. Você confere a ave e paga na hora.</p>
              </div>
            </div>
          </div>

          <div className="note flex flex-wrap items-center justify-between gap-3 mt-10">
            <span>Sua cidade não aparece, ou quer uma entrega individual? Fala com a gente.</span>
            <a href={waComOrigem('rotas')} target="_blank" rel="noopener noreferrer" className="btn btn-wa !py-2"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
};
