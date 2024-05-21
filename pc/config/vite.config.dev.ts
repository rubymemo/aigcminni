import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      port: 8080,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {
        '/hh/cx': {
          target: 'http://101.126.93.249/',
          changeOrigin: true,
        },
      }
    },
    // server: {
    //   port: 8080,
    //   open: true,
    //   fs: {
    //     strict: true,
    //   },
    //   proxy: {
    //     '/cx': {
    //       target: 'http://101.126.93.249/',
    //       changeOrigin: true,
    //     },
    //   }
    // },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig
);
