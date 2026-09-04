import React, { useMemo, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { CIDADES } from '../data/cidades';
import { zonaDaCidade } from '../data/zonas';

const normaliza = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Acha a cidade na malha do 04.8 a partir de um texto — digitado à mão OU preenchido
 * pelo CEP. Existe fora do componente porque o campo de CEP do formulário precisa da
 * MESMA régua: se o ViaCEP devolve "Betim/MG", a faixa tem de sair igual à de quem
 * digitou "Betim". Duas réguas diferentes acabariam cotando frete diferente.
 */
export const cidadeDaMalha = (texto: string) => {
  const alvo = normaliza(texto);
  let achou = CIDADES.find((c) => normaliza(`${c.c} — ${c.uf}`) === alvo);
  /**
   * Quem digita só "Betim" e não clica na sugestão também merece ter a rota reconhecida —
   * antes disso a faixa ia vazia para o pedido (medido no teste de fluxo de 07/08/2026).
   * Só resolve quando o nome é ÚNICO na malha: cidade homônima em dois estados continua
   * exigindo a escolha, senão o site chutaria a rota errada.
   */
  if (!achou) {
    const porNome = CIDADES.filter((c) => normaliza(c.c) === alvo);
    if (porNome.length === 1) achou = porNome[0];
  }
  return achou;
};

/** A faixa de rota do 04.8 para um texto de cidade. '' quando não está na malha. */
export const faixaDaCidade = (texto: string): string => cidadeDaMalha(texto)?.r || '';

/** A zona de frete de um texto de cidade. Fora da malha, cai no aéreo (Z4). */
export const zonaDoTexto = (texto: string) => zonaDaCidade(cidadeDaMalha(texto));

interface CidadeInputProps {
  /** Valor gravado — sempre "Cidade — UF" quando escolhido da base. */
  value: string;
  /** Devolve o texto e a faixa de rota do 04.8 ('' quando a cidade não está na malha). */
  onChange: (cidadeUf: string, faixaRota: string) => void;
}

export const CidadeInput: React.FC<CidadeInputProps> = ({ value, onChange }) => {
  const [aberto, setAberto] = useState(false);
  const fechando = useRef<number | null>(null);

  /**
   * A faixa é DERIVADA do valor, não guardada em estado próprio. Antes era estado local, e
   * por isso a cidade preenchida de fora (pelo CEP) aparecia como "fora da malha" mesmo
   * estando na base — o componente nunca ficava sabendo que o valor tinha mudado.
   */
  const cidade = useMemo(() => cidadeDaMalha(value), [value]);
  const faixa = cidade?.r || '';
  const zona = zonaDaCidade(cidade);

  const sugestoes = useMemo(() => {
    const q = normaliza(value);
    if (q.length < 2) return [];
    // Se o valor já é exatamente uma cidade escolhida, não sugerir de novo.
    const exato = CIDADES.some((c) => normaliza(`${c.c} — ${c.uf}`) === q);
    if (exato) return [];
    return CIDADES.filter((c) => normaliza(c.c).includes(q) || normaliza(`${c.c} ${c.uf}`).includes(q))
      .sort((a, b) => b.p - a.p)
      .slice(0, 8);
  }, [value]);

  const escolher = (c: (typeof CIDADES)[number]) => {
    onChange(`${c.c} — ${c.uf}`, c.r);
    setAberto(false);
  };

  const digitou = (texto: string) => {
    onChange(texto, faixaDaCidade(texto));
    setAberto(true);
  };

  const foraDaMalha = value.trim().length >= 3 && !faixa && sugestoes.length === 0;

  return (
    <div className="relative">
      <input
        type="text"
        name="cidade_uf"
        required
        autoComplete="off"
        value={value}
        onChange={(e) => digitou(e.target.value)}
        onFocus={() => setAberto(true)}
        onBlur={() => {
          fechando.current = window.setTimeout(() => setAberto(false), 150);
        }}
        placeholder="Comece a digitar sua cidade"
        aria-label="Cidade e UF"
        className="w-full px-4 py-2.5 rounded-lg border border-[#E0E2D9] text-sm focus:outline-none focus:border-[#D4A373]"
      />

      {aberto && sugestoes.length > 0 && (
        <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[#E0E2D9] rounded-xl shadow-lg max-h-60 overflow-auto list-none p-1 m-0">
          {sugestoes.map((c) => (
            <li key={`${c.c}-${c.uf}`}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (fechando.current) window.clearTimeout(fechando.current);
                  escolher(c);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FAFBF8] cursor-pointer bg-transparent border-0"
              >
                <span className="font-sans text-sm text-[#2D3436]">
                  {c.c} — {c.uf}
                </span>
                <span className="block font-sans text-[0.68rem] text-[#5A635C]">{c.r}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {cidade && (
        <div className="mt-1.5 rounded-lg border border-[#E0E2D9] bg-[#FAFBF8] px-3 py-2">
          <p className="flex items-start gap-1.5 font-sans text-[0.7rem] text-[#4A5D4E] m-0 leading-snug">
            <MapPin className="w-3.5 h-3.5 flex-none mt-px text-[#C1732B]" />
            <span>
              Sua cidade está na zona <strong>{zona.rotulo}</strong>.
            </span>
          </p>
          <p className="font-sans text-[0.7rem] text-[#2D3436] mt-1.5 mb-0 leading-snug">
            Frete <strong>{zona.tarifaTexto}</strong> · {zona.prazo}.
          </p>
        </div>
      )}

      {foraDaMalha && (
        <p className="font-sans text-[0.7rem] text-[#5A635C] mt-1.5 mb-0 leading-snug">
          Não encontramos sua cidade na malha terrestre. Pode enviar assim mesmo — nesse caso a gente
          combina frete aéreo (GOLLOG/LATAM, com NF e GTA) ou uma entrega individual.
        </p>
      )}
    </div>
  );
};