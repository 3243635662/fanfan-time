/// <reference types="vite/client" />

// Vue 文件模块声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_USE_MOCK: string
  readonly VITE_PUBLIC_PATH: string
  readonly VITE_GLOB_API_URL: string
  readonly VITE_GLOB_UPLOAD_URL: string
  readonly VITE_GLOB_API_URL_PREFIX: string
  readonly VITE_BUILD_COMPRESS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}