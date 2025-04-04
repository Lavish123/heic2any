import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.js', // This is the actual entry
    output: {
        file: 'dist/heic-to.umd.js',
        format: 'umd',
        name: 'HeicTo',
        sourcemap: true,
    },
    plugins: [resolve(), commonjs(), terser()],
};
