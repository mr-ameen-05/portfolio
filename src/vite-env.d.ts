/// <reference types="vite/client" />

/**
 * Environment variables consumed by the app.
 * Copy `.env.example` to `.env.local` and fill these in to point the course
 * enrollment / quiz submissions at your external API service.
 */
interface ImportMetaEnv {
  readonly VITE_ENROLL_ENDPOINT?: string;
  readonly VITE_QUIZ_ENDPOINT?: string;
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
