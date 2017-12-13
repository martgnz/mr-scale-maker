import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/js/index.js',
  output: {
    file: 'src/bundle.js',
    format: 'iife',
    name: 'bundle',
  },
  moduleContext: {
    './node_modules/papaparse/papaparse.js': 'window'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
