const path = require('path');

module.exports = {
  entry: './piskel-clone/src/script.js',
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, './piskel-clone/dist'),
  },
  // devtool: 'inline-source-map',
  devServer: {
    contentBase: './piskel-clone/dist',
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]',
            },
          },
        ],
      }],
  },
};
