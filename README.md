[![Build Status](https://travis-ci.org/kaelzhang/html-assets-webpack-plugin.svg?branch=master)](https://travis-ci.org/kaelzhang/html-assets-webpack-plugin)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/html-assets-webpack-plugin?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/html-assets-webpack-plugin)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/html-assets-webpack-plugin.svg)](http://badge.fury.io/js/html-assets-webpack-plugin)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/html-assets-webpack-plugin.svg)](https://www.npmjs.org/package/html-assets-webpack-plugin)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/html-assets-webpack-plugin.svg)](https://david-dm.org/kaelzhang/html-assets-webpack-plugin)
-->

# html-assets-webpack-plugin

Handle JavaScript or CSS assets to the HTML, woking with html-webpack-plugin

## Install

```sh
$ npm install html-assets-webpack-plugin --save-dev
```

## Usage

```js
// html-webpack-plugin@^2.10.0 is required
const HtmlPlugin = require('html-webpack-plugin')
const AssetsPlugin = require('html-assets-webpack-plugin')
const webpackConfig = {
  ...,
  plugins: [
    new HtmlPlugin(),
    new AssetsPlugin({
      filepath: require.resolve('./path/to/foo')
    })
  ]
}
```

## new AssetsPlugin(assets)
## new AssetsPlugin(asset)

- **assets** `Array.<Asset>`
- **asset** `Asset`

## Asset `Object`

- **filepath** ``

## License

MIT
