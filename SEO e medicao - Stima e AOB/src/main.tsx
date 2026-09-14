import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MARCA_ATUAL } from './marcas';

document.documentElement.dataset.marca = MARCA_ATUAL.id;

// Medição por marca. Umami: cada site tem o seu website id (src/marcas.ts), então
// o Waldir vê só o movimento do stimaaves.com.br. Meta Pixel: só na rede — o
// pixel do AOB/Arca num site de parceiro contaminaria o aprendizado da campanha.
const medir = (src: string, attrs: Record<string, string> = {}) => {
  const s = document.createElement('script');
  s.src = src; s.defer = true;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
};
medir('/umami.js', { 'data-website-id': MARCA_ATUAL.umami });
if (MARCA_ATUAL.id === 'aob') medir('/meta-pixel.js');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
