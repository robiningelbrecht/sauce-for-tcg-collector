const path = require('path');

module.exports = {
    mode: 'production',
    context: __dirname,
    entry: {
        'sauce.min': './src/sauce.js',
        'popup/popup.min': './popup/popup.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        fallback: {
            "https": false,
        }
    },
};