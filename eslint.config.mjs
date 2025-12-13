import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 1. 指定匹配的文件类型
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"]
  },

  // 2. 设置全局变量环境 (浏览器 + Node.js)
  {
    languageOptions: { 
      globals: { ...globals.browser, ...globals.node }
    }
  },

  // 3. 引入推荐的基础配置
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended, // TS 推荐配置
  ...pluginVue.configs["flat/essential"], // Vue 基础配置 (也可换成 recommended)

  // 4. Vue 文件必须指定 TS 解析器
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  // 5. 自定义规则 (在这里调整严格程度)
  {
    rules: {
      // --- TypeScript 宽松配置 ---

      // 允许使用 any 类型 (只警告，不报错)
      "@typescript-eslint/no-explicit-any": "warn",

      // 允许未使用的变量 (只警告，有助于开发时调试)
      "@typescript-eslint/no-unused-vars": "warn",
      // 允许函数不显式定义返回类型 (你的核心需求)
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // 允许使用 @ts-ignore (适度允许，用于临时跳过检查)
      "@typescript-eslint/ban-ts-comment": "off",

      // --- Vue 宽松配置 ---

      // 关闭组件命名必须多单词的限制 (如允许名为 'Login.vue' 而非 'LoginUser.vue')
      "vue/multi-word-component-names": "off",

      // 允许在 props 中不定义默认值 (根据个人喜好开启/关闭)
      "vue/require-default-prop": "off",

      // 允许 v-html (注意安全风险，但在内部系统中常用)
      "vue/no-v-html": "off",

      // --- 常规 JS 宽松配置 ---

      // 开发中允许使用 console.log，生产环境建议 warn 或 error
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
  },
  
  // 6. 忽略某些文件夹
  {
    ignores: ["dist/*", "node_modules/*", "public/*", ".nuxt/*", ".output/*"],
  },
];
