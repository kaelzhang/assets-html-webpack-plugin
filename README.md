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
  output: {
    path: '/path/to',
    ...
  },
  plugins: [
    new HtmlPlugin(...),
    new AssetsPlugin({
      // Suppose the filepath is '/src/foo.js'
      assets: [require.resolve('./path/to/foo')],
      output: {
        filename: 's/[name].[chunkhash].js',
        publicPath: '//mycdn.com/m'
      }
    })
  ]
}
```

Then, `/src/foo.js` will be copied to

```
/path/to/s/
          |-- foo.26313ef12faa88b00420.js
```

And the following script tag will be injected into the html:

```html
<script
  type=text/javascript
  src=//mycdn.com/m/s/foo.26313ef12faa88b00420.js></script>
```

## new AssetsPlugin(options)

**options** `Object`

- **assets** `Array.<Asset|Path>`
- **chunks** what's coming...
- **output.filename** `String`
- **output.publicPath** `String`
- **append** `Boolean=false` whether the asset will be append to the end of the existing assets
- **typeOfAsset** `String.<js|css>=` Optional. Specify the type of the asset. By default, `AssetPlugin` will detect the type by the extname of the filepath.

## Asset `Object`

- **filepath** ``

## License

MIT
