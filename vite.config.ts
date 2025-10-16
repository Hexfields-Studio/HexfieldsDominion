import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // added for CI/CD. Will put the game under https://hexfeldstudio.githib.io/siedler-frontend.
})
