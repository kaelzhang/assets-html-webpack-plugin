import add from './assets'

const EVENT_BEFORE = 'html-webpack-plugin-before-html-generation'

export default class AssetsHtmlPlugin {
  constructor (assets, options) {
    this._assets = this._cleanAssets(assets, options)
  }

  _cleanAssets (assets, options) {
    // TODO
    return assets
  }

  /* istanbul ignore next: this would be integration tests */
  apply (compiler) {
    const onCompilation = compilation => {
      compilation.plugin(EVENT_BEFORE, (htmlPluginData, callback) => {
        add(this._assets, compilation, htmlPluginData)
        .then(
          () => callback(null, htmlPluginData),
          callback
        )
      })
    }

    compiler.plugin('compilation', onCompilation)
  }
}
