import { defineConfig } from 'father'
// https://github.com/umijs/father-next/blob/master/docs/config.md
const type = process.env.BUILD_TYPE;
type ConfigType = Parameters<typeof defineConfig>[0]
let config: ConfigType = {};
if (type === 'lib') {
  config = {
    cjs: {
      input: 'src',
      output: 'cjs',
    },
    extraBabelPlugins: [
      [
        'babel-plugin-import',
        { libraryName: 'antd', libraryDirectory: 'lib', style: true },
        'antd',
      ] as any,
    ],
  };
}
if (type === 'es') {
  config = {
    esm: {
      ignores: ['.json'],
      input: 'src',
      output: 'esm',
    },
    extraBabelPlugins: [
      [require('./scripts/replaceLib')] as any,
      ['babel-plugin-import', { libraryName: 'antd', libraryDirectory: 'es', style: true }, 'antd'],
    ],
  };
}

export default config;
