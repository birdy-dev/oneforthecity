/// <reference types="vite/client" />

declare global {
  interface D1Result<T = unknown> {
    results?: T[];
    success: boolean;
    error?: string;
    meta: Record<string, unknown>;
  }

  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T | null>;
    run<T = unknown>(): Promise<D1Result<T>>;
    all<T = unknown>(): Promise<D1Result<T>>;
    raw<T = unknown[]>(): Promise<T[]>;
  }

  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    exec(query: string): Promise<D1Result>;
  }

  namespace NodeJS {
    interface ProcessEnv {
      readonly ADMIN_PASSWORD?: string;
      readonly ADMIN_USERNAME?: string;
      readonly STRIPE_WEBHOOK_SECRET?: string;
      readonly STRIPE_IMAGE_ORIGIN?: string;
      readonly STRIPE_SECRET_KEY?: string;
    }
  }
}

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
