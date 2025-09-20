import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtPlugin from '@create-web-ext/hot-reload'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
		react(),
		// @ts-ignore
		webExtPlugin({ sourceDir: '/dist' }),
	],
})
