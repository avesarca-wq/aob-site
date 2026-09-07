/**
 * AVISO DE PEDIDO NOVO — Aves Ornamentais Brasil.
 *
 * Disparada pelo evento `formSubmitted` da Netlify a cada envio do formulário "pedido".
 * Monta um e-mail legível (tabela do pedido, rota, total) e envia pelo Resend.
 * Sem endereço público: ninguém dispara de fora.
 *
 * Variáveis de ambiente (Netlify → Site configuration → Environment variables):
 *   RESEND_API_KEY   obrigatória. Sem ela o aviso NÃO sai (fica só na aba Forms da Netlify).
 *   EMAIL_DESTINO    opcional. Padrão: avesornamentaisbrasil@gmail.com. Aceita vários, separados por vírgula.
 *   EMAIL_REMETENTE  opcional. Padrão: remetente de teste do Resend (só entrega no e-mail dono da conta).
 *                    Com o domínio verificado no Resend: "Aves Ornamentais Brasil <pedidos@avesornamentaisbrasil.com.br>".
 *   CONFIRMA_CLIENTE opcional. "1" manda cópia de confirmação ao cliente (só com domínio verificado).
 */

/**
 * MAPA DE CAMPOS — cópia deliberada de src/lib/campos-pedido.ts.
 *
 * A primeira versão importava de lá. Não funciona: o empacotador de funções da
 * Netlify não resolveu o caminho para fora de netlify/functions, o deploy passou
 * e a função morreu em silêncio — o e-mail cru da Netlify continuou chegando e
 * só o e-mail bom sumiu (comprovado no teste AOB-TESTE-0709R, 07/09/2026).
 * Uma função de aviso não pode depender de empacotamento: ela fica sozinha.
 *
 * `pega` tenta o rótulo novo e cai para o nome antigo, então mesmo que esta
 * cópia fique para trás de src/lib/campos-pedido.ts, o pior caso é um campo
 * aparecer vazio — nunca o e-mail inteiro deixar de sair.
 */
const ROTULOS = {
  codigo: 'Código',
  nome: 'Cliente',
  whatsapp: 'Whatsapp',
  cidade_uf: 'Cidade',
  regiao: 'Região',
  rota: 'Rota',
  rota_escolhida: 'Rota Escolhida',
  proxima_saida: 'Próxima Saída',
  frete_zona: 'Zona',
  frete_valor: 'Frete',
  recebimento: 'Recebimento',
  observacoes: 'Observações',
  pedido_resumo: 'Pedido',
  total_referencia: 'Total',
  origem: 'Origem',
  pagina_entrada: 'Página',
  pedido_json: 'Itens JSON',
} as const;
type ChavePedido = keyof typeof ROTULOS;

const RESEND_API = 'https://api.resend.com/emails';
const COR = { verde: '#1F3B2E', ouro: '#B99034', marfim: '#F6F1E6', ink: '#1E2A24', cinza: '#5B6B5B', borda: '#E1DCCF' };
const WA = '5511995610741';

const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const brl = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);
const soDigitos = (s: string) => (s || '').replace(/\D/g, '');

/**
 * Lê um campo da submissão. Os pedidos novos chegam com os rótulos legíveis
 * ("Código", "Cidade"); os gravados antes de 07/09/2026 usam os nomes antigos
 * ("codigo", "cidade_uf"). Tenta o novo e cai para o velho, então os dois
 * continuam gerando o mesmo e-mail.
 */
const g = (d: Record<string, string>, chave: ChavePedido): string =>
  d[ROTULOS[chave]] ?? d[chave] ?? '';

interface Linha { nome?: string; detalhe?: string; criador?: string; unidade?: string; quantidade?: number; valorUnitario?: number }
const UNID: Record<string, string> = { casal: 'casal', macho: 'macho', femea: 'fêmea' };

function linhas(d: Record<string, string>): Linha[] {
  try { const j = JSON.parse(g(d, 'pedido_json') || '[]'); return Array.isArray(j) ? j : []; } catch { return []; }
}

const campo = (rotulo: string, valor: string, destaque = false) => `
<tr>
  <td style="padding:7px 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:${COR.cinza};white-space:nowrap;vertical-align:top;width:36%;">${esc(rotulo)}</td>
  <td style="padding:7px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:${COR.ink};${destaque ? `font-weight:bold;color:${COR.verde};` : ''}">${valor}</td>
</tr>`;

function emailPedido(d: Record<string, string>) {
  const ls = linhas(d);
  const total = Number(g(d, 'total_referencia')) || ls.reduce((s, l) => s + (l.quantidade || 0) * (l.valorUnitario || 0), 0);
  const wa = soDigitos(g(d, 'whatsapp'));
  const waCliente = wa ? `https://wa.me/${wa.startsWith('55') ? wa : '55' + wa}?text=${encodeURIComponent(`Olá, ${g(d, 'nome')}! Recebemos seu pedido ${g(d, 'codigo')} na Aves Ornamentais Brasil.`)}` : '';

  const tabela = ls.length
    ? ls.map((l) => `
<tr>
  <td style="padding:10px 8px 10px 0;border-bottom:1px solid ${COR.borda};font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:${COR.verde};white-space:nowrap;vertical-align:top;">${l.quantidade}×</td>
  <td style="padding:10px 8px;border-bottom:1px solid ${COR.borda};font-family:Georgia,serif;font-size:15px;color:${COR.ink};">
    ${esc(l.nome)}${l.detalhe ? ` <span style="color:${COR.cinza};font-style:italic;">· ${esc(l.detalhe)}</span>` : ''}<br>
    <span style="font-family:Helvetica,Arial,sans-serif;font-size:11px;color:${COR.cinza};">${esc(UNID[l.unidade || ''] || l.unidade)} · ${esc(l.criador)} · ref. ${brl(l.valorUnitario || 0)}</span>
  </td>
  <td align="right" style="padding:10px 0 10px 8px;border-bottom:1px solid ${COR.borda};font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:${COR.ink};white-space:nowrap;vertical-align:top;">${brl((l.quantidade || 0) * (l.valorUnitario || 0))}</td>
</tr>`).join('')
    : `<tr><td style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${COR.ink};white-space:pre-wrap;">${esc(g(d, 'pedido_resumo'))}</td></tr>`;

  const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;background:${COR.marfim};padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden;border:1px solid ${COR.borda};">
  <tr><td style="background:${COR.verde};padding:22px 28px;">
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.3em;color:${COR.ouro};text-transform:uppercase;">Aves Ornamentais Brasil</div>
    <div style="font-family:Georgia,serif;font-size:26px;color:${COR.marfim};margin-top:6px;">Pedido novo · ${esc(g(d, 'codigo'))}</div>
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#C9D2C9;margin-top:4px;">${esc(g(d, 'rota'))}${g(d, 'proxima_saida') ? ` · próxima saída ${esc(g(d, 'proxima_saida'))}` : ''}</div>
  </td></tr>
  <tr><td style="padding:22px 28px 6px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${campo('Cliente', esc(g(d, 'nome')), true)}
      ${campo('WhatsApp', waCliente ? `<a href="${waCliente}" style="color:${COR.verde};font-weight:bold;">${esc(g(d, 'whatsapp'))}</a>` : esc(g(d, 'whatsapp')))}
      ${d.email ? campo('E-mail', `<a href="mailto:${esc(d.email)}" style="color:${COR.verde};">${esc(d.email)}</a>`) : ''}
      ${campo('Cidade', esc(g(d, 'cidade_uf')))}
      ${campo('Recebimento', esc(g(d, 'recebimento')))}
      ${campo('Frete', `${esc(g(d, 'frete_zona'))} · ${/^\d+$/.test(g(d, 'frete_valor') || '') ? brl(Number(g(d, 'frete_valor'))) : esc(g(d, 'frete_valor'))}`)}
      ${g(d, 'observacoes') ? campo('Observações', esc(g(d, 'observacoes'))) : ''}
    </table>
  </td></tr>
  <tr><td style="padding:10px 28px 8px;">
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:${COR.cinza};margin-bottom:6px;">Aves</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${tabela}
      <tr><td colspan="2" style="padding:14px 8px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${COR.cinza};">Total de referência (sem frete)</td>
      <td align="right" style="padding:14px 0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:bold;color:${COR.verde};white-space:nowrap;">${brl(total)}</td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:18px 28px 26px;">
    ${waCliente ? `<a href="${waCliente}" style="display:inline-block;background:#1E8E5A;color:#fff;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-weight:bold;font-size:14px;padding:12px 22px;border-radius:999px;">Responder no WhatsApp</a>` : ''}
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;color:${COR.cinza};margin-top:16px;">Origem: ${esc(g(d, 'origem'))} · ${esc(g(d, 'pagina_entrada'))}</div>
  </td></tr>
</table></td></tr></table></body></html>`;

  const texto = `Pedido ${g(d, 'codigo')} · ${g(d, 'nome')} · ${g(d, 'whatsapp')}\n${g(d, 'cidade_uf')} · ${g(d, 'rota')}${g(d, 'proxima_saida') ? ` · ${g(d, 'proxima_saida')}` : ''}\nRecebimento: ${g(d, 'recebimento')} · Frete: ${g(d, 'frete_zona')} ${g(d, 'frete_valor')}\n\n${g(d, 'pedido_resumo')}\n\nTotal de referência: ${brl(total)}\n${g(d, 'observacoes') ? `Obs.: ${g(d, 'observacoes')}\n` : ''}`;
  return { assunto: d.subject || `Pedido ${g(d, 'codigo')} · ${g(d, 'nome')} · ${brl(total)}`, html, texto, respostaPara: d.email || undefined };
}

function emailCliente(d: Record<string, string>) {
  const texto = `Olá, ${g(d, 'nome')}!\n\nRecebemos seu pedido ${g(d, 'codigo')} na Aves Ornamentais Brasil.\n\n${g(d, 'pedido_resumo')}\n\nRota: ${g(d, 'rota')}${g(d, 'proxima_saida') ? ` · próxima saída ${g(d, 'proxima_saida')}` : ''}\nRecebimento: ${g(d, 'recebimento')}\n\nA confirmação de estoque e da data vem pelo WhatsApp. Pagamento só na entrega.\n\nWhatsApp: https://wa.me/${WA}`;
  return { assunto: `Recebemos seu pedido ${g(d, 'codigo')} — Aves Ornamentais Brasil`, html: `<pre style="font-family:Georgia,serif;font-size:15px;white-space:pre-wrap;">${esc(texto)}</pre>`, texto };
}

async function enviar(para: string[], peca: { assunto: string; html: string; texto: string; respostaPara?: string }) {
  const chave = process.env.RESEND_API_KEY;
  if (!chave) { console.error('[pedido-email] RESEND_API_KEY ausente — e-mail NÃO enviado.'); return; }
  const corpo: Record<string, unknown> = {
    from: process.env.EMAIL_REMETENTE || 'Aves Ornamentais Brasil <onboarding@resend.dev>',
    to: para, subject: peca.assunto, html: peca.html, text: peca.texto,
  };
  if (peca.respostaPara) corpo.reply_to = peca.respostaPara;
  const r = await fetch(RESEND_API, { method: 'POST', headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
  if (!r.ok) { console.error('[pedido-email] falha no envio', r.status, await r.text()); return; }
  console.log('[pedido-email] enviado para', para.join(','), '·', peca.assunto);
}

export default {
  async formSubmitted(event: any) {
    try {
      const dados: Record<string, string> = event?.data ?? event?.payload?.data ?? {};
      const destino = (process.env.EMAIL_DESTINO || 'avesornamentaisbrasil@gmail.com').split(',').map((s) => s.trim()).filter(Boolean);
      await enviar(destino, emailPedido(dados));
      if (process.env.CONFIRMA_CLIENTE === '1' && dados.email && /.+@.+\..+/.test(dados.email)) {
        await enviar([dados.email], emailCliente(dados));
      }
    } catch (e) {
      console.error('[pedido-email] erro inesperado', e);
    }
  },
};
