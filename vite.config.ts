import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// Fix: Explicitly import `cwd` from `node:process` to resolve TypeScript type error.
import { cwd } from 'node:process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // This configuration is now simplified.
  // We no longer need to expose any secret keys to the frontend.
  // The serverless function will read its key directly from the hosting environment variables.
  return {
    plugins: [react()],
    // The 'define' block for process.env.API_KEY has been removed.
  }
})