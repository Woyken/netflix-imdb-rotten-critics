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
        icon: 'https://raw.githubusercontent.com/Woyken/netflix-imdb-rotten-critics/main/public/imdbRottenCritics_icon.png',
        namespace: 'https://github.com/Woyken/netflix-imdb-rotten-critics',
        match: ['https://www.netflix.com/*'],
      },
    }),
  ],
});
