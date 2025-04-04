import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { string } from 'rollup-plugin-string';


export default {
    input: 'src/index.js', // This is the actual entry
    output: {
        file: 'dist/heic-to.umd.js',
        format: 'umd',
        name: 'HeicTo',
        sourcemap: true,
    },
    plugins: [
        string({
            include: 'src/worker.js', // 👈 tells rollup to inline this file
        }),
        resolve(),
        commonjs(),
        terser()
    ],
};
