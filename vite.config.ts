import { defineConfig, loadEnv, type Plugin, type ResolvedConfig, type ViteDevServer } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { viteMockServe } from 'vite-plugin-mock'
import { vitePluginForArco } from "@arco-plugins/vite-vue";
import { AssetPack } from '@assetpack/core';
import assetpackConfig from './assetpack.config';

// AssetPack 插件 - 自动处理资源并生成 manifest.json
function assetpackPlugin(): Plugin {
  let mode: ResolvedConfig['command'];
  let ap: InstanceType<typeof AssetPack> | undefined;

  return {
    name: 'vite-plugin-assetpack',
    configResolved(resolvedConfig) {
      mode = resolvedConfig.command;
    },
    buildStart: async () => {
      if (mode === 'serve') {
        // 开发模式：监听文件变化
        if (ap) return;
        ap = new AssetPack(assetpackConfig);
        void ap.watch();
      } else {
        // 生产模式：一次性构建
        await new AssetPack(assetpackConfig).run();
      }
    },
    buildEnd: async () => {
      // 构建结束时停止监听
      if (ap) {
        await ap.stop();
        ap = undefined;
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    clearScreen: false,
    server: {
      port: 5174,
      watch: {
        ignored: ['**/public/assets/**', '**/.assetpack/**'],
      },
    },
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
      assetpackPlugin(),        // AssetPack 资源打包插件
    ],
    // configureServer(server: ViteDevServer) {
    //   server.httpServer?.once('listening', () => {
    //     setTimeout(() => {
    //       server.printUrls();
    //     }, 1000);
    //   });
    // },
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
