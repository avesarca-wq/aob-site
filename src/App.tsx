import { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { CAMINHOS, ROTA_DO_CAMINHO } from './lib/links';
import { TOTAL_VARIEDADES } from './data/species';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartProvider } from './cart/CartContext';

import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Procedencia } from './pages/Procedencia';
import { Entrega } from './pages/Entrega';
import { Sobre } from './pages/Sobre';
import { PreReserva } from './pages/PreReserva';
import { Contato } from './pages/Contato';
import { Privacidade } from './pages/Privacidade';
import { Faq } from './pages/Faq';

/** Título e descrição de cada página — únicos, que é o que o Google pede. */
const META: Record<PageRoute, { titulo: string; descricao: string }> = {
  home: {
    titulo: 'Aves Arca — Anatídeos Ornamentais de Procedência',
    descricao:
      `Criadouro de patos, marrecos, gansos e cisnes ornamentais nascidos no plantel, com documentação de origem, sanidade e transporte legal. ${TOTAL_VARIEDADES} variedades.`,
  },
  especies: {
    titulo: `Catálogo: ${TOTAL_VARIEDADES} variedades de aves ornamentais — Aves Arca`,
    descricao:
      'Patos, marrecos, gansos e cisnes ornamentais por nível de raridade, com ficha técnica, preço de referência e pré-reserva sem pagamento antecipado.',
  },
  procedencia: {
    titulo: 'Procedência: como provamos a origem de cada ave — Aves Arca',
    descricao:
      'Registro, documentação sanitária e ambiental. O que separa um criadouro com procedência do mercado informal de aves ornamentais.',
  },
  entrega: {
    titulo: 'Entrega de aves ornamentais em todo o Brasil — Aves Arca',
    descricao:
      'Como funciona o transporte das aves: rotas, prazos, documentação de trânsito e o que conferir na entrega. Você paga só quando recebe.',
  },
  sobre: {
    titulo: 'Sobre a Aves Arca — criadouro de anatídeos ornamentais',
    descricao:
      'Quem somos, como nasceu o plantel de 200 casais e por que procedência — e não preço — é o nosso padrão.',
  },
  'pre-reserva': {
    titulo: 'Pré-reserva 2026 — sem pagamento antecipado — Aves Arca',
    descricao:
      'Garanta seu lugar na fila de nascimentos do ciclo 2026. Sem pagamento antecipado: você paga na entrega, com a ave e a documentação conferidas.',
  },
  contato: {
    titulo: 'Contato — Aves Arca',
    descricao: 'Fale com o criadouro sobre disponibilidade, variedades e entrega.',
  },
  faq: {
    titulo: 'Dúvidas sobre criar aves ornamentais — Aves Arca',
    descricao:
      'Respostas às perguntas que mais chegam: legalidade, documentação, estrutura mínima, manejo, transporte e prazos.',
  },
  privacidade: {
    titulo: 'Política de privacidade — Aves Arca',
    descricao: 'Como tratamos os dados de quem entra em contato ou faz pré-reserva.',
  },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedSpeciesForPreReserva, setSelectedSpeciesForPreReserva] = useState<string>('');
  const [enderecoExiste, setEnderecoExiste] = useState(true);

  /** Qual página o endereço atual representa. */
  const paginaDaURL = (): PageRoute => {
    const caminho = window.location.pathname.replace(/\/+$/, '') || '/';
    if (caminho.startsWith('/variedade/')) return 'especies';
    if (ROTA_DO_CAMINHO[caminho]) return ROTA_DO_CAMINHO[caminho];
    const hash = window.location.hash.replace('#', '') as PageRoute;
    if (CAMINHOS[hash]) return hash;
    return 'home';
  };

  /**
   * Endereco que nao existe precisa dizer que nao existe. Antes qualquer coisa inventada
   * — /loja-online, um link velho de rede social, um erro de digitacao — abria a home com
   * status 200, e o Google registrava cada uma como copia da home.
   */
  const caminhoConhecido = (): boolean => {
    const caminho = window.location.pathname.replace(/\/+$/, '') || '/';
    if (caminho.startsWith('/variedade/')) return true;
    if (ROTA_DO_CAMINHO[caminho]) return true;
    const hash = window.location.hash.replace('#', '') as PageRoute;
    return Boolean(CAMINHOS[hash]);
  };

  useEffect(() => {
    const sincronizar = () => {
      setCurrentPage(paginaDaURL());
      setEnderecoExiste(caminhoConhecido());
    };
    // Link antigo com # vira o caminho novo, sem entrada extra no histórico.
    const hash = window.location.hash.replace('#', '') as PageRoute;
    if (hash && CAMINHOS[hash] && !window.location.pathname.startsWith('/variedade/')) {
      window.history.replaceState({}, '', CAMINHOS[hash]);
    }
    sincronizar();
    window.addEventListener('hashchange', sincronizar);
    window.addEventListener('popstate', sincronizar);
    return () => {
      window.removeEventListener('hashchange', sincronizar);
      window.removeEventListener('popstate', sincronizar);
    };
  }, []);

  /** Título, descrição e canônica da página — só quando não há variedade aberta. */
  useEffect(() => {
    if (window.location.pathname.startsWith('/variedade/')) return;
    const robots = (() => {
      let el = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', 'robots');
        document.head.appendChild(el);
      }
      return el;
    })();
    if (!enderecoExiste) {
      document.title = 'Página não encontrada — Aves Arca';
      robots.content = 'noindex, follow';
      return;
    }
    robots.content = 'index, follow';
    const { titulo, descricao } = META[currentPage];
    document.title = titulo;
    const tag = (chave: string, attr: 'name' | 'property') => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${chave}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, chave);
        document.head.appendChild(el);
      }
      return el;
    };
    tag('description', 'name').content = descricao;
    tag('og:title', 'property').content = titulo;
    tag('og:description', 'property').content = descricao;
    const url = window.location.origin + CAMINHOS[currentPage];
    tag('og:url', 'property').content = url;
    let can = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!can) {
      can = document.createElement('link');
      can.rel = 'canonical';
      document.head.appendChild(can);
    }
    can.href = url;
  }, [currentPage, enderecoExiste]);

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.history.pushState({}, '', CAMINHOS[page]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSpeciesForPreReserva = (speciesName: string) => {
    setSelectedSpeciesForPreReserva(speciesName);
    navigateTo('pre-reserva');
  };

  return (
    <CartProvider>
    <div className="min-h-screen flex flex-col bg-white text-[#17282A] font-serif selection:bg-[#F1EBDD] selection:text-[#14504B]">
      {/* STICKY HEADER */}
      <Header currentPage={currentPage} onNavigate={navigateTo} />

      {/* PAGE CONTENT */}
      <main className="flex-1">
        {!enderecoExiste ? (
          <section className="section">
            <div className="wrap max-w-2xl text-center">
              <div className="eyebrow">Erro 404</div>
              <h1 className="font-serif text-[2rem] sm:text-[2.6rem] text-[#14504B] mt-2 mb-4">
                Esse endereço não existe
              </h1>
              <p className="font-serif text-base text-[#2D3436] mb-7">
                O link que te trouxe até aqui está quebrado ou desatualizado. As aves continuam no
                lugar — é só seguir para o catálogo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={() => navigateTo('especies')} className="btn btn-gold">
                  Ver o catálogo
                </button>
                <button onClick={() => navigateTo('home')} className="btn btn-ghost">
                  Voltar ao início
                </button>
              </div>
            </div>
          </section>
        ) : (
          <>
            {currentPage === 'home' && <Home onNavigate={navigateTo} />}
            {currentPage === 'especies' && (
              <Catalog
                onSelectSpeciesForPreReserva={handleSelectSpeciesForPreReserva}
                onNavigate={navigateTo}
              />
            )}
            {currentPage === 'procedencia' && <Procedencia />}
            {currentPage === 'entrega' && <Entrega onNavigate={navigateTo} />}
            {currentPage === 'sobre' && <Sobre />}
            {currentPage === 'pre-reserva' && (
              <PreReserva initialSpeciesName={selectedSpeciesForPreReserva} onNavigate={navigateTo} />
            )}
            {currentPage === 'contato' && <Contato onNavigate={navigateTo} />}
            {currentPage === 'faq' && <Faq onNavigate={navigateTo} />}
            {currentPage === 'privacidade' && <Privacidade onNavigate={navigateTo} />}
          </>
        )}
      </main>

      {/* FLOATING WHATSAPP BUTTON */}
      <FloatingWhatsApp currentPage={currentPage} onNavigate={navigateTo} />

      {/* FOOTER */}
      <Footer onNavigate={navigateTo} />
    </div>
    </CartProvider>
  );
}
