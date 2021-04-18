import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

export default [
  {
    external: [ 'moo', 'nearley' ],
    input: 'src/parseley.ts',
    plugins: [typescript()],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
