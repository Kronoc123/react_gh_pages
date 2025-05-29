import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ react() ],
    base: '/react-gh-pages/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: [ 'react', 'react-dom' ],
                    icons: [ 'lucide-react' ]
                }
            }
        }
    },
    server: {
        port: 3001,
        open: true
    }
})