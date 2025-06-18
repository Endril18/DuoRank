/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BACKEND: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}