import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Subdomain deployment configuration (e.g. learn.aiameen.online)
export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        port: 5174,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
        },
    },
});
