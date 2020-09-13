var path = require("path");
var webpack = require('webpack')
var BundleTracker = require("webpack-bundle-tracker");

module.exports = {

    context: __dirname,
    entry:  {
        accounting: './js/accounting',
        invoicing: './js/invoicing',
        employees: './js/employees',
        inventory: './js/inventory',
        calendar: './js/calendar',
        portableCalendar: './js/portableCalendar',
        services: './js/services',
        manufacturing: './js/manufacturing',
        widgets: './js/widgets',
        common: './js/common',
        messaging: './js/messaging',
        pos: './js/pos',
    },
    output: {
        library: 'portableCalendar',
        libraryTarget: 'window',
        libraryExport: 'default',
        path: path.resolve('./bundles/'),
        filename: '[name].js',
    },
    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                'loader': 'style-loader'
            },
            {
                test: /\.css$/,
                loader: 'css-loader',
                query: {
                    modules: true,
                    localIdentName: '[name]__[local]__[hash:64:5]'
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['stage-2','react']//stage 2 for class level attrs and autobind
                }
            }
        ]
    },

    resolve: {
        extensions: [ '.js', '.jsx']
    },
}