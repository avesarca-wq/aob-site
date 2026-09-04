import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CartLine } from '../types';
import { AVES, aveDoId } from '../data/aves';

const STORAGE_KEY = 'aob:pedido:v1';
const IDS = new Set(AVES.map((a) => a.id));

interface CartContextValue {
  linhas: CartLine[];
  totalLinhas: number;
  totalUnidades: number;
  totalReferencia: number;
  quantidadeDe: (id: string) => number;
  adicionar: (id: string, quantidade?: number) => void;
  alterar: (id: string, quantidade: number) => void;
  remover: (id: string) => void;
  esvaziar: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function carregar(): CartLine[] {
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    if (!bruto) return [];
    const dados = JSON.parse(bruto);
    if (!Array.isArray(dados)) return [];
    return dados
      .filter((l: any) => l && typeof l.id === 'string' && IDS.has(l.id) && typeof l.quantidade === 'number' && l.quantidade > 0)
      .map((l: any) => ({ id: l.id, quantidade: Math.max(1, Math.min(50, Math.round(l.quantidade))) }));
  } catch {
    return [];
  }
}

/** Teto por linha = estoque da unidade (casais disponíveis = min(M,F); machos; fêmeas). */
export const estoqueDaUnidade = (id: string): number => {
  const a = aveDoId(id);
  if (!a) return 0;
  if (a.unidade === 'casal') return Math.max(1, Math.min(a.machos, a.femeas));
  if (a.unidade === 'macho') return Math.max(1, a.machos);
  return Math.max(1, a.femeas);
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [linhas, setLinhas] = useState<CartLine[]>(() => (typeof window === 'undefined' ? [] : carregar()));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(linhas));
    } catch {
      /* navegação privada: segue só em memória */
    }
  }, [linhas]);

  const valor = useMemo<CartContextValue>(() => {
    const totalReferencia = linhas.reduce((s, l) => s + l.quantidade * (aveDoId(l.id)?.preco ?? 0), 0);
    const totalUnidades = linhas.reduce((s, l) => s + l.quantidade, 0);
    const limitar = (id: string, q: number) => Math.max(1, Math.min(estoqueDaUnidade(id), Math.round(q) || 1));
    return {
      linhas,
      totalLinhas: linhas.length,
      totalUnidades,
      totalReferencia,
      quantidadeDe: (id) => linhas.find((l) => l.id === id)?.quantidade ?? 0,
      adicionar: (id, quantidade = 1) =>
        setLinhas((atual) => {
          const ex = atual.find((l) => l.id === id);
          if (ex) return atual.map((l) => (l.id === id ? { ...l, quantidade: limitar(id, l.quantidade + quantidade) } : l));
          return [...atual, { id, quantidade: limitar(id, quantidade) }];
        }),
      alterar: (id, quantidade) =>
        setLinhas((atual) =>
          quantidade <= 0 ? atual.filter((l) => l.id !== id) : atual.map((l) => (l.id === id ? { ...l, quantidade: limitar(id, quantidade) } : l)),
        ),
      remover: (id) => setLinhas((atual) => atual.filter((l) => l.id !== id)),
      esvaziar: () => setLinhas([]),
    };
  }, [linhas]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>.');
  return ctx;
};
