import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { TOTAL_VARIEDADES } from '../data/species';
import { waComOrigem } from '../lib/links';
import { PageRoute } from '../types';
import { medir } from '../lib/analytics';
import { ListaEspera } from '../components/ListaEspera';

/**
 * PERGUNTAS FREQUENTES (05.6.14, pedido nº5 do Ricardo em 07/08/2026).
 *
 * Régua desta página: **cada resposta repete o que o site já sustenta em outra página**
 * (Procedência, Entrega, Pré-reserva, Sobre) ou o que está firmado nas decisões comerciais.
 * Onde a Aves Arca ainda não tem política escrita, a resposta diz "combinamos antes de
 * fechar" — não inventa garantia, prazo nem enquadramento legal.
 */

interface Pergunta {
  p: string;
  r: React.ReactNode;
}

interface FaqProps {
  onNavigate: (page: PageRoute) => void;
}

export const Faq: React.FC<FaqProps> = ({ onNavigate }) => {
  const [aberta, setAberta] = useState<number | null>(0);

  const perguntas: Pergunta[] = [
    {
      p: 'Preciso pagar alguma coisa para reservar?',
      r: (
        <>
          Não. A pré-reserva é <strong>gratuita e sem sinal</strong>: você não transfere nada para
          garantir seu lugar na fila. O pagamento acontece <strong>só na entrega ou na retirada</strong>,
          com a ave e a documentação conferidas na sua frente. É o contrário do golpe comum no
          mercado, em que se pede depósito e some.
        </>
      ),
    },
    {
      p: 'Que documentos acompanham a ave?',
      r: (
        <>
          <strong>Nota fiscal e GTA</strong> (Guia de Trânsito Animal), além da documentação de
          origem do exemplar — nascido no nosso plantel, com registro. Não trabalhamos com
          revenda de origem incerta.
        </>
      ),
    },
    {
      p: 'É legal ter essas aves? Preciso de alguma licença?',
      r: (
        <>
          Nós comercializamos apenas exemplares nascidos no plantel, com documentação de origem e
          trânsito. O <strong>enquadramento legal varia conforme a espécie</strong> (nativa, exótica
          e listagens específicas) e conforme as normas do seu estado — por isso a resposta certa
          depende da variedade que você quer.{' '}
          <strong>Pergunte pela variedade específica antes de fechar</strong> e nós informamos qual
          documentação acompanha o exemplar. Não damos por e-mail um "pode" ou "não pode" genérico:
          seria irresponsável.
        </>
      ),
    },
    {
      p: 'Vocês vendem casal ou posso comprar um só?',
      r: (
        <>
          Você escolhe <strong>macho ou fêmea</strong>, na quantidade que quiser — não obrigamos a
          levar casal. Na conversa, avaliamos junto se a composição faz sentido para o seu objetivo
          e para o bem-estar das aves (algumas espécies não vivem bem sozinhas).
        </>
      ),
    },
    {
      p: 'Quanto custa? Por que algumas variedades dizem "sob consulta"?',
      r: (
        <>
          Os preços aparecem no catálogo, por macho e por fêmea, nas {TOTAL_VARIEDADES} variedades.
          Algumas ainda estão marcadas como <strong>"sob consulta"</strong>: são as que não têm
          preço confirmado no nosso sistema. Preferimos dizer isso a publicar um número que pode
          mudar quando você for fechar.
        </>
      ),
    },
    {
      p: 'Quando eu recebo a ave?',
      r: (
        <>
          A temporada tem <strong>nascimentos entre setembro e dezembro</strong>, e a entrega
          acontece no ciclo seguinte, quando o filhote está pronto para viajar. As rotas terrestres
          são <strong>programadas conforme os pedidos acumulados em cada região</strong> — quanto
          mais gente na sua área, mais cedo a rota sai.{' '}
          <strong>Não prometemos data fixa</strong>: combinamos a janela com você pelo WhatsApp e
          confirmamos poucos dias antes. Quem tem pressa costuma optar por retirada agendada ou
          frete aéreo, que não dependem do fechamento de rota.
        </>
      ),
    },
    {
      p: 'Como a ave chega até mim?',
      r: (
        <>
          Três caminhos: <strong>rota terrestre</strong> com equipe e veículo próprios (SP, MG, RJ,
          PR e SC), <strong>frete aéreo</strong> para o restante do Brasil, ou{' '}
          <strong>retirada agendada</strong> no ponto de encontro oficial em São Paulo. Na página
          Entrega você digita sua cidade e vê qual rota atende a sua região.
        </>
      ),
    },
    {
      p: 'E se acontecer algo com a ave no transporte?',
      r: (
        <>
          Transporte de carga viva tem risco, e cada modalidade tem o seu — seria desonesto fingir o
          contrário. <strong>As condições são combinadas com você antes de fechar</strong>, e nós
          explicamos qual é o risco do caminho escolhido em vez de empurrar o mais barato. Se essa
          for uma preocupação central, diga isso na conversa: às vezes a resposta é mudar a
          modalidade ou esperar uma janela melhor.
        </>
      ),
    },
    {
      p: 'Que estrutura eu preciso ter antes de receber?',
      r: (
        <>
          O essencial é <strong>água limpa, área seca, refúgio e possibilidade de separação</strong>.
          Cada variedade tem exigência própria — a ficha técnica de cada uma, no catálogo, traz a{' '}
          <strong>área mínima por casal</strong>, o tipo de água e a territorialidade. Antes de
          confirmar qualquer pré-reserva nós validamos isso junto com você. Se a estrutura não
          estiver pronta, a recomendação é esperar: a venda só avança quando é boa para você e para
          a ave.
        </>
      ),
    },
    {
      p: 'Posso visitar o criadouro?',
      r: (
        <>
          Não. <strong>Por biossegurança, não recebemos visitas</strong> — uma doença trazida de
          fora coloca em risco o plantel inteiro. Em troca, o atendimento é 100% digital e{' '}
          <strong>enviamos fotos e vídeos reais</strong> dos exemplares e das instalações, quantos
          você precisar para decidir.
        </>
      ),
    },
    {
      p: 'Ainda não estou pronto. Consigo ser avisado depois?',
      r: (
        <>
          Sim — e é a melhor coisa a fazer se a estrutura ainda não está pronta ou se você quer uma
          variedade que não está disponível agora. Deixe seu contato na{' '}
          <strong>lista da próxima temporada</strong>, logo abaixo, e avisamos quando abrir. Sem
          disparo em massa e sem cobrança.
        </>
      ),
    },
  ];

  return (
    <div>
      <section className="hero-section py-16 sm:py-20">
        <div className="wrap text-center">
          <div className="eyebrow">Perguntas frequentes</div>
          <h1 className="sec-title center font-serif font-semibold text-3xl sm:text-4xl text-[#4A5D4E]">
            O que perguntam antes de comprar
          </h1>
          <p className="sec-sub center">
            As dúvidas que mais aparecem no WhatsApp, respondidas sem rodeio. O que ainda não temos
            fechado, está dito como está.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-white">
        <div className="wrap max-w-3xl">
          <div className="flex flex-col gap-3">
            {perguntas.map((item, i) => {
              const estaAberta = aberta === i;
              return (
                <div
                  key={item.p}
                  className={`rounded-2xl border bg-white overflow-hidden transition-colors ${
                    estaAberta ? 'border-[#C1732B]' : 'border-[#E0E2D9]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const proxima = estaAberta ? null : i;
                      setAberta(proxima);
                      if (proxima !== null) medir('abrir_faq', { pergunta: item.p.slice(0, 60) });
                    }}
                    aria-expanded={estaAberta}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 cursor-pointer"
                  >
                    <span className="font-serif text-base sm:text-lg font-semibold text-[#4A5D4E]">
                      {item.p}
                    </span>
                    {estaAberta ? (
                      <ChevronUp className="w-5 h-5 text-[#C1732B] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#8C968F] shrink-0" />
                    )}
                  </button>
                  {/* A resposta fica sempre no HTML e some por CSS quando fechada: assim o Google
                      consegue ler as onze respostas, e nao so a primeira. */}
                  <div className="px-5 pb-5 -mt-1" hidden={!estaAberta}>
                    <p className="font-serif text-sm sm:text-base leading-relaxed text-[#2D3436] m-0">
                      {item.r}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl border border-[#E0E2D9] bg-[#FAFBF8] p-6 text-center">
            <p className="font-serif text-base text-[#2D3436] mt-0 mb-4">
              Ficou uma dúvida que não está aqui? Pergunte — a resposta costuma vir no mesmo dia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={waComOrigem('duvidas')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => medir('clicar_whatsapp', { de: 'faq' })}
                className="btn btn-wa"
              >
                <MessageCircle className="w-4 h-4" />
                Falar no WhatsApp
              </a>
              <button onClick={() => onNavigate('especies')} className="btn btn-ghost">
                Ver as {TOTAL_VARIEDADES} variedades
              </button>
            </div>
          </div>
        </div>
      </section>

      <ListaEspera />
    </div>
  );
};