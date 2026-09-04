import React from 'react';
import { Bird, Check, Plus } from 'lucide-react';
import { Ave } from '../types';
import { brl, CRIADOR_ROTULO, UNIDADE_ROTULO, UNIDADE_PLURAL, CATEGORIA } from '../data/catalogo';
import { useCart, estoqueDaUnidade } from '../cart/CartContext';

/** Texto de estoque como na lista impressa: "4M · 2F". */
export const estoqueTexto = (a: Ave) => {
  const p: string[] = [];
  if (a.machos) p.push(`${a.machos}M`);
  if (a.femeas) p.push(`${a.femeas}F`);
  return p.join(' · ');
};

export const Moldura: React.FC<{ ave: Ave }> = ({ ave }) => (
  <div className="moldura">
    <Bird className="w-9 h-9 opacity-60" strokeWidth={1.4} />
    <span className="font-sans text-[0.62rem] tracking-[2px] uppercase opacity-70">{CATEGORIA[ave.categoria].nome}</span>
  </div>
);

export const AveCard: React.FC<{ ave: Ave; onVerPedido?: () => void }> = ({ ave, onVerPedido }) => {
  const { quantidadeDe, adicionar, alterar } = useCart();
  const q = quantidadeDe(ave.id);
  const max = estoqueDaUnidade(ave.id);

  return (
    <article className="card">
      <div className="card-foto">
        {ave.foto ? <img src={ave.foto} alt={ave.nome} loading="lazy" /> : <Moldura ave={ave} />}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {ave.preco_de && <span className="chip chip-promo">Promoção</span>}
          <span className="chip chip-claro">{estoqueTexto(ave)}</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="font-sans text-[0.64rem] tracking-[1.5px] uppercase text-[#B99034] font-bold mb-1">
          {ave.grupo} · {CRIADOR_ROTULO[ave.criador]}
        </div>
        <h3 className="text-[1.3rem] leading-tight text-[#1F3B2E] m-0">
          {ave.nome}
          {ave.detalhe && <span className="block font-serif italic font-normal text-[0.95rem] text-[#5B6B5B]">{ave.detalhe}</span>}
        </h3>
        <p className="font-serif italic text-[0.88rem] text-[#5B6B5B] mt-0.5 mb-3">{ave.cientifico}</p>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-sans text-[0.68rem] uppercase tracking-[1px] text-[#5B6B5B]">{UNIDADE_ROTULO[ave.unidade]}</span>
            {ave.preco_de && <s className="font-sans text-[0.85rem] text-[#9AA59A]">{brl(ave.preco_de)}</s>}
            <b className="font-serif text-[1.45rem] text-[#1F3B2E]">{brl(ave.preco)}</b>
          </div>

          {q === 0 ? (
            <button onClick={() => adicionar(ave.id, 1)} className="btn btn-verde w-full" type="button">
              <Plus className="w-4 h-4" /> Adicionar ao pedido
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="qtd">
                <button type="button" onClick={() => alterar(ave.id, q - 1)} aria-label="Menos">−</button>
                <span>{q}</span>
                <button type="button" onClick={() => alterar(ave.id, q + 1)} aria-label="Mais" disabled={q >= max}>+</button>
              </div>
              <button onClick={onVerPedido} className="btn btn-ouro flex-1 !py-2" type="button">
                <Check className="w-4 h-4" /> No pedido
              </button>
            </div>
          )}
          {q >= max && q > 0 && (
            <p className="font-sans text-[0.68rem] text-[#5B6B5B] mt-1.5 mb-0">Estoque disponível: {max} {max === 1 ? UNIDADE_ROTULO[ave.unidade] : UNIDADE_PLURAL[ave.unidade]}.</p>
          )}
        </div>
      </div>
    </article>
  );
};
