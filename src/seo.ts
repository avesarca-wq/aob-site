/**
 * Metadados por rota — a única fonte de verdade de título e descrição do site.
 *
 * Fica fora do App.tsx porque dois consumidores precisam dele:
 *   1. o App, que troca o <head> ao navegar (o que o Google, que executa JS, lê);
 *   2. scripts/prerender.mjs, que grava um HTML por rota no build (o que o
 *      WhatsApp, o Facebook e o Instagram leem — eles NÃO executam JavaScript).
 *
 * Antes desta separação, todo link compartilhado no WhatsApp mostrava o card
 * genérico da home, qualquer que fosse a página.
 */
import { PageRoute } from './types';
import { AVES, TOTAL_AVES, TOTAL_LOTES, TOTAL_VARIEDADES } from './data/aves';
import { brl } from './data/catalogo';
import { CONSTANTS } from './data/catalogo';
import { EH_REDE, MARCA_ATUAL } from './marcas';

export const SITE = CONSTANTS.DOMINIO;

export const M = CONSTANTS.MARCA;
/** Cor da barra do navegador no celular (theme-color), por marca. */
export const TEMA: string = { aob: '#1F3B2E', stima: '#28306F', alianca: '#1E2430' }[MARCA_ATUAL.id] ?? '#1F3B2E';
export const META: Record<PageRoute, { titulo: string; descricao: string }> = {
  home: { titulo: EH_REDE ? `${M} — aves ornamentais à pronta entrega` : `${M} — pavões, faisões, aquáticas e aves ornamentais em ${MARCA_ATUAL.cidade}`, descricao: EH_REDE ? `${TOTAL_AVES} aves ornamentais à pronta entrega de três criadouros parceiros: aquáticas, faisões, pavões, perdizes e mais. Rota de entrega marcada, pagamento na entrega.` : `${MARCA_ATUAL.frase} ${TOTAL_VARIEDADES} variedades criadas em ${MARCA_ATUAL.cidade}, ${TOTAL_AVES} aves à pronta entrega. Rota de entrega marcada, pagamento na entrega.` },
  aves: { titulo: EH_REDE ? `Aves disponíveis — ${TOTAL_LOTES} lotes — ${M}` : `O plantel — ${TOTAL_VARIEDADES} variedades — ${M}`, descricao: 'Lista de aves ornamentais à pronta entrega com preço, estoque por sexo e criadouro. Monte o pedido e pague na entrega.' },
  tabela: { titulo: `Tabela de valores — ${TOTAL_LOTES} lotes — ${M}`, descricao: 'Todas as aves em estoque numa página só: sexo, unidade e preço. Marque as quantidades e feche o pedido direto na tabela.' },
  pedido: { titulo: `Meu pedido — ${M}`, descricao: 'Feche seu pedido de aves ornamentais: cidade, rota de entrega e confirmação pelo WhatsApp. Sem pagamento antecipado.' },
  rotas: { titulo: `Rotas de entrega — ${M}`, descricao: 'Calendário das rotas de entrega por região, cidades atendidas e frete por saída a partir de São Paulo.' },
  criadores: EH_REDE ? { titulo: `Criadouros parceiros — ${M}`, descricao: 'Aves Arca, Stima Aves e Criadouro Aliança: quem cria as aves da lista.' } : { titulo: `O criadouro — ${M}`, descricao: `${MARCA_ATUAL.responsavel}, ${MARCA_ATUAL.credencial}: quem cria as aves do ${M}, em ${MARCA_ATUAL.cidade}.` },
  consultoria: { titulo: `Consultoria técnica — ${M}`, descricao: 'Biólogo e zootecnista parceiros da rede: recinto, manejo, nutrição, sanidade e formação de casais para quem cria aves ornamentais.' },
  sanidade: { titulo: `Sanidade e manejo — ${M}`, descricao: EH_REDE ? 'Quarentena, primeiros dias e quando chamar o veterinário.' : `Quarentena, primeiros dias em casa e quando chamar o veterinário — orientação de ${MARCA_ATUAL.responsavel}, ${MARCA_ATUAL.credencial}.` },
  contato: { titulo: `Contato — ${M}`, descricao: `WhatsApp, e-mail e Instagram de ${M}.` },
  privacidade: { titulo: `Privacidade — ${M}`, descricao: 'Como tratamos os dados de quem faz um pedido.' },
};


/** Imagem de compartilhamento desta marca, com endereço absoluto. */
export const OG_IMAGEM = SITE + MARCA_ATUAL.ogImage;

/**
 * Uma página por ave — /aves/<id>. É o que faz "faisão prelado preço" ou
 * "pavão purple criadouro" acharem o site: a vitrine é uma página só, e o
 * Google não indexa filtro. Nos sites de criadouro a chave é a variedade
 * (um lote jovem e um adulto da mesma ave viram uma página só).
 */
export interface PaginaAve {
  slug: string;
  caminho: string;
  nome: string;
  cientifico: string;
  titulo: string;
  descricao: string;
  imagem: string | null;
  preco: number | null;
  emEstoque: boolean;
  resumo: string;
  grupo: string;
}
const corta = (t: string, n: number) => (t.length <= n ? t : t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');
export const PAGINAS_AVES: PaginaAve[] = (() => {
  const vistos = new Set<string>();
  const saida: PaginaAve[] = [];
  for (const a of AVES) {
    const slug = a.variedade ?? a.id;
    if (vistos.has(slug)) continue;
    vistos.add(slug);
    const irmaos = AVES.filter((x) => (x.variedade ?? x.id) === slug);
    const precos = irmaos.map((x) => x.preco).filter((x): x is number => x !== null);
    const preco = precos.length ? Math.min(...precos) : null;
    const emEstoque = irmaos.some((x) => x.machos + x.femeas > 0);
    const precoTxt = preco === null ? 'sob consulta' : `a partir de ${brl(preco)}`;
    const onde = EH_REDE ? 'à pronta entrega, com rota de entrega marcada' : `criado em ${MARCA_ATUAL.cidade} por ${MARCA_ATUAL.responsavel}, ${MARCA_ATUAL.credencial}`;
    const base = a.resumo ? corta(a.resumo, 110) + ' ' : '';
    saida.push({
      slug, caminho: `/aves/${slug}`, nome: a.nome, cientifico: a.cientifico, grupo: a.grupo,
      titulo: `${a.nome} (${a.cientifico}) — ${precoTxt} — ${M}`,
      descricao: corta(`${a.nome}, ${a.cientifico}: ${base}${emEstoque ? 'Disponível agora' : 'Sob consulta'}, ${onde}. Pagamento na entrega.`, 158),
      imagem: a.foto ? SITE + a.foto : null,
      preco, emEstoque, resumo: a.resumo,
    });
  }
  return saida;
})();
export const PAGINA_AVE_DO_SLUG: Record<string, PaginaAve> = Object.fromEntries(PAGINAS_AVES.map((p) => [p.slug, p]));

/** JSON-LD da organização (home) — o que o Google usa para o painel de empresa e o "sameAs". */
export const JSONLD_ORGANIZACAO = {
  '@context': 'https://schema.org',
  '@type': EH_REDE ? 'Organization' : 'LocalBusiness',
  name: M,
  url: SITE + '/',
  logo: SITE + MARCA_ATUAL.logoSelo,
  image: OG_IMAGEM,
  description: MARCA_ATUAL.frase,
  telephone: '+' + MARCA_ATUAL.whatsappLink.replace(/\D/g, ''),
  email: MARCA_ATUAL.email,
  sameAs: [MARCA_ATUAL.instagram],
  address: { '@type': 'PostalAddress', addressLocality: MARCA_ATUAL.cidade.replace(/ – .*$/, ''), addressRegion: 'SP', addressCountry: 'BR' },
  ...(EH_REDE ? {} : { founder: { '@type': 'Person', name: MARCA_ATUAL.responsavel, jobTitle: MARCA_ATUAL.credencial } }),
};

/** JSON-LD de uma ave: Product com oferta (preço em BRL) quando há preço. */
export const jsonldAve = (p: PaginaAve) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: p.nome,
  alternateName: p.cientifico,
  description: p.resumo || p.descricao,
  ...(p.imagem ? { image: p.imagem } : {}),
  category: p.grupo,
  brand: { '@type': 'Brand', name: M },
  url: SITE + p.caminho,
  ...(p.preco !== null ? {
    offers: {
      '@type': 'Offer', priceCurrency: 'BRL', price: p.preco, url: SITE + p.caminho,
      availability: p.emEstoque ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      seller: { '@type': 'Organization', name: M },
    },
  } : {}),
});

export { EH_REDE };
