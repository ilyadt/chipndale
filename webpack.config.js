const path = require('path');
const webpack = require('webpack')

module.exports = {
    mode: "production",
    entry: './src/module',
    output: {
        path: path.resolve(__dirname, 'src/dist'),
        filename: 'chipndale.js',
        library: 'chipndale',
        libraryTarget: 'window',
    },
    resolve: {
        fallback: {
            "crypto": require.resolve('crypto-browserify'),
            "buffer": require.resolve("buffer/"),
            "stream": require.resolve("stream-browserify")
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        })
    ],
    performance: {
        hints: false
    }
};
