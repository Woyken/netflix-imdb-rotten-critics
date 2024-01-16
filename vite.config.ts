import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    solidPlugin(),
    monkey({
      entry: 'src/index.tsx',
      userscript: {
        author: 'Woyken',
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'https://github.com/Woyken/netflix-imdb-rotten-critics',
        match: ['https://www.netflix.com/*'],
      },
    }),
  ],
});
