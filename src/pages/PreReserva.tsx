import React, { useState, useEffect } from 'react';
import { TOTAL_VARIEDADES, CONSTANTS, TIER_DISPLAY_NAMES } from '../data/species';
import { CAMINHOS, waComOrigem } from '../lib/links';
import { PageRoute, DadosCliente, CartLine, LinhaPedido } from '../types';
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  CheckSquare,
  Trash2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { CidadeInput, faixaDaCidade, zonaDoTexto } from '../components/CidadeInput';
import { ZONAS, RETIRADA } from '../data/zonas';
import { medir, origemResumida, origemDaVisita } from '../lib/analytics';

interface PreReservaProps {
  initialSpeciesName?: string;
  onNavigate?: (page: PageRoute) => void;
}

type EstadoEnvio = 'idle' | 'enviando' | 'gravado' | 'falhou';

/**
 * O que ESTE formulário coleta, além do contrato compartilhado `DadosCliente`.
 * Fica aqui, e não em types.ts, porque só a pré-reserva usa: CEP (para resolver rota e
 * frete), forma de pagamento (sempre na entrega) e cupom de campanha (só registrado).
 */
type DadosPreReserva = DadosCliente & {
  /** CEP com máscara (00000-000). É por ele que cidade e faixa de rota são resolvidas. */
  cep: string;
  /** Rua/avenida. Vem preenchido do ViaCEP, mas continua editável. */
  endereco: string;
  /** Número da casa/sítio. O ViaCEP não tem — é a única parte que o cliente sempre digita. */
  numero: string;
  complemento: string;
  bairro: string;
  /** Como pretende pagar NA ENTREGA. Nunca há pagamento antecipado. Opcional. */
  forma_pagamento: string;
  /** Código de campanha, se houver. O site só REGISTRA — quem valida é o Ricardo. */
  cupom: string;
  /**
   * CPF de quem vai RECEBER a ave. OBRIGATORIO desde 28/08/2026, por decisao do Ricardo:
   * a NF e a GTA saem no nome de quem recebe, e o CPF valido destrava as duas. O custo em
   * conversao e medido pelo pedido_bloqueado, que nomeia o campo que barrou — decisao
   * reversivel com dado, nao com opiniao.
   */
  cpf: string;
};

const NOME_FORM = 'pre-reserva';

/** Código do pedido no formato PR-DDMM-NNN (05.6.8, decisão do Ricardo). */
const gerarCodigo = (): string => {
  const agora = new Date();
  const dd = String(agora.getDate()).padStart(2, '0');
  const mm = String(agora.getMonth() + 1).padStart(2, '0');
  const nnn = String(Math.floor(Math.random() * 900) + 100);
  return `PR-${dd}${mm}-${nnn}`;
};

const formatBRL = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

/**
 * DIVIDE O CASAL. O cliente escolhe "casal" porque é assim que ele pensa a criação;
 * o Bling, o estoque oficial e a GTA trabalham por SEXO. Então o casal existe até aqui
 * e some no envio: 1 casal vira 1 Macho + 1 Fêmea, cada um com METADE do valor do par.
 *
 * A soma não muda: 2 × (casal ÷ 2) = casal. E cada linha nascida de um casal leva
 * `de_casal: true`, para o faturamento saber de onde veio o desconto do par.
 *
 * Não fundo com uma linha avulsa da mesma variedade de propósito: o preço unitário é
 * diferente (metade do casal ≠ preço do avulso) e juntar apagaria essa diferença.
 */
const expandirParaPedido = (ls: CartLine[]): LinhaPedido[] =>
  ls.flatMap((l) =>
    l.sexo === 'Casal'
      ? ([
          { nome: l.nome, tier: l.tier, sexo: 'Macho', quantidade: l.quantidade, valorUnitario: l.valorUnitario / 2, de_casal: true },
          { nome: l.nome, tier: l.tier, sexo: 'Fêmea', quantidade: l.quantidade, valorUnitario: l.valorUnitario / 2, de_casal: true }
        ] as LinhaPedido[])
      : ([{ nome: l.nome, tier: l.tier, sexo: l.sexo, quantidade: l.quantidade, valorUnitario: l.valorUnitario }] as LinhaPedido[])
  );

/**
 * FRETE por ZONA (decisão de 24/08/2026). Aparece em LINHA SEPARADA, fora do total:
 * o total de referência é o valor das aves, e é assim que o cliente compara preço.
 *
 * A tabela sai de ZONAS — mexer em preço é mexer em src/data/zonas.ts, num lugar só.
 * A zona 4 fica "sob consulta" DE PROPÓSITO: publicar um número de frete aéreo que
 * ninguém fechou seria cobrar errado na entrega, o contrário do que a página promete.
 */
const FRETE = [ZONAS[1], ZONAS[2], ZONAS[3], ZONAS[4]];

/**
 * Formas de pagamento — TODAS na entrega. Não existe opção antecipada aqui, e isso não é
 * esquecimento: a página inteira promete "você só paga na entrega". Uma linha de pagamento
 * antecipado no formulário desmentiria a promessa três seções acima.
 */
const FORMAS_PAGAMENTO = [
  'Dinheiro na entrega',
  'PIX na entrega',
  'Cartão de débito na entrega',
  'Cartão de crédito 3x sem juros na entrega',
  'Cartão de crédito 6x sem juros na entrega',
  'Cartão de crédito 10x sem juros na entrega'
];

/** 04800000 → 04800-000. Só formata dígito que já existe; nunca completa o que falta. */
const formatarCep = (bruto: string): string => {
  const so = String(bruto || '').replace(/\D/g, '').slice(0, 8);
  return so.length > 5 ? `${so.slice(0, 5)}-${so.slice(5)}` : so;
};

/** 12345678901 → 123.456.789-01. So formata o digito que ja existe; nunca completa. */
const formatarCpf = (bruto: string): string => {
  const so = String(bruto || '').replace(/\D/g, '').slice(0, 11);
  if (so.length <= 3) return so;
  if (so.length <= 6) return `${so.slice(0, 3)}.${so.slice(3)}`;
  if (so.length <= 9) return `${so.slice(0, 3)}.${so.slice(3, 6)}.${so.slice(6)}`;
  return `${so.slice(0, 3)}.${so.slice(3, 6)}.${so.slice(6, 9)}-${so.slice(9)}`;
};

/** Digitos verificadores do CPF. O numero vira NF e GTA — lixo aqui viraria documento errado. */
const cpfValido = (bruto: string): boolean => {
  const so = String(bruto || '').replace(/\D/g, '');
  if (so.length !== 11 || /^(\d)\1{10}$/.test(so)) return false;
  for (const t of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += Number(so[i]) * (t + 1 - i);
    if (((soma * 10) % 11) % 10 !== Number(so[t])) return false;
  }
  return true;
};

/** Como a linha aparece para o cliente: o casal continua sendo um casal na tela. */
const rotuloEscolha = (sexo: CartLine['sexo']) =>
  sexo === 'Casal' ? 'Casal · 1 macho + 1 fêmea' : sexo;

export const PreReserva: React.FC<PreReservaProps> = ({ onNavigate }) => {
  const { linhas, totalLinhas, totalAves, totalReferencia, removerLinha, alterarQuantidade, esvaziar } = useCart();

  const [dados, setDados] = useState<DadosPreReserva>({
    nome: '',
    whatsapp: '',
    email: '',
    cpf: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade_uf: '',
    forma_recebimento: '',
    forma_pagamento: '',
    cupom: '',
    observacoes: ''
  });
  const [faixaRota, setFaixaRota] = useState('');
  /** Zona de frete da cidade escolhida. null enquanto a cidade não é reconhecida na malha. */
  const zonaDoCliente = faixaRota ? zonaDoTexto(dados.cidade_uf) : null;
  /** '' · 'incompleto' · 'buscando' · 'ok' · 'fora_da_malha' · 'nao_encontrado' · 'erro' */
  const [estadoCep, setEstadoCep] = useState('');
  /**
   * Foto do pedido no instante do envio. Existe porque o carrinho é ESVAZIADO assim que a
   * gravação dá certo (senão o cliente volta ao site com o pedido antigo ainda no carrinho e
   * pode mandar duas vezes — defeito medido no teste de fluxo de 07/08/2026).
   */
  const [enviado, setEnviado] = useState<{ linhas: typeof linhas; total: number } | null>(null);
  const [isca, setIsca] = useState('');
  const [estado, setEstado] = useState<EstadoEnvio>('idle');
  const [codigo, setCodigo] = useState('');
  const [erroValidacao, setErroValidacao] = useState('');
  /**
   * Confirmação de maioridade. Fica em estado próprio, e não em `dados`, porque é booleano —
   * `DadosPreReserva` só guarda strings. Existe por um caso real (rota de Belo Horizonte,
   * agosto/2026): um menor fez o pedido sem a mãe saber e a entrega foi cancelada na porta.
   * A nota fiscal e a GTA saem no nome de quem recebe a ave — quem pede precisa poder assinar.
   */
  const [maiorIdade, setMaiorIdade] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * CEP → cidade → faixa de rota. Usa o ViaCEP (base pública dos Correios, sem chave e sem
   * cadastro). O CEP é o dado de localização que o cliente tem na cabeça sem errar: com ele
   * a cidade vem escrita certa e a rota deixa de depender de digitação.
   *
   * Se o ViaCEP estiver fora do ar, o formulário NÃO trava — a cidade continua editável à mão.
   * Nunca sobrescreve uma cidade já preenchida sem ter uma resposta boa do ViaCEP.
   */
  const buscarCep = async (valor: string) => {
    const so = valor.replace(/\D/g, '');
    if (so.length !== 8) {
      setEstadoCep(so.length === 0 ? '' : 'incompleto');
      return;
    }
    setEstadoCep('buscando');
    try {
      const r = await fetch(`https://viacep.com.br/ws/${so}/json/`);
      const j = await r.json();
      if (j?.erro || !j?.localidade) {
        setEstadoCep('nao_encontrado');
        return;
      }
      const cidadeUf = `${j.localidade} — ${j.uf}`;
      const faixa = faixaDaCidade(cidadeUf);
      setDados((prev) => {
        /**
         * CEP de cidade inteira (município pequeno) volta com logradouro e bairro VAZIOS.
         * Se a pessoa só corrigiu um dígito e continua na MESMA cidade, o que ela já digitou
         * fica — apagar seria jogar fora o trabalho dela na frente dela.
         *
         * Mas se o CEP mudou de cidade, a rua antiga não é mais dela: manter "Avenida Paulista"
         * embaixo de "São Lourenço — MG" mandaria um endereço errado para o pedido sem ninguém
         * perceber. Aí limpa.
         */
        const mudouCidade = !!prev.cidade_uf && prev.cidade_uf !== cidadeUf;
        return {
          ...prev,
          cidade_uf: cidadeUf,
          endereco: j.logradouro || (mudouCidade ? '' : prev.endereco),
          bairro: j.bairro || (mudouCidade ? '' : prev.bairro),
          numero: mudouCidade ? '' : prev.numero,
          complemento: mudouCidade ? '' : prev.complemento
        };
      });
      setFaixaRota(faixa);
      setEstadoCep(faixa ? 'ok' : 'fora_da_malha');
    } catch {
      setEstadoCep('erro');
    }
  };

  const handleCep = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatado = formatarCep(e.target.value);
    setDados((prev) => ({ ...prev, cep: formatado }));
    void buscarCep(formatado);
  };

  /** CPF: aqui so formata; a exigencia e a validacao acontecem no envio (obrigatorio desde 28/08/2026). */
  const handleCpf = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDados((prev) => ({ ...prev, cpf: formatarCpf(e.target.value) }));
  };

  /** Resumo do pedido JÁ DIVIDIDO por sexo — é o que o Bling precisa ler. */
  const montarResumo = () =>
    expandirParaPedido(linhas)
      .map(
        (l) =>
          `${l.quantidade}x ${l.nome} (${TIER_DISPLAY_NAMES[l.tier]}) — ${l.sexo} — ref. ${formatBRL(
            l.valorUnitario
          )}/un${l.de_casal ? ' · do casal' : ''}`
      )
      .join('\n');

  const abrirWhatsApp = (cod: string) => {
    const texto = `Olá! Enviei a pré-reserva ${cod} com ${totalLinhas} ${
      totalLinhas === 1 ? 'variedade' : 'variedades'
    }.`;
    window.open(`${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroValidacao('');

    // 27/08/2026: o envio barrado era invisivel — o navegador segurava o formulario pela
    // validacao nativa, sem mensagem nossa, e nada disso aparecia na medicao. Agora o form
    // e noValidate, a mensagem e nossa e cada bloqueio vira evento: da para contar quantos
    // tentam enviar e nao conseguem, que era exatamente o que faltava saber.
    const bloquear = (motivo: string, mensagem: string, extra?: Record<string, string>) => {
      setErroValidacao(mensagem);
      medir('pedido_bloqueado', { motivo, ...extra });
    };

    if (linhas.length === 0) {
      bloquear('carrinho_vazio', 'Sua pré-reserva está vazia. Escolha as variedades na página Espécies.');
      return;
    }
    /**
     * 27/08/2026: a mensagem antiga listava os quatro campos de uma vez e o evento so dizia
     * "campos_obrigatorios" — dava para CONTAR o bloqueio, nao para saber ONDE ele foi. Agora a
     * mensagem nomeia o que faltou e o evento leva os campos, que e o que transforma o proximo
     * bloqueio em diagnostico em vez de misterio.
     */
    const faltando: string[] = [];
    if (!dados.nome.trim()) faltando.push('nome completo');
    if (!dados.whatsapp.trim()) faltando.push('WhatsApp');
    if (!dados.email.trim()) faltando.push('e-mail');
    if (!dados.cidade_uf.trim()) faltando.push('cidade / UF');
    if (!dados.forma_recebimento) faltando.push('forma de recebimento');
    /** Obrigatorios desde 28/08/2026: o CPF e o numero saem na NF (e o CPF tambem na GTA). */
    if (!dados.cpf.trim()) faltando.push('CPF');
    if (!dados.numero.trim()) faltando.push('número do endereço');
    if (faltando.length > 0) {
      const lista =
        faltando.length === 1
          ? faltando[0]
          : `${faltando.slice(0, -1).join(', ')} e ${faltando[faltando.length - 1]}`;
      bloquear('campos_obrigatorios', `Falta preencher: ${lista}.`, { campos: faltando.join('+') });
      return;
    }
    /** O rotulo do e-mail sempre teve asterisco; a regra nao testava. Agora testa. */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(dados.email.trim())) {
      bloquear('email_invalido', 'Confira o e-mail — falta o @ ou o final do endereco.');
      return;
    }

    if (!cpfValido(dados.cpf)) {
      bloquear('cpf_invalido', 'Confira o CPF — o número digitado não é válido.');
      return;
    }
    if (dados.cep.replace(/\D/g, '').length !== 8) {
      bloquear('cep_invalido', 'Informe um CEP válido, com 8 dígitos (exemplo: 04800-000).');
      return;
    }
    if (!maiorIdade) {
      bloquear(
        'maioridade',
        'Confirme que você tem 18 anos ou mais. A nota fiscal e a GTA saem no nome de quem recebe a ave.'
      );
      return;
    }
    /**
     * Endereço NÃO trava o envio (decisão do Ricardo, 14/08/2026). A pré-reserva é o topo do
     * funil: o que ela precisa é do CEP, que já resolve cidade, rota e frete. Rua, número e
     * complemento são conferidos quando a pré-reserva vira pedido — pedir número aqui é
     * atrito num formulário que ainda não cobra nada de ninguém.
     */
    if (isca) {
      // Campo-isca preenchido: robô. Não envia, e não avisa.
      return;
    }

    const cod = gerarCodigo();
    setCodigo(cod);
    setEstado('enviando');
    medir('enviar_pedido', { linhas: linhas.length, total_referencia: totalReferencia });

    const campos: Record<string, string> = {
      'form-name': NOME_FORM,
      /**
       * Assunto do aviso por e-mail. Vai como CAMPO porque a Netlify não interpola valores de
       * formulário no assunto configurado na interface — lá só valem %{formName}, %{siteName} e
       * %{submissionId}. Um campo chamado `subject` é o único jeito de o assunto trazer o pedido.
       * (o e-mail bonito quem monta é a função netlify/functions/pedido-email.mts; isto é a rede
       * de segurança, para o aviso nativo também chegar legível)
       */
      subject: `PRÉ-RESERVA ${cod} · ${dados.nome} · ${dados.cidade_uf} · ${formatBRL(totalReferencia)}`,
      codigo: cod,
      nome: dados.nome,
      whatsapp: dados.whatsapp,
      email: dados.email,
      cpf: dados.cpf.trim(),
      cep: dados.cep,
      endereco: dados.endereco,
      numero: dados.numero,
      complemento: dados.complemento,
      bairro: dados.bairro,
      cidade_uf: dados.cidade_uf,
      faixa_rota: faixaRota,
      // Frete por zona (24/08/2026): vai junto no pedido, não depende de eu lembrar de somar.
      frete_zona: zonaDoCliente ? zonaDoCliente.rotulo : ZONAS[4].rotulo,
      frete_valor: zonaDoCliente ? zonaDoCliente.tarifaTexto : ZONAS[4].tarifaTexto,
      forma_recebimento: dados.forma_recebimento,
      forma_pagamento: dados.forma_pagamento,
      // Sempre em maiúsculas: o cliente digita "verao26", a campanha se chama "VERAO26".
      cupom: dados.cupom.trim().toUpperCase(),
      observacoes: dados.observacoes,
      pedido_resumo: montarResumo(),
      // JSON dividido por sexo: nenhum 'Casal' chega ao Bling.
      pedido_json: JSON.stringify(expandirParaPedido(linhas)),
      total_referencia: String(totalReferencia),
      // De onde veio a visita que virou este pedido (05.14: saber qual canal produziu a venda)
      origem: origemResumida(),
      pagina_entrada: origemDaVisita().pagina_entrada,
      // Fica gravado no pedido: sem isso a carga não sai (regra do caso de agosto/2026).
      maior_idade: maiorIdade ? 'sim' : 'não',
      'bot-field': ''
    };

    try {
      const resposta = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(campos).toString()
      });
      if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status}`);
      }
      setEnviado({ linhas: [...linhas], total: totalReferencia });
      esvaziar(); // o pedido já está gravado: o carrinho não pode sobreviver ao envio
      setEstado('gravado');
      medir('pedido_ok', { linhas: linhas.length, total_referencia: totalReferencia });
      // Não abre o WhatsApp sozinho: em computador sem o app logado a mensagem se perde.
    } catch {
      // Nunca fingir sucesso: avisa e oferece o WhatsApp como saída.
      medir('pedido_erro');
      setEstado('falhou');
    }
  };

  /* VER_CONFERENCIA — declarado no tipo desde 07/08/2026 e nunca disparado. Sem ele o
     trecho entre o carrinho e o formulario e cego: em 28/08/2026 houve 39 add_carrinho e
     ZERO enviar_pedido, e nao ha como saber quantos chegaram ate esta tela. */
  useEffect(() => {
    if (estado === 'gravado') return;
    if (linhas.length === 0) return;
    medir('ver_conferencia', { linhas: linhas.length, total_referencia: totalReferencia });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linhas.length, estado]);

  const blocoPedido = (
      <section id="reservar" className="py-16 bg-[#F8F9F5]">
        <div className="wrap max-w-3xl">
          {estado === 'gravado' ? (
            /* ---------- CONFIRMAÇÃO ---------- */
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E0E2D9] shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-7 h-7 text-[#4A5D4E] flex-none mt-0.5" />
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#4A5D4E] m-0">
                    Pré-reserva registrada
                  </h2>
                  <p className="font-sans text-sm text-[#5A635C] mt-1 mb-0">
                    Guarde o código abaixo — é por ele que a gente encontra a sua pré-reserva.
                  </p>
                </div>
              </div>

              <div className="bg-[#F1EBDD] border border-[#C1732B] rounded-2xl px-5 py-4 text-center my-5">
                <div className="font-sans text-[0.7rem] uppercase tracking-wider text-[#5A635C] mb-1">
                  Código da pré-reserva
                </div>
                <div className="font-serif text-3xl font-bold text-[#14504B] tracking-wide">{codigo}</div>
              </div>

              <div className="rounded-2xl border border-[#E0E2D9] bg-[#FAFBF8] p-4 mb-5">
                <h3 className="font-sans text-[0.72rem] uppercase tracking-wider text-[#5A635C] mb-2">
                  Resumo da pré-reserva
                </h3>
                <ul className="list-none p-0 m-0 space-y-1.5">
                  {(enviado?.linhas ?? linhas).map((l) => (
                    <li
                      key={`${l.nome}-${l.sexo}`}
                      className="font-serif text-sm text-[#2D3436] flex justify-between gap-3"
                    >
                      <span>
                        {l.quantidade}× {l.nome} — {rotuloEscolha(l.sexo)}
                      </span>
                      <span className="font-sans text-xs text-[#5A635C] whitespace-nowrap">
                        {formatBRL(l.quantidade * l.valorUnitario)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-[#E0E2D9] mt-3 pt-2 flex justify-between font-sans text-sm font-bold text-[#4A5D4E]">
                  <span>Total de referência</span>
                  <span>{formatBRL(enviado?.total ?? totalReferencia)}</span>
                </div>
              </div>

              <p className="font-serif text-sm text-[#5A635C] leading-relaxed">
              Pronto — sua pré-reserva está registrada. Enviamos a confirmação com o código para
                o seu e-mail. Se quiser falar agora, é só clicar abaixo.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => abrirWhatsApp(codigo)}
                  className="btn btn-wa text-sm py-3 px-6 flex-1 justify-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  Avisar no WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => {
                    esvaziar();
                    setEnviado(null);
                    setEstado('idle');
                    setCodigo('');
                    if (onNavigate) onNavigate('especies');
                  }}
                  className="btn btn-ghost text-sm py-3 px-6 justify-center"
                >
                  Começar uma nova pré-reserva
                </button>
              </div>
            </div>
          ) : linhas.length === 0 ? (
            /* ---------- CARRINHO VAZIO ---------- */
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-dashed border-[#E0E2D9] text-center">
              <h2 className="font-serif text-2xl font-semibold text-[#4A5D4E] mb-2">
                Sua pré-reserva ainda está vazia
              </h2>
              <p className="font-serif text-base text-[#5A635C] max-w-lg mx-auto mb-6 leading-relaxed">
                A pré-reserva começa na escolha das aves. Vá ao catálogo, escolha as variedades com
                sexo e quantidade, e volte aqui para conferir e enviar — sem limite de variedades
                por pré-reserva.
              </p>
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate('especies') : (window.location.hash = 'especies'))}
                className="btn btn-gold text-sm py-3 px-7 inline-flex items-center gap-2"
              >
                Ver as {TOTAL_VARIEDADES} variedades
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* ---------- LISTA + DADOS + ENVIO ---------- */
            <>
              <h2 className="sec-title center">Confira e envie sua pré-reserva</h2>
              <p className="sec-sub center mx-auto mb-8">
                Sem pagamento antecipado. O envio registra a pré-reserva e gera um código; a conversa
                consultiva acontece depois, pelo WhatsApp.
              </p>

              {/* LISTA DO PEDIDO */}
              <div className="bg-white rounded-3xl border border-[#E0E2D9] shadow-sm p-5 sm:p-7 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-semibold text-[#4A5D4E] m-0">
                    Minha pré-reserva
                  </h3>
                  <span className="font-sans text-xs font-bold text-[#5A635C]">
                    {totalLinhas} {totalLinhas === 1 ? 'variedade' : 'variedades'} · {totalAves}{' '}
                    {totalAves === 1 ? 'ave' : 'aves'}
                  </span>
                </div>

                <div className="space-y-3">
                  {linhas.map((l) => (
                    <div
                      key={`${l.nome}-${l.sexo}`}
                      className="flex flex-wrap items-center gap-3 border border-[#E0E2D9] rounded-2xl p-3 bg-[#FAFBF8]"
                    >
                      <div className="flex-1 min-w-[9rem]">
                        <div className="font-serif text-base font-semibold text-[#4A5D4E] leading-tight">
                          {l.nome}
                        </div>
                        <div className="font-sans text-[0.7rem] text-[#5A635C]">
                          {rotuloEscolha(l.sexo)} · {TIER_DISPLAY_NAMES[l.tier]} · ref.{' '}
                          {formatBRL(l.valorUnitario)}/{l.sexo === 'Casal' ? 'casal' : 'un'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="font-sans text-[0.65rem] uppercase text-[#5A635C]">Qtd.</label>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={l.quantidade}
                          onChange={(e) => alterarQuantidade(l.nome, l.sexo, Number(e.target.value))}
                          aria-label={`Quantidade de ${l.nome} ${l.sexo}`}
                          className="w-16 px-2 py-1.5 rounded-lg border border-[#E0E2D9] bg-white text-xs font-sans text-[#2D3436] focus:outline-none focus:border-[#D4A373]"
                        />
                      </div>

                      <div className="font-sans text-sm font-bold text-[#4A5D4E] w-24 text-right">
                        {formatBRL(l.quantidade * l.valorUnitario)}
                      </div>

                      <button
                        type="button"
                        onClick={() => removerLinha(l.nome, l.sexo)}
                        aria-label={`Remover ${l.nome} ${l.sexo} da pré-reserva`}
                        className="p-2 text-[#5A635C] hover:text-[#B4462F] transition-colors bg-transparent border-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E0E2D9] mt-4 pt-4">
                  <button
                    type="button"
                    onClick={esvaziar}
                    className="font-sans text-xs text-[#5A635C] underline bg-transparent border-0 p-0 cursor-pointer hover:text-[#B4462F]"
                  >
                    Esvaziar pré-reserva
                  </button>
                  <div className="font-sans text-sm font-bold text-[#4A5D4E]">
                    Total de referência: {formatBRL(totalReferencia)}
                  </div>
                </div>

                <p className="font-sans text-[0.7rem] text-[#5A635C] mt-3 mb-0 leading-snug">
                  Valores de referência do catálogo, sem frete. O valor final é confirmado na
                  conversa consultiva, antes de qualquer pagamento — que só acontece na entrega.
                  {linhas.some((l) => l.sexo === 'Casal') && (
                    <>
                      {' '}
                      <strong className="text-[#4A5D4E]">
                        Cada casal é registrado na pré-reserva como 1 macho + 1 fêmea
                      </strong>{' '}
                      — é assim que a nota fiscal e a Guia de Trânsito Animal funcionam. O valor não
                      muda.
                    </>
                  )}
                </p>
              </div>

              {/* DADOS DO CLIENTE */}
              <form
                id="form-pre-reserva"
                name={NOME_FORM}
                noValidate
          onSubmit={handleSubmit}
                className="space-y-5 bg-white p-6 sm:p-10 rounded-3xl border border-[#E0E2D9] shadow-sm font-sans"
              >
                <h3 className="font-serif text-xl font-semibold text-[#4A5D4E] m-0">Seus dados</h3>

                {/* campo-isca (anti-robô da Netlify) */}
                <p className="hidden" aria-hidden="true">
                  <label>
                    Não preencha este campo:{' '}
                    <input
                      name="bot-field"
                      tabIndex={-1}
                      autoComplete="off"
                      value={isca}
                      onChange={(e) => setIsca(e.target.value)}
                    />
                  </label>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A5D4E] uppercase tracking-wider mb-1.5">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      required
                      value={dados.nome}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#E0E2D9] text-sm focus:outline-none focus:border-[#D4A373]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5D4E] uppercase tracking-wider mb-1.5">
                      WhatsApp / Telefone *
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      required
                      value={dados.whatsapp}
                      onChange={handleChange}
                      placeholder="(DDD) 9 0000-0000"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#E0E2D9] text-sm focus:outline-none focus:border-[#D4A373]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A5D4E] uppercase tracking-wider mb-1.5">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={dados.email}
                      onChange={handleChange}
                      placeholder="voce@email.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#E0E2D9] text-sm focus:outline-none focus:border-[#D4A373]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5D4E] uppercase tracking-wider mb-1.5">
                      CEP *
                    </label>
                    <input
                      type="text"
                      name="cep"
                      required
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={9}
                      value={dados.cep}
                      onChange={handleCep}
                      placeholder="00000-000"
                      aria-describedby="aviso-cep"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#E0E2D9] text-sm focus:outline-none focus:border-[#D4A373]"
                    />
                    <p id="aviso-cep" className="font-sans text-[0.7rem] mt-1.5 mb-0 leading-snug text-[#5A635C]">
                      {estadoCep === 'buscando' && 'Procurando o endereço…'}
                      {estadoCep === 'incompleto' && 'O CEP tem 8 dígitos.'}
                      {estadoCep === 'nao_encontrado' && (
                        <span className="text-[#B4462F]">
                          Não encontramos este CEP. Confira os números ou preencha a cidade à mão.
                        </span>
                      )}
                      {estadoCep === 'erro' &&
                        'Não deu para consultar o CEP agora — pode preencher a cidade à mão e seguir.'}
                      {(estadoCep === 'ok' || estadoCep === 'fora_da_malha') &&
                        'Cidade preenchida pelo CEP. Se estiver errada, é só corrigir abaixo.'}
                      {!estadoCep && 'O CEP preenche seu endereço e acerta a rota e o frete da entrega.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A5D4E] uppercase tracking-wider mb-1.5">
                      CPF *
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      required
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={14}
                      value={dados.cpf}
                      onChange={handleCpf}
                      placeholder="000.000.000-00"
                      aria-describedby="aviso-cpf"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#E0E2D9] text-sm focus:outline-none focus:border-[#D4A373]"
                    />
                    <p id="aviso-cpf" className="font-sans text-[0.7rem] mt-1.5 mb-0 leading-snug text-[#5A635C]">
                      A nota fiscal e a GTA saem no nome de quem recebe a ave — o CPF é o que
                      permite emitir as duas.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_110px] gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A5D4E] uppercase tracking-wider mb-1.5">
                      Endereço (opcional)
                    </label>
                    <input
                      type="text"
                      name="endereco"
                      autoComplete="address-line1"
                      value={dados.endereco}
                      onChange={handleChange}
                      placeholder="Preenchido pelo CEP"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#E0E2D9] text-sm focus:outline-none focus:border-[#D4A373]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A5D4E] uppercase tracking-wider mb-1.5">
                      Número *
                    </label>
                    <input
                      type="text"
                      name="numero"
                      required
                      maxLength={10}
                      value={dados.numero}
                      onChange={handleChange}
                      placeholder="nº"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#E0E2D9] text-sm focus:outline-none focus:border-[#D4A373]"
                    />
                  </div>
                </div>

                <p className="font-sans text-[0.7rem] text-[#5A635C] -mt-2 mb-0 leading-snug">
                  O CEP preenche a rua; o número da casa é o único pedaço que só você sabe — ele
                  sai na nota fiscal. Complemento e bairro ficam para a formalização.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-[#4A5D4E] uppercase tracking-wider mb-1.5">
                    Cidade / UF *
                  </label>
                  <CidadeInput
                    value={dados.cidade_uf}
                    onChange={(cidadeUf, faixa) => {
                      setDados((prev) => ({ ...prev, cidade_uf: cidadeUf }));
                      setFaixaRota(faixa);
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A5D4E] uppercase tracking-wider mb-1.5">
                    Forma de recebimento *
                  </label>
                  <select
                    name="forma_recebimento"
                    required
                    value={dados.forma_recebimento}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#E0E2D9] text-sm bg-white focus:outline-none focus:border-[#D4A373]"
                  >
                    <option value="">Selecione</option>
                    <option value="Retirada no ponto oficial">
                      Retirada no ponto oficial (Atacadão Parelheiros — SP)
                    </option>
                    {/* Língua do cliente (28/08/2026): a rota herda a tabela de zonas; individual e aéreo
                        declaram "sob consulta" — o preço honesto colado em cada opção, nunca subentendido. */}
                    <option value="Entrega na rota">Entrega na rota — o frete da tabela abaixo</option>
                    <option value="Entrega individual (expressa)">
                      Entrega individual (expressa) — viagem só sua, valor sob consulta
                    </option>
                    <option value="Aéreo">Aéreo — sob consulta</option>
                    <option value="A definir na conversa">A definir na conversa</option>
                  </select>
                </div>

                {/* FRETE — linha separada, FORA do total de referência */}
                <div className="rounded-2xl border border-[#E0E2D9] bg-[#FAFBF8] p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h4 className="font-sans text-[0.72rem] uppercase tracking-wider text-[#5A635C] m-0">
                      Frete
                    </h4>
                    <span className="font-sans text-[0.65rem] uppercase tracking-wider text-[#C1732B] font-bold">
                      não entra no total
                    </span>
                  </div>

                  {dados.forma_recebimento === 'Retirada no ponto oficial' ? (
                    <p className="font-sans text-sm text-[#4A5D4E] font-bold m-0">
                      R$ 0 — você retira no ponto oficial (Atacadão Parelheiros — SP).
                    </p>
                  ) : dados.forma_recebimento === 'Aéreo' ? (
                    <p className="font-sans text-sm text-[#4A5D4E] font-bold m-0">
                      Solicitar cotação — voo com nota fiscal e GTA (GOLLOG/LATAM).
                    </p>
                  ) : (
                    <>
                      {zonaDoCliente && (
                        <div className="rounded-xl border border-[#C1732B] bg-white px-3 py-2.5 mb-3">
                          <p className="font-sans text-[0.65rem] uppercase tracking-wider text-[#C1732B] font-bold m-0">
                            Sua cidade
                          </p>
                          <p className="font-sans text-sm text-[#2D3436] mt-1 mb-0">
                            <strong className="text-[#4A5D4E]">{zonaDoCliente.tarifaTexto}</strong>{' · '}
                            {zonaDoCliente.rotulo}
                          </p>
                          <p className="font-sans text-[0.7rem] text-[#5A635C] mt-1 mb-0 leading-snug">
                            {zonaDoCliente.prazo}.
                          </p>
                        </div>
                      )}
                      <ul className="list-none p-0 m-0 space-y-1">
                        {FRETE.map((z) => (
                          <li
                            key={z.n}
                            className={
                              'flex justify-between gap-3 font-sans text-[0.82rem] ' +
                              (zonaDoCliente?.n === z.n ? 'text-[#2D3436] font-bold' : 'text-[#5A635C]')
                            }
                          >
                            <span>{z.rotulo}</span>
                            <span className="whitespace-nowrap">{z.tarifaTexto}</span>
                          </li>
                        ))}
                        <li className="flex justify-between gap-3 font-sans text-[0.82rem] text-[#5A635C]">
                          <span>{RETIRADA.rotulo}</span>
                          <span className="whitespace-nowrap">{RETIRADA.tarifaTexto}</span>
                        </li>
                      </ul>
                    </>
                  )}

                  <p className="font-sans text-[0.7rem] text-[#5A635C] mt-2 mb-0 leading-snug">
                    {zonaDoCliente
                      ? 'O valor exato é confirmado na conversa consultiva, antes de qualquer pagamento.'
                      : 'Escolha sua cidade acima e o frete da sua zona aparece aqui. O valor exato é confirmado na conversa consultiva, antes de qualquer pagamento.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A5D4E] uppercase tracking-wider mb-1.5">
                    Observações (opcional)
                  </label>
                  <textarea
                    name="observacoes"
                    value={dados.observacoes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Conte seu objetivo com as aves e sua estrutura atual (lâmina d'água, recinto, área verde), se quiser."
                    className="w-full px-4 py-2.5 rounded-lg border border-[#E0E2D9] text-sm focus:outline-none focus:border-[#D4A373]"
                  ></textarea>
                </div>

                {/* Confirmação de maioridade. A nota fiscal e a GTA são emitidas no nome de
                    quem recebe a ave, então quem faz o pedido precisa poder assiná-las. */}
                <label className="flex items-start gap-2.5 cursor-pointer bg-[#F8F9F5] border border-[#E0E2D9] rounded-xl px-4 py-3">
                  <input
                    type="checkbox"
                    name="maior_idade"
                    checked={maiorIdade}
                    onChange={(e) => setMaiorIdade(e.target.checked)}
                    className="mt-0.5 w-4 h-4 flex-none accent-[#4A5D4E]"
                  />
                  <span className="text-xs text-[#4A5D4E] font-sans leading-relaxed">
                    Confirmo que tenho 18 anos ou mais. A nota fiscal e a GTA são emitidas no nome
                    de quem recebe a ave.
                  </span>
                </label>

                <p className="text-xs text-[#5A635C] font-sans leading-relaxed">
                  Ao enviar, você concorda que a Aves Arca use seus dados (nome, telefone, e-mail
                  e endereço de entrega) apenas para o atendimento da sua reserva. Não vendemos nem
                  repassamos esses dados, e não enviamos mensagens sem que você inicie o contato.
                  Este site usa medição de audiência da Meta (Facebook), que registra a navegação de
                  forma anônima — sem o seu nome, telefone, e-mail ou endereço.{' '}
                  <a
                    href={CAMINHOS.privacidade}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) {
                        onNavigate('privacidade');
                      } else {
                        window.location.hash = 'privacidade';
                      }
                    }}
                    className="text-[#4A5D4E] font-semibold underline"
                  >
                    Saiba mais
                  </a>
                </p>

                {erroValidacao && (
                  <div className="bg-[#FBEDE9] border border-[#B4462F] text-[#B4462F] p-3 rounded-xl flex items-start gap-2 text-xs font-medium">
                    <AlertTriangle className="w-4 h-4 flex-none mt-0.5" />
                    <span>{erroValidacao}</span>
                  </div>
                )}

                {estado === 'falhou' && (
                  <div className="bg-[#FBEDE9] border border-[#B4462F] text-[#B4462F] p-4 rounded-xl text-xs font-medium">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 flex-none mt-0.5" />
                      <span>
                        Não conseguimos registrar sua pré-reserva agora. Nada foi salvo — não considere a
                        pré-reserva feita. Tente de novo em instantes ou mande a lista direto pelo
                        WhatsApp.
                      </span>
                    </div>
                    <a
                      href={`${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent(
                        `Olá! Tentei enviar uma pré-reserva pelo site e não foi. Minha pré-reserva:\n${montarResumo()}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-wa text-xs py-2 px-4 mt-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Enviar pelo WhatsApp
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={estado === 'enviando'}
                  className={`btn btn-gold text-sm py-3 px-6 w-full justify-center ${
                    estado === 'enviando' ? 'opacity-60 cursor-wait' : ''
                  }`}
                >
                  {estado === 'enviando' ? 'Registrando pré-reserva…' : 'Enviar pré-reserva'}
                </button>

                <p className="text-center text-xs text-[#5A635C] mt-2 font-sans">
                  Prefere falar antes?{' '}
                  <a
                    href={waComOrigem('pre-reserva')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4A5D4E] font-bold underline"
                  >
                    Chame no WhatsApp
                  </a>{' '}
                  — respondemos com calma, sem pressa. Se preferir e-mail:{' '}
                  <a href={`mailto:${CONSTANTS.EMAIL}`} className="text-[#4A5D4E] underline">
                    {CONSTANTS.EMAIL}
                  </a>
                  .
                </p>
              </form>
            </>
          )}
        </div>
      </section>
  );

  return (
    <div>
      {/* 27/08/2026: com o carrinho cheio, o pedido vem primeiro. Antes era preciso rolar
          por cinco blocos institucionais para chegar ao proprio carrinho — 26 pessoas
          abriram esta pagina no dia 26/08 e 6 enviaram. */}
      {totalLinhas > 0 && blocoPedido}

      {/* HERO SECTION */}
      <section className="hero-section py-16 sm:py-24">
        <div className="wrap">
          <div className="eyebrow">Pré-reserva · Temporada 2026</div>
          <h1 className="font-serif font-semibold text-3xl sm:text-5xl leading-[1.15] mb-5 max-w-2xl text-[#4A5D4E]">
            Reserve a ave certa, com procedência — antes de correr atrás dela.
          </h1>
          <p className="font-serif text-lg sm:text-xl max-w-3xl text-[#5A635C] mb-8 leading-relaxed">
            Pela primeira vez, você pode reservar com antecedência um exemplar de procedência da Aves Arca — nascido no plantel, com documentação, sanidade e curadoria. <strong className="text-[#4A5D4E]">A reserva é gratuita: você garante seu lugar na fila e só paga na entrega, com a ave e a documentação conferidas.</strong>
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#reservar" className="btn btn-gold text-base px-7 py-3.5 shadow-md">
              Fazer minha pré-reserva
            </a>
            <a href="#como" className="btn btn-ghost text-base px-7 py-3.5">
              Como funciona
            </a>
          </div>
        </div>
      </section>

      {/* O QUE É A PRÉ-RESERVA */}
      <section className="py-16 bg-white">
        <div className="wrap text-center">
          <h2 className="sec-title center">O que é a pré-reserva</h2>
          <p className="sec-sub mx-auto">
            Não é venda de pronta-entrega. É garantir seu lugar na fila de uma variedade da próxima temporada (nascimentos de setembro a dezembro; entrega no ciclo seguinte), com a curadoria da Aves Arca desde o início.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-8">
            <div className="card-item">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFBF8] flex items-center justify-center text-[#4A5D4E] mb-4 border border-[#E0E2D9]">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mb-2 font-semibold">Seu lugar na fila</h3>
              <p className="font-serif text-[1rem] text-[#5A635C]">
                A pré-reserva garante a variedade e o nível que você escolheu e trava a curadoria daquele exemplar para você.
              </p>
            </div>

            <div className="card-item">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFBF8] flex items-center justify-center text-[#D4A373] mb-4 border border-[#E0E2D9]">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mb-2 font-semibold">Sem pagamento antecipado</h3>
              <p className="font-serif text-[1rem] text-[#5A635C]">
                Você não paga nada para reservar. O pagamento acontece só na entrega/retirada, com a ave e toda a documentação conferidas. Reserva é compromisso de curadoria, não cobrança.
              </p>
            </div>

            <div className="card-item">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFBF8] flex items-center justify-center text-[#4A5D4E] mb-4 border border-[#E0E2D9]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mb-2 font-semibold">Procedência documentada</h3>
              <p className="font-serif text-[1rem] text-[#5A635C]">
                Exemplar nascido no plantel, com registro e documentação de origem e trânsito — nota fiscal e GTA (Guia de Trânsito Animal).
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            <span className="badge-tier badge-bronze">Iniciante</span>
            <span className="badge-tier badge-prata">Intermediário</span>
            <span className="badge-tier badge-ouro">Avançado</span>
            <span className="badge-tier badge-diamante">Raridades</span>
          </div>
          <p className="font-serif text-sm text-[#5A635C] mt-2">
            {TOTAL_VARIEDADES} variedades · quatro níveis, do iniciante ao especialista.
          </p>
        </div>
      </section>

      {/* CONDICOES / HONESTIDADE */}
      <section className="py-14 bg-[#FAFBF8] border-y border-[#E0E2D9]">
        <div className="wrap max-w-4xl">
          <h2 className="sec-title text-2xl font-semibold text-[#4A5D4E] mb-6">
            Nossas condições, sem letra miúda
          </h2>

          <div className="space-y-4">
            <div className="note-callout my-0">
              <strong className="text-[#4A5D4E]">1. Sem pagamento antecipado:</strong> Você não transfere dinheiro para reservar. Muitos golpes no mercado pedem pagamento e somem; aqui é o contrário — o pagamento só acontece na entrega, com tudo conferido.
            </div>

            <div className="note-callout my-0">
              <strong className="text-[#4A5D4E]">2. Sem escassez fabricada:</strong> aqui não há cronômetro, "só hoje" nem contador de estoque inventado. A disponibilidade real é a que informamos — a Aves Arca converte reputação técnica em receita previsível, sem a lógica de venda fácil.
            </div>

            <div className="note-callout my-0">
              <strong className="text-[#4A5D4E]">3. Compra saudável:</strong> antes de confirmar, validamos juntos estrutura (água, área seca, refúgio, separação), logística e objetivo. A venda só avança quando é boa para você e para a ave.
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA EM 4 PASSOS */}
      <section id="como" className="py-16 bg-white">
        <div className="wrap">
          <h2 className="sec-title center">Como funciona, em 4 passos</h2>

          <div className="max-w-2xl mx-auto mt-8 space-y-6 font-serif">
            <div className="flex gap-4 items-start">
              <div className="flex-none w-9 h-9 rounded-full bg-[#4A5D4E] text-white font-serif font-bold text-lg flex items-center justify-center">
                1
              </div>
              <div className="pt-0.5">
                <strong className="text-lg text-[#4A5D4E]">Escolha</strong>
                <p className="text-sm text-[#5A635C] font-sans">Selecione a variedade e o nível de interesse no nosso catálogo.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-none w-9 h-9 rounded-full bg-[#4A5D4E] text-white font-serif font-bold text-lg flex items-center justify-center">
                2
              </div>
              <div className="pt-0.5">
                <strong className="text-lg text-[#4A5D4E]">Preencha</strong>
                <p className="text-sm text-[#5A635C] font-sans">Seus dados, a espécie/variedade, o nível e a forma de recebimento desejada.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-none w-9 h-9 rounded-full bg-[#4A5D4E] text-white font-serif font-bold text-lg flex items-center justify-center">
                3
              </div>
              <div className="pt-0.5">
                <strong className="text-lg text-[#4A5D4E]">Conversa consultiva</strong>
                <p className="text-sm text-[#5A635C] font-sans">Pelo WhatsApp, validamos estrutura, aptidão e logística com toda calma.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-none w-9 h-9 rounded-full bg-[#4A5D4E] text-white font-serif font-bold text-lg flex items-center justify-center">
                4
              </div>
              <div className="pt-0.5">
                <strong className="text-lg text-[#4A5D4E]">Confirmação</strong>
                <p className="text-sm text-[#5A635C] font-sans">Pré-reserva confirmada e curadoria do seu exemplar travada.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONFERENCIA DO PEDIDO — com o carrinho vazio segue aqui, depois da explicacao. */}
      {totalLinhas === 0 && blocoPedido}
    </div>
  );
};
