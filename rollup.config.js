

import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy'
import resolve from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-typescript';
import typescript from 'typescript'


const extensions = ['.js', '.ts', '.tsx'];
const plugins =
    [
        resolve({
            extensions,
        }),
 ts({
            typescript,
            namedExports: {
                'node_modules/react/index.js': ['Children', 'useState', 'PropTypes', 'useEffect'],
                'node_modules/react-dom/index.js': ['render'],
            },
        }),

    ];
export default [

    {
        input: 'src/background/index.ts',
        output: {
            file: 'dist/background.js',
            format: "umd",
            sourcemap: true,
        },
        plugins: [...plugins, copy({
            targets: [{ src: 'assets/*', dest: 'dist' }]
        })],
    },
    {
        input: 'src/options/index.tsx',
        output: {
            file: 'dist/options.js',
            format: "umd",
            sourcemap: true,
        },
        plugins
    },
    {
        input: 'src/popup/index.tsx',
        output: {
            file: 'dist/popup.js',
            format: "umd",
            sourcemap: true,
        },
        plugins
    },
    {
        input: 'src/content.ts',
        output: {
            file: 'dist/content.js',
            format: "umd",
            sourcemap: true,
        },
        plugins
    }
]