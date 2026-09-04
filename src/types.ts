// src/types.ts — tipos da Aves Ornamentais Brasil (AOB)

/** Categorias da vitrine. "Abastecendo conforme a necessidade" — novas entram aqui e em categorias.ts. */
export type CategoriaId =
  | 'aquaticas'
  | 'faisoes'
  | 'pavoes'
  | 'perdizes'
  | 'codornas'
  | 'pombas'
  | 'psitacideos'
  | 'turacos';

/** Quem tem a ave. 'parceiros' = Stima Aves + Criadouro Aliança (lista de 03/09 não distingue os lotes). */
export type CriadorId = 'aves-arca' | 'stima' | 'alianca' | 'parceiros';

/** Como o lote é vendido: casal (M+F), macho avulso ou fêmea avulsa. */
export type Unidade = 'casal' | 'macho' | 'femea';

export interface Ave {
  id: string;
  nome: string;
  cientifico: string;
  categoria: CategoriaId;
  /** Subgrupo dentro da categoria (Gansos, Tadornas, Pavões…), para agrupar a lista. */
  grupo: string;
  criador: CriadorId;
  /** Estoque disponível no momento da lista. */
  machos: number;
  femeas: number;
  /** Unidade de venda da linha como publicada na lista. */
  unidade: Unidade;
  /** Preço vigente (R$) da unidade acima. */
  preco: number;
  /** Preço anterior quando há promoção (R$). null = sem promoção. */
  preco_de: number | null;
  preco_casal: number | null;
  preco_macho: number | null;
  preco_femea: number | null;
  /** Foto principal em /aves/. null = mostra a moldura da categoria. */
  foto: string | null;
  /** Detalhe do lote (ex.: "casal jovem", "fêmea · 1F"). */
  detalhe: string;
  resumo: string;
}

export interface Categoria {
  id: CategoriaId;
  nome: string;
  descricao: string;
}

export interface Criador {
  id: CriadorId;
  nome: string;
  responsavel: string;
  cidade: string;
  especialidade: string;
  whatsapp: string;
  descricao: string;
}

/** Uma linha do pedido. A quantidade é de UNIDADES (casais, machos ou fêmeas). */
export interface CartLine {
  id: string;
  quantidade: number;
}

export interface DadosCliente {
  nome: string;
  whatsapp: string;
  email: string;
  cidade_uf: string;
  recebimento: 'rota' | 'retirada' | 'combinar';
  observacoes: string;
}

export type PageRoute =
  | 'home'
  | 'aves'
  | 'tabela'
  | 'pedido'
  | 'rotas'
  | 'criadores'
  | 'contato'
  | 'privacidade';
