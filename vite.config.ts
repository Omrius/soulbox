import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// Fix: Explicitly import `cwd` from `node:process` to resolve TypeScript type error.
import { cwd } from 'node:process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement du répertoire en fonction du 'mode' (development, production).
  // Le troisième paramètre '' permet de charger toutes les variables, même sans le préfixe VITE_.
  const env = loadEnv(mode, cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Expose uniquement la variable API_KEY à l'application de manière sécurisée.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
