const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    context: __dirname,
    entry: {
        'sauce.min': './src/sauce.js',
        'gravy.min': './src/gravy.js',
        'popup/popup.min': './popup/popup.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
    ],
    resolve: {
        fallback: {
            "https": false,
        }
    },
};