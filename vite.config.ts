import type { UserConfigExport } from 'vite';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import usePluginImport from "vite-plugin-importer";

const isDev = process.env.ENV == 'dev'
// https://vitejs.dev/config/

let config: UserConfigExport;
if (isDev) {
  config = defineConfig({
    root: 'test',
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      react(),
      usePluginImport({
        libraryName: "ant-design-vue",
        libraryDirectory: "es",
        style: "css",
      }),
    ],
  })
} else {
  config = defineConfig({
    build: {
      terserOptions: {
        compress: true,
        output: {
        },
      },
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'en-volant',
        formats: ['umd'],
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'antd'],
        output: {
          globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              antd: 'antd',
          },
      },
      },

    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },

    plugins: [
      react(),
      usePluginImport({
        libraryName: "ant-design-vue",
        libraryDirectory: "es",
        style: "css",
      }),
    ],
  })
}
export default config
