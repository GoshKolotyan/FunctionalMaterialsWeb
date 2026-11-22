/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "api" = live FastAPI, "static" = prebuilt JSON in /data. Default: api in dev, static in build. */
  readonly VITE_DATA_MODE?: 'api' | 'static'
  /** Base URL of a deployed API (only for api mode outside dev). Empty = same origin / dev proxy. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
