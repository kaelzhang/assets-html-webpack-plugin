import crypto from 'crypto'
import path from 'path'
import mapSeries from 'p-map-series'
import presuf from 'pre-suf'

const SLICE_HASH = '[hash]'
const SLICE_NAME = '[name]'
const hasHash = name => !!~name.indexOf(SLICE_HASH)


export default async function add (assets, compilation, htmlPluginData) {
  return mapSeries(assets, asset => addOne(asset, compilation, htmlPluginData))
}

async function addOne (
  {
    filepath,
    output: {
      // path: outputPath,
      filename: outputFilename,
      publicPath
    },
    append = false,
    // TODO
    // includeSourcemap = false,
    typeOfAsset
  },
  compilation,
  // htmlPluginData
  {
    plugin: htmlPlugin,
    assets: htmlAssets
  }

) {

  if (!filepath) {
    const error = new Error('No filepath defined')
    compilation.error.push(error)
    return Promise.reject(error)
  }

  const unresolved = await htmlPlugin.addFileToAssets(filepath, compilation)

  if (hasHash(outputFilename)) {
    const hash = crypto.createHash('md5')
    .update(compilation.assets[unresolved].source())
    .digest('hex')
    .substr(0, 20)

    // [name].[hash].js -> [name].abcd.js
    outputFilename = outputFilename.replace(SLICE_HASH, hash)
  }

  const ext = path.extname(unresolved)
  // [name].abcd.js -> foo-abcd.js
  outputFilename = presuf.removeLeading(outputFilename, '/')
  .replace(SLICE_NAME, path.basename(unresolved, ext))

  const webpackAssets = compilation.assets
  webpackAssets[outputFilename] =
  webpackAssets[unresolved]
  delete webpackAssets[unresolved]

  const appendMethod = append
    ? 'push'
    : 'unshift'

  publicPath = presuf.removeEnding(publicPath, '/')
  const outputAssetURL = `${publicPath}/${outputFilename}`

  console.log('outputAssetURL', outputAssetURL)
  htmlAssets[typeOfAsset][appendMethod](outputFilename)
}
