import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/HexfieldsDominion/', // added for CI/CD. Will put the game and assets under https://Hexfields-Studio.githib.io/HexfieldsDominion/.
})
