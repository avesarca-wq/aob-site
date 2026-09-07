// Umami Cloud — mesma propriedade que o avesarca.com.br usa
// (website b7a2b87a-78a4-4392-93cc-ee6f658328ae, conta avesarca@gmail.com).
//
// ATENCAO — este arquivo esta INATIVO (a tag foi comentada no index.html).
//
// A ideia era reaproveitar o website id da Arca, ja que o plano atual permite
// um site so. Nao funciona: o Umami Cloud amarra o website ao dominio
// configurado e ignora eventos de outro hostname. Testado em 07/09 — na Arca o
// tracker envia para gateway.umami.is; neste dominio o proprio tracker quebra
// internamente e nao envia nada.
//
// Para ligar de verdade: criar o site "Aves Ornamentais Brasil" no painel do
// Umami (exige plano com mais de um site), trocar o id abaixo pelo novo e
// descomentar a tag no index.html. A CSP ja esta liberada.
//
// Arquivo externo em vez de inline para respeitar a CSP do site, igual ao
// meta-pixel.js. defer para nao atrasar a primeira renderizacao.
(function () {
  var s = document.createElement('script');
  s.src = 'https://cloud.umami.is/script.js';
  s.defer = true;
  s.setAttribute('data-website-id', 'b7a2b87a-78a4-4392-93cc-ee6f658328ae');
  // O site e uma aplicacao de pagina unica: sem isto o Umami contaria so a
  // primeira pagina da visita e perderia a navegacao entre Aves, Tabela e Pedido.
  s.setAttribute('data-auto-track', 'true');
  document.head.appendChild(s);
})();
