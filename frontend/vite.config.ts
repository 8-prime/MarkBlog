import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite config
    plugins: [react(), tailwindcss()],
    base: env.VITE_BASE_URL ?? '/', // Important:  Include the trailing slash!
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5097',
          changeOrigin: true
        }
      }
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})