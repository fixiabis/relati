import typescript from 'rollup-plugin-typescript2';

const defaults = { compilerOptions: { declaration: true } };
const hideDeclaration = { compilerOptions: { declaration: false } };

export default [
  {
    input: './src/index.ts',

    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
        tsconfigDefaults: defaults,
      }),
    ],

    output: {
      file: 'lib/index.js',
      format: 'cjs',
      indent: true,
    },
  },
  {
    input: './src/index.ts',

    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
        tsconfigDefaults: hideDeclaration,
      }),
    ],

    output: {
      file: 'dist/relati.js',
      format: 'umd',
      name: 'relati',
      indent: true,
    },
  },
];
