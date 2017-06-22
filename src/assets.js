import crypto from 'crypto'
import path from 'path'
import presuf from 'pre-suf'
import props from 'p-props'
import find_index from 'array-find-index'

const SLICE_CHUNKHASH = '[chunkhash]'
const SLICE_NAME = '[name]'
const SLICE_EXT = '[ext]'
const hasHash = name => !!~name.indexOf(SLICE_CHUNKHASH)


export default function add (groups, compilation, htmlPluginData) {
  return new Adder(compilation, htmlPluginData).add(groups)
}

export function extname (filepath) {
  return path.extname(filepath).slice(1)
}


class Adder {
  constructor(compilation, {
    plugin,
    assets
  }) {

    this._compilation = compilation
    this._plugin = plugin
    this._assets = assets
  }

  async add ({append, prepend}) {
    const results = await props({
      append: props({
        assets: this._addAssets(append.assets),
        chunks: this._addChunks(append.chunks)
      }),
      prepend: props({
        assets: this._addAssets(prepend.assets),
        chunks: this._addChunks(prepend.chunks)
      })
    })

    this._insert(results.append.assets, true)
    this._insert(results.append.chunks, true)
    this._insert(results.prepend.assets, false)
    this._insert(results.prepend.chunks, false)
  }

  // Change the webpack output filename
  _resolve (unresolved, resolved) {
    const webpackAssets = this._compilation.assets
    webpackAssets[resolved] =
    webpackAssets[unresolved]
    delete webpackAssets[unresolved]
  }

  _insert (results, append) {
    const method = append
      ? 'push'
      : 'unshift'

    if (!append) {
      results.reverse()
    }

    results.forEach(result => {
      this._assets[result.typeOfAsset][method](result.url)
    })
  }

  _addAssets (assets) {
    return Promise.all(assets.map(asset => this._addAsset(asset)))
  }

  _addChunks (chunks) {
    return Promise.all(chunks.map(chunk => this._addChunk(chunk)))
  }

  _getHash (unresolved) {
    return crypto.createHash('md5')
    .update(this._compilation.assets[unresolved].source())
    .digest('hex')
    .substr(0, 20)
  }

  // @returns {typeOfAsset, url}
  async _addAsset ({
    asset,
    output: {
      filename,
      publicPath
    },
    typeOfAsset
  }) {

    filename = presuf.removeLeading(filename, '/')
    const unresolved = await this._plugin.addFileToAssets(asset, this._compilation)
    const chunkhash = hasHash(filename)
      ? this._getHash(unresolved)
      : ''
    const ext = path.extname(unresolved)
    const resolved = this._substitute(filename, {
      chunkhash,
      name: path.basename(unresolved, ext),
      ext: typeOfAsset
    })

    this._resolve(unresolved, resolved)

    return {
      typeOfAsset,
      url: this._joinUrlPath(publicPath, resolved)
    }
  }

  _substitute (template, {
    chunkhash,
    name,
    ext
  }) {

    return template
    .replace(SLICE_CHUNKHASH, chunkhash)
    .replace(SLICE_NAME, name)
    .replace(ext, ext)
  }

  async _addChunk ({
    chunk,
    output: {
      publicPath
    },
    typeOfAsset
  }) {

    const namedChunk = this._compilation.namedChunks[chunk]

    if (!namedChunk) {
      const error = new Error('chunk "${chunk}" not found.')
      return Promise.reject(error)
    }

    const resolved = this._substitute(this._compilation.outputOptions.filename, {
      chunkhash: namedChunk.renderedHash,
      name: chunk,
      ext: typeOfAsset
    })

    return {
      typeOfAsset,
      url: this._joinUrlPath(publicPath, resolved)
    }
  }

  _joinUrlPath (a, b) {
    a = presuf.removeEnding(a, '/')
    return a
      ? `${a}/${b}`
      : b
  }
}
