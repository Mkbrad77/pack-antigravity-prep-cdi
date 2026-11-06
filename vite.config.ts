import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { LocalSqliteStore } from './src/server/db';
import { createApiMiddleware } from './src/server/api';

export default defineConfig(() => {
  const customDbPath = process.env.PREP_CDI_DB_PATH;
  let storeInstance: LocalSqliteStore | null = null;

  const getMiddleware = () => {
    if (!storeInstance) {
      storeInstance = new LocalSqliteStore(customDbPath);
    } else {
      storeInstance.runMigrations();
    }
    return createApiMiddleware(storeInstance);
  };

  return {
    plugins: [
      react(),
      {
        name: 'local-sqlite-api-server',
        configureServer(server) {
          // Pendant les tests (Vitest), ne jamais ouvrir la vraie base storage/user_data.sqlite
          if (process.env.VITEST) return;
          server.middlewares.use(getMiddleware());
        },
        configurePreviewServer(server) {
          server.middlewares.use(getMiddleware());
        },
      },
    ],
    server: {
      port: 5173,
      host: '127.0.0.1',
    },
    test: {
      include: ['tests/unit/**/*.test.ts'],
    },
  };
});
