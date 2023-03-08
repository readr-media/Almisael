# [@readr-media/react-component](https://www.npmjs.com/package/@readr-media/react-component) &middot; ![npm version](https://img.shields.io/npm/v/@readr-media/react-component.svg?style=flat)

## Feature

- `@readr-media/react-component` 整理了 [Readr](https://www.readr.tw/) 網站/靜態專題所需之共用元件。
- 詳細使用方式可參閱各元件的 README.md。
- 注意：此套件僅支援 `ES modules`，需注意使用環境須為 Node.js 12 / Next.js 12 以上。

### Components

- [Readr LOGO](./src/logo): see [src/logo](./src/logo)
- [贊助按鈕](./src/donate-button): see [src/donate-button](./src/donate-button)
- [訂閱電子報按鈕](./src/subscribe-button): see [src/subscribe-button](./src/subscribe-button)
- [相關報導](./src/related-report): see [src/related-report](./src/related-report)

## How to Use This Pkg?

1. Install the npm [package](https://www.npmjs.com/package/@readr-media/react-component)
   `yarn add @readr-media/react-component`
2. Import component in the desired place

## Installation

`yarn install`

## Development

```
$ yarn dev
// or
$ npm run dev
// or
$ make dev
```

## Build (Webpack Bundles and ES5 Transpiling)

```
$ yarn build
// or
$ npm run build
// or
$ make build
```

### Transpile React, ES6 Codes to ES5

```
$ make build-lib
```

### NPM Publish

After executing `Build` scripts, we will have `/lib` folders,
and then we can execute publish command,

```
npm publish
```

Note: before publish npm package, we need to bump the package version first.

## TODOs

- [ ] 建立 CI pipeline，透過 CI 產生 npm package，並且上傳至 npm registry
- [ ] 透過 Lerna 控制 packages 之間的版號
