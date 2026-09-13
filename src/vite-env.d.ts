/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Marca deste build — ver src/marcas.ts. */
  readonly VITE_MARCA?: 'aob' | 'stima' | 'alianca';
  readonly VITE_UMAMI_ID?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
