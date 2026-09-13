/**
 * Marcas da rede — um código, quatro sites.
 *
 * O mesmo repositório serve o Aves Ornamentais Brasil (a rede) e os sites de
 * cada criadouro. O que muda entre eles é só o que está aqui: nome, domínio,
 * WhatsApp, quais criadores aparecem no catálogo e o id de medição.
 *
 * A marca é escolhida em tempo de build pela variável VITE_MARCA
 * (aob | stima | alianca). Sem a variável, o build é o AOB — o site atual
 * continua saindo idêntico. Na Netlify, cada projeto aponta para este mesmo
 * repositório e define a sua VITE_MARCA em Environment variables.
 *
 * Decisão de 12/09/2026: Stima Aves = plantel do Waldir Bellati (Atibaia);
 * Criadouro Aliança = plantel do Felipe Caselato (Jundiaí). Enquanto as aves
 * de parceiro ainda estiverem marcadas como 'parceiros' no aves.ts, as duas
 * marcas mostram esse grupo inteiro; quando cada linha ganhar o criador certo,
 * o filtro abaixo passa a separar sozinho.
 */
import { CriadorId } from './types';

export type MarcaId = 'aob' | 'stima' | 'alianca';

export interface Marca {
  id: MarcaId;
  nome: string;
  sigla: string;
  dominio: string;
  /** Criadores cujas aves entram no catálogo desta marca; 'todos' para a rede. */
  criadores: CriadorId[] | 'todos';
  whatsappDisplay: string;
  whatsappLink: string;
  email: string;
  instagram: string;
  /** Website id no Umami Cloud (conta avesarca@gmail.com, plano Pro). */
  umami: string;
  /** Texto curto da marca, para o rodapé e o og:description. */
  frase: string;
}

export const MARCAS: Record<MarcaId, Marca> = {
  aob: {
    id: 'aob',
    nome: 'Aves Ornamentais Brasil',
    sigla: 'AOB',
    dominio: 'https://avesornamentaisbrasil.com.br',
    criadores: 'todos',
    whatsappDisplay: '(11) 99561-0741',
    whatsappLink: 'https://wa.me/5511995610741',
    email: 'avesornamentaisbrasil@gmail.com',
    instagram: 'https://www.instagram.com/avesarca',
    umami: '60547214-1e23-4b1b-894a-9b2ab0807191',
    frase: 'Aves ornamentais à pronta entrega de três criadouros parceiros.',
  },
  stima: {
    id: 'stima',
    nome: 'Stima Aves',
    sigla: 'Stima',
    dominio: 'https://stimaaves.com.br',
    criadores: ['stima', 'parceiros'],
    whatsappDisplay: '(11) 94300-7375',
    whatsappLink: 'https://wa.me/5511943007375',
    email: 'avesornamentaisbrasil@gmail.com', // até a Stima ter e-mail próprio
    instagram: 'https://www.instagram.com/stima.aves',
    umami: '508779ed-8e55-4b82-b18d-384c124a0a92',
    frase: 'Aves de coleção com responsabilidade técnica de médico veterinário.',
  },
  alianca: {
    id: 'alianca',
    nome: 'Criadouro Aliança',
    sigla: 'Aliança',
    dominio: 'https://criadouroalianca.com.br',
    criadores: ['alianca', 'parceiros'],
    whatsappDisplay: '(11) 97464-3823',
    whatsappLink: 'https://wa.me/5511974643823',
    email: 'avesornamentaisbrasil@gmail.com', // até a Aliança ter e-mail próprio
    instagram: 'https://www.instagram.com/criadouroalianca',
    umami: 'a9007209-5e1b-44f5-a310-b960fda693bb',
    frase: 'Faisões, pavões e perdizes ornamentais de plantel selecionado em Jundiaí.',
  },
};

const idDoBuild = (import.meta.env.VITE_MARCA as MarcaId | undefined) ?? 'aob';
if (!(idDoBuild in MARCAS)) {
  throw new Error(`VITE_MARCA="${idDoBuild}" não existe. Use: ${Object.keys(MARCAS).join(' | ')}`);
}

export const MARCA_ATUAL: Marca = MARCAS[idDoBuild];

/** true quando este build é a rede (AOB), false quando é o site de um criadouro. */
export const EH_REDE = MARCA_ATUAL.criadores === 'todos';
