import React, { useMemo, useState } from 'react';
import { FileDown, Search, ShoppingBasket, Trash2 } from 'lucide-react';
import { PageRoute } from '../types';
import { AVES, LISTA_DATA, TOTAL_AVES, TOTAL_LOTES } from '../data/aves';
import { CATEGORIA, CRIADOR_ROTULO, CONSTANTS, UNIDADE_ROTULO, brl } from '../data/catalogo';
import { useCart, estoqueDaUnidade } from '../cart/CartContext';
import { estoqueTexto } from '../components/AveCard';

const normaliza = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * TABELA DE VALORES — segunda via de pedido (pedido do Ricardo, 04/09/2026).
 * Uma página só, no formato da lista impressa: quem já conhece as aves marca as quantidades
 * direto na linha e fecha o pedido, sem passar pelos cards.
 */
export const Tabela: React.FC<{ onNavigate: (p: PageRoute) => void }> = ({ onNavigate }) => {
  const { quantidadeDe, alterar, adicionar, totalUnidades, totalReferencia, totalLinhas, esvaziar } = useCart();
  const [busca, setBusca] = useState('');
  const [soPromo, setSoPromo] = useState(false);

  // Grupos na ordem da lista impressa; dentro do grupo, do mais barato ao mais caro.
  const grupos = useMemo(() => {
    const q = normaliza(busca.trim());
    const lista = AVES.filter((a) => (!soPromo || a.preco_de) && (!q || normaliza(`${a.nome} ${a.cientifico} ${a.grupo} ${a.detalhe}`).includes(q)));
    const ordem = [...new Set(AVES.map((a) => a.grupo))];
    const m = new Map<string, typeof lista>();
    for (const a of lista) m.set(a.grupo, [...(m.get(a.grupo) || []), a]);
    return [...m.entries()]
      .sort((x, y) => ordem.indexOf(x[0]) - ordem.indexOf(y[0]))
      .map(([g, aves]) => [g, [...aves].sort((a, b) => a.preco - b.preco)] as const);
  }, [busca, soPromo]);

  const totalMostrado = grupos.reduce((s, [, l]) => s + l.length, 0);

  return (
    <>
      <section className="sec-escura">
        <div className="wrap py-8 sm:py-10">
          <div className="eyebrow">Lista de {LISTA_DATA} · estoque sujeito a alteração</div>
          <h1 className="sec-title" style={{ fontSize: '2.2rem' }}>Tabela de valores</h1>
          <p className="sec-sub" style={{ marginBottom: 0 }}>
            {TOTAL_AVES} aves em {TOTAL_LOTES} lotes numa página só. Já conhece as aves? Marque as quantidades aqui e feche o pedido. Preço de casal = macho + fêmea · pagamento na entrega.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20, paddingBottom: 120 }}>
        <div className="wrap">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6B5B]" />
              <input className="campo !pl-10 !py-2.5" placeholder="Buscar na tabela…" value={busca} onChange={(e) => setBusca(e.target.value)} aria-label="Buscar" />
            </div>
            <label className="flex items-center gap-2 font-sans text-[0.82rem] text-[#5B6B5B] cursor-pointer">
              <input type="checkbox" checked={soPromo} onChange={(e) => setSoPromo(e.target.checked)} /> Só promoções
            </label>
            <a href="/lista-aves-disponiveis.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-ghost !py-2 !px-4 text-[0.8rem]">
              <FileDown className="w-4 h-4" /> PDF
            </a>
            <span className="font-sans text-[0.78rem] text-[#5B6B5B] ml-auto">{totalMostrado} lotes</span>
          </div>

          <div className="card overflow-x-auto hidden md:block">
            <table className="tabela min-w-[720px]">
              <thead>
                <tr>
                  <th className="w-[38%]">Ave</th>
                  <th>Estoque</th>
                  <th>Criadouro</th>
                  <th>Unid.</th>
                  <th className="text-right">Preço</th>
                  <th className="text-center w-[150px]">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {grupos.map(([g, aves]) => (
                  <React.Fragment key={g}>
                    <tr>
                      <td colSpan={6} className="!py-2 bg-[#F6F1E6]">
                        <span className="font-serif text-[1.05rem] text-[#1F3B2E] font-semibold">{g}</span>
                        <span className="font-sans text-[0.62rem] tracking-[1.5px] uppercase text-[#B99034] ml-3">{CATEGORIA[aves[0].categoria].nome}</span>
                      </td>
                    </tr>
                    {aves.map((a) => {
                      const q = quantidadeDe(a.id);
                      const max = estoqueDaUnidade(a.id);
                      return (
                        <tr key={a.id} className={q > 0 ? 'bg-[#FFF8E6]' : ''}>
                          <td>
                            <div className="font-serif text-[1.02rem] text-[#1F3B2E] leading-tight">
                              {a.nome}
                              {a.detalhe && <span className="italic text-[#5B6B5B] text-[0.9rem]"> · {a.detalhe}</span>}
                              {a.preco_de && <span className="chip chip-promo !text-[0.55rem] !py-0.5 !px-2 ml-2 align-middle">Promo</span>}
                            </div>
                            <div className="text-[0.72rem] italic text-[#5B6B5B]">{a.cientifico}</div>
                          </td>
                          <td className="whitespace-nowrap text-[0.82rem]">{estoqueTexto(a)}</td>
                          <td className="text-[0.74rem] text-[#5B6B5B]">{CRIADOR_ROTULO[a.criador]}</td>
                          <td className="text-[0.8rem]">{UNIDADE_ROTULO[a.unidade]}</td>
                          <td className="text-right whitespace-nowrap">
                            {a.preco_de && <s className="text-[0.75rem] text-[#9AA59A] mr-1.5">{brl(a.preco_de)}</s>}
                            <b className="text-[#1F3B2E]">{brl(a.preco)}</b>
                          </td>
                          <td className="text-center">
                            <div className="qtd">
                              <button type="button" onClick={() => alterar(a.id, q - 1)} aria-label={`Menos ${a.nome}`} disabled={q === 0}>−</button>
                              <span>{q}</span>
                              <button type="button" onClick={() => (q === 0 ? adicionar(a.id, 1) : alterar(a.id, q + 1))} aria-label={`Mais ${a.nome}`} disabled={q >= max}>+</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
                {totalMostrado === 0 && (
                  <tr><td colSpan={6} className="text-center text-[#5B6B5B] py-8">Nenhuma ave com esse filtro.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Versão celular: uma linha por lote, sem rolagem lateral */}
          <div className="md:hidden">
            {grupos.map(([g, aves]) => (
              <div key={g} className="mb-5">
                <div className="font-serif text-[1.05rem] text-[#1F3B2E] font-semibold px-1 mb-1.5">
                  {g} <span className="font-sans text-[0.6rem] tracking-[1.5px] uppercase text-[#B99034] ml-2">{CATEGORIA[aves[0].categoria].nome}</span>
                </div>
                <div className="card">
                  {aves.map((a) => {
                    const q = quantidadeDe(a.id);
                    const max = estoqueDaUnidade(a.id);
                    return (
                      <div key={a.id} className={`flex items-center gap-3 px-3.5 py-2.5 border-b border-[#E1DCCF] last:border-b-0 ${q > 0 ? 'bg-[#FFF8E6]' : ''}`}>
                        <div className="flex-1 min-w-0">
                          <div className="font-serif text-[1rem] text-[#1F3B2E] leading-tight">
                            {a.nome}{a.detalhe && <span className="italic text-[#5B6B5B] text-[0.85rem]"> · {a.detalhe}</span>}
                          </div>
                          <div className="font-sans text-[0.7rem] text-[#5B6B5B]">
                            {estoqueTexto(a)} · {UNIDADE_ROTULO[a.unidade]} · {CRIADOR_ROTULO[a.criador]}
                          </div>
                          <div className="font-sans text-[0.92rem] whitespace-nowrap">
                            {a.preco_de && <s className="text-[0.72rem] text-[#9AA59A] mr-1.5">{brl(a.preco_de)}</s>}
                            <b className="text-[#1F3B2E]">{brl(a.preco)}</b>
                            {a.preco_de && <span className="chip chip-promo !text-[0.5rem] !py-0 !px-1.5 ml-2 align-middle">Promo</span>}
                          </div>
                        </div>
                        <div className="qtd flex-none">
                          <button type="button" onClick={() => alterar(a.id, q - 1)} aria-label={`Menos ${a.nome}`} disabled={q === 0}>−</button>
                          <span>{q}</span>
                          <button type="button" onClick={() => (q === 0 ? adicionar(a.id, 1) : alterar(a.id, q + 1))} aria-label={`Mais ${a.nome}`} disabled={q >= max}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {totalMostrado === 0 && <div className="note text-center">Nenhuma ave com esse filtro.</div>}
          </div>

          <p className="font-sans text-[0.74rem] text-[#5B6B5B] mt-4">
            Estoque como na lista de {LISTA_DATA}: M = machos, F = fêmeas. Retirada em {CONSTANTS.RETIRADA} ou entrega em rota. Não achou o que procura? A encomenda continua no <a href={CONSTANTS.PRE_RESERVA_URL} target="_blank" rel="noopener noreferrer" className="text-[#1F3B2E] underline">avesarca.com.br</a>.
          </p>
        </div>
      </section>

      {/* Barra fixa do pedido */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1F3B2E] text-[#F6F1E6] border-t-[3px] border-[#D2A93C] shadow-[0_-6px_20px_rgba(0,0,0,.2)]">
        <div className="wrap py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShoppingBasket className="w-5 h-5 text-[#D2A93C]" />
            <div>
              <div className="font-sans text-[0.68rem] uppercase tracking-[1.5px] text-[#C9D2C9]">Seu pedido</div>
              <div className="font-serif text-[1.15rem] leading-tight">
                {totalUnidades === 0 ? 'Marque as quantidades na tabela' : `${totalLinhas} ${totalLinhas === 1 ? 'variedade' : 'variedades'} · ${totalUnidades} ${totalUnidades === 1 ? 'unidade' : 'unidades'} · ${brl(totalReferencia)}`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {totalUnidades > 0 && (
              <button type="button" onClick={esvaziar} className="btn btn-ghost-claro !py-2 !px-4 text-[0.8rem]" aria-label="Limpar pedido">
                <Trash2 className="w-4 h-4" /> Limpar
              </button>
            )}
            <button type="button" onClick={() => onNavigate('pedido')} className="btn btn-ouro" disabled={totalUnidades === 0}>
              Fechar pedido →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
