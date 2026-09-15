import React from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Ave, CriadorId } from '../types';
import { PaginaAve } from '../seo';
import { CRIADOR_ROTULO, CONSTANTS, brl } from '../data/catalogo';
import { EH_REDE, MARCA_ATUAL } from '../marcas';
import { waSobConsulta } from '../lib/links';
import { imagem, SIZES_FICHA, TETO_FICHA_CELULAR, MEDIA_FICHA_GRANDE } from '../lib/imagens';
import { Moldura } from './AveCard';

/**
 * Cabeçalho da ficha de uma ave (/aves/<slug>/). Antes esta rota abria a vitrine
 * já filtrada: o H1 era "Aves disponíveis", o resumo da espécie não aparecia em
 * lugar nenhum e no celular a ave só surgia depois de ~1.100 px de filtro
 * (auditoria de 14/09). Agora a espécie ocupa o topo e os lotes vêm logo abaixo.
 *
 * O H1 daqui é o nome da ave — por isso a vitrine não desenha o dela quando há
 * ficha: uma página, um H1.
 */
export const FichaAve: React.FC<{ ficha: PaginaAve; lotes: Ave[]; onVoltar: () => void }> = ({ ficha, lotes, onVoltar }) => {
  // A foto e o crédito saem do primeiro lote que tiver foto; os irmãos são a
  // mesma variedade, então a foto vale para todos.
  const comFoto = lotes.find((l) => l.foto);
  const promo = lotes.find((l) => l.preco_de);
  // Sem `new Set` de propósito: a lib de tipos deste projeto não traz a sobrecarga
  // genérica do construtor e o spread sairia como unknown[].
  const criadores: CriadorId[] = lotes.map((l) => l.criador).filter((c, i, a) => a.indexOf(c) === i);

  return (
    <section className="sec-escura">
      <div className="wrap py-10 sm:py-14">
        <button onClick={onVoltar} className="link-voltar" type="button">
          <ArrowLeft className="w-4 h-4" /> Todas as aves
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-7 md:gap-10 items-start mt-5">
          <div className="ficha-foto">
            {comFoto?.foto ? (
              <>
                {/* É a maior imagem da ficha e quase sempre o LCP: sem lazy e com
                    prioridade alta, e no tamanho da coluna, não nos 1200 px.
                    O <picture> guarda a de 1.200 para as telas de duas colunas;
                    no celular só existem 480 e 800, senão um aparelho de DPR 3
                    pede 1.038px e leva a original. */}
                <picture>
                  <source media={MEDIA_FICHA_GRANDE} srcSet={imagem(comFoto.foto).srcSet} sizes={SIZES_FICHA} />
                  <img
                    {...imagem(comFoto.foto, TETO_FICHA_CELULAR)}
                    sizes={SIZES_FICHA}
                    alt={ficha.nome}
                    fetchPriority="high"
                    decoding="async"
                  />
                </picture>
                {comFoto.foto_credito && <span className="foto-credito">{comFoto.foto_credito}</span>}
              </>
            ) : (
              <Moldura ave={lotes[0]} />
            )}
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>
              {ficha.grupo}
              {EH_REDE && criadores.length === 1 && <> · {CRIADOR_ROTULO[criadores[0]]}</>}
            </div>
            <h1 className="sec-title" style={{ fontSize: '2.2rem', marginBottom: 2 }}>{ficha.nome}</h1>
            <p className="font-serif italic text-[1.05rem] text-[var(--claro-2)] mt-0 mb-4">{ficha.cientifico}</p>

            {ficha.resumo && (
              <p lang="pt-BR" className="sec-sub text-justify hyphens-auto" style={{ marginBottom: 18 }}>{ficha.resumo}</p>
            )}

            <div className="flex items-baseline gap-2.5 flex-wrap mb-5">
              {ficha.preco === null ? (
                <b className="font-serif text-[1.6rem] text-[var(--ouro)]">Sob consulta</b>
              ) : (
                <>
                  <span className="font-sans text-[0.68rem] uppercase tracking-[1px] text-[var(--claro-2)]">a partir de</span>
                  {promo?.preco_de && <s className="font-sans text-[0.9rem] text-[var(--claro-2)] opacity-70">{brl(promo.preco_de)}</s>}
                  <b className="font-serif text-[1.85rem] text-[var(--ouro)]">{brl(ficha.preco)}</b>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {ficha.emEstoque ? (
                <>
                  <a href="#lotes" className="btn btn-ouro">Ver lotes disponíveis</a>
                  <a href={waSobConsulta(ficha.nome)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    <MessageCircle className="w-4 h-4" /> Tirar uma dúvida
                  </a>
                </>
              ) : (
                <a href={waSobConsulta(ficha.nome)} target="_blank" rel="noopener noreferrer" className="btn btn-ouro">
                  <MessageCircle className="w-4 h-4" /> Perguntar no WhatsApp
                </a>
              )}
            </div>

            <p className="font-sans text-[0.78rem] text-[var(--claro-2)] mt-4 mb-0">
              {ficha.emEstoque
                ? `Pagamento na entrega, em rota ou retirada em ${CONSTANTS.RETIRADA}.`
                : EH_REDE
                  ? 'Sem lote pronto nesta semana — pergunte que a gente avisa quando entrar.'
                  : `Criada no plantel de ${MARCA_ATUAL.cidade}; sem lote pronto nesta semana.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
