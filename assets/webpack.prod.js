const merge = require('webpack-merge')
const common = require('./webpack.common.js')

var terserPlugin = require("terser-webpack-plugin");
var uglifyPlugin = require("uglifyjs-webpack-plugin");


module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize:true,
        minimizer: [new terserPlugin()]
    }
})