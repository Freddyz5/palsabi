// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://palsabi.ec',
  // La barra de Astro se mete en las capturas de la cuenca.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
