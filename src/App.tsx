import { useEffect, useState } from 'react';
import { PageRoute } from './types';
import { CAMINHOS, ROTA_DO_CAMINHO } from './lib/links';
import { META, M, PAGINA_AVE_DO_SLUG, OG_IMAGEM } from './seo';
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
import { Consultoria } from './pages/Consultoria';
import { Contato } from './pages/Contato';
import { Privacidade } from './pages/Privacidade';
import { HomeCriadouro } from './pages/HomeCriadouro';
import { Criadouro } from './pages/Criadouro';
import { Sanidade } from './pages/Sanidade';
import { EH_REDE } from './marcas';


export default function App() {
  // Estado inicial lido da URL no primeiro render: antes, começava em 'home' e só
  // trocava num useEffect — a home montava por um instante em toda rota e baixava
  // as fotos de destaque em /contato, /pedido e nas fichas (achado da auditoria de 14/09).
  const inicial = daURL();
  const [pagina, setPagina] = useState<PageRoute>(inicial.rota ?? 'home');
  const [existe, setExiste] = useState(Boolean(inicial.rota));
  const [categoria, setCategoria] = useState<string | undefined>(inicial.cat);

  const [aveSlug, setAveSlug] = useState<string | undefined>(inicial.ave);

  function daURL() {
    const caminho = window.location.pathname.replace(/\/+$/, '') || '/';
    // /aves/<slug>: ficha própria da espécie (cabeçalho + os lotes dela).
    const mAve = caminho.match(/^\/aves\/([a-z0-9-]+)$/);
    if (mAve && PAGINA_AVE_DO_SLUG[mAve[1]]) return { rota: 'aves' as PageRoute, cat: undefined, ave: mAve[1] };
    const rota = ROTA_DO_CAMINHO[caminho];
    const hash = window.location.hash.replace('#', '') as PageRoute;
    const cat = new URLSearchParams(window.location.search).get('categoria') || undefined;
    return { rota: rota ?? (CAMINHOS[hash] ? hash : undefined), cat, ave: undefined as string | undefined };
  }

  useEffect(() => {
    const sync = () => {
      const { rota, cat, ave } = daURL();
      setPagina(rota ?? 'home');
      setExiste(Boolean(rota));
      setCategoria(cat);
      setAveSlug(ave);
    };
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
    const ave = aveSlug ? PAGINA_AVE_DO_SLUG[aveSlug] : undefined;
    const { titulo, descricao } = ave ?? META[pagina];
    document.title = titulo;
    tag('description', 'name').content = descricao;
    tag('og:title', 'property').content = titulo;
    tag('og:description', 'property').content = descricao;
    tag('og:image', 'property').content = ave?.imagem ?? OG_IMAGEM;
    const url = CONSTANTS.DOMINIO + (ave ? ave.caminho : CAMINHOS[pagina]);
    tag('og:url', 'property').content = url;
    let can = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!can) { can = document.createElement('link'); can.rel = 'canonical'; document.head.appendChild(can); }
    can.href = url;
  }, [pagina, existe, aveSlug]);

  const navegar = (p: PageRoute, extra?: string) => {
    setPagina(p);
    setExiste(true);
    setAveSlug(undefined);
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
              {pagina === 'home' && (EH_REDE ? <Home onNavigate={navegar} /> : <HomeCriadouro onNavigate={navegar} />)}
              {pagina === 'aves' && <Aves key={aveSlug ?? categoria ?? 'todas'} aveSlug={aveSlug} categoriaInicial={categoria} onNavigate={navegar} />}
              {pagina === 'tabela' && <Tabela onNavigate={navegar} />}
              {pagina === 'pedido' && <Pedido onNavigate={navegar} />}
              {pagina === 'rotas' && <Rotas onNavigate={navegar} />}
              {pagina === 'criadores' && (EH_REDE ? <Criadores onNavigate={navegar} /> : <Criadouro onNavigate={navegar} />)}
              {pagina === 'sanidade' && <Sanidade onNavigate={navegar} />}
              {pagina === 'consultoria' && <Consultoria onNavigate={navegar} />}
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
