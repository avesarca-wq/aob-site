// src/pages/Sanidade.tsx — a página que só o site de um veterinário pode ter.
//
// Conteúdo de partida, escrito para o Waldir revisar linha a linha: é orientação
// geral de manejo, não prescrição. O que for específico do plantel dele (protocolo
// de vermifugação, vacinas que ele aplica, o que vai junto na entrega) entra depois,
// com as palavras dele.
import React from 'react';
import { ShieldCheck, Home, Stethoscope, PhoneCall } from 'lucide-react';
import { PageRoute } from '../types';
import { MARCA_ATUAL } from '../marcas';
import { waComOrigem } from '../lib/links';

const BLOCOS: { Icone: any; t: string; p: string[] }[] = [
  {
    Icone: ShieldCheck, t: 'Antes de a ave chegar',
    p: [
      'Recinto pronto antes, não depois: comedouro, bebedouro com água limpa, sombra e um canto onde a ave possa se esconder nos primeiros dias.',
      'Quarentena é regra, não excesso: ave nova fica separada do plantel que já existe por 21 a 30 dias, mesmo vindo de criadouro conhecido. É o tempo de aparecer o que não se vê na entrega.',
      'Cerca e tela conferidas — a maioria das perdas na primeira semana é fuga ou predador, não doença.',
    ],
  },
  {
    Icone: Home, t: 'Os primeiros dias em casa',
    p: [
      'Nos três primeiros dias a ave come pouco e fica quieta. É o estresse da mudança e é normal; água limpa e silêncio resolvem mais do que qualquer remédio.',
      'A ração que ela já comia vai junto na entrega. Troca de alimento é gradual, ao longo de uma semana, misturando a nova à antiga.',
      'Não solte no lago ou no gramado no primeiro dia. Deixe no recinto menor até ela reconhecer onde dorme e onde come; depois abra.',
    ],
  },
  {
    Icone: Stethoscope, t: 'O que observar',
    p: [
      'Fezes, apetite e postura, todo dia, nos primeiros quinze. Fezes aguadas por mais de dois dias, ave encolhida com as penas arrepiadas ao sol, ou que para de comer, são sinais para ligar — não para esperar.',
      'Pesar a ave na chegada e duas semanas depois dá um número que vale mais do que qualquer impressão.',
      'Ave de coleção não mostra doença cedo. Quando mostra, já está adiantada. Por isso a observação diária é o manejo mais barato que existe.',
    ],
  },
  {
    Icone: PhoneCall, t: 'Quando chamar',
    p: [
      'Sempre que ficar em dúvida. Uma mensagem com uma foto e uma frase resolve a maior parte dos casos em minutos, e o que não resolve a gente encaminha.',
      'Cada ave sai daqui com orientação de manejo e com um veterinário atrás. Isso vale depois da entrega, não só antes.',
    ],
  },
];

export const Sanidade: React.FC<{ onNavigate: (p: PageRoute) => void }> = ({ onNavigate }) => {
  const m = MARCA_ATUAL;
  return (
    <>
      <section className="sec-escura">
        <div className="wrap py-10 sm:py-14">
          <div className="eyebrow">Sanidade e manejo</div>
          <h1 className="sec-title" style={{ fontSize: '2.4rem' }}>O que fazer quando a ave chega</h1>
          <p className="sec-sub" style={{ marginBottom: 0 }}>
            Orientação de {m.responsavel}, {m.credencial}, para os primeiros trinta dias — o período em que quase tudo que dá errado dá errado.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-5">
          {BLOCOS.map(({ Icone, t, p }) => (
            <div key={t} className="card p-7">
              <div className="w-10 h-10 rounded-full bg-[var(--verde)] text-[var(--ouro)] flex items-center justify-center mb-3"><Icone className="w-5 h-5" /></div>
              <h2 className="text-[1.35rem] text-[var(--verde)] m-0 mb-3">{t}</h2>
              <ul className="m-0 pl-5 font-serif text-[1rem] text-[var(--ink)] flex flex-col gap-2">
                {p.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="wrap mt-8">
          <div className="note flex flex-wrap items-center justify-between gap-3">
            <span>Orientação geral de manejo, não substitui atendimento. Para o seu caso, fale direto.</span>
            <a href={waComOrigem('sanidade')} target="_blank" rel="noopener noreferrer" className="btn btn-verde !py-2">Perguntar no WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
};
