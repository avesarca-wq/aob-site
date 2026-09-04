import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, MessageCircle, BellRing, Sprout } from 'lucide-react';
import { Species } from '../types';
import {
  CONSTANTS,
  TIER_DISPLAY_NAMES,
  FOTOS_PROPRIAS,
  slugDaVariedade,
  NOME_NA_PORTARIA,
  PORTARIA_ISENTAS,
  situacaoDe,
} from '../data/species';
import { abrirListaEspera } from './ListaEspera';
import { medir } from '../lib/analytics';
import { nomePopularDe } from '../data/nomesPopulares';

/**
 * GALERIA DA VARIEDADE — abre ao clicar no card do catálogo (pedido nº2 do Ricardo, 07/08/2026).
 *
 * Comporta **até 5 fotos** por variedade, vindas de `Species.fotos`. Enquanto as fotos não
 * chegam, mostra molduras reservadas dizendo o que falta. As variedades que ainda não têm
 * foto do plantel usam imagem de referência da espécie, sempre rotulada como ilustrativa.
 *
 * Regra de tratamento das fotos (a mesma do 05.6.12): 1600 px no maior lado, `.webp` servido
 * primeiro com `.jpg` de reserva, **sem EXIF** (a câmera grava GPS).
 */

const MAX_FOTOS = 10;

// Image CDN da Netlify — mesmo do catálogo. A galeria mostra ~700 px e a miniatura 56 px;
// servir 1600 px nos dois era o maior desperdício do site (medido em 21/08/2026).
const cdn = (u: string, w: number) =>
  `/.netlify/images?url=${encodeURIComponent(u)}&w=${w}&fm=webp&q=80`;

interface Props {
  especie: Species;
  aberta: boolean;
  onFechar: () => void;
  onAdicionar?: () => void;
}

export const GaleriaEspecie: React.FC<Props> = ({ especie, aberta, onFechar, onAdicionar }) => {
  const [indice, setIndice] = useState(0);

  /**
   * Crédito das fotos de banco. Cada variedade ilustrativa tem um
   * /especies/<slug>-creditos.txt com uma linha por foto:
   *   01 Foto: <autor>, <licença> - <endereço no Commons>
   * Sem o arquivo (ou com erro de rede) o crédito simplesmente não aparece.
   */
  const [creditos, setCreditos] = useState<Record<number, { autor: string; licenca: string; url: string }>>({});

  useEffect(() => {
    setCreditos({});
    if (FOTOS_PROPRIAS.has(especie.nome)) return;
    let cancelado = false;
    fetch(`/especies/${slugDaVariedade(especie.nome)}-creditos.txt`)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error('sem creditos'))))
      .then((texto) => {
        if (cancelado) return;
        const mapa: Record<number, { autor: string; licenca: string; url: string }> = {};
        texto.split('\n').forEach((linha) => {
          const m = linha.match(/^\s*(\d{1,2})\s+Foto:\s*(.+?),\s*(CC.*?)\s+-\s+(\S+)\s*$/);
          if (m) {
            mapa[Number(m[1])] = {
              autor: m[2].trim(),
              licenca: m[3].trim(),
              url: m[4].startsWith('http') ? m[4] : `https://${m[4]}`,
            };
          }
        });
        setCreditos(mapa);
      })
      .catch(() => setCreditos({}));
    return () => {
      cancelado = true;
    };
  }, [especie.nome]);
  const fotos = (especie.fotos || []).slice(0, MAX_FOTOS);
  const temFoto = fotos.length > 0;
  const vagas = Math.max(0, MAX_FOTOS - fotos.length);

  useEffect(() => {
    if (!aberta) return;
    setIndice(0);
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
      if (e.key === 'ArrowRight' && temFoto) setIndice((i) => (i + 1) % fotos.length);
      if (e.key === 'ArrowLeft' && temFoto) setIndice((i) => (i - 1 + fotos.length) % fotos.length);
    };
    window.addEventListener('keydown', tecla);
    return () => {
      document.body.style.overflow = antes;
      window.removeEventListener('keydown', tecla);
    };
  }, [aberta, fotos.length, temFoto, onFechar]);

  if (!aberta) return null;

  const nomePopular = nomePopularDe(especie);

  const ficha = especie.ficha;
  const linhas: Array<[string, string | undefined]> = ficha
    ? [
        ['Porte', ficha.porte],
        ['Peso adulto', ficha.peso],
        ['Água', ficha.agua],
        ['Tolera salinidade', ficha.salinidade],
        ['Área mín. casal', ficha.area_min_casal],
        ['Territorialidade', ficha.territorialidade],
        ['Incubação', ficha.incubacao],
        ['Postura', ficha.postura],
        ['Longevidade', ficha.longevidade],
      ]
    : [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-[#17282A]/70 backdrop-blur-sm p-0 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes de ${especie.nome}`}
      onClick={onFechar}
    >
      <div
        className="relative bg-white w-full sm:max-w-4xl sm:rounded-3xl overflow-hidden shadow-xl my-0 sm:my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 border border-[#E0E2D9] flex items-center justify-center text-[#4A5D4E] hover:bg-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* COLUNA DA FOTO */}
          <div className="bg-[#17282A]">
            <div className="relative w-full aspect-[4/3]">
              {temFoto ? (
                <>
                  <img
                    src={cdn(fotos[indice], 60)}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg opacity-45"
                  />
                  <picture>
                    <source
                      srcSet={`${cdn(fotos[indice], 700)} 700w, ${cdn(fotos[indice], 1300)} 1300w`}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      type="image/webp"
                    />
                    <img
                      src={fotos[indice]}
                      alt={`${especie.nome} — foto ${indice + 1} de ${fotos.length}`}
                      className="relative w-full h-full object-contain"
                    />
                  </picture>
                  {fotos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIndice((i) => (i - 1 + fotos.length) % fotos.length)}
                        aria-label="Foto anterior"
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#4A5D4E] cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIndice((i) => (i + 1) % fotos.length)}
                        aria-label="Próxima foto"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#4A5D4E] cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-2">
                  <Camera className="w-7 h-7 text-[#C1732B]" />
                  <p className="font-serif text-sm text-[#F1EBDD] m-0">
                    Fotos desta variedade em preparação.
                  </p>
                  <p className="font-sans text-[0.7rem] text-[#F1EBDD]/70 m-0">
                    Fale no WhatsApp para saber da disponibilidade.
                  </p>
                </div>
              )}
            </div>

            {fotos.length > 0 && !FOTOS_PROPRIAS.has(especie.nome) && (
              <p className="font-sans text-[0.65rem] italic text-[#F1EBDD]/60 px-3 pt-2 m-0">
                Foto ilustrativa da espécie — não é do nosso plantel.
                {creditos[indice + 1] && (
                  <>
                    {' '}
                    <a
                      href={creditos[indice + 1].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="not-italic underline decoration-dotted hover:text-[#C1732B]"
                    >
                      {creditos[indice + 1].autor}, {creditos[indice + 1].licenca} · Wikimedia Commons
                    </a>
                  </>
                )}
              </p>
            )}

            {/* Trilha das 5 posições: mostra o que já existe e o que ainda falta */}
            <div className="flex gap-2 p-3">
              {fotos.map((f, i) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setIndice(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-current={i === indice}
                  className={`relative w-14 h-11 rounded-lg overflow-hidden border-2 cursor-pointer ${
                    i === indice ? 'border-[#C1732B]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={cdn(f, 120)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {Array.from({ length: vagas }).map((_, i) => (
                <span
                  key={`vaga-${i}`}
                  title="posição reservada para foto"
                  className="w-14 h-11 rounded-lg border border-dashed border-[#F1EBDD]/35 flex items-center justify-center"
                >
                  <Camera className="w-3.5 h-3.5 text-[#F1EBDD]/35" />
                </span>
              ))}
            </div>
          </div>

          {/* COLUNA DO TEXTO */}
          <div className="p-6 sm:p-7">
            <span className="inline-block text-[0.65rem] font-sans font-bold uppercase tracking-wider text-[#C1732B] mb-2">
              {TIER_DISPLAY_NAMES[especie.tier]}
              {especie.grupo ? ` · ${especie.grupo}` : ''}
            </span>
            <h2 className="font-serif text-2xl font-semibold text-[#4A5D4E] m-0">{especie.nome}</h2>
            <dl className="mt-1.5 mb-4 grid grid-cols-1 gap-0.5">
              {nomePopular && (
                <div className="flex items-baseline gap-2">
                  <dt className="font-sans text-[0.62rem] uppercase tracking-wider text-[#8C968F] m-0 shrink-0">
                    Nome popular
                  </dt>
                  <dd className="font-serif text-sm text-[#2D3436] m-0">{nomePopular}</dd>
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <dt className="font-sans text-[0.62rem] uppercase tracking-wider text-[#8C968F] m-0 shrink-0">
                  Nome científico
                </dt>
                <dd className="font-serif italic text-sm text-[#5A635C] m-0">{especie.cientifico}</dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="font-sans text-[0.62rem] uppercase tracking-wider text-[#8C968F] m-0 shrink-0">
                  Na portaria
                </dt>
                <dd className="font-serif italic text-sm text-[#5A635C] m-0">
                  {NOME_NA_PORTARIA[especie.cientifico] ?? especie.cientifico}
                </dd>
              </div>
            </dl>
            <p className="font-sans text-[0.68rem] leading-snug text-[#5A635C] -mt-3 mb-4">
              Consta do Anexo I da{' '}
              <a
                href={PORTARIA_ISENTAS.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#C1732B]"
              >
                {PORTARIA_ISENTAS.rotulo}
              </a>
              , a lista de espécies isentas de controle do IBAMA.
            </p>

            <p className="font-serif text-sm leading-relaxed text-[#2D3436]">{especie.resumo}</p>

            {linhas.length > 0 && (
              <div className="mt-5 rounded-2xl border border-[#E0E2D9] bg-[#FAFBF8] p-4">
                <h3 className="font-sans text-[0.7rem] font-bold uppercase tracking-wider text-[#4A5D4E] mt-0 mb-2.5">
                  Ficha técnica
                </h3>
                <dl className="grid grid-cols-1 gap-1.5 m-0">
                  {linhas
                    .filter(([, v]) => !!v)
                    .map(([rotulo, valor]) => (
                      <div key={rotulo} className="flex items-baseline justify-between gap-3">
                        <dt className="font-sans text-[0.68rem] uppercase tracking-wider text-[#8C968F] m-0">
                          {rotulo}
                        </dt>
                        <dd className="font-serif text-xs text-[#2D3436] text-right m-0">{valor}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-2.5">
              {/* A galeria respeita a mesma situação comercial do card (25/08/2026). */}
              {situacaoDe(especie) === 'plantel' && (
                <p className="rounded-2xl border border-[#E0E2D9] bg-[#F1EBDD]/70 px-4 py-3 text-center font-sans text-[0.75rem] font-semibold text-[#4A5D4E] m-0 inline-flex items-center justify-center gap-1.5">
                  <Sprout className="w-4 h-4 shrink-0" />
                  Ainda não comercializado
                </p>
              )}
              {situacaoDe(especie) === 'espera' && (
                <button
                  type="button"
                  onClick={() => {
                    medir('lista_espera_abrir', { variedade: especie.nome, de: 'galeria' });
                    onFechar();
                    window.setTimeout(() => abrirListaEspera(especie.nome), 120);
                  }}
                  className="btn btn-ghost w-full justify-center"
                >
                  <BellRing className="w-4 h-4" />
                  Entrar na lista de espera
                </button>
              )}
              {situacaoDe(especie) === 'aberta' && especie.preco_confirmado && onAdicionar && (
                <button
                  type="button"
                  onClick={() => {
                    onAdicionar();
                    onFechar();
                  }}
                  className="btn btn-gold w-full justify-center"
                >
                  Escolher sexo e adicionar à pré-reserva
                </button>
              )}
              <a
                href={`${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent(
                  `Olá! Quero saber a disponibilidade de ${especie.nome}.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => medir('clicar_whatsapp', { de: 'galeria', variedade: especie.nome })}
                className="btn btn-ghost w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};