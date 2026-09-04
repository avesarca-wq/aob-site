import React, { useMemo, useState } from 'react';
import { Trash2, MessageCircle, CheckCircle2, ArrowLeft, ShoppingBasket } from 'lucide-react';
import { DadosCliente, PageRoute } from '../types';
import { aveDoId } from '../data/aves';
import { brl, CONSTANTS, CRIADOR_ROTULO, UNIDADE_ROTULO, UNIDADE_PLURAL, dataCurta } from '../data/catalogo';
import { useCart } from '../cart/CartContext';
import { CidadeInput, entregaDaCidade } from '../components/CidadeInput';
import { waComTexto } from '../lib/links';

const NOME_FORM = 'pedido';

/** Código do pedido: AOB-DDMM-NNN (sequencial por navegador, só para a conversa ter referência). */
const gerarCodigo = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  let n = 1;
  try {
    const k = `aob:seq:${dd}${mm}`;
    n = Number(window.localStorage.getItem(k) || '0') + 1;
    window.localStorage.setItem(k, String(n));
  } catch { /* sem localStorage */ }
  return `AOB-${dd}${mm}-${String(n).padStart(3, '0')}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
};

const mascaraWhats = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

export const Pedido: React.FC<{ onNavigate: (p: PageRoute) => void }> = ({ onNavigate }) => {
  const { linhas, alterar, remover, esvaziar, totalReferencia, totalUnidades } = useCart();
  const [dados, setDados] = useState<DadosCliente>({ nome: '', whatsapp: '', email: '', cidade_uf: '', recebimento: 'rota', observacoes: '' });
  const [regiao, setRegiao] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [codigo, setCodigo] = useState('');
  const [msgWhats, setMsgWhats] = useState('');

  const itens = useMemo(() => linhas.map((l) => ({ l, a: aveDoId(l.id)! })).filter((x) => x.a), [linhas]);
  const entrega = useMemo(() => entregaDaCidade(dados.cidade_uf), [dados.cidade_uf]);
  const frete = dados.recebimento === 'retirada' ? 0 : entrega?.zona.tarifa ?? null;

  const resumoTexto = () =>
    itens.map(({ l, a }) => `• ${l.quantidade} ${l.quantidade === 1 ? UNIDADE_ROTULO[a.unidade] : UNIDADE_PLURAL[a.unidade]} — ${a.nome}${a.detalhe ? ` (${a.detalhe})` : ''} — ${brl(a.preco)} cada`).join('\n');

  const set = (k: keyof DadosCliente, v: string) => setDados((d) => ({ ...d, [k]: v }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itens.length === 0) return;
    setEnviando(true);
    setErro('');
    const cod = gerarCodigo();
    const rotaTxt = entrega?.rota?.nome ?? (regiao || 'fora da malha');
    const proxTxt = entrega?.prox ? `${dataCurta(entrega.prox.saida)} (pedidos até ${dataCurta(entrega.prox.fecha)})` : '';
    const recebTxt = dados.recebimento === 'retirada' ? `Retirada em ${CONSTANTS.RETIRADA}` : dados.recebimento === 'rota' ? 'Entrega na rota' : 'Combinar';
    const texto =
      `Olá! Fiz o pedido *${cod}* no site Aves Ornamentais Brasil.\n\n${resumoTexto()}\n\n` +
      `Total de referência: *${brl(totalReferencia)}*${frete ? ` + frete ${brl(frete)}` : ''}\n` +
      `Cidade: ${dados.cidade_uf || '—'} · ${rotaTxt}${proxTxt ? ` · próxima saída ${proxTxt}` : ''}\n` +
      `Recebimento: ${recebTxt}\nNome: ${dados.nome}${dados.observacoes ? `\nObs.: ${dados.observacoes}` : ''}`;

    const campos: Record<string, string> = {
      'form-name': NOME_FORM,
      subject: `Pedido ${cod} · ${dados.nome} · ${brl(totalReferencia)} · ${rotaTxt}`,
      codigo: cod,
      nome: dados.nome,
      whatsapp: dados.whatsapp,
      email: dados.email,
      cidade_uf: dados.cidade_uf,
      regiao: entrega?.cidade.r ?? regiao,
      rota: rotaTxt,
      proxima_saida: proxTxt,
      frete_zona: entrega?.zona.rotulo ?? '',
      frete_valor: frete === null ? 'sob consulta' : String(frete),
      recebimento: recebTxt,
      observacoes: dados.observacoes,
      pedido_resumo: resumoTexto(),
      pedido_json: JSON.stringify(itens.map(({ l, a }) => ({ id: a.id, nome: a.nome, detalhe: a.detalhe, criador: CRIADOR_ROTULO[a.criador], unidade: a.unidade, quantidade: l.quantidade, valorUnitario: a.preco }))),
      total_referencia: String(totalReferencia),
      origem: document.referrer || 'direto',
      pagina_entrada: window.location.href,
    };
    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(campos).toString(),
      });
      if (!r.ok && r.status !== 404) throw new Error(`HTTP ${r.status}`);
    } catch (err) {
      // O formulário falhar não pode travar o pedido: o WhatsApp é o canal principal.
      console.warn('Falha ao registrar o formulário', err);
    }
    setMsgWhats(texto);
    setCodigo(cod);
    esvaziar();
    setEnviando(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (codigo) {
    return (
      <section className="section">
        <div className="wrap max-w-2xl text-center">
          <CheckCircle2 className="w-14 h-14 text-[#1E8E5A] mx-auto mb-3" strokeWidth={1.5} />
          <div className="eyebrow">Pedido registrado</div>
          <h1 className="sec-title center" style={{ fontSize: '2.2rem' }}>Código {codigo}</h1>
          <p className="sec-sub">Agora é só mandar o pedido no WhatsApp para a gente confirmar a rota e o estoque. O botão abaixo já leva a mensagem pronta.</p>
          <a href={waComTexto(msgWhats)} target="_blank" rel="noopener noreferrer" className="btn btn-wa text-[1rem] !px-8 !py-3.5">
            <MessageCircle className="w-5 h-5" /> Enviar pedido no WhatsApp
          </a>
          <pre className="text-left whitespace-pre-wrap font-sans text-[0.82rem] text-[#5B6B5B] bg-[#F6F1E6] border border-[#E1DCCF] rounded-xl p-4 mt-8">{msgWhats}</pre>
          <button onClick={() => onNavigate('aves')} className="btn btn-ghost mt-4">Voltar para a lista</button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="sec-escura">
        <div className="wrap py-10 sm:py-14">
          <div className="eyebrow">Meu pedido</div>
          <h1 className="sec-title" style={{ fontSize: '2.4rem' }}>Fechar pedido</h1>
          <p className="sec-sub" style={{ marginBottom: 0 }}>Sem pagamento antecipado: você paga na entrega, com a ave conferida. Confirmamos estoque e rota no WhatsApp.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="wrap grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          {/* ITENS */}
          <div>
            <h2 className="text-[1.5rem] text-[#1F3B2E] m-0 mb-4 flex items-center gap-2"><ShoppingBasket className="w-5 h-5 text-[#D2A93C]" /> Aves escolhidas</h2>
            {itens.length === 0 ? (
              <div className="note">
                Seu pedido está vazio.{' '}
                <button onClick={() => onNavigate('aves')} className="underline bg-transparent border-0 cursor-pointer text-[#1F3B2E] font-serif text-[0.95rem] p-0">Ver as aves disponíveis</button>.
              </div>
            ) : (
              <div className="card p-2">
                <table className="tabela">
                  <thead>
                    <tr><th>Ave</th><th>Unid.</th><th>Qtd.</th><th className="text-right">Subtotal</th><th></th></tr>
                  </thead>
                  <tbody>
                    {itens.map(({ l, a }) => (
                      <tr key={a.id}>
                        <td>
                          <div className="font-serif text-[1.05rem] text-[#1F3B2E] leading-tight">{a.nome}{a.detalhe ? <span className="italic text-[#5B6B5B]"> · {a.detalhe}</span> : ''}</div>
                          <div className="text-[0.7rem] text-[#5B6B5B]">{CRIADOR_ROTULO[a.criador]} · {brl(a.preco)}/{UNIDADE_ROTULO[a.unidade]}</div>
                        </td>
                        <td className="text-[0.8rem]">{UNIDADE_ROTULO[a.unidade]}</td>
                        <td>
                          <div className="qtd">
                            <button type="button" onClick={() => alterar(a.id, l.quantidade - 1)} aria-label="Menos">−</button>
                            <span>{l.quantidade}</span>
                            <button type="button" onClick={() => alterar(a.id, l.quantidade + 1)} aria-label="Mais">+</button>
                          </div>
                        </td>
                        <td className="text-right font-bold text-[#1F3B2E]">{brl(a.preco * l.quantidade)}</td>
                        <td className="text-right"><button type="button" onClick={() => remover(a.id)} className="bg-transparent border-0 cursor-pointer text-[#9AA59A] hover:text-[#B5532E]" aria-label="Remover"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-[0.8rem] text-[#5B6B5B]">{totalUnidades} {totalUnidades === 1 ? 'unidade' : 'unidades'} · valores de referência</td>
                      <td className="text-right font-serif text-[1.3rem] text-[#1F3B2E]">{brl(totalReferencia)}</td>
                      <td></td>
                    </tr>
                    {frete !== null && dados.cidade_uf && (
                      <tr><td colSpan={3} className="text-[0.8rem] text-[#5B6B5B]">Frete ({dados.recebimento === 'retirada' ? 'retirada' : entrega?.zona.rotulo})</td><td className="text-right">{frete === 0 ? 'R$ 0' : brl(frete)}</td><td></td></tr>
                    )}
                  </tfoot>
                </table>
              </div>
            )}
            <button onClick={() => onNavigate('aves')} className="btn btn-ghost mt-4 !py-2"><ArrowLeft className="w-4 h-4" /> Adicionar mais aves</button>
          </div>

          {/* DADOS */}
          <form onSubmit={enviar} name={NOME_FORM} className="card p-6 sm:p-8">
            <input type="hidden" name="form-name" value={NOME_FORM} />
            <p className="hidden"><label>Não preencher: <input name="bot-field" /></label></p>
            <h2 className="text-[1.5rem] text-[#1F3B2E] m-0 mb-5">Seus dados</h2>
            <div className="grid gap-4">
              <div>
                <label className="rotulo" htmlFor="nome">Nome</label>
                <input id="nome" className="campo" required value={dados.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Como quer ser chamado" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="rotulo" htmlFor="whatsapp">WhatsApp</label>
                  <input id="whatsapp" className="campo" required inputMode="tel" value={dados.whatsapp} onChange={(e) => set('whatsapp', mascaraWhats(e.target.value))} placeholder="(11) 90000-0000" />
                </div>
                <div>
                  <label className="rotulo" htmlFor="email">E-mail <span className="normal-case tracking-normal font-normal">(opcional)</span></label>
                  <input id="email" type="email" className="campo" value={dados.email} onChange={(e) => set('email', e.target.value)} placeholder="para receber a confirmação" />
                </div>
              </div>
              <div>
                <label className="rotulo">Cidade</label>
                <CidadeInput value={dados.cidade_uf} onChange={(c, r) => { set('cidade_uf', c); setRegiao(r); }} />
              </div>
              <div>
                <label className="rotulo">Como quer receber</label>
                <div className="grid gap-2">
                  {[
                    { v: 'rota', t: 'Entrega na rota da minha região', d: entrega?.prox ? `Próxima saída ${dataCurta(entrega.prox.saida)}` : 'A gente confirma a data no WhatsApp' },
                    { v: 'retirada', t: `Retirada em ${CONSTANTS.RETIRADA}`, d: 'Sem frete · dia e hora combinados' },
                    { v: 'combinar', t: 'Prefiro combinar no WhatsApp', d: 'Entrega individual, aéreo ou outra opção' },
                  ].map((o) => (
                    <label key={o.v} className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer ${dados.recebimento === o.v ? 'border-[#D2A93C] bg-[#F6F1E6]' : 'border-[#E1DCCF]'}`}>
                      <input type="radio" name="recebimento" value={o.v} checked={dados.recebimento === o.v} onChange={() => set('recebimento', o.v)} className="mt-1" />
                      <span>
                        <span className="block font-sans text-[0.9rem] font-semibold text-[#1F3B2E]">{o.t}</span>
                        <span className="block font-sans text-[0.74rem] text-[#5B6B5B]">{o.d}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="rotulo" htmlFor="obs">Observações <span className="normal-case tracking-normal font-normal">(opcional)</span></label>
                <textarea id="obs" className="campo" rows={3} value={dados.observacoes} onChange={(e) => set('observacoes', e.target.value)} placeholder="Ex.: prefiro fêmeas mais novas; tenho interesse em outra variedade…" />
              </div>
              {erro && <div className="note !border-l-[#B5532E]">{erro}</div>}
              <button type="submit" className="btn btn-wa w-full text-[1rem] !py-3.5" disabled={enviando || itens.length === 0}>
                <MessageCircle className="w-5 h-5" /> {enviando ? 'Registrando…' : 'Enviar pedido pelo WhatsApp'}
              </button>
              <p className="font-sans text-[0.72rem] text-[#5B6B5B] m-0 leading-relaxed">
                O pedido é registrado e a mensagem já sai montada para o WhatsApp {CONSTANTS.WHATSAPP_DISPLAY}. Os valores são de referência até a confirmação de estoque. Sem pagamento antecipado.
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
