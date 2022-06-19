const WorkerPlugin = require("worker-plugin")

module.exports = {
  "transpileDependencies": [
    "vuetify",
    "eslint-loader"
  ],
  configureWebpack: {
    output: {
      globalObject: "this"
    },
    plugins: [
      new WorkerPlugin()
    ],
    resolve: {
      extensions: ["*", ".mjs", ".js", ".vue", ".json", ".mjs", ".js", ".vue", ".json", ".gql", ".graphql"]
    },
    module: {
      rules: [
        {
          test: /node_modules\/@polkadot\/.+\.m?js$/,
          loader: require.resolve('@open-wc/webpack-import-meta-loader'),
        },
        {
          test: /\.(c|m)?js$/,
          use: {
            loader: 'babel-loader',
            options: {
              compact: false,
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    }
  }
}
