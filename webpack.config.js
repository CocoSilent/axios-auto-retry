const path = require('path');

module.exports = {
    mode: "production",
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: {
            name: 'axiosAutoRetry',
            type: 'umd',
            export: 'default',
        },
        globalObject: 'this'
    },
};
