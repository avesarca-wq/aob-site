import React, { useState } from 'react';
import { PageRoute } from '../types';
import { CONSTANTS, TOTAL_VARIEDADES, SPECIES_PUBLICADAS } from '../data/species';
import { Tier } from '../types';
import { medir } from '../lib/analytics';
import { ListaEspera } from '../components/ListaEspera';
import { WaterlineSVG } from '../components/WaterlineSVG';
import {
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Feather,
  Calendar,
  ArrowRight,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  MapPin,
  BookOpen,
  Instagram,
  Play,
  ShieldCheck as SeloEscudo
} from 'lucide-react';

export interface MatrizItem {
  src: string;
  legenda?: string;
}

export interface PorAiItem {
  /** ID do vídeo no YouTube (o trecho depois de youtu.be/ ou de ?v=). Preenchido = o item é vídeo. */
  youtube?: string;
  /** Título do vídeo, como está no canal de origem. */
  titulo?: string;
  /** Canal de origem — crédito obrigatório: o vídeo é de terceiro, não nosso. */
  canal?: string;
  imagem?: string;
  local?: string;
  data?: string;
  texto?: string;
}

/**
 * NOSSAS MATRIZES — fotos reais do plantel (enviadas pelo Ricardo em 07/08/2026).
 * Cada arquivo tem par .webp (servido primeiro) e .jpg (reserva), 1600px no maior lado,
 * sem EXIF (a câmera grava GPS; o arquivo publicado não leva).
 * `legenda` está VAZIA de propósito: nome de variedade só entra depois que o Ricardo
 * confirmar ave por ave — identificação minha, por foto, não é prova.
 * Rastreio do original em 05.6.12.
 */
export const MATRIZES: MatrizItem[] = [
  { src: "/matrizes/matriz-01.jpg", legenda: "" },
  { src: "/matrizes/matriz-02.jpg", legenda: "" },
  { src: "/matrizes/matriz-03.jpg", legenda: "" },
  { src: "/matrizes/matriz-04.jpg", legenda: "" },
  { src: "/matrizes/matriz-05.jpg", legenda: "" },
  { src: "/matrizes/matriz-06.jpg", legenda: "" },
  { src: "/matrizes/matriz-07.jpg", legenda: "" },
  { src: "/matrizes/matriz-08.jpg", legenda: "" },
  { src: "/matrizes/matriz-09.jpg", legenda: "" },
  { src: "/matrizes/matriz-10.jpg", legenda: "" },
];

export interface ParceiroItem {
  /** Caminho ou data-URL do logotipo. Vazio = moldura reservada. */
  logo?: string;
  nome?: string;
  site?: string;
}

/**
 * AVES ARCA POR AÍ — o que terceiros publicaram sobre o criadouro.
 * Vídeos entram com `youtube` (só o ID), título como está no canal de origem e o crédito do canal.
 * A capa é carregada de i.ytimg.com e o player do YouTube só é montado depois do clique
 * (youtube-nocookie): nada do YouTube roda na home de quem não pediu para assistir.
 * Itens de foto (imagem/local/data/texto) continuam válidos e aparecem abaixo dos vídeos.
 */
export const POR_AI: PorAiItem[] = [
  {
    youtube: "B5ojEorwct8",
    titulo: "A CRIAÇÃO DE PATOS E GANSOS MAIS VALIOSA QUE JÁ VI!",
    canal: "Richard Rasmussen",
  },
  {
    youtube: "W1830Om3TiY",
    titulo: "Conhecendo o Criatório Aves Arca — referência em criação de aves aquáticas",
    canal: "Aves Recriar",
  },
  {
    youtube: "133SVTQHNxk",
    titulo: "Conhecendo o MAIOR criatório de AVES AQUÁTICAS do BRASIL! — Chocmaster visita a Aves Arca",
    canal: "Chocmaster",
  },
  {
    youtube: "wKAgLMftxvI",
    titulo: "A MAIOR CRIAÇÃO DE AVES AQUÁTICAS QUE EU JÁ VISITEI | AVES ARCA",
    canal: "Sítio do RB",
  },
];

/**
 * PARCEIROS — os 4 perfis que o Ricardo indicou em 07/08/2026, exibidos lado a lado.
 * Sem logotipo: o card mostra o @ do perfil e leva ao Instagram. Logotipo entra depois,
 * se e quando o arquivo chegar — aí é só preencher `logo`.
 */
export const PARCEIROS: ParceiroItem[] = [
  { nome: "@coexistir1", site: "https://www.instagram.com/coexistir1/" },
  { nome: "@chocmaster", site: "https://www.instagram.com/chocmaster/" },
  { nome: "@volare_aves", site: "https://www.instagram.com/volare_aves/" },
  { nome: "@avesrecriar", site: "https://www.instagram.com/avesrecriar/" },
];

export const TITULO_PARCEIROS = "Parceiros";

/**
 * DEPOIMENTOS — espaço reservado (pedido nº7 do Ricardo, 07/08/2026).
 * Enquanto o array estiver vazio, a seção NÃO aparece: prova social falsa ou "em breve"
 * numa área de depoimento tira credibilidade em vez de dar. Basta preencher para publicar.
 * Regra: só depoimento real, de cliente real, com autorização.
 */
export interface DepoimentoItem {
  texto?: string;
  autor?: string;
  cidade?: string;
  variedade?: string;
  foto?: string;
}

export const DEPOIMENTOS: DepoimentoItem[] = [];

/**
 * Faixa de preço de cada nível, calculada da BASE (nunca digitada à mão): pega o menor e o
 * maior valor de MACHO ou FÊMEA entre as variedades com preço confirmado no Bling.
 * Desde 25/08/2026 macho e fêmea têm preços próprios (05.6.18) — antes esta faixa saía do
 * campo `adulto`, que era um valor só para os dois sexos.
 * Existe porque quem chega na home não faz ideia se isso custa R$ 200 ou R$ 20.000 —
 * e preço desconhecido em compra adiável é motivo de saída.
 */
const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export function faixaDoNivel(tier: Tier): string {
  const valores = SPECIES_PUBLICADAS.filter((e) => e.tier === tier && e.preco_confirmado)
    .flatMap((e) => [e.macho, e.femea])
    .filter((v) => typeof v === 'number' && v > 0);
  if (valores.length === 0) return 'sob consulta';
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  return min === max ? brl(min) : `${brl(min)} a ${brl(max)}`;
}

/** Caminho do .webp irmão de uma foto .jpg; se não for .jpg, devolve o próprio caminho. */
const fotoWebp = (src: string) => (src.endsWith('.jpg') ? src.replace(/\.jpg$/, '.webp') : src);

interface HomeProps {
  onNavigate: (page: PageRoute) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [matrizIndex, setMatrizIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [videoAberto, setVideoAberto] = useState<string | null>(null);

  const nextMatriz = () => {
    setMatrizIndex((prev) => (prev + 1) % MATRIZES.length);
  };

  const prevMatriz = () => {
    setMatrizIndex((prev) => (prev - 1 + MATRIZES.length) % MATRIZES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      nextMatriz();
    } else if (diff < -40) {
      prevMatriz();
    }
    setTouchStartX(null);
  };

  const VIDEOS = POR_AI.filter((i) => i.youtube);
  const FOTOS = POR_AI.filter((i) => !i.youtube && (i.imagem || i.local || i.texto));

  const hasPorAi = VIDEOS.length > 0 || FOTOS.length > 0;
  const hasParceiros = PARCEIROS.some((p) => p.logo || p.nome || p.site);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-section pt-10 pb-20 md:pt-14 md:pb-28 relative overflow-hidden xl:min-h-[580px] flex items-center">
        {/* Entre 1024 e 1279px não cabe a ilustração grande sem espremer os botões:
            mantém a marca-d'água discreta que já existia. */}
        <img
          src="/icone-original.svg"
          alt=""
          aria-hidden="true"
          className="absolute right-8 top-12 w-80 h-80 opacity-[0.06] pointer-events-none select-none hidden lg:block xl:hidden object-contain"
        />

        {/* ILUSTRAÇÃO DO PATO-MANDARIM — arte da marca, decorativa (a partir de 1280px) */}
        <picture>
          <source srcSet="/pato-mandarim.webp" type="image/webp" />
          <img
            src="/pato-mandarim.png"
            alt=""
            aria-hidden="true"
            loading="eager"
            className="pointer-events-none select-none absolute hidden xl:block right-0 2xl:right-4 top-1/2 -translate-y-1/2 w-[45%] max-w-[640px] object-contain"
          />
        </picture>

        <div className="wrap relative z-10 w-full">
          {/* coluna de texto limitada para não encostar na ilustração */}
          <div className="xl:max-w-[56%]">
          <div className="eyebrow">Criadouro de anatídeos ornamentais</div>
          <h1 className="font-serif font-semibold text-[2.5rem] sm:text-[3.2rem] leading-[1.14] mb-5 max-w-[17ch] text-[#4A5D4E]">
            A beleza rara das aves aquáticas, com procedência.
          </h1>
          <p className="font-serif text-[1.15rem] sm:text-[1.25rem] max-w-[54ch] text-[#5A635C] mb-8 leading-relaxed">
            Patos, marrecos, gansos e cisnes ornamentais de alta genética — nascidos no plantel, com sanidade, bem-estar e legalidade documentados. {TOTAL_VARIEDADES} variedades, do acessível ao colecionável.
          </p>
          {/* SELO — o maior matador de objeção do negócio, agora no primeiro olhar */}
          <div className="inline-flex items-start gap-2.5 rounded-2xl border border-[#C1732B]/45 bg-white/70 px-4 py-3 mb-7 max-w-[46ch]">
            <SeloEscudo className="w-5 h-5 text-[#C1732B] shrink-0 mt-0.5" />
            <p className="font-serif text-sm sm:text-[0.95rem] text-[#2D3436] m-0 leading-snug">
              <strong className="text-[#4A5D4E]">Pré-reserva sem pagamento antecipado.</strong>{' '}
              Você só paga na entrega, com a ave e a documentação conferidas.
            </p>
          </div>

          <div className="flex flex-wrap gap-3.5 sm:gap-4 items-center">
            <button
              onClick={() => onNavigate('especies')}
              className="btn btn-gold shadow-md"
            >
              Ver espécies ({TOTAL_VARIEDADES})
            </button>
            <button
              onClick={() => onNavigate('pre-reserva')}
              className="btn bg-[#4A5D4E] text-white hover:bg-[#3d4d40] shadow-md"
            >
              Fazer pré-reserva
            </button>
            <a
              href={CONSTANTS.WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => medir('clicar_whatsapp', { de: 'hero' })}
              className="btn btn-ghost"
            >
              <MessageCircle className="w-4 h-4" />
              Falar no WhatsApp
            </a>
          </div>

          {/* WATERLINE SIGNATURE */}
          <div className="mt-12 sm:mt-16">
            <WaterlineSVG />
          </div>
          </div>
        </div>
      </section>

      {/* POR QUE AVES ARCA */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="wrap text-center">
          <h2 className="sec-title center">Por que Aves Arca</h2>
          <p className="sec-sub mx-auto">
            Num mercado marcado pela informalidade, o nosso diferencial não é preço — é procedência. Cada ave carrega a prova de como nasceu e foi criada.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-8">
            <div className="card-item">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFBF8] flex items-center justify-center text-[#D4A373] mb-4 border border-[#E0E2D9]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mb-2 font-semibold">Procedência legal</h3>
              <p className="font-serif text-[1rem] text-[#5A635C]">
                Exemplares nascidos no plantel, com documentação de origem e rastreabilidade — não revenda de origem incerta.
              </p>
            </div>

            <div className="card-item">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFBF8] flex items-center justify-center text-[#D4A373] mb-4 border border-[#E0E2D9]">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mb-2 font-semibold">Sanidade e bem-estar</h3>
              <p className="font-serif text-[1rem] text-[#5A635C]">
                Protocolos de biossegurança e manejo que protegem o plantel e garantem aves saudáveis e bem formadas.
              </p>
            </div>

            <div className="card-item">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFBF8] flex items-center justify-center text-[#D4A373] mb-4 border border-[#E0E2D9]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mb-2 font-semibold">Variedade de excelência</h3>
              <p className="font-serif text-[1rem] text-[#5A635C]">
                {TOTAL_VARIEDADES} variedades em quatro níveis de raridade — de patos de superfície a gansos e cisnes de coleção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="sec-green py-14">
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="stat-item">
              <b>200</b>
              <span>casais em plantel</span>
            </div>
            <div className="stat-item">
              <b>{TOTAL_VARIEDADES}</b>
              <span>variedades</span>
            </div>
            <div className="stat-item">
              <b>4</b>
              <span>níveis de raridade</span>
            </div>
            <div className="stat-item">
              <b>100%</b>
              <span>nascidos no plantel</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUATRO NÍVEIS SECTION */}
      <section className="py-16 sm:py-20 bg-[#FAFBF8]">
        <div className="wrap text-center">
          <h2 className="sec-title center">Do iniciante ao especialista</h2>
          <p className="sec-sub mx-auto">
            Nossa linha é organizada por raridade e valor, para atender do criador iniciante ao especialista e à instituição.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left mt-8">
            <div className="card-item">
              <span className="badge-tier badge-bronze">Iniciante</span>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mt-3 mb-1 font-semibold">Iniciante</h3>
              <p className="text-xs font-sans font-bold text-[#D4A373] mb-2 uppercase tracking-wide">para começar</p>
              <p className="font-serif text-[0.98rem] text-[#5A635C]">
                Patos de superfície e variedades de início — beleza, rusticidade e giro.
              </p>
              <p className="font-sans text-xs text-[#4A5D4E] mt-3 mb-0 pt-3 border-t border-[#E0E2D9]">
                <span className="uppercase tracking-wider text-[0.65rem] text-[#8C968F]">por ave, adulto</span>
                <br />
                <strong className="text-sm">{faixaDoNivel('Bronze')}</strong>
              </p>
            </div>

            <div className="card-item">
              <span className="badge-tier badge-prata">Intermediário</span>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mt-3 mb-1 font-semibold">Intermediário</h3>
              <p className="text-xs font-sans font-bold text-[#D4A373] mb-2 uppercase tracking-wide">para evoluir</p>
              <p className="font-serif text-[0.98rem] text-[#5A635C]">
                Mandarins, carolinas e afins — bom equilíbrio de valor, exotismo e procura.
              </p>
              <p className="font-sans text-xs text-[#4A5D4E] mt-3 mb-0 pt-3 border-t border-[#E0E2D9]">
                <span className="uppercase tracking-wider text-[0.65rem] text-[#8C968F]">por ave, adulto</span>
                <br />
                <strong className="text-sm">{faixaDoNivel('Prata')}</strong>
              </p>
            </div>

            <div className="card-item">
              <span className="badge-tier badge-ouro">Avançado</span>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mt-3 mb-1 font-semibold">Avançado</h3>
              <p className="text-xs font-sans font-bold text-[#D4A373] mb-2 uppercase tracking-wide">alto valor e genética</p>
              <p className="font-serif text-[0.98rem] text-[#5A635C]">
                Tadornas, mergulhadores e cisne-negro — raridade, genética e destaque.
              </p>
              <p className="font-sans text-xs text-[#4A5D4E] mt-3 mb-0 pt-3 border-t border-[#E0E2D9]">
                <span className="uppercase tracking-wider text-[0.65rem] text-[#8C968F]">por ave, adulto</span>
                <br />
                <strong className="text-sm">{faixaDoNivel('Ouro')}</strong>
              </p>
            </div>

            <div className="card-item">
              <span className="badge-tier badge-diamante">Raridades</span>
              <h3 className="font-serif text-[1.3rem] text-[#4A5D4E] mt-3 mb-1 font-semibold">Raridades</h3>
              <p className="text-xs font-sans font-bold text-[#D4A373] mb-2 uppercase tracking-wide">coleção e exclusividade</p>
              <p className="font-serif text-[0.98rem] text-[#5A635C]">
                Gansos raros e exemplares de topo — exclusividade, conservação e prestígio.
              </p>
              <p className="font-sans text-xs text-[#4A5D4E] mt-3 mb-0 pt-3 border-t border-[#E0E2D9]">
                <span className="uppercase tracking-wider text-[0.65rem] text-[#8C968F]">por ave, adulto</span>
                <br />
                <strong className="text-sm">{faixaDoNivel('Diamante')}</strong>
              </p>
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={() => onNavigate('especies')}
              className="btn btn-gold px-8 py-3.5 text-base"
            >
              Explorar o catálogo completo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* BANNER: PRÉ-RESERVA 2026 */}
      <section className="py-12 bg-[#E9EBE2]/50 border-y border-[#E0E2D9]">
        <div className="wrap">
          <div className="bg-white border-2 border-[#D4A373] rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#FAFBF8] text-[#D4A373] border border-[#E0E2D9] px-3.5 py-1 rounded-full text-xs font-sans font-bold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                Temporada 2026 Aberta
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#4A5D4E]">
                Pré-reserva 2026 aberta — sem pagamento antecipado. Você só paga na entrega.
              </h3>
              <p className="font-serif text-[#5A635C] text-base max-w-2xl">
                Garanta o seu lugar na fila de nascimentos do novo ciclo. Atendimento consultivo, validação de estrutura e pagamento somente na entrega, com a ave e a documentação conferidas.
              </p>
            </div>
            <button
              onClick={() => onNavigate('pre-reserva')}
              className="btn btn-gold text-nowrap px-8 py-4 font-bold text-base shadow-md hover:scale-105 transition-transform"
            >
              Garantir minha pré-reserva
            </button>
          </div>
        </div>
      </section>

      {/* PROCEDÊNCIA É O NOSSO PADRÃO */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="wrap text-center">
          <h2 className="sec-title center">Procedência é o nosso padrão</h2>
          <p className="sec-sub mx-auto">
            Documentação de origem, sanidade comprovada e transporte com respaldo legal acompanham cada ave. É o que separa um criadouro sério de um mercado informal.
          </p>
          <button
            onClick={() => onNavigate('procedencia')}
            className="btn btn-gold px-8 py-3.5"
          >
            Conheça nossa procedência
          </button>
        </div>
      </section>

      {/* SEÇÃO 1: NOSSAS MATRIZES */}
      <section className="py-16 sm:py-20 bg-[#FAFBF8] border-t border-[#E0E2D9]">
        <div className="wrap">
          {/* Cabeçalho centralizado, no mesmo padrão das outras seções — antes a coluna de
              texto ficava sozinha à esquerda e metade da largura sobrava vazia. */}
          <div className="text-center mb-8">
            <div className="text-xs font-sans font-bold text-[#C1732B] uppercase tracking-wider mb-1">
              nossas matrizes
            </div>
            <h2 className="sec-title center font-serif text-2xl sm:text-3xl font-semibold text-[#4A5D4E]">
              Exemplares do nosso plantel
            </h2>
            <p className="sec-sub center mb-0">
              Registros fotográficos dos casais reprodutores e matrizes mantidos em nosso criadouro
              com acompanhamento sanitário constante.
            </p>
          </div>

          <div>
            {/* Carrossel — agora ocupa a largura útil da página, que é onde a foto rende */}
            <div className="w-full max-w-3xl mx-auto">
              <div
                className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center select-none ${
                  MATRIZES[matrizIndex]?.src
                    ? 'bg-[#17282A] border border-[#E0E2D9] p-0'
                    : 'bg-[#FAFBF8] border-2 border-dashed border-[#C1732B]/40 p-4'
                }`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {MATRIZES[matrizIndex]?.src ? (
                  <div className="w-full h-full relative rounded-xl overflow-hidden bg-[#17282A]">
                    {/* Fundo desfocado da própria foto: preenche a moldura sem cortar a ave
                        (as fotos vêm em 16:9 e uma em retrato; recorte cego decepava o bicho). */}
                    <img
                      src={fotoWebp(MATRIZES[matrizIndex].src)}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg opacity-45 pointer-events-none select-none"
                    />
                    <picture>
                      <source srcSet={fotoWebp(MATRIZES[matrizIndex].src)} type="image/webp" />
                      <img
                        src={MATRIZES[matrizIndex].src}
                        alt={MATRIZES[matrizIndex].legenda || `Foto ${matrizIndex + 1} do plantel da Aves Arca`}
                        loading={matrizIndex === 0 ? 'eager' : 'lazy'}
                        className="relative w-full h-full object-contain"
                      />
                    </picture>
                    {MATRIZES[matrizIndex].legenda && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-white p-2.5 text-xs font-serif text-center">
                        {MATRIZES[matrizIndex].legenda}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-white border border-[#E0E2D9] flex items-center justify-center text-[#C1732B]">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="font-serif text-sm text-[#5A635C] font-medium">
                      foto a inserir
                    </span>
                    <span className="font-sans text-[0.7rem] text-[#C1732B] font-bold uppercase tracking-wider">
                      Slot {matrizIndex + 1} de {MATRIZES.length}
                    </span>
                  </div>
                )}

                {/* Setas Laterais de Navegação */}
                <button
                  onClick={prevMatriz}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-[#E0E2D9] text-[#4A5D4E] hover:bg-white transition-colors flex items-center justify-center shadow-xs cursor-pointer"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMatriz}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-[#E0E2D9] text-[#4A5D4E] hover:bg-white transition-colors flex items-center justify-center shadow-xs cursor-pointer"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Pontos de Navegação (Dots) */}
              <div className="flex items-center justify-center gap-1.5 mt-4 flex-wrap">
                {MATRIZES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMatrizIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === matrizIndex
                        ? 'w-6 bg-[#C1732B]'
                        : 'w-2 bg-[#E0E2D9] hover:bg-[#C1732B]/50'
                    }`}
                    aria-label={`Ir para a foto ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: AVES ARCA POR AÍ — os 4 vídeos em 2×2, largura inteira */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E0E2D9]">
        <div className="wrap">
          <div className="text-center mb-8">
            <div className="text-xs font-sans font-bold text-[#C1732B] uppercase tracking-wider mb-1">
              na mídia
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#4A5D4E] m-0">
              Aves Arca por aí
            </h2>
            <div className="w-16 h-[3px] bg-[#C1732B] mx-auto mt-3 rounded-full" />
          </div>

          {VIDEOS.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {VIDEOS.map((v) => (
                <div key={v.youtube}>
                  {/* A capa vem do YouTube como imagem; o player só é montado no clique. */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#E0E2D9] bg-[#17282A] shadow-xs">
                    {videoAberto === v.youtube ? (
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube-nocookie.com/embed/${v.youtube}?autoplay=1&rel=0&modestbranding=1`}
                        title={v.titulo || 'Vídeo sobre a Aves Arca'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setVideoAberto(v.youtube || null); medir('play_video', { canal: v.canal, id: v.youtube }); }}
                        className="group absolute inset-0 w-full h-full cursor-pointer"
                        aria-label={`Assistir: ${v.titulo || 'vídeo'}${v.canal ? ` — canal ${v.canal}` : ''}`}
                      >
                        <img
                          src={`https://i.ytimg.com/vi/${v.youtube}/maxresdefault.jpg`}
                          onError={(e) => {
                            const img = e.currentTarget;
                            if (!img.dataset.fallback) {
                              img.dataset.fallback = '1';
                              img.src = `https://i.ytimg.com/vi/${v.youtube}/hqdefault.jpg`;
                            }
                          }}
                          alt={v.titulo || 'Vídeo sobre a Aves Arca'}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-[#17282A]/15 transition-colors group-hover:bg-[#17282A]/5" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-[#C1732B] shadow-lg transition-transform group-hover:scale-110">
                            <Play className="w-7 h-7 text-white translate-x-[2px]" fill="currentColor" />
                          </span>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Crédito sempre visível, inclusive com o vídeo tocando */}
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[#4A5D4E] leading-snug mt-4 mb-1">
                    {v.titulo}
                  </h3>
                  {v.canal && (
                    <p className="font-sans text-xs text-[#5A635C] m-0">canal {v.canal}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {FOTOS.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
              {FOTOS.slice(0, 8).map((item, idx) => (
                <div key={idx} className="bg-[#FAFBF8] p-3 rounded-xl border border-[#E0E2D9]">
                  {item.imagem && (
                    <img src={item.imagem} alt={item.local || 'Registro'} className="w-full h-24 object-cover rounded-lg mb-2" />
                  )}
                  {item.local && (
                    <div className="flex items-center gap-1 text-xs text-[#C1732B] font-bold">
                      <MapPin className="w-3 h-3" />
                      <span>{item.local}</span>
                    </div>
                  )}
                  {item.data && <span className="text-[0.7rem] text-[#5A635C] block">{item.data}</span>}
                  {item.texto && <p className="font-serif text-xs text-[#2D3436] line-clamp-1 mt-1">{item.texto}</p>}
                </div>
              ))}
            </div>
          )}

          {!hasPorAi && (
            <div className="py-12 px-4 text-center border border-dashed border-[#E0E2D9] rounded-2xl bg-[#FAFBF8]">
              <p className="font-serif text-sm text-[#8C968F] italic m-0">em breve</p>
            </div>
          )}

          <p className="text-center text-xs font-sans text-[#8C968F] mt-8 mb-0">
            Vídeos de canais independentes, publicados em seus próprios perfis. O player do YouTube
            só carrega depois que você aperta play.
          </p>
        </div>
      </section>

      {/* SEÇÃO 3: PARCEIROS (vazia por enquanto) */}
      <section className="py-16 sm:py-20 bg-[#FAFBF8] border-t border-[#E0E2D9]">
        <div className="wrap">
          <div className="text-center mb-8">
            <div className="text-xs font-sans font-bold text-[#C1732B] uppercase tracking-wider mb-1">
              quem caminha com a gente
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#4A5D4E] m-0">
              {TITULO_PARCEIROS}
            </h2>
            <div className="w-16 h-[3px] bg-[#C1732B] mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {PARCEIROS.map((parceiro, idx) => {
              const conteudo = (
                <div className="h-full rounded-2xl bg-white border border-[#E0E2D9] p-5 flex flex-col items-center justify-center gap-2.5 text-center transition-colors group-hover:border-[#C1732B]">
                  {parceiro.logo ? (
                    <img
                      src={parceiro.logo}
                      alt={parceiro.nome || 'Parceiro'}
                      className="max-h-14 max-w-full object-contain"
                    />
                  ) : (
                    <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#F1EBDD] transition-colors group-hover:bg-[#C1732B]/15">
                      <Instagram className="w-5 h-5 text-[#C1732B]" />
                    </span>
                  )}
                  {parceiro.nome && (
                    <span className="font-sans text-sm font-bold text-[#4A5D4E] break-all">
                      {parceiro.nome}
                    </span>
                  )}
                  {parceiro.site && (
                    <span className="font-sans text-[0.7rem] uppercase tracking-wider text-[#8C968F]">
                      ver no Instagram
                    </span>
                  )}
                  {!parceiro.nome && !parceiro.site && (
                    <span className="font-sans text-[0.65rem] uppercase tracking-wider text-[#8C968F]">
                      logotipo a inserir
                    </span>
                  )}
                </div>
              );

              if (parceiro.site) {
                return (
                  <a
                    key={idx}
                    href={parceiro.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => medir('clicar_parceiro', { perfil: parceiro.nome })}
                    className="group block transition-transform hover:-translate-y-0.5"
                    aria-label={`${parceiro.nome || 'Parceiro'} no Instagram (abre em outra aba)`}
                  >
                    {conteudo}
                  </a>
                );
              }
              return <div key={idx} className="group">{conteudo}</div>;
            })}
          </div>

          {!hasParceiros && (
            <p className="text-center font-serif text-sm text-[#8C968F] italic mt-6 mb-0">
              em breve
            </p>
          )}
        </div>
      </section>

      {/* SEÇÃO 4: QUEM JÁ COMPROU — espaço pronto, aparece quando houver depoimento real */}
      {DEPOIMENTOS.length > 0 && (
        <section className="py-16 sm:py-20 bg-white border-t border-[#E0E2D9]">
          <div className="wrap">
            <div className="text-center mb-8">
              <div className="text-xs font-sans font-bold text-[#C1732B] uppercase tracking-wider mb-1">
                quem já comprou
              </div>
              <h2 className="sec-title center font-serif text-2xl sm:text-3xl font-semibold text-[#4A5D4E]">
                O que dizem os criadores
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEPOIMENTOS.slice(0, 6).map((d, idx) => (
                <figure
                  key={idx}
                  className="m-0 rounded-3xl border border-[#E0E2D9] bg-[#FAFBF8] p-6 flex flex-col gap-4"
                >
                  {d.texto && (
                    <blockquote className="font-serif text-sm leading-relaxed text-[#2D3436] m-0">
                      “{d.texto}”
                    </blockquote>
                  )}
                  <figcaption className="flex items-center gap-3 mt-auto">
                    {d.foto && (
                      <img src={d.foto} alt="" className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <span className="font-sans text-xs text-[#5A635C]">
                      <strong className="block text-[#4A5D4E] text-sm font-bold">{d.autor}</strong>
                      {[d.cidade, d.variedade].filter(Boolean).join(' · ')}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEÇÃO 5: LISTA DA PRÓXIMA TEMPORADA */}
      <ListaEspera />
    </div>
  );
};