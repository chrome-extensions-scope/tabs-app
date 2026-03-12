import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import webExtPlugin from '@create-web-ext/hot-reload';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
		react(),
		tailwindcss(),
		// @ts-ignore
		webExtPlugin({ sourceDir: '/dist' }),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
})
