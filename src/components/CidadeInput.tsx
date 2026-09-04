import React, { useMemo, useRef, useState } from 'react';
import { MapPin, Truck } from 'lucide-react';
import { CIDADES, Cidade } from '../data/cidades';
import { zonaDaCidade } from '../data/zonas';
import { rotaDaRegiao, proximaSaida, dataCurta } from '../data/catalogo';

const normaliza = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

/** Acha a cidade na malha a partir do texto — "Cidade — UF" ou só o nome quando é único. */
export const cidadeDaMalha = (texto: string): Cidade | undefined => {
  const alvo = normaliza(texto);
  let achou = CIDADES.find((c) => normaliza(`${c.c} — ${c.uf}`) === alvo);
  if (!achou) {
    const porNome = CIDADES.filter((c) => normaliza(c.c) === alvo);
    if (porNome.length === 1) achou = porNome[0];
  }
  return achou;
};

/** Resumo de entrega para uma cidade: zona de frete + próxima saída da rota da região. */
export const entregaDaCidade = (texto: string) => {
  const cidade = cidadeDaMalha(texto);
  if (!cidade) return null;
  const zona = zonaDaCidade(cidade);
  const rota = rotaDaRegiao(cidade.r);
  const prox = rota ? proximaSaida(rota) : null;
  return { cidade, zona, rota, prox };
};

interface Props {
  value: string;
  onChange: (cidadeUf: string, regiao: string) => void;
  mostrarResumo?: boolean;
}

export const CidadeInput: React.FC<Props> = ({ value, onChange, mostrarResumo = true }) => {
  const [aberto, setAberto] = useState(false);
  const fechando = useRef<number | null>(null);
  const info = useMemo(() => entregaDaCidade(value), [value]);

  const sugestoes = useMemo(() => {
    const q = normaliza(value);
    if (q.length < 2) return [];
    if (CIDADES.some((c) => normaliza(`${c.c} — ${c.uf}`) === q)) return [];
    return CIDADES.filter((c) => normaliza(c.c).includes(q) || normaliza(`${c.c} ${c.uf}`).includes(q))
      .sort((a, b) => b.p - a.p)
      .slice(0, 8);
  }, [value]);

  const escolher = (c: Cidade) => {
    onChange(`${c.c} — ${c.uf}`, c.r);
    setAberto(false);
  };

  const foraDaMalha = value.trim().length >= 3 && !info && sugestoes.length === 0;

  return (
    <div className="relative">
      <input
        type="text"
        name="cidade_uf"
        required
        autoComplete="off"
        value={value}
        onChange={(e) => {
          onChange(e.target.value, cidadeDaMalha(e.target.value)?.r || '');
          setAberto(true);
        }}
        onFocus={() => setAberto(true)}
        onBlur={() => {
          fechando.current = window.setTimeout(() => setAberto(false), 150);
        }}
        placeholder="Comece a digitar sua cidade"
        aria-label="Cidade e UF"
        className="campo"
      />

      {aberto && sugestoes.length > 0 && (
        <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[#E1DCCF] rounded-xl shadow-lg max-h-64 overflow-auto list-none p-1 m-0">
          {sugestoes.map((c) => (
            <li key={`${c.c}-${c.uf}`}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (fechando.current) window.clearTimeout(fechando.current);
                  escolher(c);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F6F1E6] cursor-pointer bg-transparent border-0"
              >
                <span className="font-sans text-sm text-[#1E2A24]">
                  {c.c} — {c.uf}
                </span>
                <span className="block font-sans text-[0.68rem] text-[#5B6B5B]">{c.r}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {mostrarResumo && info && (
        <div className="mt-2 rounded-xl border border-[#E1DCCF] bg-[#F6F1E6] px-3.5 py-2.5">
          <p className="flex items-start gap-1.5 font-sans text-[0.74rem] text-[#1F3B2E] m-0 leading-snug">
            <MapPin className="w-3.5 h-3.5 flex-none mt-px text-[#B99034]" />
            <span>
              <strong>{info.rota?.nome ?? info.cidade.r}</strong> · frete <strong>{info.zona.tarifaTexto}</strong>
            </span>
          </p>
          <p className="flex items-start gap-1.5 font-sans text-[0.74rem] text-[#1E2A24] mt-1.5 mb-0 leading-snug">
            <Truck className="w-3.5 h-3.5 flex-none mt-px text-[#B99034]" />
            <span>
              {info.prox
                ? <>Próxima saída <strong>{dataCurta(info.prox.saida)}</strong> · pedidos até {dataCurta(info.prox.fecha)}</>
                : info.rota && info.rota.datas.length === 0 && info.zona.n === 1
                  ? 'Data combinada direto pelo WhatsApp.'
                  : 'Rota em formação — seu pedido entra na lista e a gente avisa a data.'}
            </span>
          </p>
        </div>
      )}

      {mostrarResumo && foraDaMalha && (
        <p className="font-sans text-[0.72rem] text-[#5B6B5B] mt-1.5 mb-0 leading-snug">
          Não encontramos sua cidade na malha de rotas. Pode enviar assim mesmo — a gente combina retirada em São Paulo ou uma entrega individual.
        </p>
      )}
    </div>
  );
};
