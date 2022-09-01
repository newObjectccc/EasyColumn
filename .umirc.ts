import { defineConfig } from "dumi";
import chalk from "chalk";
import { readdirSync } from "fs";
import { join } from "path";
import ESLintPlugin from "eslint-webpack-plugin";
import StylelintPlugin from "stylelint-webpack-plugin";

export default defineConfig({
  title: "en-volant",
  favicon: "http://dohko.hw.shop.hualala.com/images/3f58b70b.gif",
  logo: "http://dohko.hw.shop.hualala.com/images/3f58b70b.gif",
  outputPath: "docs-dist",
  mode: "site",
  // mfsu: {},
  resolve: {},
  chainWebpack(config) {
    config.plugin("eslintPlugin").use(ESLintPlugin, [
      {
        // fix: true,
        extensions: ["ts", "tsx"],
        context: join(__dirname, "./src"),
      },
    ]);

    config.plugin("styleLintPlugin").use(StylelintPlugin, [
      {
        extensions: ["less"],
        // fix: true,
      },
    ]);
  },
  apiParser: {
    // 自定义属性过滤配置，也可以是一个函数，用法参考：https://github.com/styleguidist/react-docgen-typescript/#propfilter
    propFilter: {
      // 是否忽略从 node_modules 继承的属性，默认值为 false
      skipNodeModules: true,
      // 需要忽略的属性名列表，默认为空数组
      skipPropsWithName: [],
      // 是否忽略没有文档说明的属性，默认值为 false
      skipPropsWithoutDoc: false,
    },
  },
  navs: [
    {
      title: "component",
      path: "/component",
    },
    {
      title: "regExp(正则库)",
      path: "/regExp",
    },
  ],
  devServer: {
    port: 8008,
  },
  // menus: {

  // },
  // more config: https://d.umijs.org/config
});
