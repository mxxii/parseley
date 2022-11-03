import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';

export default [
  {
    external: ['leac', 'peberminta'],
    input: 'src/parseley.ts',
    plugins: [typescript(), cleanup({ extensions: ['ts'] })],
    output: [
      {
        dir: 'lib',
        format: 'es',
        entryFileNames: '[name].mjs',
      },
      {
        dir: 'lib',
        format: 'cjs',
        entryFileNames: '[name].cjs',
      },
    ],
  },
];
