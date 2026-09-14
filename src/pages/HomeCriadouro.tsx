// src/pages/HomeCriadouro.tsx — a página inicial dos sites de criadouro (Stima, Aliança).
//
// A rede (AOB) vende uma lista; o criadouro vende uma criação com uma pessoa atrás.
// Por isso a home aqui abre com a frase da marca, põe o responsável antes das aves
// e mostra a vitrine alternando ave cara e ave de entrada de propósito — é o
// mecanismo que o Waldir descreveu: o turaco de R$ 15.000 ao lado do topetudo de
// R$ 350 é o que faz o topetudo ser respeitado.
import React from 'react';
import { ArrowRight, Stethoscope, Truck, HandCoins, Feather } from 'lucide-react';
import { PageRoute } from '../types';
import { AVES, AVES_EM_ESTOQUE, TOTAL_AVES, TOTAL_VARIEDADES, LISTA_DATA } from '../data/aves';
import { CATEGORIAS, ROTAS, proximaSaida, dataCurta, brl } from '../data/catalogo';
import { MARCA_ATUAL } from '../marcas';
import { AveCard } from '../components/AveCard';
import { CAMINHOS } from '../lib/links';

/** Cara, barata, cara, barata — quatro cards com foto, alternando as pontas. */
function vitrineAlternada(): typeof AVES {
  const comFoto = AVES.filter((a) => a.foto && a.preco !== null).sort((a, b) => (b.preco ?? 0) - (a.preco ?? 0));
  if (comFoto.length < 4) return comFoto.slice(0, 4);
  const caras = comFoto.slice(0, Math.ceil(comFoto.length / 2));
  const baratas = [...comFoto.slice(Math.ceil(comFoto.length / 2))].reverse();
  const saida: typeof AVES = [];
  for (let i = 0; saida.length < 4 && (caras[i] || baratas[i]); i++) {
    if (caras[i]) saida.push(caras[i]);
    if (baratas[i] && saida.length < 4) saida.push(baratas[i]);
  }
  return saida;
}

export const HomeCriadouro: React.FC<{ onNavigate: (p: PageRoute, extra?: string) => void }> = ({ onNavigate }) => {
  const m = MARCA_ATUAL;
  const vitrine = vitrineAlternada();
  const rotasComData = ROTAS.map((r) => ({ r, p: proximaSaida(r) })).filter((x) => x.p);
  const precos = AVES.map((a) => a.preco).filter((x): x is number => x !== null);
  const menor = Math.min(...precos), maior = Math.max(...precos);
  const porCategoria = (id: string) => AVES.filter((a) => a.categoria === id);
  const categoriasComAves = CATEGORIAS.filter((c) => porCategoria(c.id).length);

  return (
    <>
      {/* HERO */}
      <section className="sec-escura relative overflow-hidden">
        <div className="wrap py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <div>
            <div className="eyebrow">{m.cidade} · criação própria</div>
            <h1 className="font-serif text-[2.3rem] sm:text-[3.1rem] leading-[1.08] m-0 text-[var(--marfim)]">{m.frase}</h1>
            <p className="font-serif text-[1.15rem] text-[var(--claro-2)] mt-5 mb-8 max-w-[54ch]">
              Pavões para o gramado, aquáticas para o lago, faisões e turacos para o viveiro, peru e angola para o terreiro. {TOTAL_VARIEDADES} variedades criadas no mesmo plantel, sob responsabilidade técnica de médico veterinário — e entregues na rota, com pagamento só quando a ave chega na sua mão.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={CAMINHOS.aves} onClick={(e) => { e.preventDefault(); onNavigate('aves'); }} className="btn btn-ouro">
                Ver o plantel <ArrowRight className="w-4 h-4" />
              </a>
              <a href={CAMINHOS.rotas} onClick={(e) => { e.preventDefault(); onNavigate('rotas'); }} className="btn btn-ghost-claro">
                Próximas rotas
              </a>
            </div>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="rounded-2xl bg-white/95 p-8 w-[380px] max-w-full flex items-center justify-center">
              <img src={m.logoSelo} alt="" className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* tiras de credibilidade */}
        <div className="border-t border-[var(--verde-claro)]">
          <div className="wrap py-7 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat text-left"><b className="!text-[1.35rem]">{m.responsavel}</b><span className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5" /> {m.credencial}</span></div>
            <div className="stat text-left"><b className="!text-[1.35rem]">de {brl(menor)} a {brl(maior)}</b><span>{categoriasComAves.length} abas, da entrada à coleção</span></div>
            <div className="stat text-left"><b className="!text-[1.35rem]">Pagamento na entrega</b><span>rota marcada, sem sinal{rotasComData[0] ? ` · próxima ${dataCurta(rotasComData[0].p!.saida)}` : ''}</span></div>
          </div>
        </div>
      </section>

      {/* VITRINE */}
      <section className="section">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <div className="eyebrow">O plantel</div>
              <h2 className="sec-title" style={{ marginBottom: 6 }}>Da entrada à coleção, no mesmo viveiro</h2>
              <p className="sec-sub" style={{ marginBottom: 0 }}>{TOTAL_AVES} aves prontas nesta semana; o resto da criação aparece como “sob consulta”. Estoque de {LISTA_DATA}.</p>
            </div>
            <button onClick={() => onNavigate('aves')} className="btn btn-ghost">Ver as {TOTAL_VARIEDADES} variedades</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {vitrine.map((a) => <AveCard key={a.id} ave={a} onVerPedido={() => onNavigate('pedido')} />)}
          </div>
        </div>
      </section>

      {/* ABAS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="eyebrow">Por grupo</div>
          <h2 className="sec-title">O que tem para cada espaço</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoriasComAves.map((c) => {
              const n = porCategoria(c.id);
              const prontas = n.filter((a) => a.machos + a.femeas > 0).length;
              const ps = n.map((a) => a.preco).filter((x): x is number => x !== null);
              return (
                <button key={c.id} onClick={() => onNavigate('aves', c.id)} className="card p-5 text-left cursor-pointer hover:-translate-y-0.5 transition-transform">
                  <h3 className="text-[1.2rem] text-[var(--verde)] m-0 mb-1">{c.nome}</h3>
                  <p className="font-sans text-[0.78rem] text-[var(--muted)] m-0">{n.length} {n.length === 1 ? 'variedade' : 'variedades'}{prontas ? ` · ${prontas} ${prontas === 1 ? 'pronta' : 'prontas'}` : ''}</p>
                  <p className="font-sans text-[0.78rem] text-[var(--ouro2)] font-bold m-0 mt-1">{ps.length ? (Math.min(...ps) === Math.max(...ps) ? brl(ps[0]) : `${brl(Math.min(...ps))} – ${brl(Math.max(...ps))}`) : 'sob consulta'}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="section sec-clara">
        <div className="wrap">
          <div className="eyebrow">Como funciona</div>
          <h2 className="sec-title">Você escolhe a ave. O resto é combinado.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              [Feather, 'Escolha no plantel', `Cada ficha tem a espécie, o nome científico e o preço na tela. O que não está pronto na semana vira uma pergunta no WhatsApp — a gente responde com prazo.`],
              [Truck, 'Entrega na rota', `As aves viajam na rota de entrega da rede, com data marcada por região, ou você retira em ${m.retirada}. Sem transportadora.`],
              [HandCoins, 'Pagamento na entrega', 'Você paga quando a ave está na sua mão, depois de conferir. Não trabalhamos com sinal antecipado.'],
            ].map(([Icone, t, d]: any, i) => (
              <div key={i} className="card p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--verde)] text-[var(--ouro)] flex items-center justify-center mb-3"><Icone className="w-5 h-5" /></div>
                <h3 className="text-[1.2rem] text-[var(--verde)] m-0 mb-1.5">{t}</h3>
                <p className="font-serif text-[0.98rem] text-[var(--muted)] m-0">{d}</p>
              </div>
            ))}
          </div>
          <p className="font-sans text-[0.8rem] text-[var(--muted)] mt-6 mb-0">
            {AVES_EM_ESTOQUE.length} lotes prontos · {TOTAL_VARIEDADES} variedades no catálogo · lista de {LISTA_DATA}
          </p>
        </div>
      </section>
    </>
  );
};
