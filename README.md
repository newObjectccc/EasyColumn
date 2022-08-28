# en-volant

## Getting Started

Install dependencies,

```bash
$ npm i
安装eslint， stylelint 插件
```

Start the dev server,

```bash
$ npm start
```

Build documentation,

```bash
$ npm run docs:build
```

Run test,

```bash
$ npm test
```

Build library via `father`,

```bash
$ npm run build
```

Build doc: ,

```bash
$ npm run docs:build
```

按需加载配置： bable-loader

```JSON
 [
  'import',
  {
    libraryName: 'en-volant',
    libraryDirectory: 'esm/component',
    "camel2DashComponentName": false,
    // style: 'css',
  },
  'en-volant',
],
```
