import add, {extname} from './assets'
import make_array from 'make-array'
import path from 'path'

const EVENT_BEFORE = 'html-webpack-plugin-before-html-generation'
const DEFAULT_FILENAME = '[name].[chunkhash].[ext]'

function isEmpty (subject) {
  return !subject || !subject.length
}



export default class AssetsHtmlPlugin {
  constructor (...options) {
    this._groups = options
  }

  async _createGroups (compilation) {
    // assets
    // chunks
    // ouput
    // - filename: not works for chunks
    // - publicPath
    // - typeOfAsset
    const append = {
      assets: [],
      chunks: []
    }
    const prepend = {
      assets: [],
      chunks: []
    }

    this._groups.forEach(({
      assets = [],
      chunks = [],
      output: {
        filename,
        publicPath = ''
      } = {},
      append: isAppend = false,
      typeOfAsset

    }) => {

      filename = filename || compilation.outputOptions.filename || DEFAULT_FILENAME

      const group = isAppend
        ? append
        : prepend

      const emptyAssets = isEmpty(assets)
      const emptyChunks = isEmpty(chunks)
      if (emptyAssets && emptyChunks) {
        throw new Error(`assets or chunks must be defined`)
      }

      if (!typeOfAsset) {
        typeOfAsset = emptyAssets
          // If there are only chunks, use 'js'
          ? 'js'
          : extname(assets[0])
            // If there is no extname
            || 'js'
      }

      assets.forEach(asset => {
        const item = {
          asset,
          output: {
            filename,
            publicPath
          },
          typeOfAsset
        }

        group.assets.push(item)
      })

      chunks.forEach(chunk => {
        const item = {
          chunk,
          output: {
            publicPath
          },
          typeOfAsset: 'js'
        }
        group.chunks.push(item)
      })
    })

    return {
      append,
      prepend
    }
  }

  /* istanbul ignore next: this would be integration tests */
  apply (compiler) {
    const onCompilation = compilation => {
      compilation.plugin(EVENT_BEFORE, (htmlPluginData, callback) => {
        this._createGroups(compilation)
        .then(groups => add(groups, compilation, htmlPluginData))
        .then(() => callback(null, htmlPluginData))
        .catch(err => {
          compilation.errors.push(err)
          callback(err)
        })
      })
    }

    compiler.plugin('compilation', onCompilation)
  }
}
