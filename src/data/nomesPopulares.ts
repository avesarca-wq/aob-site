import { Species } from '../types';

/**
 * NOME POPULAR EM PORTUGUÊS — camada de tradução para o cliente (14/08/2026).
 *
 * O catálogo comercial da Aves Arca herdou nomes de criador ("Anas Erythrorhyncha",
 * "Nyroca", "Ash Red", "Mergus Cuculatus"): dizem tudo para quem cria e nada para quem
 * compra. Este arquivo NÃO renomeia nada — o `nome` continua sendo o nome comercial,
 * que é o mesmo do Bling, do HubSpot, do carrinho e do pedido. Ele só acrescenta, ao
 * lado, o nome popular consagrado em português, com a fonte registrada linha a linha.
 *
 * REGRA: nenhum nome inventado. Cada entrada tem fonte. Onde o português consagrado
 * é de Portugal e não do Brasil, está anotado. Onde a fonte é fraca, está anotado.
 *
 * Chave = nome científico normalizado (minúsculas, sem acento). As mutações compartilham
 * a chave da espécie-base — "Pato Carolina Silver" e "Pato Carolina" são ambos Aix sponsa.
 */
export const NOMES_POPULARES: Record<string, string> = {
  // ── PATOS E MARRECOS ────────────────────────────────────────────────────────
  /** Wikipédia PT · Avibase. No Brasil também "marreco" / "marreco-selvagem" (mallard). */
  'anas platyrhynchos': 'Pato-real',
  /** Priberam · Avibase. Uso lusófono africano; variante "marreco-do-cabo". */
  'anas capensis': 'Marrequinha-do-cabo',
  /** Wikipédia PT · Aves do Mundo (lista de nomes portugueses, 2024). */
  'netta rufina': 'Pato-de-bico-vermelho',
  /** IBAMA, Anexo I (espécies isentas de controle) · Wikipédia PT. Em PT-PT: "pato-carolino". */
  'aix sponsa': 'Pato-carolina',
  /** Wikipédia PT · IBAMA, Anexo I. */
  'aix galericulata': 'Pato-mandarim',
  /** Priberam · Wikipédia PT. Muito conhecido também como "casarca". */
  'tadorna ferruginea': 'Pato-ferrugíneo',
  /** Wikipédia PT · Aves do Mundo 2024. Confiança média (nome pouco usado no Brasil). */
  'anas castanea': 'Marrequinha-castanha',
  /** Wikipédia PT · Aves do Mundo 2024. */
  'mareca strepera': 'Frisada',
  /** Priberam · listas lusófonas de Angola e Moçambique. */
  'anas undulata': 'Pato-de-bico-amarelo',
  /** Compêndio Técnico do Plantel 03.1, p. 83: "Pato-de-bico-pintado / Indian Spot-billed Duck". */
  'anas poecilorhyncha': 'Pato-de-bico-pintado',
  /** Compêndio Técnico do Plantel 03.1, p. 388: "Ganso-do-Egito / Egyptian Goose". A Portaria
   *  2.489/2019 chama de "ganso-do-nilo" — o sinônimo de busca cobre as duas leituras. */
  'alopochen aegyptiaca': 'Ganso-do-Egito',
  /** Nome de mercado, decidido pelo Ricardo em 25/08/2026: é assim que o criador brasileiro
   *  chama esta ave. Substitui "Marreco-de-bico-vermelho" (Avibase / lista de Angola), que era
   *  tradução correta mas ninguém usa aqui. */
  'anas erythrorhyncha': 'Red Billed',
  /** Avibase · Priberam ("tadorna-da-oceania"). Confiança média. */
  'radjah radjah': 'Pato-rajá',
  /** Priberam · Avibase. Variante PT-BR no Avibase: "pato-de-cabeça-cinzenta". */
  'tadorna cana': 'Tadorna-sul-africana',
  /** Wikipédia PT · Aves do Mundo 2024. Também "tadorna-comum". */
  'tadorna tadorna': 'Pato-branco',
  /** Wikipédia PT · Priberam. */
  'tadorna variegata': 'Pato-do-paraíso',
  /** Wikipédia PT · Aves do Mundo 2024. */
  'mareca penelope': 'Piadeira-comum',
  /** Wikipédia PT · Aves do Mundo 2024. */
  'mareca falcata': 'Pato-falcado',
  /** Wikipédia PT · Aves do Mundo 2024. */
  'aythya nyroca': 'Zarro-castanho',
  /** Avibase · Priberam ("marrequinha-de-bico-azul", PT-PT). Confiança média. */
  'spatula hottentota': 'Marreco-hotentote',
  /** Priberam · Avibase · BioDiversity4All. Confiança média. */
  'lophodytes cucullatus': 'Merganso-capuchinho',
  /** Wikipédia PT · Aves do Mundo 2024. Também "pato-colhereiro". */
  'spatula clypeata': 'Pato-trombeteiro',
  /** Wikipédia PT · Priberam. */
  'anas crecca': 'Marrequinha-comum',
  /** Avibase · Priberam · BioDiversity4All. Confiança média. */
  'tadorna tadornoides': 'Pato-australiano',
  /** Infopédia · Priberam · Avibase. ⚠️ É PATO, não ganso (o nome comercial diz "Ganso Maned"). */
  'chenonetta jubata': 'Pato-de-crina',

  // ── CISNE ───────────────────────────────────────────────────────────────────
  /** Wikipédia PT · IBAMA, Anexo I. */
  'cygnus atratus': 'Cisne-negro',

  // ── GANSOS ──────────────────────────────────────────────────────────────────
  /** Wikipédia PT · Branta sandvicensis; nome havaiano "nene". */
  'branta sandvicensis': 'Ganso-do-havaí',
  /** Aves do Mundo 2024 · Wikipédia PT. */
  'anser indicus': 'Ganso-de-cabeça-listada',
  /** Avibase · Aves do Mundo 2024. Sem ocorrência no Brasil, logo sem nome CBRO. */
  'cereopsis novaehollandiae': 'Ganso-cinzento-australiano',
  /** Wikipédia PT · Avibase. No Brasil corre também como "ganso-canadense". */
  'branta canadensis': 'Ganso-do-canadá',
  /** Avibase · Aves do Mundo 2024. Ganso patagônico. */
  'chloephaga poliocephala': 'Ganso-de-cabeça-cinzenta',
  /** Infopédia · Avibase. Ganso patagônico. */
  'chloephaga rubidiceps': 'Ganso-de-cabeça-ruiva',
  /** Avibase · BioDiversity4All. Endêmico da Etiópia (daí "da Abissínia" no nome comercial). */
  'cyanochen cyanoptera': 'Ganso-de-asas-azuis',
  /** Avibase · Aves do Mundo 2024. */
  'chloephaga melanoptera': 'Ganso-andino',
  /** Avibase · eBird PT. A subespécie minima não tem nome próprio em português. */
  'branta hutchinsii minima': 'Ganso-palrador',
  /** Priberam · Infopédia · Avibase. */
  'anser canagicus': 'Ganso-imperador',
  /** Wikipédia PT ("ganso-pequeno") · Avibase · Aves do Mundo 2024. */
  'anser erythropus': 'Ganso-pequeno-de-testa-branca',
  /** eBird PT · Priberam · Avibase. Em PT-PT: "ganso-de-ross". */
  'anser rossii': 'Ganso-das-neves-pequeno',
};

/** Minúsculas, sem acento, hífen vira espaço. Mesma régua da busca do catálogo. */
const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Termos que entram SÓ na busca, nunca na tela. Existem quando o nome de mercado (o que vai no
 * card) e o nome de livro são diferentes: quem digitar um precisa achar o outro. Sem isto, trocar
 * o rótulo do card apaga em silêncio um caminho de busca que já funcionava.
 */
const SINONIMOS_DE_BUSCA: Record<string, string> = {
  /** 25/08/2026: o card passou a exibir "Red Billed"; a tradução continua achando a ave. */
  'anas erythrorhyncha': 'Marreco-de-bico-vermelho pato-de-bico-vermelho red-billed teal',
  /** 25/08/2026: o nome comercial é "Spotbill"; quem digitar em português ou o nome de livro acha. */
  'anas poecilorhyncha': 'spotbill spot-billed indian spot-billed duck pato de bico pintado',
  /** "ganso-do-nilo" é como a Portaria 2.489/2019 grafa; "aegypticus" é a grafia dela. */
  'alopochen aegyptiaca': 'ganso-do-nilo ganso do egito egyptian goose alopochen aegypticus',
};

/** O nome popular cru + sinônimos, para entrar no texto de busca mesmo quando não é exibido. */
export const nomePopularParaBusca = (cientifico: string): string => {
  const chave = normalizar(cientifico);
  return [NOMES_POPULARES[chave] || '', SINONIMOS_DE_BUSCA[chave] || ''].filter(Boolean).join(' ');
};

/**
 * O nome popular a EXIBIR. Só devolve null quando NÃO existe nome popular registrado.
 *
 * Antes havia uma segunda regra: se o nome comercial já contivesse o popular ("Pato Carolina"
 * / "Pato-carolina"), a linha sumia. Parecia economia de espaço, mas deixava 12 das 48 fichas
 * com um campo a menos que as outras — e ficha que muda de forma de card para card obriga o
 * cliente a reprocurar a informação toda vez. Padronização vale mais do que a linha economizada
 * (decisão do Ricardo, 14/08/2026). Hoje TODO card mostra nome popular e nome científico.
 */
export const nomePopularDe = (especie: Pick<Species, 'nome' | 'cientifico'>): string | null => {
  const popular = NOMES_POPULARES[normalizar(especie.cientifico)];
  if (!popular) return null;
  return popular;
};