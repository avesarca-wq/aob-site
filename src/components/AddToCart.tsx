import React, { useState } from 'react';
import { Plus, Check, BellRing, Sprout } from 'lucide-react';
import { Escolha, Species } from '../types';
import { useCart, MAX_LINHAS } from '../cart/CartContext';
import { CONSTANTS, situacaoDe } from '../data/species';
import { abrirListaEspera } from './ListaEspera';
import { medir } from '../lib/analytics';

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

interface AddToCartProps {
  species: Species;
  onIrParaPedido?: () => void;
}

export const AddToCart: React.FC<AddToCartProps> = ({ species, onIrParaPedido }) => {
  const { adicionar, cheio, temLinha } = useCart();
  // Casal é a unidade do negócio (e a do DRE). Vinha em 'Escolher', o que obrigava
  // uma decisão a mais antes de o botão funcionar — quem quer avulso troca. (27/08/2026)
  const [sexo, setSexo] = useState<Escolha | ''>('Casal');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [erro, setErro] = useState<string>('');


  const situacao = situacaoDe(species);

  // SÓ NO PLANTEL (25/08/2026): a ave existe aqui e ainda não está à venda.
  // Sem preço e sem botão — é prova de procedência, não oferta.
  if (situacao === 'plantel') {
    return (
      <div className="rounded-2xl border border-[#E0E2D9] bg-[#F1EBDD]/70 px-3 py-2.5 text-center">
        <p className="font-sans text-[0.72rem] font-semibold text-[#4A5D4E] m-0 leading-snug inline-flex items-center gap-1.5">
          <Sprout className="w-3.5 h-3.5 shrink-0" />
          Ainda não comercializado
        </p>
        {/* 31/08/2026 — VISIBILIDADE: isto era um link de texto sublinhado embaixo de uma negativa,
          e o dado mostrou o resultado: em 26–31/08, com 472 visitas ao catalogo, lista_espera_abrir
          disparou ZERO vezes (as 2 aberturas do historico sao de 25/08, antes do lancamento).
          Nao foi rejeicao, foi invisibilidade. Agora e botao de largura inteira, como o das 6 em
          lista de espera — mas ghost, nao gold: dourado no catalogo significa acao comercial, e
          estas 9 nao estao a venda. Se setembro seguir em zero abertura, ai a lista sai com prova. */}
          {/* 29/08/2026: as 9 em SO NO PLANTEL eram 23% do catalogo sem nenhuma saida.
           Continua sem preco e sem promessa de prazo — o que muda e que agora o
           interesse fica registrado em vez de virar aba fechada. */}
        <button
          type="button"
          onClick={() => {
            medir('lista_espera_abrir', { variedade: species.nome, nivel: species.tier, de: 'plantel' });
            abrirListaEspera(species.nome);
          }}
          className="btn btn-ghost text-xs py-2 w-full flex items-center justify-center gap-1.5 mt-2"
        >
          <BellRing className="w-3.5 h-3.5" />
          Avise-me quando abrir
        </button>
      </div>
    );
  }

  // LISTA DE ESPERA (25/08/2026): nós comercializamos, mas a reserva está fechada agora.
  // Em vez de prometer prazo, o botão leva ao formulário da próxima temporada com a
  // variedade já preenchida — o contato fica registrado, a promessa não é feita.
  if (situacao === 'espera') {
    return (
      <div className="rounded-2xl border border-[#E0E2D9] bg-[#FAFBF8] p-3 text-center">
        <p className="font-sans text-[0.72rem] text-[#5A635C] m-0 mb-2 leading-snug">
          Reserva fechada agora. Entre na fila e avisamos quando abrir.
        </p>
        <button
          type="button"
          onClick={() => {
            medir('lista_espera_abrir', { variedade: species.nome, nivel: species.tier });
            abrirListaEspera(species.nome);
          }}
          className="btn btn-gold text-xs py-2 w-full flex items-center justify-center gap-1.5"
        >
          <BellRing className="w-3.5 h-3.5" />
          Entrar na lista de espera
        </button>
      </div>
    );
  }

  // Variedade sem preço confirmado no Bling: não entra no carrinho (decisão de 05/08).
  if (!species.preco_confirmado) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D4A373] bg-[#FAFBF8] px-3 py-2.5 text-center">
        <p className="font-sans text-[0.72rem] font-semibold text-[#4A5D4E] m-0 leading-snug">
          Valor sob consulta — falar no WhatsApp
        </p>
      </div>
    );
  }

  // Já existe linha desta variedade no carrinho?
  // 31/08/2026: a confirmação passou a vir DAQUI, e não de um estado que se apagava sozinho.
  // Antes, um temporizador de 4 s devolvia o botão a "Adicionar" e levava junto o link
  // "Ver minha pré-reserva" — o único caminho da página para o formulário sumia da tela
  // antes de a pessoa terminar de ler a confirmação. Agora o rótulo e o link seguem a
  // verdade do carrinho: ficam de pé enquanto a ave estiver lá, e somem se ela for removida.
  const jaNoPedido = sexo ? temLinha(species.nome, sexo) : false;
  const bloqueadoPeloTeto = cheio && !jaNoPedido;

  const handleAdicionar = () => {
    setErro('');
    if (!sexo) {
      setErro('Escolha casal, macho ou fêmea.');
      return;
    }
    const r = adicionar({
      nome: species.nome,
      tier: species.tier,
      sexo,
      // No casal o valor é o do PAR (preço de casal do Bling, ≈9% abaixo de dois avulsos).
      // A divisão em macho + fêmea acontece no envio do pedido, não aqui.
      // Macho e fêmea têm preços próprios desde 25/08/2026 (planilha 05.6.18): nas Cool a
      // fêmea vale mais, no Mandarim Branco e nas Carolinas de mutação vale o macho.
      valorUnitario:
        sexo === 'Casal' ? species.casal : sexo === 'Macho' ? species.macho : species.femea,
      quantidade
    });
    if (!r.ok) {
      setErro('limite');
      return;
    }
    medir('add_carrinho', { variedade: species.nome, sexo, quantidade, nivel: species.tier });
  };

  return (
    <div className="rounded-2xl border border-[#E0E2D9] bg-[#FAFBF8] p-3">
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <label className="block font-sans text-[0.62rem] uppercase tracking-wider text-[#5A635C] mb-1">
            Casal ou avulso *
          </label>
          <select
            value={sexo}
            onChange={(e) => {
              setSexo(e.target.value as Escolha | '');
              setErro('');
            }}
            aria-label={`Casal, macho ou fêmea para ${species.nome}`}
            className="w-full px-2 py-1.5 rounded-lg border border-[#E0E2D9] bg-white text-xs font-sans text-[#2D3436] focus:outline-none focus:border-[#D4A373]"
          >
            <option value="" disabled hidden>Escolher</option>
            <option value="Casal">Casal (1 macho + 1 fêmea)</option>
            <option value="Macho">Macho</option>
            <option value="Fêmea">Fêmea</option>
          </select>
        </div>
        <div className="w-20">
          <label className="block font-sans text-[0.62rem] uppercase tracking-wider text-[#5A635C] mb-1">
            Qtd.
          </label>
          <input
            type="number"
            min={1}
            max={99}
            value={quantidade}
            onChange={(e) => setQuantidade(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
            aria-label={`Quantidade de ${species.nome}`}
            className="w-full px-2 py-1.5 rounded-lg border border-[#E0E2D9] bg-white text-xs font-sans text-[#2D3436] focus:outline-none focus:border-[#D4A373]"
          />
        </div>
      </div>

      {/* Vantagem do casal dita com número, não com adjetivo. Sai do próprio catálogo. */}
      {sexo === 'Casal' && species.casal < species.macho + species.femea && (
        <p className="font-sans text-[0.68rem] text-[#4A5D4E] leading-snug mt-0 mb-2">
          O casal sai por <strong>{formatBRL(species.casal)}</strong> —{' '}
          {formatBRL(species.macho + species.femea - species.casal)} abaixo de um macho e uma fêmea avulsos.
        </p>
      )}

      <button
        type="button"
        onClick={handleAdicionar}
        disabled={bloqueadoPeloTeto}
        className={`btn text-xs py-2 w-full flex items-center justify-center gap-1.5 ${
          bloqueadoPeloTeto ? 'btn-ghost opacity-50 cursor-not-allowed' : 'btn-gold'
        }`}
      >
        {jaNoPedido ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        {jaNoPedido ? 'Adicionado à pré-reserva' : 'Adicionar à pré-reserva'}
      </button>

      {/* Frase do teto: escrita ao lado do botão, nunca em alert depois do clique. */}
      {bloqueadoPeloTeto && (
        <p className="font-sans text-[0.68rem] text-[#5A635C] leading-snug mt-2 mb-0">
          A pré-reserva aceita até {MAX_LINHAS} variedades. Para uma pré-reserva maior,{' '}
          <a
            href={`${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent(
              'Olá! Quero fazer uma pré-reserva grande.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4A5D4E] font-bold underline"
          >
            fale com a gente pelo WhatsApp
          </a>
          .
        </p>
      )}

      {erro && erro !== 'limite' && (
        <p className="font-sans text-[0.68rem] text-[#B4462F] mt-2 mb-0">{erro}</p>
      )}

      {jaNoPedido && onIrParaPedido && (
        <button
          type="button"
          onClick={onIrParaPedido}
          className="font-sans text-[0.68rem] text-[#4A5D4E] font-bold underline mt-2 cursor-pointer bg-transparent border-0 p-0"
        >
          Ver minha pré-reserva
        </button>
      )}
    </div>
  );
};
