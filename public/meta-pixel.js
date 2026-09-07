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
// O pixel do AOB continua existindo e recebendo tudo, então a campanha que já
// está no ar apontando para ele não é afetada.
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1024778503896521');
fbq('init', '1426238322697174');
fbq('track', 'PageView');
