import type { AssetPackConfig } from '@assetpack/core';
import { pixiManifest } from '@assetpack/core/manifest';

const config: AssetPackConfig = {
  // 入口：原始资源目录
  entry: './src/assets',

  // 输出：处理后资源目录
  output: './public/assets',

  // 缓存目录
  cache: true,

  // 日志级别：设置为 none 以关闭日志
  logLevel: 'warn',

  // 资源管道配置
  pipes: [
    // 生成 PixiJS manifest.json
    pixiManifest({
      // 输出位置（相对于 output）
      output: './manifest.json',
      // 是否包含元数据
      includeMetaData: true,
      // 是否移除文件扩展名作为别名
      trimExtensions: true,
      // 是否创建短别名
      createShortcuts: true,
    }),

    // 图片压缩（需要安装 @assetpack/plugin-compress）
    // compress({
    //   jpg: { quality: 80 },
    //   png: { quality: 80 },
    //   webp: { quality: 80 },
    // }),

    // 精灵图打包（需要安装 @assetpack/plugin-texture-packer）
    // texturePacker({
    //   texturePacker: {
    //     removeFileExtension: true,
    //   },
    // }),
  ],
};

export default config;
