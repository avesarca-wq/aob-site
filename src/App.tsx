import { useEffect, useState } from 'react';
import { PageRoute } from './types';
import { CAMINHOS, ROTA_DO_CAMINHO } from './lib/links';
import { TOTAL_AVES, TOTAL_LOTES } from './data/aves';
import { CONSTANTS } from './data/catalogo';
import { CartProvider } from './cart/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Home } from './pages/Home';
import { Aves } from './pages/Aves';
import { Tabela } from './pages/Tabela';
import { Pedido } from './pages/Pedido';
import { Rotas } from './pages/Rotas';
import { Criadores } from './pages/Criadores';
import { Contato } from './pages/Contato';
import { Privacidade } from './pages/Privacidade';

const M = CONSTANTS.MARCA;
const META: Record<PageRoute, { titulo: string; descricao: string }> = {
  home: { titulo: `${M} — aves ornamentais à pronta entrega`, descricao: `${TOTAL_AVES} aves ornamentais à pronta entrega de três criadouros parceiros: aquáticas, faisões, pavões, perdizes e mais. Rota de entrega marcada, pagamento na entrega.` },
  aves: { titulo: `Aves disponíveis — ${TOTAL_LOTES} lotes — ${M}`, descricao: 'Lista de aves ornamentais à pronta entrega com preço, estoque por sexo e criadouro. Monte o pedido e pague na entrega.' },
  tabela: { titulo: `Tabela de valores — ${TOTAL_LOTES} lotes — ${M}`, descricao: 'Todas as aves em estoque numa página só: sexo, unidade e preço. Marque as quantidades e feche o pedido direto na tabela.' },
  pedido: { titulo: `Meu pedido — ${M}`, descricao: 'Feche seu pedido de aves ornamentais: cidade, rota de entrega e confirmação pelo WhatsApp. Sem pagamento antecipado.' },
  rotas: { titulo: `Rotas de entrega — ${M}`, descricao: 'Calendário das rotas de entrega por região, cidades atendidas e frete por saída a partir de São Paulo.' },
  criadores: { titulo: `Criadouros parceiros — ${M}`, descricao: 'Aves Arca, Stima Aves e Criadouro Aliança: quem cria as aves da lista.' },
  contato: { titulo: `Contato — ${M}`, descricao: 'WhatsApp, e-mail e Instagram da Aves Ornamentais Brasil.' },
  privacidade: { titulo: `Privacidade — ${M}`, descricao: 'Como tratamos os dados de quem faz um pedido.' },
};

export default function App() {
  const [pagina, setPagina] = useState<PageRoute>('home');
  const [existe, setExiste] = useState(true);
  const [categoria, setCategoria] = useState<string | undefined>(undefined);

  const daURL = () => {
    const caminho = window.location.pathname.replace(/\/+$/, '') || '/';
    const rota = ROTA_DO_CAMINHO[caminho];
    const hash = window.location.hash.replace('#', '') as PageRoute;
    const cat = new URLSearchParams(window.location.search).get('categoria') || undefined;
    return { rota: rota ?? (CAMINHOS[hash] ? hash : undefined), cat };
  };

  useEffect(() => {
    const sync = () => {
      const { rota, cat } = daURL();
      setPagina(rota ?? 'home');
      setExiste(Boolean(rota));
      setCategoria(cat);
    };
    sync();
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  useEffect(() => {
    const tag = (chave: string, attr: 'name' | 'property') => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${chave}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, chave); document.head.appendChild(el); }
      return el;
    };
    if (!existe) { document.title = `Página não encontrada — ${M}`; tag('robots', 'name').content = 'noindex, follow'; return; }
    tag('robots', 'name').content = pagina === 'pedido' ? 'noindex, follow' : 'index, follow';
    const { titulo, descricao } = META[pagina];
    document.title = titulo;
    tag('description', 'name').content = descricao;
    tag('og:title', 'property').content = titulo;
    tag('og:description', 'property').content = descricao;
    const url = CONSTANTS.DOMINIO + CAMINHOS[pagina];
    tag('og:url', 'property').content = url;
    let can = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!can) { can = document.createElement('link'); can.rel = 'canonical'; document.head.appendChild(can); }
    can.href = url;
  }, [pagina, existe]);

  const navegar = (p: PageRoute, extra?: string) => {
    setPagina(p);
    setExiste(true);
    setCategoria(p === 'aves' ? extra : undefined);
    window.history.pushState({}, '', CAMINHOS[p] + (p === 'aves' && extra ? `?categoria=${extra}` : ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header currentPage={pagina} onNavigate={navegar} />
        <main className="flex-1">
          {!existe ? (
            <section className="section">
              <div className="wrap max-w-2xl text-center">
                <div className="eyebrow">Erro 404</div>
                <h1 className="sec-title center">Esse endereço não existe</h1>
                <p className="sec-sub">O link está quebrado ou desatualizado. As aves continuam na lista.</p>
                <button onClick={() => navegar('aves')} className="btn btn-verde">Ver aves disponíveis</button>
              </div>
            </section>
          ) : (
            <>
              {pagina === 'home' && <Home onNavigate={navegar} />}
              {pagina === 'aves' && <Aves categoriaInicial={categoria} onNavigate={navegar} />}
              {pagina === 'tabela' && <Tabela onNavigate={navegar} />}
              {pagina === 'pedido' && <Pedido onNavigate={navegar} />}
              {pagina === 'rotas' && <Rotas onNavigate={navegar} />}
              {pagina === 'criadores' && <Criadores onNavigate={navegar} />}
              {pagina === 'contato' && <Contato onNavigate={navegar} />}
              {pagina === 'privacidade' && <Privacidade />}
            </>
          )}
        </main>
        {pagina !== 'pedido' && pagina !== 'tabela' && <FloatingWhatsApp />}
        <Footer onNavigate={navegar} />
      </div>
    </CartProvider>
  );
}
