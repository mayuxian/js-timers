import { defineConfig, UserConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig((config: UserConfig) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const isDev = config.mode === 'development'
  const isDevBuild = config.mode === 'devbuild'
  const isTest = config.mode === 'test'
  const isProd = config.mode === 'production'
  /* eslint-enable  */
  return {
    base: isDev ? './' : '/', // 打包路径
    plugins: [],
    resolve: {
      alias: [
        {
          find: /^@\//,
          replacement: resolve(__dirname, 'src') + '/', // 设置 `@` 指向 `src` 目录
        },
      ],
    },
    css: {
      postcss: {
        plugins: [
          {
            //解决构建包含@charset问题 https://github.com/vitejs/vite/issues/5833
            //或者安装postcss-normalize-charset，应该也可以实现去除charset规则
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: atRule => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              },
            },
          },
        ],
      },
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'ViteLib',
        fileName: format => `vite-lib-template.${format}.js`,
      },
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ['vue'],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue'
          }
        }
      },
      target: 'esnext', //默认'modules',modules模式Opera、UC、百度浏览器不支持，由于对于移动端，不建议设置modules模式
      assetsInlineLimit: 4096, //默认4096,小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求
      cssCodeSplit: true, //默认true, CSS代码拆分
      sourcemap: !isProd,
      minify: 'terser', // 'terser' 相对较慢，但大多数情况下构建后的文件体积更小。'esbuild' 最小化混淆更快但构建后的文件相对更大。
      terserOptions: {
        compress: {
          drop_console: isProd, // 生产环境去除console
          drop_debugger: isProd, // 生产环境去除debugger
        },
      },
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      jsxInject: "import { h } from 'vue';",
    },
    server: {
      port: 4005, // 启动端口
      open: false, // 启动后是否打开浏览器。建议关闭，首次打开的页面会热更新，否则每次都会打开新的tab页。
      cors: true, // 允许跨域
      // 本地代理接口
      proxy: {
        // dev环境
        '/': {
          target: '',
          changeOrigin: true,
          // rewrite: path => path.replace(/^\/collect/, 'collect'),
        },
        // test环境
        // '/': {
        //   target: '',
        //   changeOrigin: true,
        //   // rewrite: path => path.replace(/^\/collect/, 'collect'),
        // },
      },
    },
  }
})
