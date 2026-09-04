import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, FileDown } from 'lucide-react';
import { CategoriaId, CriadorId, PageRoute, Unidade } from '../types';
import { AVES, LISTA_DATA, TOTAL_AVES, TOTAL_LOTES } from '../data/aves';
import { CATEGORIAS, CRIADOR_ROTULO, CONSTANTS } from '../data/catalogo';
import { AveCard } from '../components/AveCard';
import { useCart } from '../cart/CartContext';

type Ordem = 'preco-asc' | 'preco-desc' | 'nome';
const FAIXAS: { id: string; rotulo: string; min: number; max: number }[] = [
  { id: 'todas', rotulo: 'Qualquer preço', min: 0, max: Infinity },
  { id: 'ate500', rotulo: 'até R$ 500', min: 0, max: 500 },
  { id: '500-2000', rotulo: 'R$ 500 – 2.000', min: 500, max: 2000 },
  { id: '2000-6000', rotulo: 'R$ 2.000 – 6.000', min: 2000, max: 6000 },
  { id: 'acima6000', rotulo: 'acima de R$ 6.000', min: 6000, max: Infinity },
];

const normaliza = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const Aves: React.FC<{ categoriaInicial?: string; onNavigate: (p: PageRoute) => void }> = ({ categoriaInicial, onNavigate }) => {
  const [categoria, setCategoria] = useState<CategoriaId | 'todas'>((categoriaInicial as CategoriaId) || 'todas');
  const [criador, setCriador] = useState<CriadorId | 'todos'>('todos');
  const [unidade, setUnidade] = useState<Unidade | 'todas'>('todas');
  const [faixa, setFaixa] = useState('todas');
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState<Ordem>('nome');
  const [soPromo, setSoPromo] = useState(false);
  const { totalUnidades } = useCart();

  useEffect(() => {
    if (categoriaInicial) setCategoria(categoriaInicial as CategoriaId);
  }, [categoriaInicial]);

  const lista = useMemo(() => {
    const f = FAIXAS.find((x) => x.id === faixa)!;
    const q = normaliza(busca.trim());
    let r = AVES.filter(
      (a) =>
        (categoria === 'todas' || a.categoria === categoria) &&
        (criador === 'todos' || a.criador === criador) &&
        (unidade === 'todas' || a.unidade === unidade) &&
        a.preco >= f.min && a.preco <= f.max &&
        (!soPromo || a.preco_de) &&
        (!q || normaliza(`${a.nome} ${a.cientifico} ${a.grupo} ${a.detalhe}`).includes(q)),
    );
    if (ordem === 'preco-asc') r = [...r].sort((a, b) => a.preco - b.preco);
    else if (ordem === 'preco-desc') r = [...r].sort((a, b) => b.preco - a.preco);
    else r = [...r].sort((a, b) => (a.preco - b.preco)); // dentro do grupo, como no PDF: do mais barato ao mais caro
    return r;
  }, [categoria, criador, unidade, faixa, busca, ordem, soPromo]);

  // Agrupa por subgrupo quando a ordem é por nome (lista parecida com o PDF)
  const grupos = useMemo(() => {
    if (ordem !== 'nome') return null;
    // Ordem dos grupos = ordem da lista impressa (gansos, tadornas, marrecos…, pavões, faisões…)
    const ordemGrupos = [...new Set(AVES.map((a) => a.grupo))];
    const m = new Map<string, typeof lista>();
    for (const a of lista) m.set(a.grupo, [...(m.get(a.grupo) || []), a]);
    return [...m.entries()].sort((x, y) => ordemGrupos.indexOf(x[0]) - ordemGrupos.indexOf(y[0]));
  }, [lista, ordem]);

  const categoriasComAves = CATEGORIAS.filter((c) => AVES.some((a) => a.categoria === c.id));
  const totalFiltrado = lista.reduce((s, a) => s + a.machos + a.femeas, 0);

  return (
    <>
      <section className="sec-escura">
        <div className="wrap py-10 sm:py-14">
          <div className="eyebrow">Lista de {LISTA_DATA} · estoque sujeito a alteração</div>
          <h1 className="sec-title" style={{ fontSize: '2.4rem' }}>Aves disponíveis</h1>
          <p className="sec-sub" style={{ marginBottom: 0 }}>
            {TOTAL_AVES} aves em {TOTAL_LOTES} lotes. Preço de casal = macho + fêmea. Pagamento na entrega, em rota ou retirada em {CONSTANTS.RETIRADA}.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 28 }}>
        <div className="wrap">
          {/* Categorias */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button className={`filtro ${categoria === 'todas' ? 'ativo' : ''}`} onClick={() => setCategoria('todas')}>Todas</button>
            {categoriasComAves.map((c) => (
              <button key={c.id} className={`filtro ${categoria === c.id ? 'ativo' : ''}`} onClick={() => setCategoria(c.id)}>
                {c.nome}
              </button>
            ))}
          </div>

          {/* Demais filtros */}
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-3 mb-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6B5B]" />
              <input className="campo !pl-10" placeholder="Buscar variedade…" value={busca} onChange={(e) => setBusca(e.target.value)} aria-label="Buscar" />
            </div>
            <select className="campo" value={criador} onChange={(e) => setCriador(e.target.value as any)} aria-label="Criadouro">
              <option value="todos">Todos os criadouros</option>
              <option value="aves-arca">{CRIADOR_ROTULO['aves-arca']}</option>
              <option value="parceiros">{CRIADOR_ROTULO.parceiros}</option>
            </select>
            <select className="campo" value={unidade} onChange={(e) => setUnidade(e.target.value as any)} aria-label="Unidade">
              <option value="todas">Casal, macho ou fêmea</option>
              <option value="casal">Só casais</option>
              <option value="macho">Só machos</option>
              <option value="femea">Só fêmeas</option>
            </select>
            <select className="campo" value={faixa} onChange={(e) => setFaixa(e.target.value)} aria-label="Faixa de preço">
              {FAIXAS.map((f) => <option key={f.id} value={f.id}>{f.rotulo}</option>)}
            </select>
            <select className="campo" value={ordem} onChange={(e) => setOrdem(e.target.value as Ordem)} aria-label="Ordenar">
              <option value="nome">Por grupo (como na lista)</option>
              <option value="preco-asc">Menor preço</option>
              <option value="preco-desc">Maior preço</option>
            </select>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <label className="flex items-center gap-2 font-sans text-[0.82rem] text-[#5B6B5B] cursor-pointer">
              <input type="checkbox" checked={soPromo} onChange={(e) => setSoPromo(e.target.checked)} /> Só promoções de setembro
            </label>
            <span className="font-sans text-[0.8rem] text-[#5B6B5B] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> {lista.length} {lista.length === 1 ? 'lote' : 'lotes'} · {totalFiltrado} aves
            </span>
          </div>

          {lista.length === 0 && (
            <div className="note text-center">Nenhuma ave com esses filtros. Limpe algum filtro — ou fale no WhatsApp: pode estar chegando lote novo.</div>
          )}

          {grupos ? (
            grupos.map(([g, aves]) => (
              <div key={g} className="mb-10">
                <h2 className="text-[1.5rem] text-[#1F3B2E] m-0 mb-4 flex items-baseline gap-3">
                  {g} <span className="font-sans text-[0.7rem] tracking-[1px] uppercase text-[#B99034]">{aves.length} {aves.length === 1 ? 'lote' : 'lotes'}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {aves.map((a) => <AveCard key={a.id} ave={a} onVerPedido={() => onNavigate('pedido')} />)}
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {lista.map((a) => <AveCard key={a.id} ave={a} onVerPedido={() => onNavigate('pedido')} />)}
            </div>
          )}

          <div className="note flex flex-wrap items-center justify-between gap-3 mt-8">
            <span>Prefere a lista em PDF para guardar ou encaminhar? A versão de {LISTA_DATA} está disponível.</span>
            <a href="/lista-aves-disponiveis.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-ghost !py-2">
              <FileDown className="w-4 h-4" /> Baixar a lista (PDF)
            </a>
          </div>
        </div>
      </section>

      {totalUnidades > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
          <button onClick={() => onNavigate('pedido')} className="btn btn-ouro shadow-xl">
            Fechar pedido · {totalUnidades} {totalUnidades === 1 ? 'item' : 'itens'} →
          </button>
        </div>
      )}
    </>
  );
};
