const path = require('path');

module.exports = {
    context: __dirname,
    entry: {
        'all-pages': './src/all-pages.js',
        'card-detail': './src/card-detail.js',
        'dashboard': './src/dashboard.js',
        'popup/popup': './popup/popup.js',
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