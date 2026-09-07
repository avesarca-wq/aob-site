// Umami Cloud — mesma propriedade que o avesarca.com.br usa
// (website b7a2b87a-78a4-4392-93cc-ee6f658328ae, conta avesarca@gmail.com).
//
// Por que o mesmo ID e nao um proprio: o plano atual do Umami permite um site
// so. Como o Umami grava o hostname em todo evento, os dois dominios caem no
// mesmo painel e ficam comparaveis lado a lado — que era justamente o objetivo.
// Para separar, e so filtrar por hostname no painel.
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
