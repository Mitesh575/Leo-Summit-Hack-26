import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/widget.tsx'),
            name: 'BackgroundWidget',
            fileName: 'background-widget',
            formats: ['iife'],
        },
        rollupOptions: {
            external: [], // bundle everything including React
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM'
                }
            }
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
    define: {
        'process.env': {} // Fix process undefined error in some libs
    }
});
