import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json';

export default [
  {
    external: ['leac', 'peberminta'],
    input: 'src/parseley.ts',
    plugins: [typescript(), cleanup({ extensions: ['ts'] })],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
