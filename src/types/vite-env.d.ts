interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_OTHER_KEY?: string;
  // add all your custom env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
