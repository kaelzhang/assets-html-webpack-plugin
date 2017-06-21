import add from './assets'
import make_array from 'make-array'
import path from 'path'

const EVENT_BEFORE = 'html-webpack-plugin-before-html-generation'

export default class AssetsHtmlPlugin {
  constructor ({
    assets,
    // TODO
    chunks,
    ...options
  }) {

    this._assets = assets
    this._chunks = chunks

    options = {...options}
    options.output = options.output || {}

    this._options = options
  }

  // TODO:
  // 1. use default output option of compilation
  async _cleanAssets (compilation) {
    const options = this._options
    const assets = make_array(this._assets).map(asset => {
      if (typeof asset === 'string') {
        asset = {
          filepath: asset,
          ...options
        }

      } else if (Object(asset) === asset) {
        asset = {
          ...options,
          ...asset
        }

        asset.output = {
          ...options.output,
          ...asset.output
        }
      }

      if (!asset.filepath) {
        throw new Error('No filepath defined')
      }

      if (!asset.output.filename) {
        const error = new Error(`output filename not defined for "${filepath}"`)
        compilation.warnings.push(error)
        asset.output.filename = path.basename(asset.filepath)
      }

      if (!asset.output.publicPath) {
        asset.output.publicPath = ''
      }

      if (!asset.typeOfAsset) {
        asset.typeOfAsset = path.extname(asset.filepath).slice(1) || 'js'
      }

      return asset
    })

    return assets
  }

  /* istanbul ignore next: this would be integration tests */
  apply (compiler) {
    const onCompilation = compilation => {
      compilation.plugin(EVENT_BEFORE, (htmlPluginData, callback) => {
        this._cleanAssets(compilation)
        .then(assets => add(assets, compilation, htmlPluginData))
        .then(() => callback(null, htmlPluginData))
        .catch(err => {
          compilation.error.push(err)
          callback(err)
        })
      })
    }

    compiler.plugin('compilation', onCompilation)
  }
}
