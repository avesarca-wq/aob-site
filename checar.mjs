import { chromium } from 'playwright';
const [,, porta, marca] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 412, height: 900 } });
const erros = [];
p.on('response', (r) => { if (/\.(webp|png)$/.test(r.url()) && r.status() >= 400) erros.push(r.url().replace(`http://localhost:${porta}`, '') + ' -> ' + r.status()); });
await p.goto(`http://localhost:${porta}/aves/`, { waitUntil: 'networkidle' });
// rolagem gradual, para o lazy-loading disparar em todos
for (let y = 0; y < 60; y++) { await p.evaluate(() => window.scrollBy(0, 900)); await p.waitForTimeout(120); }
await p.waitForTimeout(2000);
const r = await p.evaluate(() => {
  const cards = [...document.querySelectorAll('article.card')];
  const imgs = cards.map((c) => c.querySelector('.card-foto img')).filter(Boolean);
  const creditos = [...document.querySelectorAll('.foto-credito')].map((e) => e.textContent);
  return {
    cards: cards.length,
    comFoto: imgs.length,
    molduras: cards.filter((c) => c.querySelector('.moldura')).length,
    naoCarregaram: imgs.filter((i) => i.naturalWidth === 0).map((i) => i.currentSrc.split('/').pop()),
    creditoArca: creditos.filter((c) => c.startsWith('Foto: Aves Arca')).length,
    creditoLivre: creditos.filter((c) => !c.startsWith('Foto: Aves Arca')).length,
  };
});
console.log(`${marca} /aves/: ${r.cards} cards · ${r.comFoto} com foto · ${r.molduras} com moldura`);
console.log(`  creditos: Aves Arca ${r.creditoArca} · acervo livre ${r.creditoLivre}`);
console.log(`  fotos que nao carregaram: ${r.naoCarregaram.length ? r.naoCarregaram : 'nenhuma'}`);
console.log(`  erros HTTP de imagem: ${erros.length ? erros : 'nenhum'}`);
await b.close();
