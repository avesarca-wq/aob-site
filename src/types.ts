export type Tier = 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';

/** Régua comercial do Ricardo, não taxonomia. Preenchida por rodada, conforme ele fecha cada família. */
export type Grupo = 'Pato' | 'Marreco' | 'Ganso' | 'Cisne' | 'Marreca';

export interface Ficha {
  porte?: string;
  peso?: string;
  agua?: string;
  area_min_casal?: string;
  territorialidade?: string;
  longevidade?: string;
  incubacao?: string;
  postura?: string;
  salinidade?: string;
}

/**
 * As três situações comerciais do catálogo (decidido com o Ricardo em 25/08/2026, planilha 05.6.18).
 * 'aberta'  — à venda: o cliente escolhe sexo e pré-reserva agora.
 * 'espera'  — nós comercializamos, mas a reserva está fechada no momento. Preço à vista,
 *             botão trocado pela lista da próxima temporada — captar contato sem prometer prazo.
 * 'plantel' — a ave existe no plantel e ainda não está à venda: sem preço e sem botão.
 *             É vitrine de procedência, não oferta.
 * Não confundir com `publicado: false`, que é despublicação por documentação (Portaria IBAMA):
 * essa some do site inteiro, estas três continuam visíveis.
 */
export type Situacao = 'aberta' | 'espera' | 'plantel';

export interface Species {
  nome: string;
  /**
   * Até 5 fotos do exemplar/variedade, na ordem em que aparecem na galeria.
   * Caminhos em /especies/, no mesmo tratamento das matrizes (1600px, .webp + .jpg, sem EXIF).
   * Vazio = a galeria mostra molduras reservadas, e nada é inventado.
   */
  fotos?: string[];
  /** Preço confirmado no Bling (fonte-verdade de preço). Se false, a variedade não entra no carrinho. */
  preco_confirmado: boolean;
  /** Vocabulário comercial do cliente: Pato · Marreco · Ganso · Cisne · Marreca. Vazio = ainda não classificada. */
  grupo?: Grupo;
  /** Ausente ou true = aparece no catálogo. false = fora de circulação, mas o dado fica guardado. */
  publicado?: boolean;
  /** Situação comercial (05.6.18). Ausente = 'aberta'. */
  situacao?: Situacao;
  tier: Tier;
  cientifico: string;
  especie_base?: string | null;
  casal: number;
  adulto: number;
  filhote: number;
  ovo: number;
  /** Preço do macho avulso (R$). Planilha 05.6.18, revisada pelo Ricardo em 25/08/2026. */
  macho: number;
  /**
   * Preço da fêmea avulsa (R$). Nem sempre igual ao do macho: nas Cool a fêmea poedeira vale
   * mais; no Mandarim Branco e nas Carolinas de mutação, o macho. Regra medida no Bling (05/08).
   */
  femea: number;
  resumo: string;
  ficha: Ficha | null;
}

export type PageRoute = 'home' | 'especies' | 'procedencia' | 'entrega' | 'sobre' | 'pre-reserva' | 'contato' | 'faq' | 'privacidade';

export interface PreReservaFormData {
  nome: string;
  whatsapp: string;
  email: string;
  variedade: string;
  tier: string;
  recebimento: string;
  obs: string;
}

/** Sexo — decisão nº3: só se vende sexado. É isto que o Bling recebe. */
export type Sexo = 'Macho' | 'Fêmea';

/**
 * O que o cliente escolhe no catálogo.
 * 'Casal' é um atalho comercial: 1 macho + 1 fêmea pelo preço de casal do Bling
 * (≈9% abaixo de dois avulsos). Ele existe só do lado do cliente — **no envio do
 * pedido o casal É DIVIDIDO** em uma linha de Macho e uma de Fêmea, para o Bling
 * receber a informação por sexo, que é como o estoque oficial e a GTA funcionam.
 */
export type Escolha = Sexo | 'Casal';

/** Uma linha do carrinho: combinação variedade + escolha. Quantidade livre dentro da linha. */
export interface CartLine {
  nome: string;
  tier: Tier;
  sexo: Escolha;
  quantidade: number;
  /** Valor de referência unitário (R$), na data em que a linha entrou. No casal, o preço do PAR. */
  valorUnitario: number;
}

/** Linha já expandida para o pedido: nunca contém 'Casal'. É o formato que sai no JSON. */
export interface LinhaPedido {
  nome: string;
  tier: Tier;
  sexo: Sexo;
  quantidade: number;
  valorUnitario: number;
  /** true quando esta linha nasceu da divisão de um casal — para conferir o desconto no faturamento. */
  de_casal?: boolean;
}

export interface DadosCliente {
  nome: string;
  whatsapp: string;
  email: string;
  cidade_uf: string;
  forma_recebimento: string;
  observacoes: string;
}

/** Faixa de rota do 04.8, deduzida da cidade escolhida. Vazia quando a cidade não está na base. */
export type FaixaRota = string;