/**
 * Nomes dos campos do formulário de pedido — fonte única.
 *
 * POR QUE ISTO EXISTE
 * -------------------
 * O aviso de pedido chega por dois caminhos:
 *
 *   1. netlify/functions/pedido-email.mts, que monta o e-mail desenhado (Resend);
 *   2. a notificação automática da Netlify, que NÃO tem template: ela imprime
 *      todo campo recebido usando o próprio nome do campo como título.
 *
 * Enquanto os campos se chamavam `codigo`, `cidade_uf` e `proxima_saida`, o
 * segundo e-mail saía com títulos "Codigo", "Cidade Uf" e "Proxima Saida" — nome
 * de variável, sem acento, porque nunca foi texto escrito para alguém ler.
 *
 * Renomear resolve, mas cria uma armadilha: a função do Resend lê os dados pela
 * chave. Se os dois lados discordarem, o e-mail bom perde campos EM SILÊNCIO.
 * Por isso o mapa mora aqui, é importado pelos dois, e o leitor da função tem
 * queda para o nome antigo — assim submissões velhas continuam legíveis.
 *
 * REGRA AO EDITAR
 * ---------------
 * Mudou um rótulo aqui? O index.html (formulário estático oculto que a Netlify
 * lê no deploy) precisa da MESMA lista de names, senão o campo não é gravado.
 *
 * Os rótulos são escolhidos para sobreviver ao title-case da Netlify: ela põe
 * maiúscula em toda palavra. "Total de referência" viraria "Total De
 * Referência"; por isso os nomes são de uma palavra ou já vêm capitalizados.
 */

/** interno → rótulo que aparece como título no e-mail cru da Netlify. */
export const ROTULOS = {
  codigo: 'Código',
  nome: 'Cliente',
  whatsapp: 'WhatsApp',
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
  // Fica por último de propósito: é registro de máquina, não linha de leitura.
  pedido_json: 'Itens JSON',
} as const;

export type ChavePedido = keyof typeof ROTULOS;

/**
 * Ordem em que os campos vão no corpo do POST — e, portanto, a ordem em que a
 * Netlify os imprime. O JSON por último para não partir o bloco legível.
 */
export const ORDEM: ChavePedido[] = [
  'codigo', 'nome', 'whatsapp', 'cidade_uf', 'regiao',
  'rota', 'rota_escolhida', 'proxima_saida', 'frete_zona', 'frete_valor',
  'recebimento', 'observacoes', 'pedido_resumo', 'total_referencia',
  'origem', 'pagina_entrada', 'pedido_json',
];

/**
 * Lê um campo da submissão pelo rótulo novo, caindo para o nome antigo.
 * A queda é o que mantém legíveis os pedidos gravados antes desta mudança.
 */
export const pegar = (d: Record<string, string>, chave: ChavePedido): string =>
  d[ROTULOS[chave]] ?? d[chave] ?? '';
