// Umami Cloud — site "Aves Ornamentais Brasil"
// (website 60547214-1e23-4b1b-894a-9b2ab0807191, conta avesarca@gmail.com, plano Pro desde 12/09).
//
// Historico: ate 12/09 este arquivo estava INATIVO. A ideia inicial era
// reaproveitar o website id da Arca (b7a2b87a-...), mas o Umami Cloud amarra
// o website ao dominio configurado e ignora eventos de outro hostname —
// testado em 07/09. Com o plano Pro o AOB ganhou id proprio e a tag foi
// religada no index.html. A CSP do netlify.toml ja libera cloud.umami.is
// (script) e gateway.umami.is (beacon).
//
// Arquivo externo em vez de inline para respeitar a CSP do site, igual ao
// meta-pixel.js. defer para nao atrasar a primeira renderizacao.
(function () {
  var s = document.createElement('script');
  s.src = 'https://cloud.umami.is/script.js';
  s.defer = true;
  s.setAttribute('data-website-id', '60547214-1e23-4b1b-894a-9b2ab0807191');
  // O site e uma aplicacao de pagina unica: sem isto o Umami contaria so a
  // primeira pagina da visita e perderia a navegacao entre Aves, Tabela e Pedido.
  s.setAttribute('data-auto-track', 'true');
  document.head.appendChild(s);
})();
