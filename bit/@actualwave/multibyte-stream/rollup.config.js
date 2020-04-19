import typescript from '@rollup/plugin-typescript';

export default {
  input: 'source/index.ts',
  output: [
    {
      file: 'index.js',
      format: 'cjs',
    },
    {
      name: 'MultibyteStream',
      file: 'dist/multibyte-stream.umd.js',
      format: 'umd',
    },
  ],
  plugins: [typescript()],
};
