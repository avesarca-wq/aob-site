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

// Busca do fbevents.js: no primeiro dos dois que acontecer — a página terminar
// de carregar e o navegador ficar ocioso, ou a pessoa mexer na página.
(function () {
  var buscado = false;
  var GATILHOS = ['scroll', 'touchstart', 'pointerdown', 'keydown'];

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

  function quandoOcioso() {
    // O timeout do requestIdleCallback é o teto: se o navegador nunca ficar
    // ocioso, ele chama assim mesmo. Sem ele, o pixel poderia nunca carregar.
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(buscar, { timeout: 3000 });
    else window.setTimeout(buscar, 3000);
  }

  if (document.readyState === 'complete') quandoOcioso();
  else window.addEventListener('load', quandoOcioso, { once: true });
})();
