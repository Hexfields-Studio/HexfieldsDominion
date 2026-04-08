import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd());
  const BACKEND_URL = env.VITE_BACKEND_URL;

  return {
    plugins: [react()],
    base: '/HexfieldsDominion/', // added for CI/CD. Will put the game and assets under https://Hexfields-Studio.github.io/HexfieldsDominion/.
    server: {
      proxy: {
        '/api': {
          target: BACKEND_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
