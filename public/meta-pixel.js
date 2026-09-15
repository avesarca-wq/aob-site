// Meta Pixel — carregado como arquivo externo (e não inline) para respeitar a
// CSP do site sem precisar de 'unsafe-inline'.
//
// DOIS conjuntos de dados, de propósito:
//
//   1024778503896521  "AOB - Site"     — o pixel próprio deste domínio
//   1426238322697174  "Aves Arca"      — o pixel do avesarca.com.br
//
// O motivo é aprendizado. A Meta só otimiza bem um conjunto de dados que
// acumula volume; dois pixels pequenos, um por domínio, aprendem os dois mal.
// Chamando fbq('init', ...) duas vezes, todo evento disparado depois vai para
// os dois conjuntos — cada um passa a enxergar o funil somado dos dois sites,
// que são o mesmo comprador em momentos diferentes.
//
// ---------------------------------------------------------------------------
// POR QUE O CARREGAMENTO É ADIADO (medição em produção, 15/09)
//
// O fbevents.js mais as duas configurações somavam 550–650 ms de script, e a
// maior tarefa longa da home era dele (337–522 ms). Bloqueando o pixel, o TBT
// da home caía de 645 ms para 113 ms e o tempo total de script de 1.175 para
// 345 ms. Nada disso precisa acontecer antes da página ficar utilizável.
//
// A parte que fica aqui em cima é só a fila do fbq: umas poucas linhas, sem
// rede. As chamadas de init e PageView entram nessa fila na hora de sempre, e
// são processadas quando o fbevents.js chega — nenhum evento se perde, só
// chega alguns segundos depois. O que foi adiado é a busca do script.
//
// A primeira tentativa usava requestIdleCallback depois do load e não bastou:
// ver o comentário do gatilho, lá embaixo.
// ---------------------------------------------------------------------------

// Fila do fbq (o mesmo stub do trecho oficial, sem a injeção do script).
!(function (f) {
  if (f.fbq) return;
  var n = (f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  });
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = '2.0';
  n.queue = [];
})(window);

fbq('init', '1024778503896521');
fbq('init', '1426238322697174');
fbq('track', 'PageView');

// Busca do fbevents.js: no primeiro dos dois que acontecer — a pessoa mexer na
// página, ou 5 s depois do load.
//
// Era requestIdleCallback depois do load. Medido em produção (15/09), não serve:
// o navegador fica ocioso cedo demais, antes de a montagem do React terminar, e
// o fbevents entrava entre 1,3 e 2,4 s — dentro da janela que o Lighthouse mede,
// com o LCP observado entre 1,4 e 2,5 s. Um prazo fixo e generoso é grosseiro,
// mas é previsível: depois dos 5 s a página já está montada em qualquer aparelho
// que nos interesse, e quem mexe antes disso puxa o pixel na hora.
(function () {
  var buscado = false;
  var GATILHOS = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
  var ESPERA_MAXIMA = 5000;

  function buscar() {
    if (buscado) return;
    buscado = true;
    GATILHOS.forEach(function (ev) { window.removeEventListener(ev, buscar, true); });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
  }

  GATILHOS.forEach(function (ev) {
    window.addEventListener(ev, buscar, { once: true, passive: true, capture: true });
  });

  function contarOsCincoSegundos() { window.setTimeout(buscar, ESPERA_MAXIMA); }

  if (document.readyState === 'complete') contarOsCincoSegundos();
  else window.addEventListener('load', contarOsCincoSegundos, { once: true });
})();
