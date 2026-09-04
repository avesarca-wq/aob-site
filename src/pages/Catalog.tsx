import React, { useState, useMemo, useEffect } from 'react';
import { SPECIES_DATA, SPECIES_PUBLICADAS, NOME_NA_PORTARIA, PORTARIA_ISENTAS, TOTAL_VARIEDADES, GRUPO_SINONIMOS, CONSTANTS, TIER_DISPLAY_NAMES, FOTOS_PROPRIAS, slugDaVariedade, situacaoDe, SITUACAO_ROTULO } from '../data/species';
import { Tier, PageRoute, Grupo } from '../types';
import { Search, ChevronDown, ChevronUp, MessageCircle, Camera } from 'lucide-react';
import { AddToCart } from '../components/AddToCart';
import { GaleriaEspecie } from '../components/GaleriaEspecie';
import { ListaEspera } from '../components/ListaEspera';
import { medir } from '../lib/analytics';
import { Species } from '../types';
import { nomePopularDe, nomePopularParaBusca } from '../data/nomesPopulares';

// Foco vertical da capa (object-position). Padrão 30% — sobe o recorte para não cortar a cabeça.
// Exceções medidas foto a foto em 21/08/2026.
const FOCO_CAPA: Record<string, string> = {
  'Anas Capensis': '50% 12%',
};

// Capa servida pelo Image CDN da Netlify. O card mostra ~420 px — não precisa dos 1600.
// Medido em 21/08/2026: as 43 capas caem de 11,20 MB para 2,38 MB (-79%).
const capaCDN = (u: string, w: number) =>
  `/.netlify/images?url=${encodeURIComponent(u)}&w=${w}&fm=webp&q=80`;

interface CatalogProps {
  onSelectSpeciesForPreReserva: (speciesName: string) => void;
  onNavigate: (page: PageRoute) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ onSelectSpeciesForPreReserva, onNavigate }) => {
  const [selectedTier, setSelectedTier] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');
  const [expandedFichas, setExpandedFichas] = useState<Record<string, boolean>>({});

  /**
   * A ficha técnica nasce ABERTA (decisão do Ricardo, 07/08/2026): ninguém adivinha que precisa
   * clicar, e o dado técnico é justamente o que separa a Aves Arca do mercado informal.
   * O botão continua ali para quem quiser recolher — mudou só o padrão.
   */
  const FICHA_ABERTA_POR_PADRAO = true;

  /** Variedade aberta na galeria (pedido nº2, 07/08/2026). null = galeria fechada. */
  const [galeria, setGaleria] = useState<Species | null>(null);

  /**
   * Variedade que saiu do catálogo (publicado: false) e ainda recebe visita por link antigo.
   * Guarda só o nome, para o aviso — a ficha continua fora do ar.
   */
  const [despublicada, setDespublicada] = useState<string | null>(null);

  /** Página de variedade fora do catálogo não fica no índice do Google. */
  useEffect(() => {
    if (!despublicada) return;
    const el = document.createElement('meta');
    el.name = 'robots';
    el.content = 'noindex';
    document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, [despublicada]);

  useEffect(() => {
    medir('ver_catalogo');
  }, []);

  /** Busca só é registrada quando o visitante para de digitar — senão vira ruído letra a letra. */
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const t = setTimeout(() => medir('buscar', { termo: searchQuery.trim().toLowerCase().slice(0, 40) }), 900);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const toggleFicha = (nome: string) => {
    setExpandedFichas((prev) => {
      const proximo = !(prev[nome] ?? FICHA_ABERTA_POR_PADRAO);
      medir('abrir_ficha', { variedade: nome, aberta: proximo });
      return { ...prev, [nome]: proximo };
    });
  };

  /**
   * URL própria por variedade — /variedade/<slug>.
   * O resto do site segue em hash; só a variedade ganha caminho de verdade, para
   * poder ser compartilhada, entrar no sitemap e receber schema.org.
   */
  const abrirGaleria = (s: Species) => {
    setGaleria(s);
    medir('abrir_galeria', { variedade: s.nome, tem_foto: (s.fotos || []).length > 0 });
    window.history.pushState({ variedade: s.nome }, '', `/variedade/${slugDaVariedade(s.nome)}`);
  };

  const fecharGaleria = () => {
    /* Devolve a pessoa ao card que ela estava vendo. Quem chega por /variedade/<slug>
       nunca rolou o catalogo: sem isto, fechar a galeria joga no topo de 17 mil pixels. */
    const alvo = galeria ? `v-${slugDaVariedade(galeria.nome)}` : null;
    setGaleria(null);
    if (window.location.pathname.startsWith('/variedade/')) {
      window.history.pushState({}, '', '/catalogo');
    }
    if (alvo) {
      /* O modal trava o scroll com overflow:hidden no body. Enquanto a trava estiver de pe,
         scrollIntoView nao faz nada — entao espera ela sair, por ate 20 quadros. */
      let tentativas = 0;
      const irAteOCard = () => {
        const el = document.getElementById(alvo);
        const travado = getComputedStyle(document.body).overflow === 'hidden';
        if (el && !travado) {
          el.scrollIntoView({ block: 'center' });
          return;
        }
        if (tentativas++ < 20) requestAnimationFrame(irAteOCard);
      };
      requestAnimationFrame(irAteOCard);
    }
  };

  /** Abre a galeria quando a pessoa chega por link direto e responde ao botão voltar. */
  useEffect(() => {
    const daURL = () => {
      const m = window.location.pathname.match(/^\/variedade\/([a-z0-9-]+)\/?$/);
      if (!m) {
        setGaleria(null);
        setDespublicada(null);
        return;
      }
      const achada = SPECIES_PUBLICADAS.find((s) => slugDaVariedade(s.nome) === m[1]);
      setGaleria(achada ?? null);
      const fora = achada
        ? null
        : SPECIES_DATA.find((s) => s.publicado === false && slugDaVariedade(s.nome) === m[1]);
      setDespublicada(fora ? fora.nome : null);
    };
    daURL();
    window.addEventListener('popstate', daURL);
    return () => window.removeEventListener('popstate', daURL);
  }, []);

  /**
   * Título e tags de compartilhamento por variedade.
   * Robô de rede social não roda JavaScript: quem entrega isto a ele é a extensão
   * Prerender da Netlify, que serve o HTML já renderizado. Sem ela, o link continua
   * com a prévia genérica do site.
   */
  useEffect(() => {
    const meta = (chave: string, attr: 'property' | 'name') => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${chave}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, chave);
        document.head.appendChild(el);
      }
      return el;
    };
    const CAMPOS: Array<[string, 'property' | 'name']> = [
      // 29/08/2026: a description de busca ficava a generica do site nas 39 variedades.
      // As og: ja eram proprias; a que o Google le, nao era.
      ['description', 'name'],
      ['og:title', 'property'],
      ['og:description', 'property'],
      ['og:image', 'property'],
      ['og:url', 'property'],
      ['twitter:title', 'name'],
      ['twitter:description', 'name'],
      ['twitter:image', 'name'],
    ];
    const canonica = (() => {
      let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!el) {
        el = document.createElement('link');
        el.rel = 'canonical';
        document.head.appendChild(el);
      }
      return el;
    })();
    const original = {
      titulo: document.title,
      metas: CAMPOS.map(([c, a]) => meta(c, a).content),
      canonica: canonica.href,
    };
    if (galeria) {
      const base = window.location.origin;
      const url = `${base}/variedade/${slugDaVariedade(galeria.nome)}`;
      const foto =
        galeria.fotos && galeria.fotos.length > 0
          ? `${base}${galeria.fotos[0]}`
          : meta('og:image', 'property').content;
      const titulo = `${galeria.nome} — Aves Arca`;
      document.title = titulo;
      meta('og:title', 'property').content = titulo;
      meta('og:description', 'property').content = galeria.resumo;
      meta('og:image', 'property').content = foto;
      meta('og:url', 'property').content = url;
      /* 29/08/2026: sem esta linha as 39 URLs de variedade declaravam a HOME como versao
         canonica de si mesmas — ou seja, pediam ao Google para nao indexa-las. */
      meta('description', 'name').content = galeria.resumo;
      canonica.href = url;
      meta('twitter:title', 'name').content = titulo;
      meta('twitter:description', 'name').content = galeria.resumo;
      meta('twitter:image', 'name').content = foto;
    }
    return () => {
      canonica.href = original.canonica;
      document.title = original.titulo;
      CAMPOS.forEach(([c, a], i) => {
        meta(c, a).content = original.metas[i];
      });
    };
  }, [galeria]);

  /** schema.org da variedade aberta — sai do <head> quando a galeria fecha. */
  useEffect(() => {
    const ID = 'ld-variedade';
    const antigo = document.getElementById(ID);
    if (antigo) antigo.remove();
    if (!galeria) return;
    const base = window.location.origin;
    const url = `${base}/variedade/${slugDaVariedade(galeria.nome)}`;
    const dados: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: galeria.nome,
      description: galeria.resumo,
      category: 'Aves ornamentais',
      url,
      brand: { '@type': 'Brand', name: 'Aves Arca' },
    };
    if (galeria.fotos && galeria.fotos.length > 0) {
      dados.image = galeria.fotos.map((f) => `${base}${f}`);
    }
    // Só declara preço quando ele está confirmado no Bling — senão o dado seria inventado.
    // E só quando a reserva está aberta: anunciar oferta de ave que não está à venda seria
    // promessa falsa no resultado de busca (situação decidida em 25/08/2026).
    if (galeria.preco_confirmado && galeria.casal && situacaoDe(galeria) === 'aberta') {
      dados.offers = {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: galeria.casal,
        availability: 'https://schema.org/PreOrder',
        url,
      };
    }
    const el = document.createElement('script');
    el.id = ID;
    el.type = 'application/ld+json';
    // Migalha de pão: Início > Catálogo > variedade. O Google mostra essa trilha no resultado.
    const trilha = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${base}/catalogo` },
        { '@type': 'ListItem', position: 3, name: galeria.nome, item: url },
      ],
    };
    el.textContent = JSON.stringify([dados, trilha]);
    document.head.appendChild(el);
    return () => {
      const s = document.getElementById(ID);
      if (s) s.remove();
    };
  }, [galeria]);

  const filteredSpecies = useMemo(() => {
    const normalizeText = (text: string) =>
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const stopWords = new Set(['de', 'do', 'da', 'e']);
    const normQuery = normalizeText(searchQuery);
    const queryWords = normQuery
      ? normQuery.split(' ').filter((w) => w.length > 0 && !stopWords.has(w))
      : [];

    /**
     * Busca só pelo nome de um grupo ("marreco", "gansos") vira FILTRO por grupo —
     * mas apenas se alguma variedade já estiver classificada nesse grupo. Enquanto a
     * régua comercial do Ricardo não estiver preenchida para uma família, a busca cai
     * no comportamento antigo (texto corrido), sem perder resultado nenhum.
     */
    const grupoBuscado = (Object.keys(GRUPO_SINONIMOS) as Grupo[]).find(
      (g) =>
        queryWords.length > 0 &&
        queryWords.every((w) => GRUPO_SINONIMOS[g].includes(w)) &&
        SPECIES_PUBLICADAS.some((sp) => sp.grupo === g)
    );

    let result = SPECIES_PUBLICADAS.filter((s) => {
      const matchTier = selectedTier === 'Todos' || s.tier === selectedTier;
      if (!matchTier) return false;

      if (queryWords.length === 0) return true;
      if (grupoBuscado) return s.grupo === grupoBuscado;

      const levelLabel = TIER_DISPLAY_NAMES[s.tier] || '';
      const especieBaseText = s.especie_base ? s.especie_base : '';
      // O grupo entra na busca com singular e plural: "marrecos" acha o que está marcado como "Marreco".
      const grupoText = s.grupo ? GRUPO_SINONIMOS[s.grupo].join(' ') : '';
      // O nome popular entra na busca mesmo quando não aparece no card: quem procura por
      // "marreco de bico vermelho" precisa achar a Anas Erythrorhyncha.
      const nomePopularText = nomePopularParaBusca(s.cientifico);
      const searchableText = normalizeText(
        `${s.nome} ${s.cientifico} ${nomePopularText} ${especieBaseText} ${s.resumo} ${levelLabel} ${grupoText}`
      );

      return queryWords.every((word) => searchableText.includes(word));
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => Math.min(a.macho, a.femea) - Math.min(b.macho, b.femea));
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => Math.min(b.macho, b.femea) - Math.min(a.macho, a.femea));
    } else if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.nome.localeCompare(b.nome));
    }

    return result;
  }, [selectedTier, searchQuery, sortBy]);

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const getTierBadgeClass = (tier: Tier) => {
    switch (tier) {
      case 'Bronze':
        return 'badge-bronze';
      case 'Prata':
        return 'badge-prata';
      case 'Ouro':
        return 'badge-ouro';
      case 'Diamante':
        return 'badge-diamante';
    }
  };

  const getEmojiForSpecies = (nome: string, cientifico: string) => {
    const lower = (nome + ' ' + cientifico).toLowerCase();
    if (lower.includes('cisne') || lower.includes('ganso') || lower.includes('cygnus') || lower.includes('anser') || lower.includes('branta') || lower.includes('cereopsis')) {
      return '🦢';
    }
    return '🦆';
  };

  return (
    <div>
      {/* HEADER BANNER */}
      <section className="bg-[#FAFBF8] py-12 border-b border-[#E0E2D9]">
        <div className="wrap">
          <div className="eyebrow">Catálogo de Variedades</div>
          <h1 className="sec-title text-3xl sm:text-4xl font-serif font-semibold text-[#4A5D4E]">
            Espécies e variedades
          </h1>
          <p className="sec-sub text-base sm:text-lg mb-6">
            As {TOTAL_VARIEDADES} variedades da linha da Aves Arca, organizadas por nível de raridade. Preços de referência para Macho e Fêmea; disponibilidade e pré-reserva confirmadas pelo WhatsApp.
          </p>

          {despublicada && (
            <div className="mt-2 mb-6 rounded-2xl border border-[#E0E2D9] bg-white px-5 py-4">
              <p className="font-sans text-sm text-[#4A5D4E]">
                <strong>{despublicada}</strong> está temporariamente fora do catálogo enquanto
                regularizamos a documentação desta espécie.
              </p>
              <p className="font-sans text-xs text-[#5A635C] mt-1">
                As demais variedades continuam disponíveis abaixo.
              </p>
            </div>
          )}

          {/* CONTROLS BAR: FILTERS, SEARCH, SORT */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mt-6 bg-white p-4 rounded-2xl border border-[#E0E2D9] shadow-sm">
            {/* LEVEL BUTTONS */}
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Bronze', 'Prata', 'Ouro', 'Diamante'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTier(t)}
                  className={`px-4 py-1.5 rounded-full font-sans text-xs font-bold transition-all ${
                    selectedTier === t
                      ? 'bg-[#4A5D4E] text-white shadow-sm'
                      : 'bg-white text-[#4A5D4E] border border-[#E0E2D9] hover:bg-[#FAFBF8]'
                  }`}
                >
                  {t === 'Todos' ? 'Todos' : TIER_DISPLAY_NAMES[t as Tier]}
                </button>
              ))}
            </div>

            {/* SEARCH AND SORT */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A635C]" />
                <input
                  type="text"
                  placeholder="Buscar espécie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs font-sans rounded-full border border-[#E0E2D9] focus:outline-none focus:border-[#D4A373] w-full sm:w-48 bg-white text-[#2D3436]"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-3 text-xs font-sans rounded-full border border-[#E0E2D9] bg-white text-[#2D3436] focus:outline-none focus:border-[#D4A373] w-full sm:w-auto"
              >
                <option value="default">Ordenação padrão</option>
                <option value="price-asc">Menor preço (Macho/Fêmea)</option>
                <option value="price-desc">Maior preço (Macho/Fêmea)</option>
                <option value="name-asc">Nome (A-Z)</option>
              </select>
            </div>
          </div>

          {/* COUNTER & NOTE */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-sans text-[#5A635C]">
            <span>
              Exibindo <strong>{filteredSpecies.length}</strong> de <strong>{TOTAL_VARIEDADES}</strong> variedades
            </span>
            <span className="italic">
              * "Foto ilustrativa" indica imagem de referência da espécie, não do nosso plantel.
            </span>
          </div>

          <div className="note-callout mt-4 text-xs">
            <strong>Nota de Procedência:</strong> Exemplares comercializados apenas quando nascidos no próprio plantel, com registro e documentação sanitária/ambiental.
            </div>

            <div className="note-callout mt-3 text-xs">
              <strong>Avaliações públicas:</strong> 96% de recomendação em 20 avaliações na página
              do Facebook e 4,4 de 5 em 7 avaliações no Google — números lidos nos dois perfis em
              29/08/2026. Não publicamos depoimento sem origem verificável.
            </div>

          <div className="note-callout mt-3 text-xs">
            <strong>As {TOTAL_VARIEDADES} constam do Anexo I</strong> da{' '}
            <a
              href={PORTARIA_ISENTAS.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#C1732B]"
            >
              {PORTARIA_ISENTAS.rotulo}
            </a>
            , a lista de espécies isentas de controle. Cada card traz o selo e o nome exatamente
            como está escrito no anexo — sete espécies mudaram de gênero desde 2019 e constam lá
            sob outro nome.
          </div>
        </div>
      </section>

      {/* CATALOG GRID */}
      <section className="py-12 bg-[#F8F9F5]">
        <div className="wrap">
          {filteredSpecies.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#E0E2D9] px-4">
              <p className="font-serif text-xl text-[#4A5D4E] mb-2">Nenhuma variedade encontrada.</p>
              <p className="font-sans text-sm text-[#5A635C] max-w-md mx-auto mb-4 leading-relaxed">
                Tente ajustar os termos da busca, mudar o filtro de nível ou fale conosco no WhatsApp para consultar outras espécies e disponibilidades.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent(
                    searchQuery
                      ? `Olá! Estava buscando por "${searchQuery}" no catálogo de variedades e gostaria de consultar a disponibilidade.`
                      : 'Olá! Não encontrei a variedade desejada no catálogo e gostaria de consultar informações.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa text-xs px-5 py-2 inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  Falar no WhatsApp
                </a>
                <button
                  onClick={() => {
                    setSelectedTier('Todos');
                    setSearchQuery('');
                    setSortBy('default');
                  }}
                  className="btn btn-ghost text-xs px-5 py-2"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpecies.map((s) => {
                const isExpanded = expandedFichas[s.nome] ?? FICHA_ABERTA_POR_PADRAO;
                const emoji = getEmojiForSpecies(s.nome, s.cientifico);
                const hasFicha = s.ficha !== null;
                const nomePopular = nomePopularDe(s);
                const situacao = situacaoDe(s);

                return (
                  <article
                    key={s.nome}
                    id={`v-${slugDaVariedade(s.nome)}`}
                    className="spec border border-[#E0E2D9] rounded-3xl overflow-hidden bg-white flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      {/* CAPA — clicável, abre a galeria da variedade (até 5 fotos + ficha) */}
                      <button
                        type="button"
                        onClick={() => abrirGaleria(s)}
                        aria-label={`Ver fotos e ficha de ${s.nome}`}
                        className="group w-full h-52 bg-gradient-to-br from-[#3d4d40] to-[#4A5D4E] flex items-center justify-center relative cursor-pointer overflow-hidden"
                      >
                        {s.fotos && s.fotos.length > 0 ? (
                          <picture>
                            <source
                              srcSet={`${capaCDN(s.fotos[0], 500)} 500w, ${capaCDN(s.fotos[0], 900)} 900w`}
                              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              type="image/webp"
                            />
                            <img
                              src={s.fotos[0]}
                              alt={s.nome}
                              loading="lazy"
                              style={{ objectPosition: FOCO_CAPA[s.nome] ?? '50% 30%' }}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </picture>
                        ) : (
                          <span className="text-4xl select-none">{emoji}</span>
                        )}
                        <span className={`badge-tier ${getTierBadgeClass(s.tier)} absolute bottom-2 right-3 shadow-sm`}>
                          {TIER_DISPLAY_NAMES[s.tier]}
                        </span>
                        <span className="absolute bottom-2 left-3 inline-flex items-center gap-1.5 text-[0.65rem] font-sans font-bold uppercase tracking-wider text-white/90 bg-[#17282A]/40 rounded-full px-2.5 py-1 transition-colors group-hover:bg-[#C1732B]">
                          <Camera className="w-3 h-3" />
                          {s.fotos && s.fotos.length > 0 ? `ver ${s.fotos.length} fotos` : 'ver detalhes'}
                        </span>
                      </button>

                      <div className="p-5">
                        {/* NOMES — comercial no título; popular e científico rotulados abaixo */}
                        <h3 className="font-serif font-semibold text-xl text-[#4A5D4E] mb-0.5">
                          <a
                  href={`/variedade/${slugDaVariedade(s.nome)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    abrirGaleria(s);
                  }}
                  className="text-left hover:text-[#C1732B] transition-colors cursor-pointer"
                >
                  {s.nome}
                </a>
                        </h3>
                        {nomePopular && (
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-sans text-[0.6rem] uppercase tracking-wider text-[#8C968F] shrink-0">
                              Nome popular
                            </span>
                            <span className="font-serif text-xs text-[#2D3436]">{nomePopular}</span>
                          </div>
                        )}
                        <div className="flex items-baseline gap-1.5 mb-3">
                          <span className="font-sans text-[0.6rem] uppercase tracking-wider text-[#8C968F] shrink-0">
                            Nome científico
                          </span>
                          <span className="font-serif italic text-xs text-[#5A635C]">{s.cientifico}</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 -mt-2.5 mb-3">
                          <span className="font-sans text-[0.6rem] uppercase tracking-wider text-[#8C968F] shrink-0">
                            Na portaria
                          </span>
                          <span className="font-serif italic text-xs text-[#5A635C]">
                            {NOME_NA_PORTARIA[s.cientifico] ?? s.cientifico}
                          </span>
                        </div>
                        {/* SITUAÇÃO COMERCIAL — as três decididas em 25/08/2026 (planilha 05.6.18). */}
                        <div className="-mt-2 mb-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-[0.58rem] font-bold uppercase tracking-wider ${
                              situacao === 'aberta'
                                ? 'border border-[#14504B] bg-[#14504B] text-white'
                                : situacao === 'espera'
                                  ? 'border border-[#C1732B] bg-[#C1732B]/10 text-[#8A4E17]'
                                  : 'border border-[#C9C2B2] bg-[#F1EBDD] text-[#5A635C]'
                            }`}
                          >
                            {SITUACAO_ROTULO[situacao]}
                          </span>
                        </div>
                        <div className="-mt-2 mb-3">
                          <span className="inline-flex items-center rounded-full border border-[#E0E2D9] bg-[#FAFBF8] px-2.5 py-0.5 font-sans text-[0.58rem] font-bold uppercase tracking-wider text-[#5A635C]">
                            {PORTARIA_ISENTAS.selo}
                          </span>
                        </div>

                        {s.fotos && s.fotos.length > 0 && !FOTOS_PROPRIAS.has(s.nome) && (
                          <p className="font-sans text-[0.6rem] italic text-[#8C968F] -mt-2 mb-3">
                            Foto ilustrativa da espécie
                          </p>
                        )}

                        {/* RESUMO */}
                        <p className="font-serif text-xs leading-relaxed text-[#2D3436] bg-[#FAFBF8] p-3 rounded-2xl border border-[#E0E2D9] mb-4">
                          {s.resumo}
                        </p>

                        {/* PREÇO — some por completo em SÓ NO PLANTEL: ave que não está à venda não tem preço. */}
                        {situacao !== 'plantel' && (
                          <table className="price-table mb-4">
                            <tbody>
                              <tr>
                                <td className="text-[#5A635C]">Macho</td>
                                <td className="font-bold text-[#4A5D4E] text-sm">
                                  {s.preco_confirmado ? formatBRL(s.macho) : 'Sob consulta'}
                                </td>
                              </tr>
                              <tr>
                                <td className="text-[#5A635C]">Fêmea</td>
                                <td className="font-bold text-[#4A5D4E] text-sm">
                                  {s.preco_confirmado ? formatBRL(s.femea) : 'Sob consulta'}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}

                        {/* DETALHES TÉCNICOS ACCORDION (ONLY IF FICHA IS NOT NULL) */}
                        {hasFicha && (
                          <div className="mb-4 border-t border-[#E0E2D9] pt-3">
                            <button
                              onClick={() => toggleFicha(s.nome)}
                              className="w-full flex items-center justify-between text-xs font-sans font-semibold text-[#4A5D4E] hover:text-[#D4A373] transition-colors py-1"
                            >
                              <span>Detalhes técnicos (Ficha)</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {isExpanded && s.ficha && (
                              <div className="mt-2.5 p-3 bg-[#FAFBF8] rounded-xl text-xs space-y-1.5 border border-[#E0E2D9] animate-fadeIn">
                                {s.ficha.porte && (
                                  <div className="flex justify-between">
                                    <span className="font-sans text-[0.7rem] uppercase text-[#5A635C]">Porte:</span>
                                    <span className="font-serif font-medium text-[#2D3436]">{s.ficha.porte}</span>
                                  </div>
                                )}
                                {s.ficha.peso && (
                                  <div className="flex justify-between">
                                    <span className="font-sans text-[0.7rem] uppercase text-[#5A635C]">Peso adulto:</span>
                                    <span className="font-serif font-medium text-[#2D3436]">{s.ficha.peso}</span>
                                  </div>
                                )}
                                {s.ficha.agua && (
                                  <div className="flex justify-between">
                                    <span className="font-sans text-[0.7rem] uppercase text-[#5A635C]">Água:</span>
                                    <span className="font-serif font-medium text-[#2D3436]">{s.ficha.agua}</span>
                                  </div>
                                )}
                                {s.ficha.salinidade && (
                                  <div className="flex justify-between">
                                    <span className="font-sans text-[0.7rem] uppercase text-[#5A635C]">Tolera Salinidade:</span>
                                    <span className="font-serif font-medium text-[#2D3436]">{s.ficha.salinidade}</span>
                                  </div>
                                )}
                                {s.ficha.area_min_casal && (
                                  <div className="flex justify-between">
                                    <span className="font-sans text-[0.7rem] uppercase text-[#5A635C]">Área mín. casal:</span>
                                    <span className="font-serif font-medium text-[#2D3436]">{s.ficha.area_min_casal}</span>
                                  </div>
                                )}
                                {s.ficha.territorialidade && (
                                  <div className="flex justify-between">
                                    <span className="font-sans text-[0.7rem] uppercase text-[#5A635C]">Territorialidade:</span>
                                    <span className="font-serif font-medium text-[#2D3436]">{s.ficha.territorialidade}</span>
                                  </div>
                                )}
                                {s.ficha.incubacao && (
                                  <div className="flex justify-between">
                                    <span className="font-sans text-[0.7rem] uppercase text-[#5A635C]">Incubação:</span>
                                    <span className="font-serif font-medium text-[#2D3436]">{s.ficha.incubacao}</span>
                                  </div>
                                )}
                                {s.ficha.postura && (
                                  <div className="flex justify-between">
                                    <span className="font-sans text-[0.7rem] uppercase text-[#5A635C]">Postura:</span>
                                    <span className="font-serif font-medium text-[#2D3436]">{s.ficha.postura}</span>
                                  </div>
                                )}
                                {s.ficha.longevidade && (
                                  <div className="flex justify-between">
                                    <span className="font-sans text-[0.7rem] uppercase text-[#5A635C]">Longevidade:</span>
                                    <span className="font-serif font-medium text-[#2D3436]">{s.ficha.longevidade}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AÇÕES — `mt-auto` cola no rodapé para os cards da linha terminarem juntos */}
                    <div className="p-5 pt-0 grid grid-cols-1 gap-2 mt-auto">
                      <AddToCart
                        species={s}
                        onIrParaPedido={() => onSelectSpeciesForPreReserva(s.nome)}
                      />

                      {/* 27/08/2026: a ordem e o peso estavam invertidos — o WhatsApp era o botao cheio
                          e o "Adicionar a pre-reserva" era o palido. A saida que nao escala tinha o desenho
                          da que escala. Agora o pedido vem primeiro e a consulta fica como link. */}
                      <a
                        href={`${CONSTANTS.WHATSAPP_LINK}?text=${encodeURIComponent(
                          `Olá, tenho interesse na variedade ${s.nome} (${TIER_DISPLAY_NAMES[s.tier]})`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => medir('clicar_whatsapp', { de: 'card', variedade: s.nome })}
                        className="font-sans text-[0.72rem] text-[#4A5D4E] underline underline-offset-2 inline-flex items-center justify-center gap-1.5 py-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Consultar no WhatsApp
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* FOOTNOTE */}
          <div className="mt-12 text-center border-t border-[#E0E2D9] pt-6">
            <p className="font-sans text-xs text-[#5A635C]">
              Resumos e fichas: Compêndio Técnico do Plantel (03.1). Valores de manejo são referências mínimas, a confirmar com o plantel.
            </p>
          </div>
        </div>
      </section>

      {/* LISTA DA PRÓXIMA TEMPORADA — destino do botão das variedades em lista de espera. */}
      <ListaEspera />

      {/* GALERIA DA VARIEDADE — abre pelo clique no card */}
      {galeria && (
        <GaleriaEspecie
          especie={galeria}
          aberta={!!galeria}
          onFechar={fecharGaleria}
          onAdicionar={() => onSelectSpeciesForPreReserva(galeria.nome)}
        />
      )}
    </div>
  );
};
