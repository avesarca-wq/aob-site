import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CartLine, Escolha, Tier } from '../types';
import { SPECIES_ABERTAS } from '../data/species';

/**
 * Guarda de sanidade do carrinho — não é regra comercial.
 * O teto de 10 linhas do 05.6.8 saiu em 27/08/2026: nenhum pedido real chegou
 * perto dele (o maior do primeiro dia teve 6 linhas) e a frase "1 de 10" na tela
 * anunciava um limite que ninguém tinha pedido. Os 99 daqui existem só para um
 * carrinho corrompido no localStorage não virar pedido gigante.
 * Uma linha = variedade + sexo; a quantidade dentro da linha continua livre.
 */
export const MAX_LINHAS = 99;

// v2: os nomes de 8 variedades mudaram na Zeca-05; carrinhos antigos são descartados
// para nenhum pedido chegar com um nome que não existe mais no catálogo.
const STORAGE_KEY = 'avesarca:pre-reserva:carrinho:v3';

/**
 * Nomes que aceitam pré-reserva hoje. O carrinho vive no navegador do visitante e sobrevive a
 * qualquer mudança do catálogo: sem esta conferência, uma variedade despublicada — ou que
 * passou para lista de espera / só no plantel — continuaria no carrinho de quem já a tinha e
 * chegaria como pedido. Derruba só a linha inválida; o resto do carrinho segue intacto.
 * Desde 25/08/2026 a régua é a SITUAÇÃO, não só a publicação (ver 05.6.18).
 */
const NOMES_ABERTOS = new Set(SPECIES_ABERTAS.map((s) => s.nome));

interface CartContextValue {
  linhas: CartLine[];
  totalLinhas: number;
  totalAves: number;
  totalReferencia: number;
  cheio: boolean;
  temLinha: (nome: string, sexo: Escolha) => boolean;
  adicionar: (linha: CartLine) => { ok: boolean; motivo?: string };
  removerLinha: (nome: string, sexo: Escolha) => void;
  alterarQuantidade: (nome: string, sexo: Escolha, quantidade: number) => void;
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
      .filter(
        (l: any) =>
          l &&
          typeof l.nome === 'string' &&
          (l.sexo === 'Macho' || l.sexo === 'Fêmea' || l.sexo === 'Casal') &&
          typeof l.quantidade === 'number' &&
          l.quantidade > 0
      )
      .filter((l: any) => NOMES_ABERTOS.has(l.nome))
      .slice(0, MAX_LINHAS)
      .map((l: any) => ({
        nome: l.nome,
        tier: (l.tier || 'Bronze') as Tier,
        sexo: l.sexo as Escolha,
        quantidade: Math.max(1, Math.min(99, Math.round(l.quantidade))),
        valorUnitario: typeof l.valorUnitario === 'number' ? l.valorUnitario : 0
      }));
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [linhas, setLinhas] = useState<CartLine[]>(() =>
    typeof window === 'undefined' ? [] : carregar()
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(linhas));
    } catch {
      /* localStorage indisponível (navegação privada): o carrinho segue só em memória. */
    }
  }, [linhas]);

  const valor = useMemo<CartContextValue>(() => {
    const totalLinhas = linhas.length;
    // Um casal são DUAS aves. O total de aves precisa dizer o que sai do plantel,
    // não quantas linhas o cliente escolheu.
    const totalAves = linhas.reduce((soma, l) => soma + l.quantidade * (l.sexo === 'Casal' ? 2 : 1), 0);
    const totalReferencia = linhas.reduce((soma, l) => soma + l.quantidade * l.valorUnitario, 0);

    const mesmaLinha = (l: CartLine, nome: string, sexo: Escolha) => l.nome === nome && l.sexo === sexo;

    return {
      linhas,
      totalLinhas,
      totalAves,
      totalReferencia,
      cheio: totalLinhas >= MAX_LINHAS,
      temLinha: (nome, sexo) => linhas.some((l) => mesmaLinha(l, nome, sexo)),
      adicionar: (nova) => {
        const existente = linhas.find((l) => mesmaLinha(l, nova.nome, nova.sexo));
        if (existente) {
          // Mesma combinação variedade+sexo soma na quantidade, não cria linha nova.
          setLinhas((atual) =>
            atual.map((l) =>
              mesmaLinha(l, nova.nome, nova.sexo)
                ? { ...l, quantidade: Math.min(99, l.quantidade + nova.quantidade) }
                : l
            )
          );
          return { ok: true };
        }
        if (linhas.length >= MAX_LINHAS) {
          return { ok: false, motivo: 'limite' };
        }
        setLinhas((atual) => [...atual, nova]);
        return { ok: true };
      },
      removerLinha: (nome, sexo) =>
        setLinhas((atual) => atual.filter((l) => !mesmaLinha(l, nome, sexo))),
      alterarQuantidade: (nome, sexo, quantidade) =>
        setLinhas((atual) =>
          atual.map((l) =>
            mesmaLinha(l, nome, sexo)
              ? { ...l, quantidade: Math.max(1, Math.min(99, Math.round(quantidade) || 1)) }
              : l
          )
        ),
      esvaziar: () => setLinhas([])
    };
  }, [linhas]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart precisa estar dentro de <CartProvider>.');
  }
  return ctx;
};
