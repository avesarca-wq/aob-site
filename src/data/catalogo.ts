// src/data/catalogo.ts — categorias, criadores, rotas e constantes da AOB.
import { Categoria, CategoriaId, Criador, CriadorId } from '../types';

export const CONSTANTS = {
  MARCA: 'Aves Ornamentais Brasil',
  SIGLA: 'AOB',
  DOMINIO: 'https://avesornamentaisbrasil.com.br',
  /** WhatsApp central dos pedidos (decisão do Ricardo, 04/09/2026). */
  WHATSAPP_DISPLAY: '(11) 99561-0741',
  WHATSAPP_LINK: 'https://wa.me/5511995610741',
  EMAIL: 'avesornamentaisbrasil@gmail.com',
  INSTAGRAM: 'https://www.instagram.com/avesarca',
  /** Ponto de retirada oficial. */
  RETIRADA: 'São Paulo – Capital',
  /** Site-irmão para encomenda do que não está à pronta entrega. */
  PRE_RESERVA_URL: 'https://avesarca.com.br/pre-reserva?utm_source=aob&utm_medium=site&utm_campaign=pre-reserva',
};

export const CATEGORIAS: Categoria[] = [
  { id: 'aquaticas', nome: 'Aves aquáticas', descricao: 'Patos, marrecos, gansos, tadornas e mergulhões ornamentais.' },
  { id: 'faisoes', nome: 'Faisões', descricao: 'Dourado, Prata, Lady Amherst, Swinhoe, Eperonier, Prelatus.' },
  { id: 'pavoes', nome: 'Pavões', descricao: 'Azul, Branco, Arlequim, Purple e Opal.' },
  { id: 'perdizes', nome: 'Perdizes', descricao: 'Perdizes, francolins e sandgrouse.' },
  { id: 'codornas', nome: 'Codornas', descricao: 'Codornas ornamentais — em formação.' },
  { id: 'pombas', nome: 'Pombas', descricao: 'Pombas ornamentais.' },
  { id: 'psitacideos', nome: 'Psitacídeos', descricao: 'Ring Necks e lóris.' },
  { id: 'turacos', nome: 'Turacos', descricao: 'Turacos Leucotis, Violeta e Persa.' },
];

export const CATEGORIA: Record<CategoriaId, Categoria> = Object.fromEntries(
  CATEGORIAS.map((c) => [c.id, c]),
) as Record<CategoriaId, Categoria>;

export const CRIADORES: Criador[] = [
  {
    id: 'aves-arca',
    nome: 'Aves Arca',
    responsavel: 'Ricardo',
    cidade: 'Diadema – SP',
    especialidade: 'Anatídeos ornamentais: patos, marrecos, gansos, tadornas e mergulhões.',
    whatsapp: '5511995610741',
    descricao:
      'Criadouro de aves aquáticas ornamentais. Plantel de matrizes nascidas e criadas em São Paulo, com fotos reais de cada variedade.',
  },
  {
    id: 'stima',
    nome: 'Stima Aves',
    responsavel: 'Waldir',
    cidade: 'São Paulo – SP',
    especialidade: 'Pavões, faisões, perdizes, pombas e aves exóticas.',
    whatsapp: '5511943007375',
    descricao: 'Criadouro parceiro com foco em galiformes ornamentais e aves exóticas de coleção.',
  },
  {
    id: 'alianca',
    nome: 'Criadouro Aliança',
    responsavel: 'Felipe',
    cidade: 'São Paulo – SP',
    especialidade: 'Faisões, pavões, perdizes e psitacídeos.',
    whatsapp: '5511974643823',
    descricao: 'Criadouro parceiro que completa a lista com galiformes e aves de coleção.',
  },
];

/** Rótulo do criador como aparece na vitrine. 'parceiros' agrupa Stima + Aliança. */
export const CRIADOR_ROTULO: Record<CriadorId, string> = {
  'aves-arca': 'Aves Arca',
  stima: 'Stima Aves',
  alianca: 'Criadouro Aliança',
  parceiros: 'Stima Aves · Criadouro Aliança',
};

export interface Rota {
  /** Mesmo texto do campo `r` de cidades.ts — é a chave que liga cidade → rota. */
  regiao: string;
  nome: string;
  /** Datas de saída confirmadas (ISO). Vazio = rota em formação. */
  datas: string[];
  /** Dias antes da saída em que fecham os pedidos. */
  fechaDiasAntes: number;
  nota: string;
}

/** Calendário de rotas do ciclo set–nov/2026 (05.29, rodada 1 do Meta). Saída de São Paulo. */
export const ROTAS: Rota[] = [
  {
    regiao: 'Entrega rápida (Grande São Paulo)',
    nome: 'Grande São Paulo e raio de 150 km',
    datas: [],
    fechaDiasAntes: 0,
    nota: 'Data combinada direto pelo WhatsApp, sem esperar rota fechar. Retirada em São Paulo – Capital também.',
  },
  {
    regiao: 'Ribeirão Preto e Triângulo',
    nome: 'Rota Ribeirão Preto',
    datas: ['2026-09-12', '2026-10-10', '2026-11-07'],
    fechaDiasAntes: 3,
    nota: 'Campinas, Limeira, Araraquara, São Carlos, Ribeirão Preto, Franca, Uberaba e Uberlândia.',
  },
  {
    regiao: 'Sul de Minas e Belo Horizonte',
    nome: 'Rota Minas Gerais',
    datas: ['2026-09-26', '2026-10-24', '2026-11-21'],
    fechaDiasAntes: 5,
    nota: 'Pouso Alegre, Varginha, Lavras, Belo Horizonte, Betim e região.',
  },
  {
    regiao: 'Rio de Janeiro e Vale do Paraíba',
    nome: 'Rota Rio e Vale do Paraíba',
    datas: [],
    fechaDiasAntes: 5,
    nota: 'Em formação — sai quando fechar o mínimo de pedidos. Entre na lista pelo pedido.',
  },
  {
    regiao: 'Centro-Oeste Paulista e Norte do Paraná',
    nome: 'Rota Oeste Paulista e Norte do Paraná',
    datas: [],
    fechaDiasAntes: 5,
    nota: 'Em formação — sai quando fechar o mínimo de pedidos.',
  },
  {
    regiao: 'Litoral do Paraná a Santa Catarina',
    nome: 'Rota Curitiba e Santa Catarina',
    datas: [],
    fechaDiasAntes: 5,
    nota: 'Em formação — sai quando fechar o mínimo de pedidos.',
  },
];

export const rotaDaRegiao = (regiao: string) => ROTAS.find((r) => r.regiao === regiao);

/** Próxima saída ainda aberta para pedidos (ou null). */
export const proximaSaida = (rota: Rota, hoje = new Date()): { saida: Date; fecha: Date } | null => {
  for (const iso of rota.datas) {
    const saida = new Date(iso + 'T12:00:00-03:00');
    const fecha = new Date(saida.getTime() - rota.fechaDiasAntes * 86400000);
    if (fecha.getTime() >= hoje.setHours(0, 0, 0, 0)) return { saida, fecha };
  }
  return null;
};

export const dataCurta = (d: Date) =>
  d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
export const dataLonga = (d: Date) =>
  d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

export const brl = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

export const UNIDADE_ROTULO = { casal: 'casal', macho: 'macho', femea: 'fêmea' } as const;
export const UNIDADE_PLURAL = { casal: 'casais', macho: 'machos', femea: 'fêmeas' } as const;
