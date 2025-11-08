import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';
import del from 'rollup-plugin-delete';
import { dts } from 'rollup-plugin-dts';

function paths (paths) {
  return function (filePath) {
    const normalizedFilePath = filePath.replace(/\\/g, '/');
    for (const [originalPath, replacementPath] of Object.entries(paths)) {
      if (normalizedFilePath.endsWith(originalPath)) {
        return replacementPath;
      }
    }
    return filePath;
  };
}

function externalBySuffix (id) {
  const n = id.replace(/\\/g, '/');
  return n.endsWith('/ast.ts');
}

export default [
  {
    external: ['leac', 'peberminta'],
    input: 'src/parseley.ts',
    plugins: [
      typescript(),
      cleanup({ extensions: ['ts'] }),
    ],
    output: [
      {
        format: 'es',
        file: 'lib/parseley.mjs',
      },
      {
        format: 'cjs',
        file: 'lib/parseley.cjs',
      },
    ],
  },
  {
    input: 'src/ast.ts',
    plugins: [
      dts(),
      del({ targets: 'lib/*.d.ts', hook: 'writeBundle', verbose: true }),
    ],
    output: [
      {
        format: 'es',
        file: 'lib/ast.d.mts',
      },
      {
        format: 'cjs',
        file: 'lib/ast.d.cts',
      },
    ],
  },
  {
    input: 'src/parseley.ts',
    external: externalBySuffix,
    plugins: [
      dts(),
      del({ targets: 'lib/*.d.ts', hook: 'writeBundle', verbose: true }),
    ],
    output: [
      {
        format: 'es',
        file: 'lib/parseley.d.mts',
        paths: paths({ '/ast.ts': './ast.mjs' }),
      },
      {
        format: 'cjs',
        file: 'lib/parseley.d.cts',
        paths: paths({ '/ast.ts': './ast.cjs' }),
      },
    ],
  },
];
