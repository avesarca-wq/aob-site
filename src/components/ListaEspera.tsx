import React, { useEffect, useState } from 'react';
import { BellRing, Check, AlertTriangle } from 'lucide-react';
import { medir, origemResumida } from '../lib/analytics';

/**
 * LISTA DA PRÓXIMA TEMPORADA (05.6.14, pedido nº9 do Ricardo em 07/08/2026).
 *
 * O problema que resolve: ave ornamental é compra adiável. A maior parte de quem chega
 * — inclusive de anúncio pago — sai pensando "um dia". Hoje esse visitante custava
 * dinheiro e ia embora sem deixar rastro. Aqui ele deixa um contato, e vira matéria-prima
 * da onda de ativação de rota do 05.15.
 *
 * Grava em **Netlify > Forms > lista-espera** (o mesmo caminho já provado do pedido).
 * O aviso por e-mail sai formatado pela função netlify/functions/pedido-email.mts.
 */

const NOME_FORM = 'lista-espera';

/** Âncora da seção. O card do catálogo rola até aqui em vez de abrir outra página. */
export const ANCORA_LISTA_ESPERA = 'lista-de-espera';

/** Evento interno: o card manda a variedade, o formulário já abre com ela preenchida. */
const EVENTO = 'aa:lista-espera';

/**
 * Chamado pelo botão das variedades em LISTA DE ESPERA (situação decidida em 25/08/2026):
 * rola até o formulário e preenche o campo de interesse. Sem prometer prazo, sem página nova.
 */
export function abrirListaEspera(variedade?: string) {
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: variedade ?? '' }));
  const alvo = document.getElementById(ANCORA_LISTA_ESPERA);
  if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export const ListaEspera: React.FC = () => {
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const [interesse, setInteresse] = useState('');
  const [isca, setIsca] = useState('');
  const [estado, setEstado] = useState<'parado' | 'enviando' | 'ok' | 'falhou'>('parado');

  // Variedade que veio do card em lista de espera.
  useEffect(() => {
    const ouvir = (e: Event) => {
      const v = (e as CustomEvent).detail;
      if (typeof v === 'string' && v) setInteresse(v);
    };
    window.addEventListener(EVENTO, ouvir);
    return () => window.removeEventListener(EVENTO, ouvir);
  }, []);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isca) return; // robô: não envia e não avisa
    if (!nome.trim() || !contato.trim()) return;

    setEstado('enviando');
    const campos: Record<string, string> = {
      'form-name': NOME_FORM,
      // a Netlify usa o campo "subject" como assunto do aviso (não interpola campos no assunto da UI)
      subject: `LISTA DE ESPERA · ${nome.trim()}${interesse.trim() ? ` · ${interesse.trim()}` : ''}`,
      nome: nome.trim(),
      contato: contato.trim(),
      interesse: interesse.trim(),
      origem: origemResumida(),
      'bot-field': '',
    };

    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(campos).toString(),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setEstado('ok');
      medir('lista_espera_ok', { tem_interesse: !!interesse.trim() });
    } catch {
      // Nunca fingir que gravou.
      setEstado('falhou');
    }
  };

  return (
    <section id={ANCORA_LISTA_ESPERA} className="py-14 sm:py-16 bg-[#FAFBF8] border-t border-[#E0E2D9] scroll-mt-24">
      <div className="wrap max-w-3xl text-center">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-[#E0E2D9] text-[#C1732B] mb-4">
          <BellRing className="w-5 h-5" />
        </span>
        <h2 className="sec-title center font-serif text-2xl sm:text-3xl font-semibold text-[#4A5D4E]">
          Ainda não é a hora? Entre na lista da próxima temporada
        </h2>
        <p className="sec-sub center">
          Se a estrutura ainda não está pronta, ou a variedade que você quer não está disponível
          agora, deixe seu contato. Avisamos quando abrir — sem disparo em massa e sem cobrança.
        </p>

        {estado === 'ok' ? (
          <div className="rounded-2xl border border-[#4A5D4E]/30 bg-white p-6 flex items-center justify-center gap-3">
            <Check className="w-5 h-5 text-[#4A5D4E]" />
            <p className="font-serif text-base text-[#2D3436] m-0">
              Anotado. Avisamos você quando a próxima temporada abrir.
            </p>
          </div>
        ) : (
          <form
            onSubmit={enviar}
            className="rounded-2xl border border-[#E0E2D9] bg-white p-5 sm:p-6 text-left"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-semibold text-[#4A5D4E] uppercase tracking-wider mb-1.5">
                  Nome *
                </label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E0E2D9] text-sm focus:outline-none focus:border-[#D4A373]"
                  placeholder="Como podemos te chamar"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-semibold text-[#4A5D4E] uppercase tracking-wider mb-1.5">
                  WhatsApp ou e-mail *
                </label>
                <input
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E0E2D9] text-sm focus:outline-none focus:border-[#D4A373]"
                  placeholder="(11) 90000-0000 ou voce@email.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-sans font-semibold text-[#4A5D4E] uppercase tracking-wider mb-1.5">
                Que variedade te interessa? (opcional)
              </label>
              <input
                value={interesse}
                onChange={(e) => setInteresse(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E0E2D9] text-sm focus:outline-none focus:border-[#D4A373]"
                placeholder="Ex.: Pato Mandarim, cisne-negro, ainda estou olhando"
              />
            </div>

            {/* campo-isca invisível para robô */}
            <input
              type="text"
              value={isca}
              onChange={(e) => setIsca(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            {estado === 'falhou' && (
              <div className="mt-4 flex items-start gap-2 text-sm text-[#C1732B]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Não conseguimos gravar seu contato agora. Tente de novo em instantes ou fale
                  direto no WhatsApp — preferimos avisar a fingir que deu certo.
                </span>
              </div>
            )}

            <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
              <button type="submit" disabled={estado === 'enviando'} className="btn btn-gold">
                {estado === 'enviando' ? 'Enviando…' : 'Quero ser avisado'}
              </button>
              <span className="font-sans text-[0.7rem] text-[#8C968F]">
                Usamos seu contato só para avisar sobre a temporada. Nada de disparo em massa.
              </span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};