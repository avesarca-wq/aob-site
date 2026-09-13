import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// Id do Umami por marca, para o %VITE_UMAMI_ID% do index.html. Se a Netlify já
// definir VITE_UMAMI_ID, ela vence; senão cai no id da marca escolhida.
const UMAMI_POR_MARCA: Record<string, string> = {
  aob: '60547214-1e23-4b1b-894a-9b2ab0807191',
  stima: '508779ed-8e55-4b82-b18d-384c124a0a92',
  alianca: 'a9007209-5e1b-44f5-a310-b960fda693bb',
};
process.env.VITE_MARCA ||= 'aob';
process.env.VITE_UMAMI_ID ||= UMAMI_POR_MARCA[process.env.VITE_MARCA] ?? UMAMI_POR_MARCA.aob;

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
