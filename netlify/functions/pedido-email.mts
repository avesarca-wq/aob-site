/**
 * AVISO DE PEDIDO NOVO — e-mail formatado (a "máscara" pedida pelo Ricardo em 07/08/2026).
 *
 * POR QUE EXISTE
 * A notificação nativa da Netlify despeja os campos crus, um embaixo do outro, com o nome
 * técnico do campo virando título ("Cidade Uf", "Pedido Json"), o total como "59950" e o
 * assunto sem nenhum dado do pedido — a Netlify só aceita %{formName}, %{siteName} e
 * %{submissionId} no assunto, nunca o valor de um campo. Fonte: docs.netlify.com/manage/forms/notifications.
 * Esta função assume o aviso: monta um e-mail legível, com o pedido em tabela, o total em
 * reais e os botões de resposta (WhatsApp e e-mail) já prontos.
 *
 * COMO É DISPARADA
 * Evento `formSubmitted` da Netlify — roda a cada envio verificado, dos dois formulários.
 * Não tem endereço público: ninguém consegue chamar de fora para disparar e-mail falso.
 *
 * O QUE PRECISA ESTAR CONFIGURADO (Netlify → Project configuration → Environment variables)
 *   RESEND_API_KEY     obrigatória. Chave da conta do Ricardo no Resend. NÃO fica no código.
 *   EMAIL_DESTINO      opcional. Padrão: avesarca@gmail.com
 *   EMAIL_REMETENTE    opcional. Padrão: remetente de teste do Resend, que só entrega no
 *                      e-mail dono da conta. Para escrever ao CLIENTE é obrigatório trocar
 *                      por um endereço do domínio verificado (ex.: Aves Arca <contato@avesarca.com.br>).
 *   CONFIRMA_CLIENTE   opcional. "1" liga o e-mail de confirmação para o cliente. Só ligar
 *                      DEPOIS de verificar o domínio no Resend — remetente genérico cai em spam.
 *
 *   HUBSPOT_TOKEN     opcional. Token de um Private App do HubSpot com escrita em contatos e
 *                     negócios. SEM ELE a integração do CRM é simplesmente pulada, sem erro.
 *                     NÃO fica no código.
 *
 * Sem dependência nenhuma: usa fetch nativo do Node 22.
 */

const RESEND_API = 'https://api.resend.com/emails';
const HUBSPOT_API = 'https://api.hubapi.com';

/** Funil e estágio conferidos na conta em 01/09/2026 (accountId 51712225). */
const HS_PIPELINE = 'default'; // "Funil Aves Arca"
const HS_ESTAGIO = 'presentationscheduled'; // "Pré-reserva confirmada"

const COR = {
  teal: '#14504B',
  ambar: '#C1732B',
  areia: '#F1EBDD',
  grafite: '#17282A',
  cinza: '#5A635C',
  borda: '#E0E2D9',
  papel: '#FAFBF8',
};

interface Linha {
  nome?: string;
  tier?: string;
  sexo?: string;
  quantidade?: number;
  valorUnitario?: number;
  /** true quando a linha nasceu da divisão de um casal (o cliente escolheu "casal"). */
  de_casal?: boolean;
}

const NIVEL: Record<string, string> = {
  Bronze: 'Iniciante',
  Prata: 'Intermediário',
  Ouro: 'Avançado',
  Diamante: 'Raridades',
};

/** Nunca interpolar texto de terceiro em HTML sem escapar. */
const esc = (v: unknown): string =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const brl = (n: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

/** Telefone digitado por gente vira número de WhatsApp. "(11) 9 7293-1857" → 5511972931857 */
function paraWhatsApp(bruto: string): string {
  const so = String(bruto || '').replace(/\D/g, '');
  if (!so) return '';
  if (so.startsWith('55') && so.length >= 12) return so;
  if (so.length === 10 || so.length === 11) return `55${so}`;
  return so;
}

/**
 * Junta o endereço numa linha só, pulando o que veio vazio. Na pré-reserva o endereço é
 * OPCIONAL — o obrigatório é o CEP —, então quase sempre vem parcial. Uma linha limpa
 * ("Rua X, 123 — Bairro") lê melhor que quatro campos com metade em branco.
 */
function enderecoCompleto(d: Record<string, string>): string {
  const rua = [d.endereco, d.numero].filter(Boolean).join(', ');
  const resto = [d.complemento, d.bairro].filter(Boolean).join(' · ');
  return [rua, resto].filter(Boolean).join(' — ');
}

function quebrasParaHtml(txt: string): string {
  return esc(txt).replace(/\n/g, '<br />');
}

/* ------------------------------------------------------------------ blocos */

function botao(href: string, rotulo: string, fundo: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;margin:0 8px 8px 0;">
  <tr><td align="center" bgcolor="${fundo}" style="border-radius:8px;">
    <a href="${href}" style="display:inline-block;padding:12px 22px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">${esc(rotulo)}</a>
  </td></tr>
</table>`;
}

function linhaDado(rotulo: string, valor: string, destaque = false): string {
  if (!valor) return '';
  return `<tr>
  <td style="padding:7px 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:${COR.cinza};white-space:nowrap;vertical-align:top;width:38%;">${esc(rotulo)}</td>
  <td style="padding:7px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:${COR.grafite};${destaque ? `font-weight:bold;color:${COR.teal};` : ''}">${valor}</td>
</tr>`;
}

function tabelaPedido(linhas: Linha[], resumoTexto: string, total: number): string {
  if (!linhas.length) {
    return resumoTexto
      ? `<div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${COR.grafite};line-height:1.7;">${quebrasParaHtml(resumoTexto)}</div>`
      : '';
  }

  const corpo = linhas
    .map((l) => {
      const qtd = Number(l.quantidade) || 0;
      const un = Number(l.valorUnitario) || 0;
      const nivel = NIVEL[String(l.tier)] || l.tier || '';
      return `<tr>
  <td style="padding:10px 8px 10px 0;border-bottom:1px solid ${COR.borda};font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:${COR.teal};white-space:nowrap;vertical-align:top;">${qtd}×</td>
  <td style="padding:10px 8px;border-bottom:1px solid ${COR.borda};font-family:Georgia,serif;font-size:15px;color:${COR.grafite};">
    ${esc(l.nome)}<br />
    <span style="font-family:Helvetica,Arial,sans-serif;font-size:11px;color:${COR.cinza};">${esc(l.sexo || '')}${nivel ? ` · ${esc(nivel)}` : ''} · ref. ${brl(un)}/un</span>${
      l.de_casal
        ? `&nbsp;·&nbsp;<span style="display:inline-block;margin-left:6px;padding:1px 6px;border-radius:8px;background:${COR.areia};border:1px solid ${COR.ambar};font-family:Helvetica,Arial,sans-serif;font-size:10px;color:${COR.ambar};">do casal</span>`
        : ''
    }
  </td>
  <td align="right" style="padding:10px 0 10px 8px;border-bottom:1px solid ${COR.borda};font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:${COR.grafite};white-space:nowrap;vertical-align:top;">${brl(qtd * un)}</td>
</tr>`;
    })
    .join('');

  const aves = linhas.reduce((s, l) => s + (Number(l.quantidade) || 0), 0);
  // Conta variedades distintas: o casal vira duas linhas (de_casal) e nao pode contar como duas.
  const variedades = new Set(linhas.map((l) => l.nome)).size;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  ${corpo}
  <tr>
    <td colspan="2" style="padding:14px 8px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${COR.cinza};">
      ${variedades} ${variedades === 1 ? 'variedade' : 'variedades'} · ${aves} ${aves === 1 ? 'ave' : 'aves'}<br />
      <span style="font-size:11px;">valor de referência do catálogo, sem frete</span>
    </td>
    <td align="right" style="padding:14px 0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:bold;color:${COR.teal};white-space:nowrap;">${brl(total)}</td>
  </tr>
</table>`;
}

/* ---------------------------------------------------------------- entrega */

/**
 * Quando a entrega sai, por rótulo de zona. Espelha o campo "prazo" de src/data/zonas.ts.
 * Duplicado aqui de propósito: esta função é empacotada sozinha pela Netlify, e importar
 * src/data/zonas arrastaria cidades.ts inteiro para dentro do bundle. Se a zona for
 * renomeada lá, a linha "Quando sai" simplesmente some — degrada em silêncio, nunca mente.
 */
const PRAZO_POR_ZONA: Record<string, string> = {
  'ABC e Grande São Paulo': 'Data combinada direto, sem esperar a rota fechar',
  'Interior próximo, Vale e Baixada': 'Sai quando a rota da sua região fecha',
  'Rotas longas': 'Sai quando a rota da sua região fecha',
  'Encontro na rota': 'Combinado na cidade da rota mais próxima',
  'Fora da malha terrestre': 'Combinado caso a caso',
};

interface Entrega {
  modo: 'retirada' | 'aereo' | 'terrestre';
  zona: string;
  chip: string;
  freteTexto: string;
  freteValor: number | null;
  quando: string;
}

/**
 * O que o cliente paga de entrega e quando ela sai. Lê frete_zona/frete_valor, que o
 * formulário manda desde 24/08/2026 e que este e-mail nunca imprimiu — o defeito que
 * apareceu nos três primeiros pedidos reais, em 26/08/2026.
 *
 * NÃO usar faixa_rota para isto: é o agrupamento operacional das rotas e diz
 * "Entrega rápida (Grande São Paulo)" para Caraguatatuba e para Paulínia.
 */
function entregaDoPedido(d: Record<string, string>): Entrega {
  const forma = d.forma_recebimento || '';

  if (forma.startsWith('Retirada')) {
    return {
      modo: 'retirada',
      zona: '',
      chip: 'Retirada no ponto oficial',
      freteTexto: 'sem frete',
      freteValor: 0,
      quando: 'Data da retirada combinada no WhatsApp',
    };
  }

  if (forma.startsWith('Aéreo')) {
    return {
      modo: 'aereo',
      zona: 'Frete aéreo',
      chip: 'Frete aéreo · sob consulta',
      freteTexto: 'Sob consulta',
      freteValor: null,
      quando: 'Combinado caso a caso',
    };
  }

  /**
   * Entrega individual (28/08/2026): viagem dedicada, fora da tabela de zonas.
   * O frete NUNCA herda o valor da rota — é combinado na conversa, e o e-mail diz isso.
   */
  if (forma.startsWith('Entrega individual')) {
    return {
      modo: 'terrestre',
      zona: d.frete_zona || '',
      chip: 'Entrega individual (expressa) · sob consulta',
      freteTexto: 'Sob consulta — viagem dedicada',
      freteValor: null,
      quando: 'Data combinada direto, sem esperar a rota fechar',
    };
  }

  const zona = d.frete_zona || '';
  const texto = d.frete_valor || 'Sob consulta';
  const numero = Number(String(texto).replace(/[^0-9]/g, ''));
  const valor = Number.isFinite(numero) && numero > 0 ? numero : null;

  return {
    modo: 'terrestre',
    zona,
    chip: zona ? `${zona} · ${texto}` : '',
    freteTexto: texto,
    freteValor: valor,
    quando: PRAZO_POR_ZONA[zona] || '',
  };
}

/** Linhas <tr> da entrega, para ir dentro de uma tabela de linhaDado. */
function linhasEntrega(e: Entrega, totalAves: number): string {
  const cabecalho =
    e.modo === 'retirada'
      ? linhaDado('Entrega', 'Retirada no ponto oficial — <strong>sem frete</strong>', true)
      : linhaDado(
          'Zona de entrega',
          e.zona ? esc(e.zona) : '<span style="color:#B4462F;">não resolvida</span>'
        ) +
        linhaDado('Frete', `<strong>${esc(e.freteTexto)}</strong> · por viagem, não por ave`, true);

  const quando = e.quando ? linhaDado('Quando sai', esc(e.quando)) : '';

  const total =
    e.freteValor === null
      ? `${brl(totalAves)} <span style="font-weight:normal;">+ frete a combinar</span>`
      : brl(totalAves + e.freteValor);

  return cabecalho + quando + linhaDado('Total com entrega', `<strong>${total}</strong>`, true);
}

/* ------------------------------------------------------- e-mail do Ricardo */

function emailPedido(d: Record<string, string>) {
  let linhas: Linha[] = [];
  try {
    const bruto = JSON.parse(d.pedido_json || '[]');
    if (Array.isArray(bruto)) linhas = bruto;
  } catch {
    /* pedido_json corrompido não pode impedir o aviso: cai no resumo em texto */
  }

  const total = Number(d.total_referencia) || 0;
  const entrega = entregaDoPedido(d);
  const codigo = d.codigo || 'sem código';
  const zap = paraWhatsApp(d.whatsapp || '');
  const saudacao = `Olá ${String(d.nome || '').split(' ')[0] || ''}! Aqui é o Ricardo, da Aves Arca. Recebi sua pré-reserva ${codigo}. Posso te chamar agora para conferirmos os detalhes?`;

  const acoes = [
    zap ? botao(`https://wa.me/${zap}?text=${encodeURIComponent(saudacao)}`, 'Responder no WhatsApp', '#25D366') : '',
    d.email ? botao(`mailto:${encodeURIComponent(d.email)}?subject=${encodeURIComponent(`Sua pré-reserva ${codigo} — Aves Arca`)}`, 'Responder por e-mail', COR.teal) : '',
  ]
    .filter(Boolean)
    .join('');

  const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Pedido ${esc(codigo)}</title></head>
<body style="margin:0;padding:0;background:${COR.areia};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COR.areia};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid ${COR.borda};">

  <tr><td style="background:${COR.teal};padding:22px 28px;">
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${COR.ambar};font-weight:bold;">Aves Arca · pedido novo no site</div>
    <div style="font-family:Georgia,serif;font-size:30px;font-weight:bold;color:#ffffff;padding-top:6px;letter-spacing:.02em;">${esc(codigo)}</div>
  </td></tr>

  <tr><td style="padding:26px 28px 6px;">
    <div style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:${COR.teal};">${esc(d.nome || 'sem nome')}</div>
      <div style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${COR.cinza};padding-top:4px;">${esc(d.cidade_uf || '—')}${entrega.chip ? ` · ${esc(entrega.chip)}` : ''}</div>
  </td></tr>

  <tr><td style="padding:14px 28px 0;">
    ${acoes}
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;color:${COR.cinza};padding-top:4px;">Meta de primeira resposta: 15 minutos em horário comercial.</div>
  </td></tr>

  <tr><td style="padding:22px 28px 0;">
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${COR.ambar};font-weight:bold;padding-bottom:6px;">O pedido</div>
    <div style="background:${COR.papel};border:1px solid ${COR.borda};padding:16px 18px;">
      ${tabelaPedido(linhas, d.pedido_resumo || '', total)}
    </div>
  </td></tr>

  <tr><td style="padding:22px 28px 0;">
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${COR.ambar};font-weight:bold;padding-bottom:2px;">Contato e logística</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${linhaDado('WhatsApp', zap ? `<a href="https://wa.me/${zap}" style="color:${COR.teal};text-decoration:none;font-weight:bold;">${esc(d.whatsapp)}</a>` : esc(d.whatsapp || ''))}
      ${linhaDado('E-mail', d.email ? `<a href="mailto:${esc(d.email)}" style="color:${COR.teal};">${esc(d.email)}</a>` : '<span style="color:#B4462F;">não informado</span>')}
      ${linhaDado('CPF', d.cpf ? `<strong>${esc(d.cpf)}</strong>` : '<span style="color:#B4462F;">não informado — pedir na conversa; a NF e a GTA saem no nome de quem recebe</span>')}
      ${linhaDado('CEP', d.cep ? esc(d.cep) : '<span style="color:#B4462F;">não informado</span>')}
      ${linhaDado('Endereço', esc(enderecoCompleto(d)))}
      ${linhaDado('Cidade / UF', esc(d.cidade_uf || ''))}
      ${linhasEntrega(entrega, total)}
      ${linhaDado('Como quer receber', esc(d.forma_recebimento || ''), true)}
      ${linhaDado('Como pretende pagar', d.forma_pagamento ? esc(d.forma_pagamento) : 'a definir na conversa')}
      ${linhaDado('Cupom', d.cupom ? `<strong style="color:${COR.ambar};">${esc(d.cupom)}</strong> — conferir a campanha antes de aplicar` : '')}
      ${linhaDado(
        'Maior de 18 anos',
        d.maior_idade === 'sim'
          ? 'confirmado no formulário'
          : '<span style="color:#B4462F;">não confirmado — confirmar antes de fechar</span>'
      )}
    </table>
  </td></tr>

  ${
    d.observacoes
      ? `<tr><td style="padding:20px 28px 0;">
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${COR.ambar};font-weight:bold;padding-bottom:6px;">O que ele escreveu</div>
    <div style="border-left:3px solid ${COR.ambar};padding:2px 0 2px 14px;font-family:Georgia,serif;font-size:15px;color:${COR.grafite};line-height:1.6;">${quebrasParaHtml(d.observacoes)}</div>
  </td></tr>`
      : ''
  }

  <tr><td style="padding:22px 28px 26px;">
    <div style="border-top:1px solid ${COR.borda};padding-top:14px;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:${COR.cinza};line-height:1.7;">
      <strong style="color:${COR.grafite};">De onde veio:</strong> ${esc(d.origem || 'não registrado')}<br />
        <strong style="color:${COR.grafite};">Rota operacional (interno):</strong> ${d.faixa_rota ? esc(d.faixa_rota) : 'não resolvida'} — agrupamento da viagem, não é o que o cliente paga.<br />
      Pré-reserva sem pagamento antecipado — o ganho só entra no placar quando a venda for paga na entrega.
    </div>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;

  const texto = [
    `PEDIDO NOVO — ${codigo}`,
    `${d.nome || 'sem nome'} · ${d.cidade_uf || '—'}${entrega.chip ? ` · ${entrega.chip}` : ''}`,
    `WhatsApp: ${d.whatsapp || '—'} · E-mail: ${d.email || '—'}`,
    `CPF: ${d.cpf || '— não informado, pedir na conversa'}`,
    `CEP: ${d.cep || '—'}`,
    enderecoCompleto(d) ? `Endereço: ${enderecoCompleto(d)}` : '',
    `Recebimento: ${d.forma_recebimento || '—'}`,
    entrega.modo === 'retirada'
      ? 'Entrega: retirada no ponto oficial — sem frete'
      : `Entrega: ${entrega.zona || 'zona não resolvida'} · frete ${entrega.freteTexto}${entrega.quando ? ` · ${entrega.quando}` : ''}`,
    `Pagamento: ${d.forma_pagamento || 'a definir na conversa'}`,
    d.cupom ? `Cupom: ${d.cupom}` : '',
    d.maior_idade === 'sim'
      ? 'Maior de 18: confirmado no formulário'
      : 'Maior de 18: NÃO confirmado — confirmar antes de fechar',
    '',
    d.pedido_resumo || '',
    '',
    `Total de referência: ${brl(total)}`,
    entrega.freteValor === null
      ? `Total com entrega: ${brl(total)} + frete a combinar`
      : `Total com entrega: ${brl(total + entrega.freteValor)}`,
    d.observacoes ? `\nObservações: ${d.observacoes}` : '',
    `\nDe onde veio: ${d.origem || 'não registrado'}`,
    `Rota operacional (interno): ${d.faixa_rota || 'não resolvida'}`,
  ].join('\n');

  const assunto = `PEDIDO ${codigo} · ${d.nome || 'sem nome'} · ${d.cidade_uf || '—'} · ${brl(total)}`;

  return { assunto, html, texto, respostaPara: d.email || undefined };
}

/* --------------------------------------------------- e-mail da lista de espera */

function emailListaEspera(d: Record<string, string>) {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8" /></head>
<body style="margin:0;background:${COR.areia};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COR.areia};padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid ${COR.borda};">
  <tr><td style="background:${COR.teal};padding:20px 28px;">
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${COR.ambar};font-weight:bold;">Aves Arca · lista de espera</div>
    <div style="font-family:Georgia,serif;font-size:24px;font-weight:bold;color:#ffffff;padding-top:6px;">${esc(d.nome || 'sem nome')}</div>
  </td></tr>
  <tr><td style="padding:24px 28px 26px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${linhaDado('Contato', esc(d.contato || ''), true)}
      ${linhaDado('Interesse', esc(d.interesse || ''))}
      ${linhaDado('De onde veio', esc(d.origem || 'não registrado'))}
    </table>
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;color:${COR.cinza};padding-top:16px;line-height:1.7;">
      Não é pedido: é alguém pedindo para ser avisado. Vale entrar na lista de transmissão, não na abordagem individual.
    </div>
  </td></tr>
</table></td></tr></table></body></html>`;

  return {
    assunto: `LISTA DE ESPERA · ${d.nome || 'sem nome'} · ${d.interesse || 'sem interesse declarado'}`,
    html,
    texto: `LISTA DE ESPERA\n${d.nome || 'sem nome'}\nContato: ${d.contato || '—'}\nInteresse: ${d.interesse || '—'}\nDe onde veio: ${d.origem || 'não registrado'}`,
    respostaPara: undefined as string | undefined,
  };
}

/* ------------------------------------- confirmação para o cliente (desligada) */

function emailCliente(d: Record<string, string>) {
  const codigo = d.codigo || '';
  const total = Number(d.total_referencia) || 0;
  const entrega = entregaDoPedido(d);
  let linhas: Linha[] = [];
  try {
    const bruto = JSON.parse(d.pedido_json || '[]');
    if (Array.isArray(bruto)) linhas = bruto;
  } catch {
    /* idem */
  }

  const contatoWpp = d.whatsapp ? ` pelo WhatsApp ${esc(d.whatsapp)}` : '';

  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8" /></head>
<body style="margin:0;background:${COR.areia};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COR.areia};padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid ${COR.borda};">
  <tr><td style="background:${COR.teal};padding:22px 28px;">
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${COR.ambar};font-weight:bold;">Aves Arca</div>
    <div style="font-family:Georgia,serif;font-size:26px;font-weight:bold;color:#ffffff;padding-top:6px;">Sua pré-reserva foi registrada</div>
  </td></tr>
  <tr><td style="padding:26px 28px 0;font-family:Georgia,serif;font-size:16px;color:${COR.grafite};line-height:1.7;">
    Olá, ${esc(String(d.nome || '').split(' ')[0])}. Recebemos a sua pré-reserva — ela organiza a fila e a rota
    de entrega, não é cobrança e não é compra fechada. Guarde o código abaixo: é por ele que encontramos a sua
    pré-reserva.
  </td></tr>
  <tr><td style="padding:18px 28px 0;">
    <div style="background:${COR.areia};border:1px solid ${COR.ambar};padding:16px;text-align:center;">
      <div style="font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:${COR.cinza};">Código da pré-reserva</div>
      <div style="font-family:Georgia,serif;font-size:28px;font-weight:bold;color:${COR.teal};padding-top:4px;">${esc(codigo)}</div>
    </div>
  </td></tr>
  <tr><td style="padding:22px 28px 0;">
    <div style="background:${COR.papel};border:1px solid ${COR.borda};padding:16px 18px;">${tabelaPedido(linhas, d.pedido_resumo || '', total)}</div>
  </td></tr>
  <tr><td style="padding:20px 28px 0;">
  <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${COR.ambar};font-weight:bold;padding-bottom:2px;">Entrega</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  ${linhasEntrega(entrega, total)}
  </table>
  </td></tr>
  <tr><td style="padding:22px 28px 0;">
    <div style="background:${COR.areia};border-left:4px solid ${COR.ambar};padding:18px 20px;font-family:Georgia,serif;font-size:15px;color:${COR.grafite};line-height:1.7;">
      <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${COR.ambar};font-weight:bold;padding-bottom:8px;">O que é a pré-reserva</div>
      Sua pré-reserva está registrada com o código <strong>${esc(codigo)}</strong>. Ela serve para <strong>organizar a fila e a rota de entrega</strong> — não é cobrança, não é compra fechada, e você não precisa fazer mais nada agora.
      <br /><br />
      <strong style="color:${COR.teal};">1. Este e-mail é o seu comprovante.</strong><br />
      Ele tem o número da pré-reserva, as aves que você escolheu e o valor. Guarde: é por ele que a gente se encontra depois.
      <br /><br />
      <strong style="color:${COR.teal};">2. A sua pré-reserva é das aves da temporada 2026/2027.</strong><br />
      As aves nascem e ficam prontas ao longo da temporada, cada variedade no seu tempo. Conforme as suas ficam disponíveis, nós procuramos você${contatoWpp} para alinhar a efetivação do pedido.
      <br /><br />
      <strong style="color:${COR.teal};">3. A entrega sai por rota, não por pedido.</strong><br />
      As aves viajam em uma rota que nós mesmos organizamos, para chegarem bem. Por isso a viagem para a sua região só sai quando junta um grupo de entregas na mesma direção. É isso que permite cobrar um valor competitivo de frete, em vez do custo de uma viagem inteira por cliente.
      <br /><br />
      <strong style="color:${COR.teal};">4. A data vem quando a rota fecha — e vem de nós.</strong><br />
      Assim que a sua região fechar, nós procuramos você com dia, horário e valor final. Antes disso não existe data: preferimos dizer “ainda não fechou” a marcar um dia e ter que desmarcar.
      <div style="border-top:1px solid ${COR.ambar};margin-top:16px;padding-top:14px;">
        <strong style="color:${COR.teal};">Enquanto isso:</strong> sua vaga não vence e nada é cobrado. Se quiser mudar as aves, mudar o endereço ou desistir, basta responder este e-mail — sem custo e sem constrangimento. Dúvida de qualquer tipo, responda aqui mesmo: a gente lê tudo.
      </div>
    </div>
  </td></tr>
  <tr><td style="padding:22px 28px 26px;font-family:Georgia,serif;font-size:15px;color:${COR.grafite};line-height:1.7;">
    <strong style="color:${COR.teal};">Você não paga nada agora.</strong> A pré-reserva é gratuita; o pagamento acontece só na entrega, com a ave e a documentação conferidas.
    <div style="border-top:1px solid ${COR.borda};margin-top:18px;padding-top:14px;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:${COR.cinza};line-height:1.7;">
      Valores de referência do catálogo, por ave. O frete é por viagem: o mesmo valor leva um casal ou o pedido inteiro. Se não foi você quem fez este pedido, é só ignorar este e-mail.
    </div>
  </td></tr>
</table></td></tr></table></body></html>`;

  return {
    assunto: `Sua pré-reserva ${codigo} foi registrada — Aves Arca`,
    html,
    texto: `Sua pré-reserva ${codigo} foi registrada.\n\n${d.pedido_resumo || ''}\n\nTotal de referência: ${brl(total)}\n\nO QUE É A PRÉ-RESERVA\n\nEla serve para organizar a fila e a rota de entrega - não é cobrança, não é compra fechada, e você não precisa fazer mais nada agora.\n\n1. Este e-mail é o seu comprovante. Ele tem o número da pré-reserva, as aves que você escolheu e o valor.\n\n2. A sua pré-reserva é das aves da temporada 2026/2027. As aves nascem e ficam prontas ao longo da temporada, cada variedade no seu tempo. Conforme as suas ficam disponíveis, nós procuramos você para alinhar a efetivação do pedido.\n\n3. A entrega sai por rota, não por pedido. As aves viajam em uma rota que nós mesmos organizamos, para chegarem bem. Por isso a viagem para a sua região só sai quando junta um grupo de entregas na mesma direção. É isso que permite cobrar um valor competitivo de frete, em vez do custo de uma viagem inteira por cliente.\n\n4. A data vem quando a rota fecha - e vem de nós. Assim que a sua região fechar, nós procuramos você com dia, horário e valor final.\n\nEnquanto isso: sua vaga não vence e nada é cobrado. Se quiser mudar as aves, mudar o endereço ou desistir, basta responder este e-mail. Você não paga nada agora - o pagamento acontece só na entrega.`,
    respostaPara: process.env.EMAIL_DESTINO || 'avesarca@gmail.com',
  };
}

/* ------------------------------------------------------------------ envio */

async function enviar(
  para: string,
  peca: { assunto: string; html: string; texto: string; respostaPara?: string }
): Promise<void> {
  const chave = process.env.RESEND_API_KEY;
  if (!chave) {
    console.error('[pedido-email] RESEND_API_KEY ausente — e-mail NÃO enviado.');
    return;
  }

  const corpo: Record<string, unknown> = {
    from: process.env.EMAIL_REMETENTE || 'Aves Arca <onboarding@resend.dev>',
    to: [para],
    subject: peca.assunto,
    html: peca.html,
    text: peca.texto,
  };
  if (peca.respostaPara) corpo.reply_to = peca.respostaPara;

  const r = await fetch(RESEND_API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  });

  if (!r.ok) {
    // Nunca engolir em silêncio: sem isto, um pedido some sem ninguém saber.
    console.error('[pedido-email] falha no envio', r.status, await r.text());
    return;
  }
  console.log('[pedido-email] enviado para', para, '·', peca.assunto);
}

/* ------------------------------------------------------------------ HubSpot */

/**
 * CRM — cria o contato e o negocio no HubSpot a cada pre-reserva (01/09/2026).
 *
 * POR QUE EXISTE
 * Agosto fechou com 17 pre-reservas vivendo em e-mail e planilha, sem cadencia de follow-up.
 * O funil ja existia na conta (pipeline "Funil Aves Arca") e nunca havia sido alimentado.
 * O negocio nasce direto em "Pre-reserva confirmada", que e a verdade do pedido: tem codigo,
 * itens e valor, e NAO foi pago. O estagio de ganho chama "Pago na entrega" — e o pedido so
 * chega la quando o dinheiro entra.
 *
 * O QUE NAO SOBE: CPF e endereco completo (decisao de 01/09). Ficam no e-mail do pedido e no
 * Bling, que e onde a NF e a GTA precisam deles. O CRM leva nome, telefone, e-mail e cidade/UF.
 *
 * DORMENTE SEM TOKEN: sem HUBSPOT_TOKEN a integracao inteira e pulada, sem erro e sem barulho.
 * E qualquer falha aqui e engolida com log — o CRM NUNCA pode derrubar o aviso do pedido, que e
 * a unica coisa que nao pode faltar quando alguem compra.
 */
async function hs(caminho: string, metodo: string, corpo?: unknown): Promise<any> {
  const r = await fetch(`${HUBSPOT_API}${caminho}`, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  if (!r.ok) throw new Error(`HubSpot ${metodo} ${caminho} -> ${r.status} ${await r.text()}`);
  return r.json();
}

/** Cidade e UF saem do campo unico "Cidade — UF" que o formulario grava. */
function cidadeUf(bruto: string): { cidade: string; uf: string } {
  const [cidade = '', uf = ''] = String(bruto || '').split('—');
  return { cidade: cidade.trim(), uf: uf.trim() };
}

/**
 * Acha o contato por e-mail (ou por telefone, quando o pedido veio sem e-mail) e devolve o id.
 * Cria se nao existir. E o que impede o Evandro, que fez dois pedidos, virar dois contatos.
 */
async function contatoDoCliente(d: Record<string, string>): Promise<string> {
  const email = String(d.email || '').trim().toLowerCase();
  const zap = paraWhatsApp(d.whatsapp || '');
  const telefone = zap ? `+${zap}` : '';

  const filtro = email
    ? { propertyName: 'email', operator: 'EQ', value: email }
    : telefone
      ? { propertyName: 'phone', operator: 'EQ', value: telefone }
      : null;

  if (filtro) {
    const achado = await hs('/crm/v3/objects/contacts/search', 'POST', {
      filterGroups: [{ filters: [filtro] }],
      properties: ['email'],
      limit: 1,
    });
    if (achado?.results?.length) return String(achado.results[0].id);
  }

  const partes = String(d.nome || '').trim().split(/\s+/);
  const { cidade, uf } = cidadeUf(d.cidade_uf);
  const criado = await hs('/crm/v3/objects/contacts', 'POST', {
    properties: {
      firstname: partes[0] || '',
      lastname: partes.slice(1).join(' '),
      ...(email ? { email } : {}),
      ...(telefone ? { phone: telefone } : {}),
      ...(cidade ? { city: cidade } : {}),
      ...(uf ? { state: uf } : {}),
    },
  });
  return String(criado.id);
}

/** Contato + negocio associados, numa chamada de criacao so para o negocio. */
async function criarNoHubSpot(d: Record<string, string>): Promise<void> {
  if (!process.env.HUBSPOT_TOKEN) return;
  try {
    const contatoId = await contatoDoCliente(d);
    const total = Number(d.total_referencia) || 0;
    const entrega = entregaDoPedido(d);
    const codigo = d.codigo || 'sem codigo';

    await hs('/crm/v3/objects/deals', 'POST', {
      properties: {
        dealname: `${codigo} · ${d.nome || 'sem nome'}`,
        amount: String(total),
        pipeline: HS_PIPELINE,
        dealstage: HS_ESTAGIO,
        description: [
          `Pedido ${codigo}`,
          `Origem: ${d.origem || 'nao registrada'}`,
          entrega.modo === 'retirada'
            ? 'Entrega: retirada no ponto oficial, sem frete'
            : `Entrega: ${entrega.zona || 'zona nao resolvida'} · frete ${entrega.freteTexto}`,
          d.pedido_resumo ? `\n${d.pedido_resumo}` : '',
        ]
          .filter(Boolean)
          .join(' · '),
      },
      // associationTypeId 3 = negocio -> contato (padrao do HubSpot).
      associations: [
        {
          to: { id: contatoId },
          types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }],
        },
      ],
    });

    console.log('[hubspot] contato', contatoId, '+ negocio criados para', codigo);
  } catch (e) {
    console.error('[hubspot] falhou — o pedido e o e-mail seguem normais.', e);
  }
}

/* ------------------------------------------------------------------ gatilho */

export default {
  async formSubmitted(event: any) {
    try {
      const dados: Record<string, string> = event?.data ?? event?.payload?.data ?? {};
      const formulario: string =
        event?.formName ?? event?.form_name ?? event?.payload?.form_name ?? dados['form-name'] ?? '';

      const destino = process.env.EMAIL_DESTINO || 'avesarca@gmail.com';
      const ehListaEspera = /lista/i.test(formulario) || (!!dados.interesse && !dados.codigo);

      const peca = ehListaEspera ? emailListaEspera(dados) : emailPedido(dados);
      await enviar(destino, peca);

      // Depois do e-mail, sempre: o aviso do pedido tem prioridade sobre o CRM.
      if (!ehListaEspera) await criarNoHubSpot(dados);

      // Confirmação ao cliente: só depois do domínio verificado no Resend.
      if (
        !ehListaEspera &&
        process.env.CONFIRMA_CLIENTE === '1' &&
        dados.email &&
        /.+@.+\..+/.test(dados.email)
      ) {
        await enviar(dados.email, emailCliente(dados));
      }
    } catch (e) {
      console.error('[pedido-email] erro inesperado', e);
    }
  },
};