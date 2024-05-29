const path = require('path');

module.exports = {
    context: __dirname + '/src',
    entry: {
        'all-pages': './all-pages.js',
        'card-detail': './card-detail.js',
        'dashboard': './dashboard.js',
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