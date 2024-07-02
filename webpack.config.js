const path = require('path');

module.exports = {
    mode: 'production',
    context: __dirname,
    entry: {
        'all-pages.min': './src/all-pages.js',
        'card-page.min': './src/card-page.js',
        'dashboard-page.min': './src/dashboard-page.js',
        'expansion-page.min': './src/expansion-page.js',
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