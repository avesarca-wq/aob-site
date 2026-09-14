import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
const [,, porta, rotulo, ...rotas] = process.argv;
const chrome = await launch({ chromePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', chromeFlags: ['--headless=new','--no-sandbox','--disable-dev-shm-usage'] });
for (const rota of rotas) {
  const { lhr: j } = await lighthouse(`http://localhost:${porta}${rota}`, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['accessibility'] });
  const a = j.audits['color-contrast'];
  console.log(`${rotulo} ${rota.padEnd(12)} contraste ${a.score === 1 ? 'passa' : 'FALHA'} · a11y ${Math.round(j.categories.accessibility.score*100)}`);
  for (const it of (a.details?.items ?? [])) console.log('   ·', (it.node?.explanation || '').replace(/\s+/g,' ').slice(0, 130));
}
await chrome.kill();
