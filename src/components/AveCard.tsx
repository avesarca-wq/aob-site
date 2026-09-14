import React from 'react';
import { Bird, Check, Plus } from 'lucide-react';
import { Ave } from '../types';
import { brl, CRIADOR_ROTULO, UNIDADE_ROTULO, UNIDADE_PLURAL, CATEGORIA } from '../data/catalogo';
import { useCart, estoqueDaUnidade } from '../cart/CartContext';
import { waSobConsulta, slugDaAve, caminhoDaAve } from '../lib/links';
import { imagem, SIZES_CARD } from '../lib/imagens';
import { EH_REDE } from '../marcas';

/** Texto de estoque: machos à esquerda, fêmeas à direita — "4M · 2F". */
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

/** Foto do card: exibida a ~352px, então o celular baixa a de 480, não a de 1200. */
const FotoDoCard: React.FC<{ foto: string; alt: string }> = ({ foto, alt }) => {
  const i = imagem(foto);
  return <img src={i.src} srcSet={i.srcSet} sizes={SIZES_CARD} alt={alt} width={i.width || undefined} height={i.height || undefined} loading="lazy" decoding="async" />;
};

export const AveCard: React.FC<{ ave: Ave; onVerPedido?: () => void }> = ({ ave, onVerPedido }) => {
  const { quantidadeDe, adicionar, alterar } = useCart();
  const q = quantidadeDe(ave.id);
  const max = estoqueDaUnidade(ave.id);
  /** Variedade do plantel sem lote na semana ou sem preço fechado: vira conversa. */
  const sobConsulta = ave.preco === null || ave.machos + ave.femeas === 0;
  const ficha = caminhoDaAve(slugDaAve(ave));

  return (
    <article className="card">
      <div className="card-foto">
        {/* Foto e nome levam à ficha da espécie. O Google segue o href; o botão de
            adicionar ao pedido fica fora do link, para não virar clique dentro de link. */}
        <a href={ficha} aria-label={`Ficha de ${ave.nome}`} tabIndex={-1}>
          {ave.foto ? <FotoDoCard foto={ave.foto} alt={ave.nome} /> : <Moldura ave={ave} />}
        </a>
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {ave.preco_de && <span className="chip chip-promo">Promoção</span>}
          {sobConsulta ? <span className="chip chip-claro">Sob consulta</span> : <span className="chip chip-claro">{estoqueTexto(ave)}</span>}
        </div>
        {ave.foto && ave.foto_credito && <span className="foto-credito">{ave.foto_credito}</span>}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="font-sans text-[0.64rem] tracking-[1.5px] uppercase text-[var(--ouro2)] font-bold mb-1">
          {ave.grupo}{EH_REDE && <> · {CRIADOR_ROTULO[ave.criador]}</>}
        </div>
        <h3 className="text-[1.3rem] leading-tight text-[var(--verde)] m-0">
          <a href={ficha} className="card-titulo-link">{ave.nome}</a>
          {ave.detalhe && <span className="block font-serif italic font-normal text-[0.95rem] text-[var(--muted)]">{ave.detalhe}</span>}
        </h3>
        <p className="font-serif italic text-[0.88rem] text-[var(--muted)] mt-0.5 mb-3">{ave.cientifico}</p>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            {ave.preco !== null && <span className="font-sans text-[0.68rem] uppercase tracking-[1px] text-[var(--muted)]">{UNIDADE_ROTULO[ave.unidade]}</span>}
            {ave.preco_de && <s className="font-sans text-[0.85rem] text-[var(--muted-2)]">{brl(ave.preco_de)}</s>}
            <b className="font-serif text-[1.45rem] text-[var(--verde)]">{brl(ave.preco)}</b>
          </div>

          {sobConsulta ? (
            <a href={waSobConsulta(ave.nome)} target="_blank" rel="noopener" className="btn btn-verde w-full">
              Perguntar no WhatsApp
            </a>
          ) : q === 0 ? (
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
            <p className="font-sans text-[0.68rem] text-[var(--muted)] mt-1.5 mb-0">Estoque disponível: {max} {max === 1 ? UNIDADE_ROTULO[ave.unidade] : UNIDADE_PLURAL[ave.unidade]}.</p>
          )}
        </div>
      </div>
    </article>
  );
};
