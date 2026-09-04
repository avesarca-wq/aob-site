/**
 * MEDIÇÃO — instrumentação do site (05.6.14, pedido nº1 do Ricardo em 07/08/2026).
 *
 * Por que existe: o protocolo 05.14 diagnostica em qual ELO a cadeia quebrou
 * (A alcance → B clique → C lead → D qualificado → E pré-reserva → F venda paga).
 * O site responde pelo elo B→C. Sem evento registrado, "não vendeu" vira opinião.
 *
 * COMO ACENDER (uma constante, sem tocar em mais nada):
 *   - UMAMI (RECOMENDADO): preencher UMAMI_ID com o "Website ID" do Umami Cloud.
 *     Plano gratuito permanente, sem cookie, com eventos personalizados e funis.
 *     Se a conta for auto-hospedada, ajustar também UMAMI_SCRIPT.
 *   - PLAUSIVEL: preencher com o domínio, ex.: 'avesarca.com.br'. Pago (US$ 9/mês),
 *     sem cookie, 30 dias de teste.
 *   - GA4: preencher com 'G-XXXXXXXXXX'. **Grava cookie e faz perfilamento** — exige
 *     aviso de consentimento antes de carregar e revisão do texto de /#privacidade.
 *     Só faz sentido se houver anúncio no Google para integrar. Não ligar no impulso.
 *
 * Ordem de precedência: UMAMI > PLAUSIVEL > GA4. Preencher só uma.
 *
 * Enquanto os dois estiverem vazios, nada é enviado para fora: os eventos ficam em
 * `window.__eventos` (e no console em modo dev), o que já permite conferir a instrumentação
 * sem contratar nada.
 */

export const UMAMI_ID = 'b7a2b87a-78a4-4392-93cc-ee6f658328ae';
export const UMAMI_SCRIPT = 'https://cloud.umami.is/script.js';
export const PLAUSIVEL = '';
export const GA4 = '';

/**
 * PIXEL DA META — conjunto de dados "Aves Arca - Site" (31/08/2026).
 * Diferente do Umami, ESTE grava cookie (_fbp) e manda a navegação para a Meta. Por isso a
 * /privacidade e a linha de dados da pré-reserva foram reescritas no mesmo commit — e por isso
 * o CSP do netlify.toml precisou liberar connect.facebook.net e www.facebook.com; sem isso
 * o pixel falha CALADO.
 * Nunca recebe nome, telefone, e-mail nem endereço: só o evento e o valor de referência.
 * Para desligar, basta esvaziar esta constante.
 */
export const META_PIXEL = '1426238322697174';

export type Evento =
  | 'ver_catalogo'
  | 'buscar'
  | 'filtrar_nivel'
  | 'abrir_ficha'
  | 'abrir_galeria'
  | 'add_carrinho'
  | 'ver_conferencia'
  | 'enviar_pedido'
  | 'pedido_ok'
  | 'pedido_erro'
  | 'clicar_whatsapp'
  | 'play_video'
  | 'clicar_parceiro'
  | 'lista_espera_ok'
  | 'abrir_faq'
  | 'ir_para_pedido'
  | 'pedido_bloqueado'
  | 'lista_espera_abrir'
  | 'carrinho_vazio';

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    __eventos?: Array<{ evento: string; props: Props; t: number }>;
    plausible?: (evento: string, opcoes?: { props: Props }) => void;
    umami?: { track: (evento: string, props?: Props) => void };
    gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  _fbq?: unknown;
    dataLayer?: unknown[];
  }
}

const CHAVE_ORIGEM = 'avesarca:origem:v1';

export interface Origem {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  pagina_entrada: string;
  referencia: string;
}

/**
 * Guarda de onde a visita veio, na PRIMEIRA página aberta, e devolve isso depois — inclusive
 * no envio do pedido. É assim que se descobre se o pedido nasceu do orgânico, do grupo, da
 * lista de transmissão ou do anúncio pago (os quatro canais do 05.14), sem cookie e sem
 * identificar ninguém.
 */
export function origemDaVisita(): Origem {
  const vazio: Origem = {
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    pagina_entrada: '',
    referencia: '',
  };
  try {
    const guardado = sessionStorage.getItem(CHAVE_ORIGEM);
    if (guardado) return { ...vazio, ...JSON.parse(guardado) };

    const q = new URLSearchParams(window.location.search);
    const origem: Origem = {
      utm_source: q.get('utm_source') || '',
      utm_medium: q.get('utm_medium') || '',
      utm_campaign: q.get('utm_campaign') || '',
      utm_content: q.get('utm_content') || '',
      pagina_entrada: window.location.hash || '#home',
      // só o domínio de origem, nunca a URL inteira (não é dado de pessoa)
      referencia: document.referrer ? new URL(document.referrer).hostname : '',
    };
    sessionStorage.setItem(CHAVE_ORIGEM, JSON.stringify(origem));
    return origem;
  } catch {
    return vazio;
  }
}

/** Texto curto com a origem, do jeito que entra no registro do pedido. */
export function origemResumida(): string {
  const o = origemDaVisita();
  const partes = [
    o.utm_source && `fonte=${o.utm_source}`,
    o.utm_medium && `meio=${o.utm_medium}`,
    o.utm_campaign && `campanha=${o.utm_campaign}`,
    o.utm_content && `criativo=${o.utm_content}`,
    !o.utm_source && o.referencia && `veio-de=${o.referencia}`,
    !o.utm_source && !o.referencia && 'direto',
    o.pagina_entrada && `entrou-em=${o.pagina_entrada}`,
  ].filter(Boolean);
  return partes.join(' · ');
}

/** Registra um evento. Nunca recebe nome, telefone, e-mail nem nada que identifique a pessoa. */
export function medir(evento: Evento, props: Props = {}): void {
  try {
    if (!window.__eventos) window.__eventos = [];
    window.__eventos.push({ evento, props, t: Date.now() });
    if (window.__eventos.length > 200) window.__eventos.shift();

    if (UMAMI_ID && window.umami?.track) {
      window.umami.track(evento, props);
    }
    if (PLAUSIVEL && typeof window.plausible === 'function') {
      window.plausible(evento, { props });
    }
    if (GA4 && typeof window.gtag === 'function') {
      window.gtag('event', evento, props);
    }
    // Meta: só os dois eventos que interessam a um anúncio — carrinho e pedido enviado.
    if (META_PIXEL && typeof window.fbq === 'function') {
      if (evento === 'add_carrinho') {
        window.fbq('track', 'AddToCart', {
          content_name: String(props.variedade ?? ''),
          content_type: 'product',
          currency: 'BRL',
        });
      } else if (evento === 'pedido_ok') {
        window.fbq('track', 'Lead', {
          value: Number(props.total_referencia ?? 0),
          currency: 'BRL',
        });
      }
    }

    if (typeof location !== 'undefined' && /localhost|127\.0\.0\.1/.test(location.hostname)) {
      // eslint-disable-next-line no-console
      console.debug('[medir]', evento, props);
    }
  } catch {
    /* medição nunca pode derrubar a página */
  }
}

/** Injeta o script escolhido. Chamado uma vez, na subida do app. */
export function carregarMedicao(): void {
  try {
    // A fila existe desde a subida do app: dá para conferir a instrumentação no console
    // (window.__eventos) mesmo antes de qualquer clique.
    if (!window.__eventos) window.__eventos = [];
    origemDaVisita();

    // O pixel é independente da escolha acima (Umami/Plausible/GA4) e precisa entrar ANTES
    // do return de cada bloco, senão nunca carregaria.
    if (META_PIXEL && !window.fbq) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const w = window as any;
      const n: any = (w.fbq = function (...args: unknown[]) {
        if (n.callMethod) n.callMethod.apply(n, args);
        else n.queue.push(args);
      });
      if (!w._fbq) w._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      /* eslint-enable @typescript-eslint/no-explicit-any */
      const p = document.createElement('script');
      p.async = true;
      p.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(p);
      // Desliga a coleta automática da Meta ANTES do init. Sem isto o pixel manda por conta
      // própria o texto dos botões clicados e as características dos formulários — e é isso que
      // tornaria falsa a frase que a /privacidade publica: 'nunca o seu nome, telefone, e-mail ou
      // endereço, nem o que você escreveu no formulário'. Conferido no ar em 31/08: com a coleta
      // ligada, um clique em 'Adicionar à pré-reserva' virava um evento SubscribedButtonClick.
      w.fbq('set', 'autoConfig', false, META_PIXEL);
      w.fbq('init', META_PIXEL);
      w.fbq('track', 'PageView');
    }

    if (UMAMI_ID) {
      const s = document.createElement('script');
      s.defer = true;
      s.src = UMAMI_SCRIPT;
      s.setAttribute('data-website-id', UMAMI_ID);
      document.head.appendChild(s);
      return;
    }

    if (PLAUSIVEL) {
      const s = document.createElement('script');
      s.defer = true;
      s.setAttribute('data-domain', PLAUSIVEL);
      s.src = 'https://plausible.io/js/script.tagged-events.js';
      document.head.appendChild(s);
      window.plausible =
        window.plausible ||
        function (...args: unknown[]) {
          (window.plausible as unknown as { q: unknown[] }).q =
            (window.plausible as unknown as { q?: unknown[] }).q || [];
          (window.plausible as unknown as { q: unknown[] }).q.push(args);
        };
      return;
    }

    if (GA4) {
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: unknown[]) {
        window.dataLayer!.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA4, { anonymize_ip: true });
    }
  } catch {
    /* idem */
  }
}
