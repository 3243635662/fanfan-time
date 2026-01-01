import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { viteMockServe } from 'vite-plugin-mock'
import { vitePluginForArco } from "@arco-plugins/vite-vue";
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      vitePluginForArco({
        style: "css",
      }),
      viteMockServe({
        mockPath: 'mock',        // mock 文件夹
        enable: env.VITE_USE_MOCK === 'true', // 根据环境变量控制
        watchFiles: true,        // 监听 mock 文件变化
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/styles/variables.scss" as *;
            @use "@/styles/mixins.scss" as *;
          `,
        },
      },
    },
  }
});
